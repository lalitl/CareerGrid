import Job from "../models/JobModel.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import day from "dayjs";
//GET ALL JOBS
const getAllJobs = async (req, res) => {
  const { search, jobStatus, jobType, sort } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  if (search) {
    queryObject.$or = [
      {
        position: { $regex: search, $options: "i" },
      },
      {
        company: { $regex: search, $options: "i" },
      },
    ];
  }

  if (jobStatus && jobStatus !== "all") {
    queryObject.jobStatus = jobStatus;
  }

  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }

  const sortOptions = {
    newest: "-createdAt",
    oldest: "createdAt",
    "a-z": "position",
    "z-a": "-position",
  };

  const sortKey = sortOptions[sort] || sortOptions.newest;

  //PAGINATION LOGIC
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalJobs = await Job.countDocuments(queryObject);
  const jobs = await Job.find(queryObject)
    .sort(sortKey)
    .skip(skip)
    .limit(limit);
  const numOfPages = Math.ceil(totalJobs / limit);
  return res
    .status(StatusCodes.OK)
    .json({ totalJobs, numOfPages, currentPage: page, jobs });
};

//GET SINGLE JOB
const getSingleJob = async (req, res) => {
  const { id } = req.params;
  const job = await Job.findOne({ _id: id });
  return res.status(StatusCodes.OK).json({ job });
};

//CREATE JOB
const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  return res.status(StatusCodes.CREATED).json({ job });
};

//UPDATE JOB
const updateJob = async (req, res) => {
  const { company, position } = req.body;
  const { id } = req.params;
  if (!company || !position) {
    throw new BadRequestError("Please provide company and position");
  }

  const job = await Job.findByIdAndUpdate(
    { _id: id },
    {
      new: true,
    }
  );

  job.company = company;
  job.position = position;

  await job.save();

  return res
    .status(StatusCodes.OK)
    .json({ msg: "Job updated successfully", job });
};

//DELETE JOB
const deleteJob = async (req, res) => {
  const { id } = req.params;
  let job = await Job.findOneAndDelete({ _id: id });
  return res
    .status(StatusCodes.OK)
    .json({ msg: "Job deleted successfully!", job });
};

const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    {
      $match: {
        createdBy: mongoose.Types.ObjectId.createFromHexString(req.user.userId),
      },
    },
    {
      $group: {
        _id: "$jobStatus",
        count: { $sum: 1 },
      },
    },
  ]);

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    {
      $match: {
        createdBy: mongoose.Types.ObjectId.createFromHexString(req.user.userId),
      },
    },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        "_id.year": -1,
        "_id.month": -1,
      },
    },
    {
      $limit: 6,
    },
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const { year, month } = item._id;
      return {
        date: day()
          .year(year)
          .month(month - 1)
          .format("MMMM YY"),
        year,
        count: item.count,
      };
    })
    .reverse();

  res.status(200).json({ defaultStats, monthlyApplications });
};

export { getAllJobs, getSingleJob, createJob, updateJob, deleteJob, showStats };

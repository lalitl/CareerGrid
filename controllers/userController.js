import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel.js";
import Job from "../models/JobModel.js";
import cloudinary from "cloudinary";
import { formatImage } from "../middleware/multermiddleware.js";

const getCurrentUser = async (req, res) => {
  const { userId } = req.user;
  const user = await User.findById({ _id: userId });
  const userWithoutPassword = user.removePassword();
  res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};

const getApplicationsStats = async (req, res) => {
  const users = await User.countDocuments();
  const jobs = await Job.countDocuments();

  return res.status(StatusCodes.OK).json({ users, jobs });
};

const updateUser = async (req, res) => {
  const newUser = { ...req.body };
  delete newUser.password;

  if (req.file) {
    const file = formatImage(req.file);
    const response = await cloudinary.v2.uploader.upload(file);
    newUser.avatar = response.secure_url;
    newUser.avatarPublicId = response.public_id;
  }
  const updatedUser = await User.findByIdAndUpdate(req.user.userId, newUser);

  if (req.file && updatedUser.avatarPublicId) {
    await cloudinary.v2.uploader.destroy(updatedUser.avatarPublicId);
  }

  res.status(StatusCodes.OK).json({ msg: "update user" });
};

export { getCurrentUser, updateUser, getApplicationsStats };

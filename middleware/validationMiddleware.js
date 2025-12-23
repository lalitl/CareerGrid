import { body, param, validationResult } from "express-validator";
import {
  BadRequestError,
  NotFoundError,
  UnAuthorizedError,
} from "../errors/customErrors.js";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants.js";
import mongoose from "mongoose";
import Job from "../models/JobModel.js";
import User from "../models/UserModel.js";

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((err) => err.msg);
        if (errorMessages[0].startsWith("No job")) {
          throw new NotFoundError(errorMessages);
        }
        if (errorMessages[0].startsWith("Unauthorized to")) {
          throw new UnAuthorizedError(errorMessages);
        }
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

export const validateJobInput = withValidationErrors([
  body("company").notEmpty().withMessage("Company is required"),
  body("position").notEmpty().withMessage("Position is required"),
  body("jobLocation").notEmpty().withMessage("Job location is required"),
  body("jobStatus")
    .isIn(Object.values(JOB_STATUS))
    .withMessage("Invalid Job Status"),
  body("jobType").isIn(Object.values(JOB_TYPE)).withMessage("Invalid Job Type"),
]);

export const validateIdParam = withValidationErrors([
  param("id").custom(async (value, { req }) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequestError("Invalid MongoId");
    const job = await Job.findById(value);
    if (!job) {
      throw new NotFoundError(`No job exists with id ${value}`);
    }
    if (
      req.user.userId !== job.createdBy.toString() &&
      req.user.role !== "admin"
    )
      throw new UnAuthorizedError("Unauthorized to access this route");
  }),
]);

export const validateRegisterUser = withValidationErrors([
  body("name").notEmpty().withMessage("Name is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must contain atleast 8 characters"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) throw new BadRequestError("Email already exists!");
    }),
  body("lastName").notEmpty().withMessage("last name cannot be empty"),
  body("location").notEmpty().withMessage("Location cannot be empty"),
]);

export const validateLoginUser = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address"),
  body("password").notEmpty().withMessage("Please enter a valid password"),
]);

export const validateUpdateUser = withValidationErrors([
  body("name").notEmpty().withMessage("Name cannot be empty"),
  body("lastName").notEmpty().withMessage("Last name cannot be empty"),
  body("location").notEmpty().withMessage("Location cannot be empty"),
  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email });
      if (user && user._id.toString() !== req.user.userId) {
        throw new BadRequestError("email already exists");
      }
    }),
]);

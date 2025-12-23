import {
  UnAuthenticatedError,
  UnAuthorizedError,
  BadRequestError,
} from "../errors/customErrors.js";
import { verifyJWT } from "../utils/tokenUtils.js";

export const authenticateUser = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new UnAuthenticatedError("Authentication invalid.");
  }

  try {
    const { userId, role } = verifyJWT(token);
    const testUser = userId === "69344198eb6001d38db6ed68";
    req.user = { userId, role, testUser };
    next();
  } catch (error) {
    throw new UnAuthenticatedError("Authentication invalid.");
  }
};

export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnAuthorizedError("Unauthorized to access this route");
    }
    next();
  };
};

export const checkForTestUser = (req, res, next) => {
  if (req.user.testUser) {
    throw new BadRequestError("Demo user. read only!");
  }
  next();
};

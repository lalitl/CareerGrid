import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel.js";
import { comparePassord, hashPassword } from "../utils/passwordUtils.js";
import { UnAuthenticatedError } from "../errors/customErrors.js";
import { createJWT } from "../utils/tokenUtils.js";

const register = async (req, res) => {
  const isFirstUser = (await User.countDocuments()) === 0;
  req.body.role = isFirstUser ? "admin" : "user";

  req.body.password = await hashPassword(req.body.password);

  const user = await User.create(req.body); //NOSONAR
  return res
    .status(StatusCodes.CREATED)
    .json({ msg: "User created successfully" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnAuthenticatedError("Invalid credentials!");
  }
  
  const isValidPassword = await comparePassord({
    password,
    hashedPassword: user.password,
  });

  const jwtToken = createJWT({ userId: user._id, role: user.role });
  if (!isValidPassword) throw new UnAuthenticatedError("Invalid credentials!");

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", jwtToken, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({ msg: "User logged in successfully" });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "User logged out successfully" });
};

export { register, login, logout };

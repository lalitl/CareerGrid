import express from "express";
import { login, logout, register } from "../controllers/authContoller.js";
import {
  validateLoginUser,
  validateRegisterUser,
  
} from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/register", validateRegisterUser, register);
router.post("/login", validateLoginUser, login);
router.get("/logout", logout);

export default router;

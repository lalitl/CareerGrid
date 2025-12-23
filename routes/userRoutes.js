import express from "express";
import {
  getApplicationsStats,
  getCurrentUser,
  updateUser,
} from "../controllers/userController.js";
import { validateUpdateUser } from "../middleware/validationMiddleware.js";
import {
  authorizePermissions,
  checkForTestUser,
} from "../middleware/authMiddleware.js";
import uploads from "../middleware/multermiddleware.js";

const router = express.Router();

router.get("/current-user", getCurrentUser);
router.get(
  "/admin/app-stats",
  authorizePermissions("admin"),
  getApplicationsStats
);
router.patch(
  "/update-user",
  uploads.single("avatar"),
  checkForTestUser,
  validateUpdateUser,
  updateUser
);

export default router;

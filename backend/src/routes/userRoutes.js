import express from "express";
import {
  getAllUsers,
  createUser,
  loginUser,
  logoutUser,
  updateUser,
  deleteUser,
  changePassword,
  changeRole,
} from "../controllers/userController.js";
import { protect, authorize } from '../sevices/authmiddleware.js';

const router = express.Router();

router.post("/register", createUser);      // Or protect+authorize('Admin') if only admins create users
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);

router.get("/", protect, authorize("Admin"), getAllUsers);

router.put("/:id", protect, authorize("Admin"), updateUser);
router.delete("/:id", protect, authorize("Admin"), deleteUser);
router.patch("/:id/role", protect, authorize("Admin"), changeRole);
router.post("/:id/change-password", protect, changePassword);

export default router;

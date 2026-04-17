// routes/reportRoutes.js
import express from "express";
import { getAnalytics } from "../controllers/reportController.js";
import { protect, authorize } from "../sevices/authmiddleware.js";

const router = express.Router();
router.get("/", protect, authorize("Admin"), getAnalytics);
export default router;
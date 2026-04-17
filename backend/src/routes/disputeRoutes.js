import express from "express";
import { getAllDisputes,createDispute,updateDispute,deleteDispute, getDisputeById, getResolvedDisputes, getDisputeStats, getMonthlyDisputeStats } from "../controllers/disputeController.js";
import { protect } from "../sevices/authmiddleware.js";

const router= express.Router();
router.get("/month-stats", getMonthlyDisputeStats);
router.get("/stats", getDisputeStats);
router.get("/resolve",getResolvedDisputes);
router.get("/",getAllDisputes);
router.get("/:id",getDisputeById);
router.post("/:landId",protect,createDispute);
router.put("/:id",updateDispute);
router.delete("/:id",deleteDispute);

export default router;
import express from "express";
import { countLandRecords, createLandRecord, deleteLandRecord, getAllLandRecords, getLandRecordById, updateLandRecord } from "../controllers/landRecordController.js";
import { protect } from "../sevices/authmiddleware.js";

const router=express.Router();

router.get("/count",countLandRecords);
router.get("/",getAllLandRecords);
router.post("/",protect,createLandRecord);
router.put("/:id",updateLandRecord);
router.get("/:id",getLandRecordById);
router.delete("/:id",deleteLandRecord);

export default router;
import express from "express";
import upload from "../sevices/uploadmiddleware.js";
import {
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  viewDocument,
  downloadDocument
} from "../controllers/documentController.js";
import { protect } from "../sevices/authmiddleware.js";

const router = express.Router();

router.post("/:landId",protect, upload.single("file"), createDocument);
router.get("/", getAllDocuments);
router.get("/:id", getDocumentById);
router.put("/:id", upload.single("file"), updateDocument);
router.delete("/:id", deleteDocument);
router.get("/view/:id", viewDocument);
router.get("/download/:id", downloadDocument);


export default router;

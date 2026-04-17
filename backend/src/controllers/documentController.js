import Document from "../models/Documents.js";
import express from "express";
import upload from "../sevices/uploadmiddleware.js";


import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// for resolving __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// VIEW document (open in browser if supported, e.g. PDF)
export async function viewDocument(req, res) {
  try {
    const { id } = req.params;
    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

const filePath = path.resolve("uploads", path.basename(document.file_path));

    res.setHeader("Content-Type", "application/pdf");
res.setHeader("Content-Disposition","inline; filename=" + path.basename(filePath)); // 👈 important
res.sendFile(filePath, (err) => {
  if (err) {
    console.error("Error sending file", err);
    res.status(500).json({ message: "Error opening document" });
  }
});
  } catch (error) {
    console.error("Error in viewDocument controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// DOWNLOAD document
export async function downloadDocument(req, res) {
  try {
    const { id } = req.params;
    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const filePath = path.resolve("uploads", path.basename(document.file_path));
   // res.download(filePath, path.basename(filePath));
    res.download(
      filePath,
      document.document_type + path.basename(filePath),
      (err) => {
        if (err) {
          console.error("Error downloading file", err);
          res.status(500).json({ message: "Error downloading document" });
        }
      }
    );
  } catch (error) {
    console.error("Error in downloadDocument controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Upload a document
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const {
      land_id,
      ownership_history_id,
      dispute_id,
      document_type,
      uploaded_by,
    } = req.body;

    const newDoc = new Document({
      land_id,
      ownership_history_id: ownership_history_id || null,
      dispute_id: dispute_id || null,
      document_type,
      file_path: req.file.path,
      uploaded_by,
    });

    await newDoc.save();

    res
      .status(201)
      .json({ message: "Document uploaded successfully", document: newDoc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading document" });
  }
});

export default router;

export async function createDocument(req, res) {
  try {
    const {
      ownership_history_id,
      dispute_id,
      document_type,
    } = req.body;

    // File comes from multer
    const file_path = req.file ? req.file.path : null;
     const land_id = req.params.landId;

    // Basic validation
    if (!file_path ) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const newDocument = new Document({
      land_id,
      ownership_history_id: ownership_history_id || null,
      dispute_id: dispute_id || null,
      document_type,
      file_path:req.file.filename,
      uploaded_by:req.user.id,
    });

    await newDocument.save();
    res.status(201).json({
      message: "Document uploaded successfully",
      document: newDocument,
    });
  } catch (error) {
    console.error("Error in createDocument controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// GET ALL Documents
export async function getAllDocuments(req, res) {
  try {
    const documents = await Document.find()
      .populate("land_id", "plot_number location")
      .populate("ownership_history_id", "new_owner_name transaction_date")
      .populate("dispute_id", "dispute_details status")
      .populate("uploaded_by", "full_name role");

    res.status(200).json(documents);
  } catch (error) {
    console.error("Error in getAllDocuments controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// GET Document by ID
export async function getDocumentById(req, res) {
  try {
    const document = await Document.findById(req.params.id)
      .populate("land_id", "plot_number")
      .populate("ownership_history_id", "new_owner_name")
      .populate("dispute_id", "dispute_details")
      .populate("uploaded_by", "full_name");

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json(document);
  } catch (error) {
    console.error("Error in getDocumentById controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// UPDATE Document
export async function updateDocument(req, res) {
  try {
    const { id } = req.params;

    // If a new file was uploaded, replace file_path
    const updateData = {
      ...req.body,
      ...(req.file ? { file_path: req.file.path } : {}),
    };

    const updatedDocument = await Document.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedDocument) {
      return res.status(404).json({ message: "Document not found" });
    }

    res
      .status(200)
      .json({ message: "Document updated", document: updatedDocument });
  } catch (error) {
    console.error("Error in updateDocument controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// DELETE Document
export async function deleteDocument(req, res) {
  try {
    const { id } = req.params;

    const deletedDocument = await Document.findByIdAndDelete(id);

    if (!deletedDocument) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error in deleteDocument controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

import mongoose from "mongoose";
import OwnershipHistory from "../models/OwnershipHistory.js";
import LandRecord from "../models/LandRecord.js";
import Document from "../models/Documents.js"

// CREATE Ownership History
export async function createOwnershipHistory(req, res) {
  try {
    const {
      new_owner_name,
      new_owner_cnic,
      transaction_date,
      transaction_amount,
      documents_uploaded,
    } = req.body;
    const land_id = req.params.landId;

    if (!new_owner_name || !transaction_date) {
      return res.status(400).json({ message: "Required fields are missing" });
    }
    if (!land_id) {
      return res.status(400).json({ message: "Land ID is required" });
    }
       const cnicRegex = /^\d{13}$/;
    if (!cnicRegex.test(new_owner_cnic)) {
      return res.status(400).json({ message: "CNIC must be exactly 13 digits" });
    }

    const landRecord = await LandRecord.findById(land_id);
    if (!landRecord) {
      return res.status(404).json({ message: "Land record not found" });
    }

    // Store previous owner details
    const previous_owner_name = landRecord.current_owner_name;
    const previous_owner_cnic = landRecord.current_owner_cnic;

    // Step 1: Create new ownership history record
    const newRecord = new OwnershipHistory({
      land_id,
      previous_owner_name,
      new_owner_name,
      previous_owner_cnic,
      new_owner_cnic,
      transaction_date,
      transaction_amount,
      documents_uploaded,
      recorded_by: req.user.id,
    });

    await newRecord.save();

    // Step 2: Update the land record with new owner
    landRecord.current_owner_name = new_owner_name;
    landRecord.current_owner_cnic = new_owner_cnic;
    await landRecord.save();

    res.status(201).json({
      message: "Ownership history recorded and land record updated successfully",
      record: newRecord,
      updatedLand: landRecord
    });
  } catch (error) {
    console.error("Error in createOwnershipHistory controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// GET ALL Ownership Histories
export async function getAllOwnershipHistories(req, res) {
    try {
        const records = await OwnershipHistory.find()
            .populate('land_id', 'plot_number location')
            .populate('recorded_by', 'full_name role');
        res.status(200).json(records);
    } catch (error) {
        console.error("Error in getAllOwnershipHistories controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// GET Ownership History by ID
export async function getOwnershipHistoryById(req, res) {
    try {
        const record = await OwnershipHistory.findById(req.params.id)
            .populate('land_id', 'plot_number location')
            .populate('recorded_by', 'full_name role');

        if (!record) {
            return res.status(404).json({ message: "Ownership history not found" });
        }

        res.status(200).json(record);
    } catch (error) {
        console.error("Error in getOwnershipHistoryById controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// GET Ownership History by Land ID
// export async function getOwnershipHistoryByLandId(req, res) {
//     try {
//         const { landId } = req.params;

//         const records = await OwnershipHistory.find({ land_id: landId })
//             .populate('land_id', 'plot_number location')
//             .populate('recorded_by', 'full_name role');

//         if (!records || records.length === 0) {
//             return res.status(404).json({ message: "No ownership history found for this land ID" });
//         }

//         res.status(200).json(records);
//     } catch (error) {
//         console.error("Error in getOwnershipHistoryByLandId controller", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// }

 // adjust path if needed

// ✅ Get ownership history by Land ID
export const getOwnershipHistoryByLandId = async (req, res) => {
    try {
        const { landId } = req.params;

        // Convert to ObjectId safely
        let objectId;
        try {
            objectId = new mongoose.Types.ObjectId(landId);
        } catch (err) {
            return res.status(400).json({ message: "Invalid land ID format" });
        }

        const history = await OwnershipHistory.find({ land_id: objectId })
            .populate("land_id")
            .populate("recorded_by")
            .lean();;

        if (!history || history.length === 0) {
            return res.status(404).json({ message: "No ownership history found for this land ID" });
        }

          const historyWithDocs = await Promise.all(
      history.map(async (record) => {
        const docs = await Document.find({ ownership_history_id: record._id });
        return { ...record, documents: docs };
      })
    );

        res.status(200).json(historyWithDocs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE Ownership History
export async function updateOwnershipHistory(req, res) {
    try {
        const { id } = req.params;

        const updatedRecord = await OwnershipHistory.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedRecord) {
            return res.status(404).json({ message: "Ownership history not found" });
        }

        res.status(200).json({ message: "Ownership history updated", record: updatedRecord });
    } catch (error) {
        console.error("Error in updateOwnershipHistory controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// DELETE Ownership History
export async function deleteOwnershipHistory(req, res) {
    try {
        const { id } = req.params;

        const deletedRecord = await OwnershipHistory.findByIdAndDelete(id);

        if (!deletedRecord) {
            return res.status(404).json({ message: "Ownership history not found" });
        }

        res.status(200).json({ message: "Ownership history deleted successfully" });
    } catch (error) {
        console.error("Error in deleteOwnershipHistory controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

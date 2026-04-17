import LandRecord from "../models/LandRecord.js";

// CREATE
// export async function createLandRecord(req, res) {
//   try {
//     const {
//       plot_number,
//       khasra_number,
//       area,
//       location,
//       land_type,
//       boundary_coordinates,
//       patwari_notes,
//       created_by,
//     } = req.body;

//     // Basic validation
//     if (
//       !plot_number ||
//       !khasra_number ||
//       !area ||
//       !location ||
//       !land_type ||
//       !created_by
//     ) {
//       return res.status(400).json({ message: "Required fields are missing" });
//     }

//     // Create record
//     const newRecord = new LandRecord({
//       plot_number,
//       khasra_number,
//       area,
//       location,
//       land_type,
//       boundary_coordinates,
//       patwari_notes,
//       created_by,
//     });

//     await newRecord.save();

//     res
//       .status(201)
//       .json({ message: "Land record created successfully", record: newRecord });
//   } catch (error) {
//     console.error("Error in createLandRecord controller", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }


export async function createLandRecord(req, res) {
  try {
    const {
      plot_number,
      khasra_number,
      area,
      location,
      land_type,
      boundary_coordinates,
      patwari_notes,
      current_owner_name,
      current_owner_cnic
    } = req.body;

    if (!plot_number || !current_owner_name || !location || !land_type ||!current_owner_cnic) {
      return res.status(400).json({ message: "Required fields are missing" });
    }
    
     const cnicRegex = /^\d{13}$/;
    if (!cnicRegex.test(current_owner_cnic)) {
      return res.status(400).json({ message: "CNIC must be exactly 13 digits" });
    }
    

    const newRecord = new LandRecord({
      plot_number,
      khasra_number,
      area,
      location,
      land_type,
      boundary_coordinates,
      patwari_notes,
      current_owner_name,
      current_owner_cnic,
      created_by: req.user.id, // comes from token
    });

    await newRecord.save();
    res.status(201).json({ message: "Land record created successfully", record: newRecord });
  } catch (error) {
    console.error("Error in createLandRecord controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


// READ ALL
export async function getAllLandRecords(req, res) {
  try {
    const records = await LandRecord.find().populate(
      "created_by",
      "full_name role"
    );
    res.status(200).json(records);
  } catch (error) {
    console.error("Error in getAllLandRecords controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// READ BY ID
export async function getLandRecordById(req, res) {
  try {
    const record = await LandRecord.findById(req.params.id).populate(
      "created_by",
      "full_name"
    );

    if (!record) {
      return res.status(404).json({ message: "Land record not found" });
    }

    res.status(200).json(record);
  } catch (error) {
    console.error("Error in getLandRecordById controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// UPDATE
export async function updateLandRecord(req, res) {
  try {
    const { id } = req.params;

    const updatedRecord = await LandRecord.findByIdAndUpdate(
      id,
      { ...req.body, updated_at: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({ message: "Land record not found" });
    }

    res
      .status(200)
      .json({ message: "Land record updated", record: updatedRecord });
  } catch (error) {
    console.error("Error in updateLandRecord controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// DELETE
export async function deleteLandRecord(req, res) {
  try {
    const { id } = req.params;

    const deletedRecord = await LandRecord.findByIdAndDelete(id);

    if (!deletedRecord) {
      return res.status(404).json({ message: "Land record not found" });
    }

    res.status(200).json({ message: "Land record deleted successfully" });
  } catch (error) {
    console.error("Error in deleteLandRecord controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
// COUNT ALL
export async function countLandRecords(req, res) {
  try {
    const totalRecords = await LandRecord.countDocuments();

    res.status(200).json({ totalRecords });
  } catch (error) {
    console.error("Error in countLandRecords controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

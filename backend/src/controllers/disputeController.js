import Dispute from '../models/Dispute.js';

// CREATE Dispute
export async function createDispute(req, res) {
    try {
        const {
            dispute_details,
            status,
            resolution_notes,
            resolution_date
        } = req.body;
        const land_id = req.params.landId;

        // Validation
        if ( !dispute_details) {
            return res.status(400).json({ message: "Required fields are missing" });
        }
        if (!land_id) {
            return res.status(400).json({ message: "Land ID is required" });
        }

        // Create new dispute
        const newDispute = new Dispute({
            land_id,
            filed_by:req.user.id,
            dispute_details,
            status,
            resolution_notes,
            resolution_date
        });

        await newDispute.save();
        res.status(201).json({ message: "Dispute filed successfully", dispute: newDispute });
    } catch (error) {
        console.error("Error in createDispute controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export async function getAllDisputes(req, res) {
    try {
        const disputes = await Dispute.find({
      status: { $in: ["Pending", "Rejected"] } 
    })
            .populate('land_id', 'plot_number location')
            .populate('filed_by', 'full_name role');
        res.status(200).json(disputes);
    } catch (error) {
        console.error("Error in getAllDisputes controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export async function getResolvedDisputes(req, res) {
    try {
        const disputes = await Dispute.find({
      status: "Resolved"
    })
            .populate('land_id', 'plot_number location')
            .populate('filed_by', 'full_name role');
        res.status(200).json(disputes);
    } catch (error) {
        console.error("Error in getAllDisputes controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// GET Dispute by ID
export async function getDisputeById(req, res) {
    try {
        const dispute = await Dispute.findById(req.params.id)
            .populate('land_id', 'plot_number location')
            .populate('filed_by', 'full_name role');

        if (!dispute) {
            return res.status(404).json({ message: "Dispute not found" });
        }

        res.status(200).json(dispute);
    } catch (error) {
        console.error("Error in getDisputeById controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// UPDATE Dispute
export async function updateDispute(req, res) {
    try {
        const { id } = req.params;

        const updatedDispute = await Dispute.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedDispute) {
            return res.status(404).json({ message: "Dispute not found" });
        }

        res.status(200).json({ message: "Dispute updated successfully", dispute: updatedDispute });
    } catch (error) {
        console.error("Error in updateDispute controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// DELETE Dispute
export async function deleteDispute(req, res) {
    try {
        const { id } = req.params;

        const deletedDispute = await Dispute.findByIdAndDelete(id);

        if (!deletedDispute) {
            return res.status(404).json({ message: "Dispute not found" });
        }

        res.status(200).json({ message: "Dispute deleted successfully" });
    } catch (error) {
        console.error("Error in deleteDispute controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}



// GET dispute counts by status
export async function getDisputeStats(req, res) {
    try {
        const stats = await Dispute.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        
        const result = stats.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, { Pending: 0, Resolved: 0, Rejected: 0 }); 

        res.status(200).json(result);
    } catch (error) {
        console.error("Error in getDisputeStats controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// GET monthly dispute stats
export async function getMonthlyDisputeStats(req, res) {
  try {
    const stats = await Dispute.aggregate([
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, status: "$status" },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.month",
          counts: {
            $push: { status: "$_id.status", count: "$count" },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    // Start with all months = 0
    const formatted = months.map((m, i) => ({
      month: m,
      pending: 0,
      resolved: 0,
    }));

    // Fill in actual counts
    stats.forEach((item) => {
      const row = formatted[item._id - 1]; // month number from $month (1-12)
      item.counts.forEach((c) => {
        if (c.status === "Pending") row.pending = c.count;
        if (c.status === "Resolved") row.resolved = c.count;
      });
    });

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error in getMonthlyDisputeStats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// controllers/reportController.js
import LandRecord from "../models/LandRecord.js";
import Dispute from "../models/Dispute.js";
import OwnershipHistory from "../models/OwnershipHistory.js";
import Document from "../models/Documents.js";
import User from "../models/User.js";

export const getAnalytics = async (req, res) => {
  try {
    // ── Counts ──────────────────────────────────────
    const [totalLands, totalDisputes, totalTransfers, totalDocuments, totalUsers] =
      await Promise.all([
        LandRecord.countDocuments(),
        Dispute.countDocuments(),
        OwnershipHistory.countDocuments(),
        Document.countDocuments(),
        User.countDocuments(),
      ]);

    // ── Disputes by status ───────────────────────────
    const disputesByStatus = await Dispute.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // ── Land by type ─────────────────────────────────
    const landByType = await LandRecord.aggregate([
      { $group: { _id: "$land_type", count: { $sum: 1 } } },
    ]);

    // ── Users by role ────────────────────────────────
    const usersByRole = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    // ── Land records per month (last 6 months) ───────
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const landsPerMonth = await LandRecord.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // ── Disputes per month (last 6 months) ───────────
    const disputesPerMonth = await Dispute.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // ── Top clerks by records created ────────────────
    const topClerks = await LandRecord.aggregate([
      {
        $group: { _id: "$created_by", count: { $sum: 1 } },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          full_name: "$user.full_name",
          username: "$user.username",
          count: 1,
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      counts: { totalLands, totalDisputes, totalTransfers, totalDocuments, totalUsers },
      disputesByStatus,
      landByType,
      usersByRole,
      landsPerMonth,
      disputesPerMonth,
      topClerks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};
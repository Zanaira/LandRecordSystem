import React, { useEffect, useState } from "react";
import StateCard from "./StateCard";
import ChartCard from "./ChartCard";
import API from "../services/api.js";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import MapIcon from "@mui/icons-material/Map";
import DisputeTrends from "./DisputeTrends.jsx";

export default function DashboardContant() {
  const [stats, setStats] = useState({});
  const [count, setCount] = useState({});

  const fetchStats = async () => {
    try {
      const res = await API.get("/dispute/stats");
      setStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCount = async () => {
    try {
      const res = await API.get("/landRecord/count");
      setCount(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchCount();
  }, []);

  return (
    <div style={{ backgroundColor: "#edf2f0", width: "100%", height: "100vh" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          paddingTop: "1rem",
        }}
      >
        <StateCard
          name="Total Land Records"
          stats={count.totalRecords}
          icon={MapIcon}
          iconColor="#abbca1"
          link="/dashboard/manage-record"
        />
        <StateCard
          name="Total Disputes"
          stats={
            (stats.Pending || 0) + (stats.Resolved || 0) + (stats.Rejected || 0)
          }
          icon={ReportProblemIcon}
          iconColor="#abbca1"
          link="/dashboard/disputes"
        />
        <StateCard
          name="Resolved Disputes"
          stats={stats.Resolved}
          icon={DoneAllIcon}
          iconColor="#2e7d32"
          link="/dashboard/resolve-dispute"
        />
        <StateCard
          name="Pending Disputes"
          stats={stats.Pending}
          icon={PendingActionsIcon}
          iconColor="#f57c00"
          link="/dashboard/disputes"
        />
      </div>
      <div className="flex gap-6 m-4">
        <ChartCard />
        <DisputeTrends />
      </div>
    </div>
  );
}

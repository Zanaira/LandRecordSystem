import { useEffect, useState } from "react";
import API from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function DisputeTrendsChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/dispute/month-stats");
        console.log(res);
        setData(res.data);
      } catch (err) {
        console.error("Error fetching dispute stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-4 bg-white rounded-xl shadow-md w-1/2">
      <h2 className="text-lg font-semibold mb-4">Dispute Trends</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month"
          ticks={["Jan", "Mar", "May", "Jul", "Sep", "Nov"]}  />
          <YAxis />
          <Tooltip
            formatter={(value, name) => [
              `${value}`,
              name === "pending" ? "Pending" : "Resolved",
            ]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="resolved"
            stroke="#4ade80"
            strokeWidth={3}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="pending"
            stroke="#f59e0b"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

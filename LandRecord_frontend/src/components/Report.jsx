import React, { useEffect, useState } from "react";
import API from "../services/api";
import {
  Box, Typography, Grid, Card, CardContent,
  Divider, CircularProgress,
} from "@mui/material";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  LineChart, Line,
} from "recharts";
import LandscapeIcon from "@mui/icons-material/Landscape";
import GavelIcon from "@mui/icons-material/Gavel";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import DescriptionIcon from "@mui/icons-material/Description";
import PeopleIcon from "@mui/icons-material/People";

const COLORS = ["#4CAF50", "#1976d2", "#FF9800", "#e53935", "#9C27B0"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];


const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// ── Stat Card ──────────────────────────────────────────
function StatCard({ icon, label, value, color }) {
  return (
    <Card sx={{
      borderRadius: 3,
      border: "1px solid", borderColor: color + "30",
      background: `linear-gradient(135deg, #fff 60%, ${color}10 100%)`,
      transition: "all 0.25s ease",
      "&:hover": { boxShadow: `0 8px 24px ${color}30`, transform: "translateY(-2px)" },
    }}>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: "16px !important" }}>
        <Box sx={{
          bgcolor: color + "18", borderRadius: 2.5, p: 1.4,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          {React.cloneElement(icon, { sx: { color, fontSize: 26 } })}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h5" fontWeight={800} lineHeight={1.1} color="#1a1a2e">
            {value ?? 0}
          </Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={500}
            sx={{ display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {label}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}


// ── Chart Card wrapper ─────────────────────────────────
function ChartCard({ title, children }) {
  return (
    <Card sx={{ borderRadius: 3, p: 2, "&:hover": { boxShadow: 4 } }}>
      <Typography fontWeight={600} fontSize="1rem" mb={2}>{title}</Typography>
      {children}
    </Card>
  );
}

export default function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API
      .get("/report", getAuthHeader())
      .then((res) => { setData(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress sx={{ color: "#4CAF50" }} />
      </Box>
    );

  if (!data) return <Typography sx={{ p: 3 }}>Failed to load analytics.</Typography>;

  // ── Format monthly data ──────────────────────────────
  const formatMonthly = (arr) =>
    arr.map((d) => ({ name: MONTHS[d._id.month - 1], count: d.count }));

  const landsMonthly = formatMonthly(data.landsPerMonth);
  const disputesMonthly = formatMonthly(data.disputesPerMonth);

  // ── Format pie data ──────────────────────────────────
  const disputePie = data.disputesByStatus.map((d) => ({ name: d._id, value: d.count }));
  const landPie = data.landByType.map((d) => ({ name: d._id, value: d.count }));
  const userPie = data.usersByRole.map((d) => ({ name: d._id, value: d.count }));

  return (
    <Box sx={{ p: 3, width: "100%", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Reports & Analytics
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* ── Stat Cards ── */}
      <Grid container spacing={2} mb={4}>
        {[
          { icon: <LandscapeIcon />, label: "Total Land Records", value: data.counts.totalLands, color: "#4CAF50" },
          { icon: <GavelIcon />, label: "Total Disputes", value: data.counts.totalDisputes, color: "#e53935" },
          { icon: <SwapHorizIcon />, label: "Ownership Transfers", value: data.counts.totalTransfers, color: "#1976d2" },
          { icon: <DescriptionIcon />, label: "Documents Uploaded", value: data.counts.totalDocuments, color: "#FF9800" },
          { icon: <PeopleIcon />, label: "Total Users", value: data.counts.totalUsers, color: "#9C27B0" },
        ].map((s) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={s.label}>
            <StatCard {...s} />
          </Grid>
        ))}
      </Grid>

      {/* ── Row 1: Pie Charts ── */}
      <Grid container spacing={3} mb={5} sx={{display:"flex",justifyContent:"center" }}>
        <Grid item xs={12} md={4} >
          <ChartCard title="Land Records by Types of Land">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={landPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label>
                  {landPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <ChartCard title="Disputes by Status in 6 Months">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={disputePie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label>
                  {disputePie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <ChartCard title="Users  by  Roles In the System " >
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={userPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label>
                  {userPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>

      {/* ── Row 2: Bar + Line Charts ── */}
      <Grid container spacing={3} mb={3} sx={{display:"flex",justifyContent:"center"}}>
        <Grid item xs={12} md={6}>
          <ChartCard title="Land Records Added In the system ( Last 6 Months)">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={landsMonthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" /><YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#4CAF50" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <ChartCard title="Disputes Filed In the syatem ( Last 6 Months )">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={disputesMonthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" /><YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#e53935" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>

      {/* ── Row 3: Top Clerks Table ── */}
      <Card sx={{ borderRadius: 3, p: 2 }}>
        <Typography fontWeight={600} fontSize="1rem" mb={2}>
          Top Clerks by Records Created
        </Typography>
        {data.topClerks.length === 0 ? (
          <Typography color="text.secondary">No data available</Typography>
        ) : (
          data.topClerks.map((clerk, index) => (
            <Box
              key={clerk._id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 1.5,
                mb: 1,
                borderRadius: 2,
                bgcolor: index % 2 === 0 ? "#fff" : "#e3e8e1",
              }}
            >
              <Box>
                <Typography fontWeight={600}>{clerk.full_name}</Typography>
                <Typography variant="body2" color="text.secondary">@{clerk.username}</Typography>
              </Box>
              <Typography
                fontWeight={700}
                sx={{ color: "#4CAF50", fontSize: "1.1rem" }}
              >
                {clerk.count} records
              </Typography>
            </Box>
          ))
        )}
      </Card>
    </Box>
  );
}
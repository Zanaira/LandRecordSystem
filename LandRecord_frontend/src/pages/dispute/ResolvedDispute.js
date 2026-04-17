import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Chip,
} from "@mui/material";
import API from "../../services/api";

export default function ViewDispute() {
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  const fetchRecords = async () => {
    try {
      const res = await API.get("/dispute/resolve");
      setRecords(res.data);
    } catch (err) {
      let message = "Failed to fetch land records. Please try again later.";
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.request) {
        message =
          "No response from server. Please check your internet connection.";
      }
      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
        confirmButtonColor: "#d33",
      });
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return { bgcolor: "#FFD54F", color: "black" };
      case "Resolved":
        return { bgcolor: "#66BB6A", color: "white" };
      case "Rejected":
        return { bgcolor: "#EF5350", color: "white" };
      default:
        return {};
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleRowClick = (id) => {
    navigate(`/dashboard/manage-resolve/${id}`);
  };

  const filteredRecords = records.filter((rec) => {
  const filterText = filter.toLowerCase();
  const createdAtStr = rec.createdAt
    ? new Date(rec.createdAt).toLocaleDateString().toLowerCase()
    : "";
  const resolvedAtStr = rec.resolution_date
    ? new Date(rec.resolution_date).toLocaleDateString().toLowerCase()
    : "";

  return (
    rec.status?.toLowerCase().includes(filterText) ||
    rec.land_id?.plot_number?.toLowerCase().includes(filterText) ||
    rec.filed_by?.full_name?.toLowerCase().includes(filterText) ||
    createdAtStr.includes(filterText) ||
    resolvedAtStr.includes(filterText)
  );
});


  return (
    <Box >
      <Paper sx={{ height: '100%' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bolder" }}>Plot Number</TableCell>
                <TableCell sx={{ fontWeight: "bolder" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bolder" }}>Filed By</TableCell>
                <TableCell sx={{ fontWeight: "bolder" }}>Filed Date</TableCell>
                <TableCell sx={{ fontWeight: "bolder" }}>Resolved Date</TableCell>
                <TableCell colSpan={2} align="right">
                  <TextField
                    placeholder="Search..."
                    size="small"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    sx={{
                      width: "70%",
                      backgroundColor: "white",
                      borderRadius: 2,
                    }}
                  />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((rec) => (
                  <TableRow
                    key={rec._id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleRowClick(rec._id)}
                  >
                    <TableCell>{rec.land_id?.plot_number || "N/A"}</TableCell>
                    <TableCell>
                      <Chip
                        label={rec.status}
                        sx={{
                          fontWeight: "bold",
                          borderRadius: "6px",
                          ...getStatusStyle(rec.status),
                        }}
                      />
                    </TableCell>
                    <TableCell>{rec.filed_by?.full_name || ""}</TableCell>
                    <TableCell>
                      {new Date(rec.createdAt).toLocaleDateString()}
                    </TableCell>

                       <TableCell>
                      {new Date(rec.resolution_date).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

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
  TableContainer
} from "@mui/material";
import API from "../services/api";

export default function ManageLandRecords() {
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  const fetchRecords = async () => {
    try {
      const res = await API.get("/landRecord");
      setRecords(res.data);
    } catch (err) {
      let message = "Failed to fetch land records. Please try again later.";
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.request) {
        message = "No response from server. Please check your internet connection.";
      }
      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
        confirmButtonColor: "#d33"
      });
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleRowClick = (id) => {
    navigate(`/dashboard/land-details/${id}`);
  };

  const filteredRecords = records.filter((rec) => {
    const filterText = filter.toLowerCase();
    return (
      rec.plot_number?.toLowerCase().includes(filterText) ||
      rec.khasra_number?.toLowerCase().includes(filterText) ||
      rec.location?.toLowerCase().includes(filterText) ||
      rec.land_type?.toLowerCase().includes(filterText) ||
      rec.created_by?.full_name?.toLowerCase().includes(filterText) ||
      rec.patwari_notes?.toLowerCase().includes(filterText)
    );
  });

  return (
    <Box>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Plot Number</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Owner Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Location</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Land Type</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Record Created</TableCell>
                <TableCell colSpan={2} align="right">
                  <TextField
                    placeholder="Search..."
                    size="small"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    sx={{
                      width: "100%",
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
                    <TableCell>{rec.plot_number}</TableCell>
                    <TableCell>{rec.current_owner_name}</TableCell>
                    <TableCell>{rec.location}</TableCell>
                    <TableCell>{rec.land_type}</TableCell>
                    <TableCell>{rec.created_by?.full_name || ""}</TableCell>
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

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import showToast from "../../components/ShowToast";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  MenuItem,
  Chip
} from "@mui/material";
import API from "../../services/api";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function CreateDispute() {
  const { landId } = useParams();

  const [formData, setFormData] = useState({
    dispute_details: "",
    status: "",
    resolution_notes: "",
    resolution_date: "",
  });
  
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


  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
   

    API
      .post(`/dispute/${landId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // send token to backend
        },
      })
      .then(() => {
        showToast("Record created successfully", "success");
        setFormData({
          dispute_details: "",
          status: "",
          resolution_notes: "",
          resolution_date: "",
        });
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.message) {
          showToast(err.response.data.message, "error");
        } else {
          showToast("An unexpected error occurred", "error");
          console.error("Error creating record:", err);
        }
      });
  };

  return (
    <Paper
      sx={{
        p: 3,
        height: "100vh",
        
      }}
    >
      <Button
        variant="contained"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/dashboard/land-details/${landId}`)}
        sx={{ mb: 3, bgcolor: "#4CAF50" }}
      >
        Back
      </Button>

      <Typography
        variant="h5"
        sx={{
          mb: 2,
          fontWeight: "bold",
         
        }}
      >
        Add Dispute
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {/* Dispute Details */}
          <TextField
            label="Enter Dispute Details"
            name="dispute_details"
            value={formData.dispute_details}
            onChange={handleChange}
            required
            multiline
            rows={3}
            sx={{ backgroundColor: "white", borderRadius: 2 }}
          />

          {/* Status Dropdown with colors */}
          <TextField
            select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
           sx={{ bgcolor: "#fff", borderRadius: 2 }}
          >
            <MenuItem value="Pending">
              <Chip label="Pending" sx={getStatusStyle("Pending")} />
            </MenuItem>
            <MenuItem value="Resolved">
              <Chip label="Resolved" sx={getStatusStyle("Resolved")} />
            </MenuItem>
            <MenuItem value="Rejected">
              <Chip label="Rejected" sx={getStatusStyle("Rejected")} />
            </MenuItem>
          </TextField>

          {/* Conditional Resolution Fields */}
          {formData.status === "Resolved" && (
            <>
              <TextField
                label="Resolution Notes"
                name="resolution_notes"
                value={formData.resolution_notes}
                onChange={handleChange}
                multiline
                rows={2}
                sx={{ backgroundColor: "white", borderRadius: 2 }}
              />
              <TextField
                type="date"
                label="Resolution Date"
                name="resolution_date"
                InputLabelProps={{ shrink: true }}
                value={formData.resolution_date}
                onChange={handleChange}
                sx={{ backgroundColor: "white", borderRadius: 2 }}
              />
            </>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#0F5A4A",
              "&:hover": {
                backgroundColor: "#0D4B3F",
              },
              borderRadius: 2,
              fontWeight: "bold",
              mt: 2,
            }}
          >
            Create
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}

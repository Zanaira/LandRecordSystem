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
} from "@mui/material";
import API from "../../services/api";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function CreateLandRecord() {
  const { landId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    new_owner_name: "",
    new_owner_cnic: "",
    transaction_date: "",
    transaction_amount: "",
    documents_uploaded: true,
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  try {
    // Step 1: Create ownership history
    const res = await API.post(`/owner/${landId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        },
      }
    );

    const ownershipHistoryId = res.data.record._id; // ✅ correct here

    // Step 2: If a file is uploaded, send it to /api/document/upload
    if (file) {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("land_id", landId);
      uploadData.append("ownership_history_id", ownershipHistoryId);
      uploadData.append("document_type", "Ownership Transfer");
      uploadData.append("uploaded_by", localStorage.getItem("userId")); // adjust based on your auth

 

      await API.post(`/document/${landId}`, uploadData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    }

    showToast("Record created successfully", "success");
    setFormData({
      new_owner_name: "",
      new_owner_cnic: "",
      transaction_date: "",
      transaction_amount: "",
      documents_uploaded: true,
    });
    setFile(null);
  } catch (err) {
    if (err.response?.data?.message) {
      showToast(err.response.data.message, "error");
    } else {
      showToast("An unexpected error occurred", "error");
    }
    console.error("Error creating record:", err);
  }
};


  return (
    <Paper sx={{ p: 3 }}>
      <Button
        variant="contained"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/dashboard/land-details/${landId}`)}
        sx={{ mb: 3, bgcolor: "#4CAF50" }}
      >
        Back
      </Button>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Add Ownership History
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="New Owner Name"
            name="new_owner_name"
            value={formData.new_owner_name}
            onChange={handleChange}
            required
          />
          <TextField
            label="New Owner CNIC"
            name="new_owner_cnic"
            value={formData.new_owner_cnic}
            onChange={handleChange}
            required
          />
          <TextField
            select
            label="Document Uploaded"
            name="documents_uploaded"
            value={formData.documents_uploaded}
            onChange={handleChange}
            required
          >
            <MenuItem value="true">Yes</MenuItem>
            <MenuItem value="false">No</MenuItem>
          </TextField>

          <TextField
            type="date"
            label="Transaction Date"
            name="transaction_date"
            value={formData.transaction_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={{ backgroundColor: "white", borderRadius: 2 }}
            required
          />

          <TextField
            label="Transaction Amount"
            name="transaction_amount"
            type="number"
            value={formData.transaction_amount}
            onChange={handleChange}
          />

          {/* File Upload Input */}
          <Button variant="outlined" component="label">
            Upload Document
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          {file && <Typography variant="body2">{file.name}</Typography>}

          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#0F5A4A",
              "&:hover": {
                backgroundColor: "#0D4B3F",
              },
            }}
          >
            Create
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}

import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  MenuItem,
} from "@mui/material";
import API from "../services/api";
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export default function CreateLandRecord() {
  const [formData, setFormData] = useState({
    plot_number: "",
    khasra_number: "",
    area: "",
    location: "",
    land_type: "Residential",
    boundary_coordinates: "",
    patwari_notes: "",
    current_owner_name:"",
    current_owner_cnic:"",
    
  });
  const navigate=useNavigate();
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
      .post("/landRecord", formData,{
         headers: {
        Authorization: `Bearer ${token}`, // send token to backend
      },
      })
      .then(() => {
        showToast("Record created successfully",'success');
        setFormData({
          plot_number: "",
          khasra_number: "",
          area: "",
          location: "",
          land_type: "Residential",
          boundary_coordinates: "",
          patwari_notes: "",
          current_owner_name:"",
          current_owner_cnic:"",
        });
      })
      .catch((err) => {if (err.response && err.response.data && err.response.data.message) {
        showToast(err.response.data.message, "error");
      } else {
        showToast("An unexpected error occurred", "error");
      }
      console.error("Error creating record:", err);
    });
  
  };
  const showToast = (message, type) => {
    Swal.fire({
      icon: type, // "success", "error", "warning", "info", "question"
      title: message,
      toast: true,
      position: "bottom-end",
      timer: 3500,
      timerProgressBar: true,
      showConfirmButton: false,
      background: "#f4f6f9", 
      color: type === "error" ? "#b91c1c" : "#1f2937", 
      customClass: {
        popup: "border border-gray-300 shadow-lg rounded-lg",
        title: "text-lg font-semibold tracking-wide",
      },
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      }
    });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/dashboard`)}
          sx={{ mb: 3, bgcolor: "#4CAF50" }}
        >
          Back
        </Button>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Add Land Record
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Plot Number"
            name="plot_number"
            value={formData.plot_number}
            onChange={handleChange}
            required
          />
          <TextField
            label="Khasra Number"
            name="khasra_number"
            value={formData.khasra_number}
            onChange={handleChange}
            required
          />
          <TextField
            label="Area"
            name="area"
            type="number"
            value={formData.area}
            onChange={handleChange}
            required
          />
          <TextField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
          <TextField
            select
            label="Land Type"
            name="land_type"
            value={formData.land_type}
            onChange={handleChange}
            required
          >
            <MenuItem value="Agricultural">Agricultural</MenuItem>
            <MenuItem value="Residential">Residential</MenuItem>
            <MenuItem value="Commercial">Commercial</MenuItem>
          </TextField>
          <TextField
            label="Boundary Coordinates"
            name="boundary_coordinates"
            value={formData.boundary_coordinates}
            onChange={handleChange}
            required
          />
          <TextField
            label="Patwari Notes"
            name="patwari_notes"
            multiline
            rows={3}
            value={formData.patwari_notes}
            onChange={handleChange}
          />
          <TextField
            label="Owner Name"
            name="current_owner_name"
            value={formData.current_owner_name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Owner CNIC"
            name="current_owner_cnic"
            value={formData.current_owner_cnic}
            onChange={handleChange}
            required
          />
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

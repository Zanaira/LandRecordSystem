import React, { useEffect, useState,useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import showToast from "../components/ShowToast";
import ConfirmDialog from "../components/ConfirmDialog";
import {
  Typography,
  Box,
  Divider,
  Button,
  Stack,
  TextField,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HistoryIcon from "@mui/icons-material/History";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

export default function LandRecordDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  



  const fetchRecord= useCallback(async () => {
    API
      .get(`/landRecord/${id}`)
      .then((res) => {
        setRecord(res.data);
        setEditValues(res.data); // Pre-fill edit form
        setLoading(false);
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.message) {
          showToast(err.response.data.message, "error");
        } else {
          showToast("Error fetching record:", err);
        }
        setLoading(false);
      });
  }, [id]);
  useEffect(() => {
    if (id) {
      fetchRecord();
    }
  }, [id, fetchRecord]);
const handleDelete = () => {
    setConfirmOpen(true); // Open dialog instead of window.confirm
  };
  const confirmDelete = () => {
    if (("Are you sure you want to delete this record?")) {
      API
        .delete(`/landRecord/${id}`)
        .then(() => {
          showToast("Land record deleted successfully");
          navigate("/dashboard/manage-record");
        })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.message) {
            showToast(err.response.data.message, "error");
          } else {
            console.error("Error deleting record:", err);
          }
          showToast("Failed to delete record.");
          
        }).finally(() => {
        setConfirmOpen(false); // Close dialog after attempt
      });
    }
  };

  const handleUpdateSave = () => {
    API
      .put(`/landRecord/${id}`, editValues)
      .then(() => {
        showToast("Record updated successfully","success");
        setIsEditing(false);
        fetchRecord();
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.message) {
          showToast(err.response.data.message, "error");
        } else {
          showToast("An unexpected error occurred", "error");
        }
        console.error("Error creating record:", err);
      });
  };

  const handleChange = (field, value) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!record) return <Typography>No record found.</Typography>;

  return (
    <>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        gap: 6,
        width: "100%",
        height: "100vh",
        bgcolor: "#f5f6fa",
        p: 4,
      }}
    >
      <Box sx={{ width: "60%", height: "100%" }}>
        {/* Back Button */}
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/dashboard/manage-record")}
          sx={{ mb: 3, bgcolor: "#4CAF50" }}
        >
          Back
        </Button>

        {/* Title */}
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Detailed Record
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {/* Editable Fields */}
        <Box sx={{ flex: 1, lineHeight: 2, bgcolor: "#edf2f0" }}>
          {renderField(
            "Plot Number",
            "plot_number",
            isEditing,
            editValues,
            record,
            handleChange
          )}
          {renderField(
            "Owner Name",
            "current_owner_name",
            isEditing,
            editValues,
            record,
            handleChange
          )}
          {renderField(
            "Owner CNIC",
            "current_owner_cnic",
            isEditing,
            editValues,
            record,
            handleChange
          )}
          {renderField(
            "Khasra Number",
            "khasra_number",
            isEditing,
            editValues,
            record,
            handleChange
          )}
          {renderField(
            "Area",
            "area",
            isEditing,
            editValues,
            record,
            handleChange
          )}
          {renderField(
            "Location",
            "location",
            isEditing,
            editValues,
            record,
            handleChange
          )}
          {renderField(
            "Land Type",
            "land_type",
            isEditing,
            editValues,
            record,
            handleChange
          )}
          {renderField(
            "Coordinates",
            "boundary_coordinates",
            isEditing,
            editValues,
            record,
            handleChange
          )}
          <Info
            label="Created By"
            value={record.created_by?.full_name || "N/A"}
          />
          {renderField(
            "Notes",
            "patwari_notes",
            isEditing,
            editValues,
            record,
            handleChange
          )}
        </Box>

        {/* Update & Delete */}
        <Stack direction="row" spacing={2} mt={2}>
          {isEditing ? (
            <>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{ bgcolor: "#4CAF50" }}
                onClick={handleUpdateSave}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              startIcon={<UpdateIcon />}
              sx={{ bgcolor: "#2196F3" }}
              onClick={() => setIsEditing(true)}
            >
              Update Land Record
            </Button>
          )}

          <Button
            variant="contained"
            startIcon={<DeleteIcon />}
            sx={{ bgcolor: "#F44336" }}
            onClick={handleDelete}
          >
            Delete Land Record
          </Button>
        </Stack>
      </Box>

      {/* Right Side Actions */}
      <Stack
        spacing={2}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Button
          fullWidth
          variant="contained"
          startIcon={<TransferWithinAStationIcon />}
          sx={{ bgcolor: "#2196F3" }}
          onClick={() => navigate(`/dashboard/create-record/${id}`)}
        >
          Create Ownership Transfer
        </Button>

        <Button
          fullWidth
          variant="contained"
          startIcon={<HistoryIcon />}
          sx={{ bgcolor: "#FF9800" }}
          onClick={() => navigate(`/dashboard/owner-history/${id}`)}
        >
          {record.plot_number} Ownership History
        </Button>

         <Button
          fullWidth
          variant="contained"
          startIcon={<HistoryIcon />}
          sx={{ bgcolor: "#FF9800" }}
          onClick={() => navigate(`/dashboard/create-dispute/${id}`)}
        >
          {record.plot_number} File Dispute
        </Button>
      </Stack>
    </Box>

    <ConfirmDialog
        open={confirmOpen}
        title="Delete Land Record"
        message="Are you sure you want to delete this record? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
      </>
  );
}

// make sure MenuItem is imported

function renderField(
  label,
  field,
  isEditing,
  editValues,
  record,
  handleChange
) {
  if (isEditing) {
    // Special case for land_type dropdown
    if (field === "land_type") {
      return (
        <TextField
          select
          label={label}
          variant="outlined"
          size="small"
          fullWidth
          margin="dense"
          value={editValues[field] || ""}
          onChange={(e) => handleChange(field, e.target.value)}
        >
          <MenuItem value="Commercial">Commercial</MenuItem>
          <MenuItem value="Residential">Residential</MenuItem>
          <MenuItem value="Agricultural">Agricultural</MenuItem>
        </TextField>
      );
    }

    // Default text field for all other editable fields
    return (
      <TextField
        label={label}
        variant="outlined"
        size="small"
        fullWidth
        margin="dense"
        value={editValues[field] || ""}
        onChange={(e) => handleChange(field, e.target.value)}
      />
    );
  }

  // Read-only display
  return <Info label={label} value={record[field]} />;
}

function Info({ label, value }) {
  return (
    <Typography sx={{ fontSize: "1rem", display: "flex", lineHeight: 1.9 }}>
      <strong style={{ minWidth: "130px", display: "inline-block" }}>
        {label}:
      </strong>
      {value}
    </Typography>
  );
}


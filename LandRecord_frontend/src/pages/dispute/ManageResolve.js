import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import showToast from "../../components/ShowToast";
import ConfirmDialog from "../../components/ConfirmDialog";
import {
  Typography,
  Box,
  Divider,
  Button,
  Stack,
  TextField,
  MenuItem,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

export default function ManageDisputes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchRecord = useCallback(async () => {
    API
      .get(`/dispute/${id}`)
      .then((res) => {
        setRecord(res.data);
        setEditValues(res.data);
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
    setConfirmOpen(true);
  };
  const confirmDelete = () => {
    if ("Are you sure you want to delete this record?") {
      API
        .delete(`/dispute/${id}`)
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
        })
        .finally(() => {
          setConfirmOpen(false);
        });
    }
  };

  const handleUpdateSave = () => {
    API
      .put(`/dispute/${id}`, editValues)
      .then(() => {
        showToast("Record updated successfully", "success");
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
    
       
        <Box >
          {/* Back Button */}
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/dashboard/resolve-dispute")}
            sx={{ mb: 3, bgcolor: "#4CAF50",marginTop:2,marginLeft:2 }}
          >
            Back
          </Button>

          {/* Title */}
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600,textAlign:"center",paddingRight:10 }}>
            Resolve Dispute Details
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {/* Editable Fields */}
          <Box
            sx={{
              flex: 1,
              lineHeight: 2,
              bgcolor: "#edf2f0",
              p: 3,
              height: "100%",
              margin:10,
              width:"70%"
            }}
          >
            <Info
              label="Plot Number"
              value={record.land_id?.plot_number || "N/A"}
            />
            {renderField(
              "Status",
              "status",
              isEditing,
              editValues,
              record,
              handleChange
            )}
            <Info
              label="Filed By"
              value={record.filed_by?.full_name || "N/A"}
            />
              {renderField(
              "Resolution Date",
              "resolution_date",
              isEditing,
              editValues,
              record,
              handleChange
            )}
            {renderField(
              "Dispute Detail",
              "dispute_details",
              isEditing,
              editValues,
              record,
              handleChange
            )}
            {renderField(
              "Resolution Note",
              "resolution_notes",
              isEditing,
              editValues,
              record,
              handleChange
            )}
          
          

          
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
                Update Dispute
              </Button>
            )}

            <Button
              variant="contained"
              startIcon={<DeleteIcon />}
              sx={{ bgcolor: "#F44336" }}
              onClick={handleDelete}
            >
              Delete Dispute
            </Button>
           
          </Stack> </Box>

        </Box>

        {/* Right Side Actions */}
    

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

function renderField(
  label,
  field,
  isEditing,
  editValues,
  record,
  handleChange
) {
  if (isEditing) {
    if (field === "status") {
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
      );
    }
    if (field === "resolution_date") {
      return (
        <TextField
          label={label}
          type="date"
          variant="outlined"
          size="small"
          fullWidth
          margin="dense"
          InputLabelProps={{ shrink: true }}
          value={
            editValues[field]
              ? new Date(editValues[field]).toISOString().split("T")[0] 
              : ""
          }
          onChange={(e) => handleChange(field, e.target.value)}
        />
      );
    }

    // Default text field
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

  if (field === "resolution_date") {
    return (
      <Info
        label={label}
        value={
          record[field]
            ? new Date(record[field]).toLocaleDateString()
            : "N/A"
        }
      />
    );
  }

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

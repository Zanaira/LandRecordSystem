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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HistoryIcon from "@mui/icons-material/History";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
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
  const [isResolving, setIsResolving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const fetchRecord = useCallback(async () => {
    API
      .get(`/dispute/${id}`)
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
          setConfirmOpen(false); // Close dialog after attempt
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

  const handleRejectSave = () => {
    API
      .put(`/dispute/${id}`, {
        status: "Rejected",
        resolution_notes: editValues.resolution_notes, // save reject notes
      })
      .then(() => {
        showToast("Dispute rejected successfully", "success");
        setIsRejecting(false);
        fetchRecord(); // refresh data to show notes in left panel
      })
      .catch((err) => {
        showToast(
          err.response?.data?.message || "Failed to reject dispute",
          "error"
        );
      });
  };

  const handleResolveSave = () => {
    API
      .put(`/dispute/${id}`, {
        status: "Resolved",
        resolution_notes: editValues.resolution_notes,
        resolution_date: editValues.resolution_date,
      })
      .then(() => {
        showToast("Dispute resolved successfully", "success");
        navigate("/dashboard/disputes"); // 🔹 redirect so it disappears from list
      })
      .catch((err) => {
        showToast(
          err.response?.data?.message || "Failed to resolve dispute",
          "error"
        );
      });
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
            onClick={() => navigate("/dashboard/disputes")}
            sx={{ mb: 3, bgcolor: "#4CAF50" }}
          >
            Back
          </Button>

          {/* Title */}
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Dispute Detail
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {/* Editable Fields */}
          <Box
            sx={{
              flex: 1,
              lineHeight: 2,
              bgcolor: "#edf2f0",
              p: 3,
              height: "50%",
              filter: isResolving || isRejecting ? "blur(4px)" : "none",
              pointerEvents: isResolving || isRejecting ? "none" : "auto",
            }}
          >
            <Info
              label="Plot Number"
              value={record.land_id?.plot_number || "N/A"}
            />
            <Info label="Status" value={record.status || "N/A"} />
            <Info
              label="Filed By"
              value={record.filed_by?.full_name || "N/A"}
            />
            {renderField(
              "Detail",
              "dispute_details",
              isEditing,
              editValues,
              record,
              handleChange
            )}

         
            {record.status === "Rejected" && (
              <Info
                label="Rejection Notes"
                value={record.resolution_notes || "N/A"}
              />
            )}
          </Box>
          {isRejecting && (
            <Box
              sx={{
                position: "absolute",
                top: "20%",
                left: "50%",
                transform: "translateX(-50%)",
                bgcolor: "white",
                p: 3,
                borderRadius: 2,
                boxShadow: 5,
                width: "40%",
                zIndex: 10,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Reject Dispute
              </Typography>
              <TextField
                label="Rejection Notes"
                multiline
                rows={3}
                fullWidth
                margin="dense"
                value={editValues.resolution_notes || ""}
                onChange={(e) =>
                  handleChange("resolution_notes", e.target.value)
                }
              />

              <Stack direction="row" spacing={2} mt={2}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  sx={{ bgcolor: "#F44336" }}
                  onClick={handleRejectSave}
                >
                  Save Rejection
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => setIsRejecting(false)}
                >
                  Cancel
                </Button>
              </Stack>
            </Box>
          )}

          {isResolving && (
            <Box
              sx={{
                position: "absolute",
                top: "20%",
                left: "50%",
                transform: "translateX(-50%)",
                bgcolor: "white",
                p: 3,
                borderRadius: 2,
                boxShadow: 5,
                width: "40%",
                zIndex: 10,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Resolve Dispute
              </Typography>
              <TextField
                label="Resolution Notes"
                multiline
                rows={3}
                fullWidth
                margin="dense"
                value={editValues.resolution_notes || ""}
                onChange={(e) =>
                  handleChange("resolution_notes", e.target.value)
                }
              />
              <TextField
                label="Resolution Date"
                type="date"
                fullWidth
                margin="dense"
                InputLabelProps={{ shrink: true }}
                value={
                  editValues.resolution_date
                    ? new Date(editValues.resolution_date)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  handleChange("resolution_date", e.target.value)
                }
              />

              <Stack direction="row" spacing={2} mt={2}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  sx={{ bgcolor: "#4CAF50" }}
                  onClick={handleResolveSave}
                >
                  Save Resolution
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => setIsResolving(false)}
                >
                  Cancel
                </Button>
              </Stack>
            </Box>
          )}

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
          </Stack>
        </Box>

        {/* Right Side Actions */}
        <Stack
          spacing={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            fullWidth
            variant="contained"
            startIcon={<TransferWithinAStationIcon />}
            sx={{ bgcolor: "#2196F3" }}
            onClick={() => setIsResolving(true)}
          >
            Resolve Dispute
          </Button>

          <Button
            fullWidth
            variant="contained"
            startIcon={<HistoryIcon />}
            sx={{ bgcolor: "#FF9800" }}
            onClick={() => setIsRejecting(true)} // 🔹 instead of navigate
          >
            Reject Dispute
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

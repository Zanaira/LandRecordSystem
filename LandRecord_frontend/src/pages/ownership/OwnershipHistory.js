import React, { useEffect, useState,useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import showToast from "../../components/ShowToast";
import {
  Typography,
  Box,
  Divider,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function LandRecordDetails() {
  const { id } = useParams(); // land id
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const BASE_URL = process.env.REACT_APP_API_URL;

  // Fetch ownership history
  const fetchRecord = () => {
    API
      .get(`/owner/land/${id}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.data?.message) {
          showToast(err.response.data.message, "error");
        } else {
          showToast("An unexpected error occurred", "error");
        }
        setData([]);
        setLoading(false);
        console.error("Error fetching record:", err);
      });
  };

  useEffect(() => {
    fetchRecord();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;

  const handleDelete = (recordId) => {
    API
      .delete(`/owner/${recordId}`)
      .then(() => {
        showToast("Ownership history deleted successfully", "success");
        fetchRecord();
      })
      .catch((err) => {
        if (err.response?.data?.message) {
          showToast(err.response.data.message, "error");
        } else {
          console.error("Error deleting record:", err);
        }
        showToast("Failed to delete record.", "error");
      });
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setSelectedRecord(record);
    setEditValues(record);
  };

  const handleUpdateSave = () => {
    API
      .put(`/owner/${selectedRecord._id}`, editValues)
      .then(() => {
        showToast("Record updated successfully", "success");
        setIsEditing(false);
        setSelectedRecord(null);
        fetchRecord();
      })
      .catch((err) => {
        if (err.response?.data?.message) {
          showToast(err.response.data.message, "error");
        } else {
          showToast("An unexpected error occurred", "error");
        }
        console.error("Error updating record:", err);
      });
  };

  // document rendering logic
 const renderDocument = (doc) => {
  const previewUrl = `${BASE_URL}/document/view/${doc._id}`;
  const downloadUrl = `${BASE_URL}/document/download/${doc._id}`;

  const isPDF = /\.pdf$/i.test(doc.file_path);
  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(doc.file_path);
  const isWord = /\.(doc|docx)$/i.test(doc.file_path);

  if (isImage) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: "5rem",
            height: "5rem",
            overflow: "hidden",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          <img
            src={previewUrl}
            alt="Document"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </Box>
        <Button size="small" variant="contained" href={downloadUrl}>
          Download
        </Button>
      </Box>
    );
  }

  if (isPDF) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
        <iframe
          src={previewUrl}
          title="PDF Preview"
          style={{ width: "80px", height: "80px", border: "1px solid #ccc" }}
        />
        <Button size="small" variant="contained" href={downloadUrl}>
          Download
        </Button>
      </Box>
    );
  }

  if (isWord) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
        <Typography>📘 Word</Typography>
        <Button size="small" variant="contained" href={downloadUrl}>
          Download
        </Button>
      </Box>
    );
  }

  return <Typography>Unknown File</Typography>;
};



  return (
    <Box sx={{ p: 3, width: "100%", height: "100vh" }}>
      <Button
        variant="contained"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/dashboard/land-details/${id}`)}
        sx={{ mb: 2, bgcolor: "#4CAF50" }}
      >
        Back
      </Button>

      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Ownership History
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ lineHeight: 2 }}>
        {data.length > 0 ? (
          data.map((record, index) => (
            <Box
              key={record._id}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                bgcolor: index % 2 === 0 ? "#fff" : "#e3e8e1",
                "&:hover": { boxShadow: 3 },
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Box sx={{ flex: 1 }}>
                {isEditing && selectedRecord?._id === record._id ? (
                  <>
                    {/* Editable fields */}
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Previous Owner"
                          value={editValues.previous_owner_name || ""}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              previous_owner_name: e.target.value,
                            })
                          }
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Previous Owner CNIC"
                          value={editValues.previous_owner_cnic || ""}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              previous_owner_cnic: e.target.value,
                            })
                          }
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="New Owner"
                          value={editValues.new_owner_name || ""}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              new_owner_name: e.target.value,
                            })
                          }
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="New Owner CNIC"
                          value={editValues.new_owner_cnic || ""}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              new_owner_cnic: e.target.value,
                            })
                          }
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Transaction Amount"
                          value={editValues.transaction_amount || ""}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              transaction_amount: e.target.value,
                            })
                          }
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          label="Transaction Date"
                          value={editValues.transaction_date || ""}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              transaction_date: e.target.value,
                            })
                          }
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={handleUpdateSave}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          setIsEditing(false);
                          setSelectedRecord(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </>
                ) : (
                  <>
                    <Info label="Previous Owner" value={record.previous_owner_name} />
                    <Info label="Previous Owner CNIC" value={record.previous_owner_cnic} />
                    <Info label="New Owner" value={record.new_owner_name} />
                    <Info label="New Owner CNIC" value={record.new_owner_cnic} />
                    <Info label="Transaction Date" value={record.transaction_date} />
                    <Info label="Transaction Amount" value={record.transaction_amount} />
                    <Info
                      label="Recorded By"
                      value={record.recorded_by?.full_name || "N/A"}
                    />

                    <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEdit(record)}
                      >
                        Update
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(record._id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </>
                )}
              </Box>

              {/* Document Preview */}
              <Box
                sx={{
                  ml: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  alignItems: "center",
                }}
              >
                {record.documents && record.documents.length > 0 ? (
                  record.documents.map((doc) => (
                    <Box
                      key={doc._id}
                      sx={{
                        width: "5rem",
                        flexDirection:"column",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        
                      }}
                    >
                      {renderDocument(doc)}
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No Documents
                  </Typography>
                )}
              </Box>
            </Box>
          ))
        ) : (
          <Typography>No record found</Typography>
        )}
      </Box>
    </Box>
  );
}

function Info({ label, value }) {
  return (
    <Typography sx={{ fontSize: "1rem", display: "flex", lineHeight: 2 }}>
      <strong style={{ minWidth: "175px", display: "inline-block" }}>
        {label}:
      </strong>
      {value}
    </Typography>
  );
}

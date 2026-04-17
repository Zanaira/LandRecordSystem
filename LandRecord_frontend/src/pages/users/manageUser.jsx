import React, { useEffect, useState } from "react";
import API from "../../services/api";
import showToast from "../../components/ShowToast";
import {
  Box,
  Typography,
  Button,
  Divider,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";



const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const emptyForm = {
  username: "",
  full_name: "",
  role: "Clerk",
  password: "",
};

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(emptyForm);
  const [createLoading, setCreateLoading] = useState(false);

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editTarget, setEditTarget] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  // Role dialog
  const [roleOpen, setRoleOpen] = useState(false);
  const [roleTarget, setRoleTarget] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [roleLoading, setRoleLoading] = useState(false);

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    API
      .get("/user", getAuthHeader())
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        showToast(err.response?.data?.message || "Failed to fetch users", "error");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ── Create ──────────────────────────────────────────
  const handleCreateOpen = () => {
    setCreateForm(emptyForm);
    setCreateOpen(true);
  };

  const handleCreate = () => {
    if (!createForm.username || !createForm.full_name || !createForm.password) {
      showToast("All fields are required", "error");
      return;
    }
    setCreateLoading(true);
    API
      .post(`user/register`, createForm, getAuthHeader())
      .then(() => {
        showToast("User created successfully", "success");
        setCreateOpen(false);
        fetchUsers();
      })
      .catch((err) =>
        showToast(err.response?.data?.message || "Failed to create user", "error")
      )
      .finally(() => setCreateLoading(false));
  };

  // ── Edit ────────────────────────────────────────────
  const handleEditOpen = (user) => {
    setEditTarget(user);
    setEditForm({ username: user.username, full_name: user.full_name });
    setEditOpen(true);
  };

  const handleEdit = () => {
    setEditLoading(true);
    
API
      .put(`user/${editTarget._id}`, editForm, getAuthHeader())
      .then(() => {
        showToast("User updated successfully", "success");
        setEditOpen(false);
        fetchUsers();
      })
      .catch((err) =>
        showToast(err.response?.data?.message || "Failed to update user", "error")
      )
      .finally(() => setEditLoading(false));
  };

  // ── Role ────────────────────────────────────────────
  const handleRoleOpen = (user) => {
    setRoleTarget(user);
    setNewRole(user.role);
    setRoleOpen(true);
  };

  const handleRoleChange = () => {
    setRoleLoading(true);
    API
      .patch(`user/${roleTarget._id}/role`, { role: newRole }, getAuthHeader())
      .then(() => {
        showToast("Role updated successfully", "success");
        setRoleOpen(false);
        fetchUsers();
      })
      .catch((err) =>
        showToast(err.response?.data?.message || "Failed to update role", "error")
      )
      .finally(() => setRoleLoading(false));
  };

  // ── Delete ──────────────────────────────────────────
  const handleDeleteOpen = (user) => {
    setDeleteTarget(user);
    setDeleteOpen(true);
  };

  const handleDelete = () => {
    setDeleteLoading(true);
    API
      .delete(`user/${deleteTarget._id}`, getAuthHeader())
      .then(() => {
        showToast("User deleted successfully", "success");
        setDeleteOpen(false);
        fetchUsers();
      })
      .catch((err) =>
        showToast(err.response?.data?.message || "Failed to delete user", "error")
      )
      .finally(() => setDeleteLoading(false));
  };

  return (
    <Box sx={{ p: 3, width: "100%", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography variant="h4" fontWeight={600}>
          Manage Users
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={handleCreateOpen}
          sx={{ bgcolor: "#4CAF50", "&:hover": { bgcolor: "#388E3C" } }}
        >
          Add User
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* User List */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress sx={{ color: "#4CAF50" }} />
        </Box>
      ) : users.length === 0 ? (
        <Typography>No users found.</Typography>
      ) : (
        users.map((user, index) => (
          <Box
            key={user._id}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
              bgcolor: index % 2 === 0 ? "#fff" : "#e3e8e1",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              "&:hover": { boxShadow: 3 },
            }}
          >
            {/* User Info */}
            <Box>
              <Typography fontWeight={600} fontSize="1rem">
                {user.full_name}
              </Typography>
              <Typography fontSize="0.85rem" color="text.secondary">
                @{user.username}
              </Typography>
              <Typography fontSize="0.8rem" color="text.secondary">
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </Typography>
            </Box>

            {/* Role Badge + Actions */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Chip
                label={user.role}
                size="small"
                sx={{
                  bgcolor: user.role === "Admin" ? "#4CAF50" : "#1976d2",
                  color: "#fff",
                  fontWeight: 600,
                }}
              />

              <Tooltip title="Edit User">
                <IconButton color="primary" onClick={() => handleEditOpen(user)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Change Role">
                <IconButton
                  onClick={() => handleRoleOpen(user)}
                  sx={{ color: "#4CAF50" }}
                >
                  <ManageAccountsIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete User">
                <IconButton color="error" onClick={() => handleDeleteOpen(user)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        ))
      )}

      {/* ── Create Dialog ── */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={600}>Add New User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Full Name"
                value={createForm.full_name}
                onChange={(e) => setCreateForm({ ...createForm, full_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Username"
                value={createForm.username}
                onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Password" type="password"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={createForm.role}
                  label="Role"
                  onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                >
                  <MenuItem value="Clerk">Clerk</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCreateOpen(false)} color="error" variant="outlined">Cancel</Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={createLoading}
            sx={{ bgcolor: "#4CAF50", "&:hover": { bgcolor: "#388E3C" } }}
          >
            {createLoading ? <CircularProgress size={20} color="inherit" /> : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Edit Dialog ── */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={600}>Edit User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Full Name"
                value={editForm.full_name || ""}
                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Username"
                value={editForm.username || ""}
                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditOpen(false)} color="error" variant="outlined">Cancel</Button>
          <Button
            onClick={handleEdit}
            variant="contained"
            disabled={editLoading}
            sx={{ bgcolor: "#4CAF50", "&:hover": { bgcolor: "#388E3C" } }}
          >
            {editLoading ? <CircularProgress size={20} color="inherit" /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Role Dialog ── */}
      <Dialog open={roleOpen} onClose={() => setRoleOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={600}>Change Role</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Changing role for <strong>{roleTarget?.full_name}</strong>
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select value={newRole} label="Role" onChange={(e) => setNewRole(e.target.value)}>
              <MenuItem value="Clerk">Clerk</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setRoleOpen(false)} color="error" variant="outlined">Cancel</Button>
          <Button
            onClick={handleRoleChange}
            variant="contained"
            disabled={roleLoading}
            sx={{ bgcolor: "#4CAF50", "&:hover": { bgcolor: "#388E3C" } }}
          >
            {roleLoading ? <CircularProgress size={20} color="inherit" /> : "Update Role"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete Confirm Dialog ── */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={600} color="error">Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{deleteTarget?.full_name}</strong>? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteOpen(false)} variant="outlined">Cancel</Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={deleteLoading}
          >
            {deleteLoading ? <CircularProgress size={20} color="inherit" /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
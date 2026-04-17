import React from "react";
import Swal from "sweetalert2";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
  Paper,
  Grid,
  Link,
} from "@mui/material";

function Register() {
  const [form, setForm] = useState({
    full_name: "",
    username: " ",
    // email: '',
    password: "",
    role: "Clerk",
  });
  const navigate = useNavigate();

  const showToast = (message, type) => {
    Swal.fire({
      icon: type, // "success", "error", "warning", "info", "question"
      title: message,
      toast: true,
      position: "top-end",
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
      },
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      showToast("Registered successfully! Now login", "success");
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        showToast(err.response.data.message, "error");
      } else {
        showToast("something went wrong");
      }
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f0f2f5"
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: 600,
          borderRadius: 3,
          background: "linear-gradient(135deg, #ffffff, #f8f9fa)",
        }}
      >
        <Typography
          variant="h4"
          mb={4}
          fontWeight="bold"
          textAlign="center"
          color="#142423"
        >
          Register in LandLedger
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </Grid>
              {/* <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="User Name"
                name="username"
                value={form.user_name}
                onChange={handleChange}
                margin="normal"
                required
              />
            </Grid> */}

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    label="Role"
                  >
                    <MenuItem value="Clerk">Clerk</MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="username"
                  type="email"
                  value={form.username}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
              </Grid>
            </Grid>
          </Grid>
          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{
                mt: 2,
                py: 1.5,
                fontSize: "1rem",
                borderRadius: 2,
                textTransform: "none",
                bgcolor: "#4CAF50",
              }}
            >
              Register
            </Button>
          </Grid>
        </form>
        <Grid sx={{ textAlign: "center", marginTop: "0.5rem" }}>
          <Link
            href="/login"
            variant="body2"
            sx={{
              color: "#142423",
              fontSize: "1rem",
              textDecoration: "none",
            }}
          >
            Already Registered?
          </Link>
        </Grid>
      </Paper>
    </Box>
  );
}

export default Register;

import * as React from "react";
import Swal from "sweetalert2";
import {
  Button,
  FormControl,
  Checkbox,
  FormControlLabel,
  InputLabel,
  OutlinedInput,
  TextField,
  InputAdornment,
  Link,
  IconButton,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { AppProvider } from "@toolpad/core/AppProvider";
import { SignInPage } from "@toolpad/core/SignInPage";
import { useTheme } from "@mui/material/styles";

import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { setToken } from "../utils/auth";

const providers = [{ id: "credentials", name: "Email and Password" }];

function CustomEmailField() {
  return (
    <TextField
      id="input-with-icon-textfield"
      label="Email"
      name="username"
      type="email"
      size="small"
      required
      fullWidth
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle fontSize="inherit" />
            </InputAdornment>
          ),
        },
      }}
      variant="outlined"
    />
  );
}

function CustomPasswordField() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FormControl sx={{ my: 2 }} fullWidth variant="outlined">
      <InputLabel size="small" htmlFor="outlined-adornment-password">
        Password
      </InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        type={showPassword ? "text" : "password"}
        name="password"
        size="small"
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              size="small"
            >
              {showPassword ? (
                <VisibilityOff fontSize="inherit" />
              ) : (
                <Visibility fontSize="inherit" />
              )}
            </IconButton>
          </InputAdornment>
        }
        label="Password"
      />
    </FormControl>
  );
}

function CustomButton() {
  return (
    <Button
      type="submit"
      variant="contained"
      // background="#4CAF50"
      size="small"
      disableElevation
      fullWidth
      sx={{ my: 2, bgcolor: "#4CAF50" }}
    >
      Log In
    </Button>
  );
}

function SignUpLink() {
  return (
    <Link
      href="/"
      variant="body2"
      sx={{ color: "#142423", fontSize: "1rem", textDecoration: "none" }}
    >
      Don't have an Account?
    </Link>
  );
}

function ForgotPasswordLink() {
  return (
    <Link
      href="/"
      variant="body2"
      sx={{ color: "#142423", fontSize: "1rem", textDecoration: "none" }}
    >
      Forgot password?
    </Link>
  );
}

function Title() {
  return <h1 style={{color: "#142423",fontWeight:'bold',fontSize:'1.5rem'}}>LOG IN</h1>;
}

function Subtitle() {
  return (
    <p
      style={{
        marginBottom: 8,
        // padding: "0 4px",
        color: "#142423",
        fontSize: "1.2rem",
      }}
    >
      To LandRecord System
    </p>
  );
}

const showToast = (message, type) => {
  Swal.fire({
    icon: type, // "success", "error", "warning", "info", "question"
    title: message,
    toast: true,
    position: "mid-end",
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

function RememberMeCheckbox() {
  const theme = useTheme();
  return (
    <FormControlLabel
      label="Remember me"
      control={
        <Checkbox
          name="remember"
          value="true"
          color="primary"
          sx={{ padding: 0.5, "& .MuiSvgIcon-root": { fontSize: 20 } }}
        />
      }
      slotProps={{
        typography: {
          color: "textSecondary",
          fontSize: theme.typography.pxToRem(14),
        },
      }}
    />
  );
}

export default function SlotsSignIn() {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleSignIn = async (provider, formData) => {
    const username = formData.get("username")?.toString().trim() || "";
    const password = formData.get("password")?.toString() || "";
    const remember =
      formData.get("remember") === "true" || formData.get("remember") === "on";

    if (!username || !password) {
      showToast("Please provide email and password.", "warning");
      return;
    }

    try {
      const res = await loginUser({ username, password });

      setToken(res.data.token, { remember });
      localStorage.setItem("role", res.data.user.role);
      showToast("Login successful", "success");
      navigate("/dashboard");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        showToast(err.response.data.message, "error");
      } else {
        showToast("Something went wrong");
      }
    }
  };

  return (
    <AppProvider theme={theme}>
      <SignInPage
        signIn={handleSignIn}
        slots={{
          title: Title,
          subtitle: Subtitle,
          emailField: CustomEmailField,
          passwordField: CustomPasswordField,
          submitButton: CustomButton,
          signUpLink: SignUpLink,
          rememberMe: RememberMeCheckbox,
          forgotPasswordLink: ForgotPasswordLink,
        }}
        slotProps={{ form: { noValidate: true } }}
        providers={providers}
      />
    </AppProvider>
  );
}

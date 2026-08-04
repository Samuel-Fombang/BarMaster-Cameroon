import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import {
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import axios from "axios";
import { useState } from "react";
import {
  Link as RouterLink,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router";

import { resetPassword } from "../services/authService";

type LocationState = {
  email?: string;
  resetToken?: string;
};

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const state =
    location.state as LocationState | null;

  const email = state?.email ?? "";
  const resetToken = state?.resetToken ?? "";

  const [newPassword, setNewPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showNewPassword, setShowNewPassword] =
    useState(false);
  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [errors, setErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState<"success" | "error">("success");

  if (!email || !resetToken) {
    return (
      <Navigate
        to="/forgot-password"
        replace
      />
    );
  }

  const validate = () => {
    const newErrors: {
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (!newPassword) {
      newErrors.newPassword =
        "New password is required.";
    } else if (newPassword.length < 8) {
      newErrors.newPassword =
        "Password must contain at least 8 characters.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm the new password.";
    } else if (
      newPassword !== confirmPassword
    ) {
      newErrors.confirmPassword =
        "The passwords do not match.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as
        | { message?: string }
        | undefined;

      return (
        data?.message ??
        "The password could not be reset."
      );
    }

    return "The password could not be reset.";
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword({
        email,
        resetToken,
        newPassword,
        confirmPassword,
      });

      setMessageType("success");
      setMessage(response.message);

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1200);
    } catch (error) {
      setMessageType("error");
      setMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        bgcolor: "#f3f4f6",
        px: 2,
        py: 4,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 460,
          borderRadius: 4,
          p: {
            xs: 3,
            sm: 4,
          },
        }}
      >
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{ mb: 1 }}
        >
          Set New Password
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Create a new password for:
          <br />
          <strong>{email}</strong>
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
        >
          <TextField
            label="New Password"
            type={
              showNewPassword
                ? "text"
                : "password"
            }
            value={newPassword}
            onChange={(event) => {
              setNewPassword(event.target.value);

              setErrors((current) => ({
                ...current,
                newPassword: undefined,
              }));
            }}
            error={Boolean(errors.newPassword)}
            helperText={
              errors.newPassword ??
              "Minimum 8 characters."
            }
            autoComplete="new-password"
            fullWidth
            required
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() =>
                        setShowNewPassword(
                          (current) => !current
                        )
                      }
                      aria-label={
                        showNewPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showNewPassword ? (
                        <VisibilityOffOutlined />
                      ) : (
                        <VisibilityOutlined />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            label="Confirm New Password"
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(
                event.target.value
              );

              setErrors((current) => ({
                ...current,
                confirmPassword: undefined,
              }));
            }}
            error={Boolean(
              errors.confirmPassword
            )}
            helperText={
              errors.confirmPassword
            }
            autoComplete="new-password"
            fullWidth
            required
            sx={{ mt: 2 }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() =>
                        setShowConfirmPassword(
                          (current) => !current
                        )
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <VisibilityOffOutlined />
                      ) : (
                        <VisibilityOutlined />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            fullWidth
            sx={{
              mt: 3,
              py: 1.4,
              fontWeight: 700,
            }}
          >
            {loading
              ? "Resetting password..."
              : "Reset Password"}
          </Button>

          <Box
            sx={{
              mt: 3,
              textAlign: "center",
            }}
          >
            <Link
              component={RouterLink}
              to="/login"
              underline="hover"
            >
              Back to Login
            </Link>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={Boolean(message)}
        autoHideDuration={4000}
        onClose={() => setMessage("")}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity={messageType}
          variant="filled"
          onClose={() => setMessage("")}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ResetPassword;
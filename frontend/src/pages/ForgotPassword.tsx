import {
  Alert,
  Box,
  Button,
  Link,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import {
  Link as RouterLink,
  useNavigate,
} from "react-router";

import { forgotPassword } from "../services/authService";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState<"success" | "error">("success");

  const validate = () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmailError("Email address is required.");
      return false;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        trimmedEmail
      )
    ) {
      setEmailError(
        "Enter a valid email address."
      );
      return false;
    }

    setEmailError("");
    return true;
  };

  const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as
        | { message?: string }
        | undefined;

      return (
        data?.message ??
        "The reset email could not be sent."
      );
    }

    return "The reset email could not be sent.";
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
      const response = await forgotPassword({
        email: email.trim(),
      });

      setMessageType("success");
      setMessage(response.message);

      navigate("/verify-reset-code", {
        state: {
          email: email.trim(),
        },
      });
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
          Forgot Password
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Enter the email address connected to your
          IVY EASY LOUNGE worker account. We will send you a
          six-digit verification code.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
        >
          <TextField
            label="Email Address"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setEmailError("");
            }}
            error={Boolean(emailError)}
            helperText={emailError}
            autoComplete="email"
            autoFocus
            fullWidth
            required
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
              ? "Sending code..."
              : "Send Verification Code"}
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

export default ForgotPassword;
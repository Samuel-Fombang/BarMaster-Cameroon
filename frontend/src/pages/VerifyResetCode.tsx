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
  Navigate,
  useLocation,
  useNavigate,
} from "react-router";

import { verifyResetCode } from "../services/authService";

type LocationState = {
  email?: string;
};

function VerifyResetCode() {
  const location = useLocation();
  const navigate = useNavigate();

  const state =
    location.state as LocationState | null;

  const email = state?.email ?? "";

  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState<"success" | "error">("success");

  if (!email) {
    return (
      <Navigate
        to="/forgot-password"
        replace
      />
    );
  }

  const validate = () => {
    const trimmedCode = code.trim();

    if (!trimmedCode) {
      setCodeError(
        "Verification code is required."
      );
      return false;
    }

    if (!/^\d{6}$/.test(trimmedCode)) {
      setCodeError(
        "Enter the 6-digit verification code."
      );
      return false;
    }

    setCodeError("");
    return true;
  };

  const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as
        | { message?: string }
        | undefined;

      return (
        data?.message ??
        "The verification code could not be confirmed."
      );
    }

    return "The verification code could not be confirmed.";
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
      const response = await verifyResetCode({
        email,
        code: code.trim(),
      });

      setMessageType("success");
      setMessage(response.message);

      navigate("/reset-password", {
        state: {
          email,
          resetToken: response.resetToken,
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
          Verify Code
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mb: 1 }}
        >
          Enter the six-digit code sent to:
        </Typography>

        <Typography
          fontWeight={700}
          sx={{ mb: 3 }}
        >
          {email}
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
        >
          <TextField
            label="Verification Code"
            value={code}
            onChange={(event) => {
              const value =
                event.target.value
                  .replace(/\D/g, "")
                  .slice(0, 6);

              setCode(value);
              setCodeError("");
            }}
            error={Boolean(codeError)}
            helperText={codeError}
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            fullWidth
            required
            slotProps={{
              htmlInput: {
                maxLength: 6,
                style: {
                  textAlign: "center",
                  letterSpacing: "0.5rem",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                },
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
              ? "Verifying..."
              : "Verify Code"}
          </Button>

          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Link
              component={RouterLink}
              to="/forgot-password"
              underline="hover"
            >
              Request another code
            </Link>

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

export default VerifyResetCode;
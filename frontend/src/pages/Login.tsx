import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import {
  LocalBarOutlined,
  LockOutlined,
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

import { useAuth } from "../context/AuthContext";

type LocationState = {
  from?: string;
};

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] =
    useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] =
    useState(false);
  const [showPassword, setShowPassword] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<{
    usernameOrEmail?: string;
    password?: string;
  }>({});

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState<"success" | "error">("error");

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const validate = () => {
    const errors: {
      usernameOrEmail?: string;
      password?: string;
    } = {};

    if (!usernameOrEmail.trim()) {
      errors.usernameOrEmail =
        "Username or email is required.";
    }

    if (!password) {
      errors.password = "Password is required.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as
        | { message?: string }
        | undefined;

      return (
        data?.message ??
        "Login failed. Please check your details."
      );
    }

    return "Login failed. Please try again.";
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
      await login(
        {
          usernameOrEmail:
            usernameOrEmail.trim(),
          password,
        },
        rememberMe
      );

      setMessageType("success");
      setMessage("Login successful.");

      const state =
        location.state as LocationState | null;

      navigate(state?.from ?? "/", {
        replace: true,
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
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            bgcolor: "#0b0b0b",
            color: "white",
            px: 4,
            py: 4,
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              bgcolor: "white",
              color: "#111111",
              display: "grid",
              placeItems: "center",
              mx: "auto",
              mb: 2,
            }}
          >
            <LocalBarOutlined fontSize="large" />
          </Box>

          <Typography
            variant="h4"
            fontWeight={800}
          >
            BarMaster
          </Typography>

          <Typography
            sx={{
              color: "#d1d5db",
              mt: 0.5,
            }}
          >
            Cameroon
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: {
              xs: 3,
              sm: 4,
            },
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h5"
              fontWeight={700}
            >
              Welcome back
            </Typography>

            <Typography color="text.secondary">
              Sign in using your username or email.
            </Typography>
          </Box>

          <TextField
            label="Username or Email"
            value={usernameOrEmail}
            onChange={(event) => {
              setUsernameOrEmail(
                event.target.value
              );

              setFieldErrors((current) => ({
                ...current,
                usernameOrEmail: undefined,
              }));
            }}
            error={Boolean(
              fieldErrors.usernameOrEmail
            )}
            helperText={
              fieldErrors.usernameOrEmail
            }
            autoComplete="username"
            autoFocus
            fullWidth
            required
            sx={{ mb: 2 }}
          />

          <TextField
            label="Password"
            type={
              showPassword ? "text" : "password"
            }
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);

              setFieldErrors((current) => ({
                ...current,
                password: undefined,
              }));
            }}
            error={Boolean(fieldErrors.password)}
            helperText={fieldErrors.password}
            autoComplete="current-password"
            fullWidth
            required
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword(
                          (current) => !current
                        )
                      }
                      edge="end"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
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

          <Box
            sx={{
              mt: 1,
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(
                      event.target.checked
                    )
                  }
                />
              }
              label="Remember me"
            />

            <Link
              component={RouterLink}
              to="/forgot-password"
              underline="hover"
            >
              Forgot password?
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            fullWidth
            sx={{
              py: 1.4,
              fontWeight: 700,
            }}
          >
            {loading ? "Signing in..." : "Login"}
          </Button>

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ mt: 3 }}
          >
            BarMaster professional bar management
          </Typography>
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

export default Login;
import { Alert, Box, Button, Paper, Typography } from "@mui/material";
import { Navigate, Outlet, useNavigate } from "react-router";

import { useAuth } from "../../context/AuthContext";

type WorkerRole =
  | "Admin"
  | "Manager"
  | "Bartender"
  | "Storekeeper";

type RoleRouteProps = {
  allowedRoles: WorkerRole[];
};

function normalizeRole(role?: string): WorkerRole | null {
  const normalizedRole = role?.trim().toLowerCase();

  if (normalizedRole === "admin") {
    return "Admin";
  }

  if (normalizedRole === "manager") {
    return "Manager";
  }

  if (normalizedRole === "bartender") {
    return "Bartender";
  }

  if (normalizedRole === "storekeeper") {
    return "Storekeeper";
  }

  return null;
}

function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const navigate = useNavigate();
  const { worker, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const workerRole = normalizeRole(worker?.role);

  if (!workerRole || !allowedRoles.includes(workerRole)) {
    return (
      <Box
        sx={{
          minHeight: 420,
          display: "grid",
          placeItems: "center",
          p: 2,
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            width: "100%",
            maxWidth: 520,
            borderRadius: 3,
            p: {
              xs: 3,
              sm: 4,
            },
            textAlign: "center",
          }}
        >
          <Alert
            severity="error"
            sx={{
              mb: 3,
              textAlign: "left",
            }}
          >
            You do not have permission to open this page.
          </Alert>

          <Typography variant="h5" fontWeight={700}>
            Access Denied
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 1,
              mb: 3,
            }}
          >
            Your current role is{" "}
            <strong>{worker?.role ?? "Unknown"}</strong>.
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate("/", { replace: true })}
          >
            Return to Dashboard
          </Button>
        </Paper>
      </Box>
    );
  }

  return <Outlet />;
}

export default RoleRoute;
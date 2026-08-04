import {
  AccountCircleOutlined,
  LogoutOutlined,
  NotificationsNoneOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "../../context/AuthContext";

function Header() {
  const navigate = useNavigate();
  const { worker, logout } = useAuth();

  const [anchorElement, setAnchorElement] =
    useState<HTMLElement | null>(null);

  const menuOpen = Boolean(anchorElement);

  const fullName = worker
    ? `${worker.firstName} ${worker.lastName}`
    : "Worker";

  const initials = worker
    ? `${worker.firstName.charAt(0)}${worker.lastName.charAt(0)}`
        .toUpperCase()
    : "BM";

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorElement(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElement(null);
  };

  const handleLogout = () => {
    handleCloseMenu();
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "#ffffff",
        color: "#111827",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <Toolbar
        sx={{
          minHeight: 72,
          px: {
            xs: 2,
            md: 3,
          },
          gap: 2,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6">
            BarMaster Cameroon
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Professional Bar Management System
          </Typography>
        </Box>

        <TextField
          placeholder="Search..."
          sx={{
            width: 260,
            display: {
              xs: "none",
              lg: "block",
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
        >
          <Tooltip title="Notifications">
            <IconButton>
              <NotificationsNoneOutlined />
            </IconButton>
          </Tooltip>

          <Tooltip title="Open user menu">
            <IconButton
              onClick={handleOpenMenu}
              size="small"
              aria-controls={
                menuOpen ? "user-menu" : undefined
              }
              aria-haspopup="true"
              aria-expanded={
                menuOpen ? "true" : undefined
              }
            >
              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  bgcolor: "#111111",
                  fontSize: 15,
                  fontWeight: 700,
                }}
              >
                {initials}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Box
            onClick={handleOpenMenu}
            sx={{
              display: {
                xs: "none",
                sm: "block",
              },
              cursor: "pointer",
            }}
          >
            <Typography
              variant="subtitle2"
              fontWeight={700}
            >
              {fullName}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {worker?.role ?? "Worker"}
            </Typography>
          </Box>

          <Tooltip title="Logout">
            <IconButton onClick={handleLogout}>
              <LogoutOutlined />
            </IconButton>
          </Tooltip>
        </Stack>

        <Menu
          id="user-menu"
          anchorEl={anchorElement}
          open={menuOpen}
          onClose={handleCloseMenu}
          onClick={handleCloseMenu}
          slotProps={{
            paper: {
              sx: {
                mt: 1.5,
                minWidth: 260,
                borderRadius: 2,
              },
            },
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
            }}
          >
            <Typography fontWeight={700}>
              {fullName}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              {worker?.email ?? "No email"}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {worker?.role ?? "Worker"}
            </Typography>
          </Box>

          <Divider />

          <MenuItem
            onClick={() => {
              handleCloseMenu();
              navigate("/settings");
            }}
          >
            <ListItemIcon>
              <AccountCircleOutlined fontSize="small" />
            </ListItemIcon>

            Profile
          </MenuItem>

          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutOutlined fontSize="small" />
            </ListItemIcon>

            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
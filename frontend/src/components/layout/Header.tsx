import {
  LogoutOutlined,
  NotificationsNoneOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

function Header() {
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
          <Typography variant="h6">BarMaster Cameroon</Typography>

          <Typography variant="body2" color="text.secondary">
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
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="Notifications">
            <IconButton>
              <NotificationsNoneOutlined />
            </IconButton>
          </Tooltip>

          <Avatar
            sx={{
              width: 38,
              height: 38,
              bgcolor: "#111111",
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            SA
          </Avatar>

          <Box
            sx={{
              display: {
                xs: "none",
                sm: "block",
              },
            }}
          >
            <Typography variant="subtitle2" fontWeight={700}>
              Samuel
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Manager
            </Typography>
          </Box>

          <Tooltip title="Logout">
            <IconButton>
              <LogoutOutlined />
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
import {
  DashboardOutlined,
  LocalBarOutlined,
  Inventory2Outlined,
  PointOfSaleOutlined,
  LocalShippingOutlined,
  ReceiptLongOutlined,
  GroupsOutlined,
  AssessmentOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { NavLink, useLocation } from "react-router";

const drawerWidth = 260;

const menuItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: <DashboardOutlined />,
  },
  {
    label: "Drinks",
    path: "/drinks",
    icon: <LocalBarOutlined />,
  },
  {
    label: "Stock",
    path: "/stock",
    icon: <Inventory2Outlined />,
  },
  {
    label: "Sales",
    path: "/sales",
    icon: <PointOfSaleOutlined />,
  },
  {
    label: "Purchases",
    path: "/purchases",
    icon: <LocalShippingOutlined />,
  },
  {
    label: "Expenses",
    path: "/expenses",
    icon: <ReceiptLongOutlined />,
  },
  {
    label: "Workers",
    path: "/workers",
    icon: <GroupsOutlined />,
  },
  {
    label: "Reports",
    path: "/reports",
    icon: <AssessmentOutlined />,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: <SettingsOutlined />,
  },
];

function Sidebar() {
  const location = useLocation();

  return (
    <Box
      component="aside"
      sx={{
        width: drawerWidth,
        minHeight: "100vh",
        flexShrink: 0,
        bgcolor: "#0b0b0b",
        color: "white",
        display: {
          xs: "none",
          md: "flex",
        },
        flexDirection: "column",
        borderRight: "1px solid #232323",
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            letterSpacing: "-0.5px",
          }}
        >
          BarMaster
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            color: "#9ca3af",
          }}
        >
          Cameroon
        </Typography>
      </Box>

      <Divider
        sx={{
          borderColor: "#252525",
        }}
      />

      <List
        sx={{
          px: 1.5,
          py: 2,
        }}
      >
        {menuItems.map((item) => {
          const isActive =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);

          return (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              sx={{
                mb: 0.75,
                minHeight: 48,
                borderRadius: 2.5,
                color: isActive ? "#111111" : "#d1d5db",
                bgcolor: isActive ? "#ffffff" : "transparent",
                "&:hover": {
                  bgcolor: isActive ? "#ffffff" : "#1f1f1f",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 42,
                  color: isActive ? "#111111" : "#d1d5db",
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 15,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box
        sx={{
          mt: "auto",
          p: 2.5,
        }}
      >
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: "#171717",
            border: "1px solid #2a2a2a",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
            }}
          >
            BarMaster v1.0
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: "#9ca3af",
            }}
          >
            Professional bar management
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Sidebar;
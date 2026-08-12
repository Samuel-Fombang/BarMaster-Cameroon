import {
  AssessmentOutlined,
  CategoryOutlined,
  DashboardOutlined,
  GroupsOutlined,
  Inventory2Outlined,
  LocalBarOutlined,
  LocalShippingOutlined,
  LocationOnOutlined,
  PointOfSaleOutlined,
  ReceiptLongOutlined,
  SellOutlined,
  SettingsOutlined,
  StorefrontOutlined,
  StraightenOutlined,
  SwapHorizOutlined,
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

import type { ReactNode } from "react";

import {
  NavLink,
  useLocation,
} from "react-router";

import { useAuth } from "../../context/AuthContext";

const drawerWidth = 260;

type WorkerRole =
  | "Admin"
  | "Manager"
  | "Bartender"
  | "Storekeeper";

type MenuItem = {
  label: string;
  path: string;
  icon: ReactNode;
  allowedRoles: WorkerRole[];
};

const allRoles: WorkerRole[] = [
  "Admin",
  "Manager",
  "Bartender",
  "Storekeeper",
];

const managementRoles: WorkerRole[] = [
  "Admin",
  "Manager",
];

const stockRoles: WorkerRole[] = [
  "Admin",
  "Manager",
  "Storekeeper",
];

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/",
    icon: <DashboardOutlined />,
    allowedRoles: allRoles,
  },

  {
    label: "Drinks",
    path: "/drinks",
    icon: <LocalBarOutlined />,
    allowedRoles: stockRoles,
  },

  {
    label: "Categories",
    path: "/categories",
    icon: <CategoryOutlined />,
    allowedRoles: stockRoles,
  },

  {
    label: "Brands",
    path: "/brands",
    icon: <SellOutlined />,
    allowedRoles: stockRoles,
  },

  {
    label: "Bottle Sizes",
    path: "/bottle-sizes",
    icon: <StraightenOutlined />,
    allowedRoles: stockRoles,
  },

  {
    label: "Suppliers",
    path: "/suppliers",
    icon: <StorefrontOutlined />,
    allowedRoles: stockRoles,
  },

  {
    label: "Locations",
    path: "/locations",
    icon: <LocationOnOutlined />,
    allowedRoles: stockRoles,
  },

  {
    label: "Inventory",
    path: "/inventory",
    icon: <Inventory2Outlined />,
    allowedRoles: stockRoles,
  },

  {
    label: "Transfers",
    path: "/transfers",
    icon: <SwapHorizOutlined />,
    allowedRoles: stockRoles,
  },

  {
    label: "Purchases",
    path: "/purchases",
    icon: <LocalShippingOutlined />,
    allowedRoles: stockRoles,
  },

  {
    label: "Sales",
    path: "/sales",
    icon: <PointOfSaleOutlined />,
    allowedRoles: allRoles,
  },

  {
    label: "Expenses",
    path: "/expenses",
    icon: <ReceiptLongOutlined />,
    allowedRoles: managementRoles,
  },

  {
    label: "Workers",
    path: "/workers",
    icon: <GroupsOutlined />,
    allowedRoles: ["Admin"],
  },

  {
    label: "Reports",
    path: "/reports",
    icon: <AssessmentOutlined />,
    allowedRoles: managementRoles,
  },

  {
    label: "Settings",
    path: "/settings",
    icon: <SettingsOutlined />,
    allowedRoles: ["Admin"],
  },
];

function normalizeRole(
  role?: string
): WorkerRole | null {
  const normalizedRole =
    role?.trim().toLowerCase();

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

function Sidebar() {
  const location = useLocation();

  const { worker } = useAuth();

  const workerRole =
    normalizeRole(worker?.role);

  const visibleMenuItems =
    menuItems.filter((item) => {
      if (!workerRole) {
        return item.path === "/";
      }

      return item.allowedRoles.includes(
        workerRole
      );
    });

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
        borderRight:
          "1px solid #232323",
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
          IVY EASY LOUNGE
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            color: "#9ca3af",
          }}
        >
          
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
        {visibleMenuItems.map(
          (item) => {
            const isActive =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(
                    item.path
                  );

            return (
              <ListItemButton
                key={item.path}
                component={NavLink}
                to={item.path}
                sx={{
                  mb: 0.75,
                  minHeight: 48,
                  borderRadius: 2.5,

                  color: isActive
                    ? "#111111"
                    : "#d1d5db",

                  bgcolor: isActive
                    ? "#ffffff"
                    : "transparent",

                  "&:hover": {
                    bgcolor: isActive
                      ? "#ffffff"
                      : "#1f1f1f",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 42,

                    color: isActive
                      ? "#111111"
                      : "#d1d5db",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      sx: {
                        fontWeight:
                          isActive
                            ? 700
                            : 500,

                        fontSize: 15,
                      },
                    },
                  }}
                />
              </ListItemButton>
            );
          }
        )}
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
            border:
              "1px solid #2a2a2a",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
            }}
          >
            {worker?.firstName
              ? `${worker.firstName} ${worker.lastName}`
              : "IVY EASY LOUNGE User"}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: "#9ca3af",
              display: "block",
            }}
          >
            {worker?.role ??
              "Unknown role"}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: "#6b7280",
              display: "block",
              mt: 1,
            }}
          >
            IVY EASY LOUNGE v1.0
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Sidebar;
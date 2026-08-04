import {
  NotificationsActiveOutlined,
  SaveOutlined,
  SettingsOutlined,
  StoreOutlined,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  MenuItem,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

type BusinessSettings = {
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  currency: string;
  notificationsEnabled: boolean;
};

const STORAGE_KEY = "barmaster_business_settings";

const defaultSettings: BusinessSettings = {
  businessName: "BarMaster Cameroon",
  ownerName: "Samuel",
  phone: "+237",
  email: "swsslounge@gmail.com",
  address: "",
  currency: "FCFA",
  notificationsEnabled: true,
};

function Settings() {
  const [settings, setSettings] =
    useState<BusinessSettings>(defaultSettings);

  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedSettings =
      localStorage.getItem(STORAGE_KEY);

    if (!savedSettings) {
      return;
    }

    try {
      const parsedSettings =
        JSON.parse(savedSettings) as Partial<BusinessSettings>;

      setSettings({
        ...defaultSettings,
        ...parsedSettings,
      });
    } catch (error) {
      console.error(
        "Could not load saved settings:",
        error
      );
    }
  }, []);

  const updateField = <K extends keyof BusinessSettings>(
    field: K,
    value: BusinessSettings[K]
  ) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [field]: value,
    }));
  };

  const handleSave = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(settings)
    );

    setMessage("Settings saved successfully.");
  };

  return (
    <Box>
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "center",
        }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4">
            Settings
          </Typography>

          <Typography color="text.secondary">
            Configure your business information and application
            preferences.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<SaveOutlined />}
          onClick={handleSave}
        >
          Save Settings
        </Button>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "2fr 1fr",
          },
          gap: 2.5,
        }}
      >
        <Card>
          <CardContent>
            <Stack spacing={3}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
              >
                <StoreOutlined />

                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  Business Information
                </Typography>
              </Stack>

              <Divider />

              <TextField
                label="Business Name"
                fullWidth
                value={settings.businessName}
                onChange={(event) =>
                  updateField(
                    "businessName",
                    event.target.value
                  )
                }
              />

              <TextField
                label="Owner Name"
                fullWidth
                value={settings.ownerName}
                onChange={(event) =>
                  updateField(
                    "ownerName",
                    event.target.value
                  )
                }
              />

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                  },
                  gap: 2,
                }}
              >
                <TextField
                  label="Phone Number"
                  fullWidth
                  value={settings.phone}
                  onChange={(event) =>
                    updateField(
                      "phone",
                      event.target.value
                    )
                  }
                />

                <TextField
                  label="Business Email"
                  type="email"
                  fullWidth
                  value={settings.email}
                  onChange={(event) =>
                    updateField(
                      "email",
                      event.target.value
                    )
                  }
                />
              </Box>

              <TextField
                label="Business Address"
                multiline
                rows={3}
                fullWidth
                value={settings.address}
                onChange={(event) =>
                  updateField(
                    "address",
                    event.target.value
                  )
                }
              />

              <TextField
                select
                label="Currency"
                fullWidth
                value={settings.currency}
                onChange={(event) =>
                  updateField(
                    "currency",
                    event.target.value
                  )
                }
              >
                <MenuItem value="FCFA">
                  FCFA
                </MenuItem>

                <MenuItem value="EUR">
                  Euro
                </MenuItem>

                <MenuItem value="USD">
                  US Dollar
                </MenuItem>
              </TextField>
            </Stack>
          </CardContent>
        </Card>

        <Stack spacing={2.5}>
          <Card>
            <CardContent>
              <Stack spacing={2.5}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                >
                  <NotificationsActiveOutlined />

                  <Typography
                    variant="h6"
                    fontWeight={700}
                  >
                    Notifications
                  </Typography>
                </Stack>

                <Divider />

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Box>
                    <Typography fontWeight={700}>
                      Enable Notifications
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Receive stock and system alerts.
                    </Typography>
                  </Box>

                  <Switch
                    checked={
                      settings.notificationsEnabled
                    }
                    onChange={(event) =>
                      updateField(
                        "notificationsEnabled",
                        event.target.checked
                      )
                    }
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                >
                  <SettingsOutlined />

                  <Typography
                    variant="h6"
                    fontWeight={700}
                  >
                    Application
                  </Typography>
                </Stack>

                <Divider />

                <Box>
                  <Typography fontWeight={700}>
                    BarMaster Version
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Version 1.0
                  </Typography>
                </Box>

                <Box>
                  <Typography fontWeight={700}>
                    Storage
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Settings are currently saved in this browser.
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>

      <Snackbar
        open={Boolean(message)}
        autoHideDuration={4000}
        onClose={() => setMessage("")}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setMessage("")}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Settings;
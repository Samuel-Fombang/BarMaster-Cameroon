import {
  AttachMoneyOutlined,
  Inventory2Outlined,
  LocalBarOutlined,
  TrendingUpOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import DashboardCard from "../components/dashboard/DashboardCard";

function Dashboard() {
  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4">Dashboard</Typography>

          <Typography color="text.secondary">
            Welcome back. Here is today&apos;s business summary.
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<AttachMoneyOutlined />}>
          Record Sale
        </Button>
      </Stack>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <DashboardCard
            title="Today's Sales"
            value="0 FCFA"
            subtitle="No sales recorded yet"
            icon={<AttachMoneyOutlined />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <DashboardCard
            title="Today's Profit"
            value="0 FCFA"
            subtitle="Calculated from sales"
            icon={<TrendingUpOutlined />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <DashboardCard
            title="Available Drinks"
            value="0"
            subtitle="Active products"
            icon={<LocalBarOutlined />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <DashboardCard
            title="Low Stock"
            value="0"
            subtitle="Items needing attention"
            icon={<WarningAmberOutlined />}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Box>
                  <Typography variant="h6">Recent Sales</Typography>

                  <Typography variant="body2" color="text.secondary">
                    Latest transactions from your bar
                  </Typography>
                </Box>

                <Button size="small">View all</Button>
              </Stack>

              <Box
                sx={{
                  minHeight: 220,
                  display: "grid",
                  placeItems: "center",
                  border: "1px dashed #d1d5db",
                  borderRadius: 3,
                  bgcolor: "#fafafa",
                }}
              >
                <Stack alignItems="center" spacing={1}>
                  <Inventory2Outlined color="disabled" />

                  <Typography color="text.secondary">
                    No sales recorded yet
                  </Typography>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Stock Alerts</Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Drinks below minimum stock
              </Typography>

              <Box
                sx={{
                  minHeight: 220,
                  display: "grid",
                  placeItems: "center",
                  border: "1px dashed #d1d5db",
                  borderRadius: 3,
                  bgcolor: "#fafafa",
                }}
              >
                <Stack alignItems="center" spacing={1}>
                  <Chip label="All stock levels are healthy" color="success" />

                  <Typography variant="body2" color="text.secondary">
                    No low-stock items
                  </Typography>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
import {
  AttachMoneyOutlined,
  GroupsOutlined,
  Inventory2Outlined,
  LocalBarOutlined,
  LocalShippingOutlined,
  PaymentsOutlined,
  ReceiptLongOutlined,
  StoreOutlined,
  TrendingUpOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router";

import DashboardCard from "../components/dashboard/DashboardCard";

import { getDashboard } from "../services/dashboardService";
import { getDrinks } from "../services/drinkService";
import { getInventory } from "../services/inventoryService";
import { getSales } from "../services/saleService";

import type { DashboardData } from "../types/dashboard";
import type { Drink } from "../types/drink";
import type { Inventory } from "../types/inventory";
import type { Sale } from "../types/sale";

type RecentSale = Sale & {
  drinkName: string;
};

type LowStockItem = Inventory & {
  drinkName: string;
};

const emptyDashboard: DashboardData = {
  todaySales: 0,
  todayProfit: 0,
  todayPurchases: 0,
  todayExpenses: 0,
  inventoryValue: 0,
  lowStockItems: 0,
  outOfStockItems: 0,
  totalDrinks: 0,
  totalSuppliers: 0,
  totalWorkers: 0,
  bestSellingDrink: "—",
  bestSalesLocation: "—",
};

function Dashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] =
    useState<DashboardData>(
      emptyDashboard
    );

  const [sales, setSales] =
    useState<Sale[]>([]);

  const [inventory, setInventory] =
    useState<Inventory[]>([]);

  const [drinks, setDrinks] =
    useState<Drink[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const [
          dashboardData,
          salesData,
          inventoryData,
          drinksData,
        ] = await Promise.all([
          getDashboard(),
          getSales(),
          getInventory(),
          getDrinks(),
        ]);

        setDashboard(dashboardData);
        setSales(salesData);
        setInventory(inventoryData);
        setDrinks(drinksData);
      } catch (error) {
        console.error(
          "Could not load dashboard data:",
          error
        );

        setErrorMessage(
          "Could not load the dashboard. Check that the backend is running and that you are logged in."
        );
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  const getDateTime = (
    dateValue?: string | null
  ) => {
    if (!dateValue) {
      return 0;
    }

    return new Date(
      dateValue
    ).getTime();
  };

  const formatDateTime = (
    dateValue?: string | null
  ) => {
    if (!dateValue) {
      return "No date";
    }

    return new Date(
      dateValue
    ).toLocaleString();
  };

  const recentSales =
    useMemo<RecentSale[]>(() => {
      return [...sales]
        .sort(
          (first, second) =>
            getDateTime(
              second.saleDate
            ) -
            getDateTime(
              first.saleDate
            )
        )
        .slice(0, 5)
        .map((sale) => {
          const drink = drinks.find(
            (item) =>
              item.id === sale.drinkId
          );

          const drinkName =
            drink?.bottleSize
              ? `${drink.name} ${drink.bottleSize}`
              : drink?.name ??
                "Unknown drink";

          return {
            ...sale,
            drinkName,
          };
        });
    }, [sales, drinks]);

  const lowStockItems =
    useMemo<LowStockItem[]>(() => {
      return inventory
        .filter(
          (item) =>
            item.isActive &&
            item.quantity <=
              item.minimumQuantity
        )
        .map((item) => {
          const drink = drinks.find(
            (drinkItem) =>
              drinkItem.id ===
              item.drinkId
          );

          const drinkName =
            drink?.bottleSize
              ? `${drink.name} ${drink.bottleSize}`
              : drink?.name ??
                "Unknown drink";

          return {
            ...item,
            drinkName,
          };
        })
        .sort(
          (first, second) =>
            first.quantity -
            second.quantity
        );
    }, [inventory, drinks]);

  const formatMoney = (
    amount: number
  ) =>
    `${amount.toLocaleString()} FCFA`;

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 500,
          display: "grid",
          placeItems: "center",
        }}
      >
        <Stack
          alignItems="center"
          spacing={2}
        >
          <CircularProgress />

          <Typography color="text.secondary">
            Loading dashboard...
          </Typography>
        </Stack>
      </Box>
    );
  }

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
            Dashboard
          </Typography>

          <Typography color="text.secondary">
            Welcome back. Here is
            today&apos;s business
            summary.
          </Typography>
        </Box>

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={1.5}
          sx={{
            width: {
              xs: "100%",
              sm: "auto",
            },
          }}
        >
          <Button
            variant="outlined"
            startIcon={
              <LocalShippingOutlined />
            }
            onClick={() =>
              navigate("/purchases")
            }
          >
            New Purchase
          </Button>

          <Button
            variant="contained"
            startIcon={
              <AttachMoneyOutlined />
            }
            onClick={() =>
              navigate("/sales")
            }
          >
            Record Sale
          </Button>
        </Stack>
      </Stack>

      {errorMessage && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {errorMessage}
        </Alert>
      )}

      <Grid
        container
        spacing={2.5}
      >
        <Grid
          size={{
            xs: 12,
            sm: 6,
            lg: 3,
          }}
        >
          <DashboardCard
            title="Today's Sales"
            value={formatMoney(
              dashboard.todaySales
            )}
            subtitle="Completed sales today"
            icon={
              <AttachMoneyOutlined />
            }
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            lg: 3,
          }}
        >
          <DashboardCard
            title="Today's Profit"
            value={formatMoney(
              dashboard.todayProfit
            )}
            subtitle="Profit from today's sales"
            icon={
              <TrendingUpOutlined />
            }
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            lg: 3,
          }}
        >
          <DashboardCard
            title="Today's Expenses"
            value={formatMoney(
              dashboard.todayExpenses
            )}
            subtitle="Expenses recorded today"
            icon={
              <ReceiptLongOutlined />
            }
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            lg: 3,
          }}
        >
          <DashboardCard
            title="Today's Purchases"
            value={formatMoney(
              dashboard.todayPurchases
            )}
            subtitle="Purchases received today"
            icon={
              <LocalShippingOutlined />
            }
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            lg: 3,
          }}
        >
          <DashboardCard
            title="Inventory Value"
            value={formatMoney(
              dashboard.inventoryValue
            )}
            subtitle="Current stock buying value"
            icon={
              <Inventory2Outlined />
            }
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            lg: 3,
          }}
        >
          <DashboardCard
            title="Total Drinks"
            value={dashboard.totalDrinks.toString()}
            subtitle={`${dashboard.totalSuppliers} suppliers`}
            icon={
              <LocalBarOutlined />
            }
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            lg: 3,
          }}
        >
          <DashboardCard
            title="Low Stock"
            value={dashboard.lowStockItems.toString()}
            subtitle={`${dashboard.outOfStockItems} out of stock`}
            icon={
              <WarningAmberOutlined />
            }
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            lg: 3,
          }}
        >
          <DashboardCard
            title="Total Workers"
            value={dashboard.totalWorkers.toString()}
            subtitle="Registered workers"
            icon={
              <GroupsOutlined />
            }
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2.5}
        sx={{ mt: 0.5 }}
      >
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography color="text.secondary">
                    Best-Selling Drink
                  </Typography>

                  <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{ mt: 0.5 }}
                  >
                    {dashboard.bestSellingDrink ||
                      "—"}
                  </Typography>
                </Box>

                <LocalBarOutlined fontSize="large" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography color="text.secondary">
                    Best Sales Location
                  </Typography>

                  <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{ mt: 0.5 }}
                  >
                    {dashboard.bestSalesLocation ||
                      "—"}
                  </Typography>
                </Box>

                <StoreOutlined fontSize="large" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2.5}
        sx={{ mt: 0.5 }}
      >
        <Grid
          size={{
            xs: 12,
            lg: 8,
          }}
        >
          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Box>
                  <Typography variant="h6">
                    Recent Sales
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Latest transactions
                    from your bar
                  </Typography>
                </Box>

                <Button
                  size="small"
                  onClick={() =>
                    navigate("/sales")
                  }
                >
                  View all
                </Button>
              </Stack>

              {recentSales.length ===
              0 ? (
                <Box
                  sx={{
                    minHeight: 260,
                    display: "grid",
                    placeItems:
                      "center",
                    border:
                      "1px dashed #d1d5db",
                    borderRadius: 3,
                    bgcolor: "#fafafa",
                  }}
                >
                  <Stack
                    alignItems="center"
                    spacing={1}
                  >
                    <PaymentsOutlined color="disabled" />

                    <Typography color="text.secondary">
                      No sales recorded yet
                    </Typography>
                  </Stack>
                </Box>
              ) : (
                <Stack
                  divider={
                    <Divider />
                  }
                >
                  {recentSales.map(
                    (sale) => (
                      <Stack
                        key={
                          sale.id ??
                          sale.saleNumber
                        }
                        direction={{
                          xs: "column",
                          sm: "row",
                        }}
                        justifyContent="space-between"
                        alignItems={{
                          xs: "flex-start",
                          sm: "center",
                        }}
                        spacing={1}
                        sx={{ py: 1.5 }}
                      >
                        <Box>
                          <Typography fontWeight={700}>
                            {
                              sale.drinkName
                            }
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {sale.saleNumber ??
                              "Sale"}{" "}
                            ·{" "}
                            {sale.quantity}{" "}
                            bottle
                            {sale.quantity ===
                            1
                              ? ""
                              : "s"}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            textAlign: {
                              xs: "left",
                              sm: "right",
                            },
                          }}
                        >
                          <Typography fontWeight={700}>
                            {formatMoney(
                              sale.totalAmount ??
                                0
                            )}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {formatDateTime(
                              sale.saleDate
                            )}
                          </Typography>
                        </Box>
                      </Stack>
                    )
                  )}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid
          size={{
            xs: 12,
            lg: 4,
          }}
        >
          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Box>
                  <Typography variant="h6">
                    Stock Alerts
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Drinks at or below
                    minimum stock
                  </Typography>
                </Box>

                <Button
                  size="small"
                  onClick={() =>
                    navigate(
                      "/inventory"
                    )
                  }
                >
                  View
                </Button>
              </Stack>

              {lowStockItems.length ===
              0 ? (
                <Box
                  sx={{
                    minHeight: 260,
                    display: "grid",
                    placeItems:
                      "center",
                    border:
                      "1px dashed #d1d5db",
                    borderRadius: 3,
                    bgcolor: "#fafafa",
                  }}
                >
                  <Stack
                    alignItems="center"
                    spacing={1}
                  >
                    <Chip
                      label="Stock levels are healthy"
                      color="success"
                    />

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      No low-stock items
                    </Typography>
                  </Stack>
                </Box>
              ) : (
                <Stack
                  divider={
                    <Divider />
                  }
                >
                  {lowStockItems
                    .slice(0, 6)
                    .map((item) => (
                      <Stack
                        key={
                          item.id ??
                          `${item.drinkId}-${item.locationId}`
                        }
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                        sx={{
                          py: 1.25,
                        }}
                      >
                        <Box>
                          <Typography fontWeight={700}>
                            {
                              item.drinkName
                            }
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Minimum:{" "}
                            {
                              item.minimumQuantity
                            }
                          </Typography>
                        </Box>

                        <Chip
                          size="small"
                          label={
                            item.quantity ===
                            0
                              ? "Out of stock"
                              : `${item.quantity} left`
                          }
                          color={
                            item.quantity ===
                            0
                              ? "error"
                              : "warning"
                          }
                        />
                      </Stack>
                    ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
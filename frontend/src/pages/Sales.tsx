import {
  AddOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  InputAdornment,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";

import SaleDialog from "../components/sales/SaleDialog";
import { getDrinks } from "../services/drinkService";
import { getInventory } from "../services/inventoryService";
import { getLocations } from "../services/locationService";
import {
  createSale,
  getSales,
} from "../services/saleService";
import type { Drink } from "../types/drink";
import type { Inventory } from "../types/inventory";
import type { Location } from "../types/location";
import type { Sale } from "../types/sale";

type SaleRow = Sale & {
  locationName: string;
  drinkName: string;
  drinkBrand: string;
  bottleSize: string;
};

function Sales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState<"success" | "error">("success");

  const loadData = async () => {
    setLoading(true);

    try {
      const [
        saleData,
        inventoryData,
        drinkData,
        locationData,
      ] = await Promise.all([
        getSales(),
        getInventory(),
        getDrinks(),
        getLocations(),
      ]);

      setSales(saleData);
      setInventory(inventoryData);
      setDrinks(drinkData);
      setLocations(locationData);
    } catch (error) {
      console.error("Could not load sales:", error);

      setMessageType("error");
      setMessage(
        "Could not load sales. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const rows = useMemo<SaleRow[]>(() => {
    return sales.map((sale) => {
      const location = locations.find(
        (item) => item.id === sale.locationId
      );

      const drink = drinks.find(
        (item) => item.id === sale.drinkId
      );

      return {
        ...sale,
        locationName:
          location?.name ?? "Unknown location",
        drinkName:
          drink?.name ?? "Unknown drink",
        drinkBrand:
          drink?.brand ?? "",
        bottleSize:
          drink?.bottleSize ?? "",
      };
    });
  }, [sales, locations, drinks]);

  const filteredRows = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesSearch =
        !searchText ||
        [
          row.saleNumber ?? "",
          row.locationName,
          row.drinkName,
          row.drinkBrand,
          row.bottleSize,
          row.paymentMethod,
          row.customerName,
          row.notes,
          row.status ?? "",
        ].some((value) =>
          value.toLowerCase().includes(searchText)
        );

      const matchesLocation =
        !locationFilter ||
        row.locationId === locationFilter;

      const matchesPayment =
        !paymentFilter ||
        row.paymentMethod === paymentFilter;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesPayment
      );
    });
  }, [
    rows,
    search,
    locationFilter,
    paymentFilter,
  ]);

  const handleSave = async (sale: Sale) => {
    try {
      await createSale(sale);

      setMessageType("success");
      setMessage("Sale completed successfully.");

      await loadData();
    } catch (error) {
      console.error("Could not complete sale:", error);

      setMessageType("error");
      setMessage(
        "Could not complete the sale. Check available stock and form values."
      );

      throw error;
    }
  };

  const columns: GridColDef<SaleRow>[] = [
    {
      field: "saleNumber",
      headerName: "Sale Number",
      minWidth: 210,
      flex: 1,
      valueGetter: (_value, row) =>
        row.saleNumber ?? "—",
    },
    {
      field: "locationName",
      headerName: "Location",
      minWidth: 170,
      flex: 1,
    },
    {
      field: "drinkName",
      headerName: "Drink",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "drinkBrand",
      headerName: "Brand",
      minWidth: 170,
      flex: 1,
      valueGetter: (_value, row) =>
        row.drinkBrand || "—",
    },
    {
      field: "bottleSize",
      headerName: "Size",
      width: 100,
      valueGetter: (_value, row) =>
        row.bottleSize || "—",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 110,
    },
    {
      field: "unitSellingPrice",
      headerName: "Unit Price",
      minWidth: 130,
      valueFormatter: (value) =>
        `${Number(value).toLocaleString()} FCFA`,
    },
    {
      field: "totalAmount",
      headerName: "Total",
      minWidth: 140,
      valueFormatter: (value) =>
        `${Number(value ?? 0).toLocaleString()} FCFA`,
    },
    {
      field: "profit",
      headerName: "Profit",
      minWidth: 140,
      valueFormatter: (value) =>
        `${Number(value ?? 0).toLocaleString()} FCFA`,
    },
    {
      field: "paymentMethod",
      headerName: "Payment",
      minWidth: 160,
      valueFormatter: (value) => {
        if (value === "MTN_MOMO") {
          return "MTN Mobile Money";
        }

        if (value === "ORANGE_MONEY") {
          return "Orange Money";
        }

        return String(value);
      },
    },
    {
      field: "customerName",
      headerName: "Customer",
      minWidth: 160,
      valueGetter: (_value, row) =>
        row.customerName || "—",
    },
    {
      field: "saleDate",
      headerName: "Date",
      minWidth: 180,
      flex: 1,
      valueFormatter: (value) => {
        if (!value) {
          return "—";
        }

        return new Date(String(value)).toLocaleString();
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 125,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.row.status ?? "Completed"}
          color={
            params.row.status === "Cancelled"
              ? "error"
              : "success"
          }
        />
      ),
    },
  ];

  const totalRevenue = sales.reduce(
    (total, sale) =>
      total + (sale.totalAmount ?? 0),
    0
  );

  const totalProfit = sales.reduce(
    (total, sale) =>
      total + (sale.profit ?? 0),
    0
  );

  const totalBottlesSold = sales.reduce(
    (total, sale) =>
      total + sale.quantity,
    0
  );

  const today = new Date().toDateString();

  const todaySales = sales.filter((sale) => {
    if (!sale.saleDate) {
      return false;
    }

    return (
      new Date(sale.saleDate).toDateString() === today
    );
  });

  const todayRevenue = todaySales.reduce(
    (total, sale) =>
      total + (sale.totalAmount ?? 0),
    0
  );

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          justifyContent: "space-between",
          alignItems: {
            xs: "stretch",
            sm: "center",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4">
            Sales
          </Typography>

          <Typography color="text.secondary">
            Record bar sales and reduce stock automatically.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddOutlined />}
          onClick={() => setDialogOpen(true)}
        >
          Record Sale
        </Button>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            border: "1px solid #e5e7eb",
            borderRadius: 3,
            p: 2,
          }}
        >
          <Typography color="text.secondary">
            Total Sales
          </Typography>

          <Typography variant="h4">
            {sales.length}
          </Typography>
        </Box>

        <Box
          sx={{
            bgcolor: "background.paper",
            border: "1px solid #e5e7eb",
            borderRadius: 3,
            p: 2,
          }}
        >
          <Typography color="text.secondary">
            Bottles Sold
          </Typography>

          <Typography variant="h4">
            {totalBottlesSold.toLocaleString()}
          </Typography>
        </Box>

        <Box
          sx={{
            bgcolor: "background.paper",
            border: "1px solid #e5e7eb",
            borderRadius: 3,
            p: 2,
          }}
        >
          <Typography color="text.secondary">
            Total Revenue
          </Typography>

          <Typography variant="h5">
            {totalRevenue.toLocaleString()} FCFA
          </Typography>
        </Box>

        <Box
          sx={{
            bgcolor: "background.paper",
            border: "1px solid #e5e7eb",
            borderRadius: 3,
            p: 2,
          }}
        >
          <Typography color="text.secondary">
            Total Profit
          </Typography>

          <Typography variant="h5">
            {totalProfit.toLocaleString()} FCFA
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Today: {todayRevenue.toLocaleString()} FCFA
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          bgcolor: "background.paper",
          border: "1px solid #e5e7eb",
          borderRadius: 3,
          p: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              lg: "row",
            },
            gap: 2,
            mb: 2,
          }}
        >
          <TextField
            placeholder="Search sales..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            sx={{
              width: {
                xs: "100%",
                lg: 340,
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            select
            label="Location"
            value={locationFilter}
            onChange={(event) =>
              setLocationFilter(event.target.value)
            }
            sx={{
              width: {
                xs: "100%",
                lg: 220,
              },
            }}
          >
            <MenuItem value="">
              All locations
            </MenuItem>

            {locations
              .filter(
                (location) =>
                  location.type === "SalesArea"
              )
              .map((location) => (
                <MenuItem
                  key={location.id ?? location.name}
                  value={location.id ?? ""}
                >
                  {location.name}
                </MenuItem>
              ))}
          </TextField>

          <TextField
            select
            label="Payment Method"
            value={paymentFilter}
            onChange={(event) =>
              setPaymentFilter(event.target.value)
            }
            sx={{
              width: {
                xs: "100%",
                lg: 220,
              },
            }}
          >
            <MenuItem value="">
              All payment methods
            </MenuItem>

            <MenuItem value="Cash">
              Cash
            </MenuItem>

            <MenuItem value="MTN_MOMO">
              MTN Mobile Money
            </MenuItem>

            <MenuItem value="ORANGE_MONEY">
              Orange Money
            </MenuItem>

            <MenuItem value="Card">
              Card
            </MenuItem>

            <MenuItem value="Credit">
              Credit
            </MenuItem>
          </TextField>
        </Box>

        <DataGrid
          rows={filteredRows}
          columns={columns}
          loading={loading}
          getRowId={(row) =>
            row.id ??
            row.saleNumber ??
            `${row.locationId}-${row.drinkId}-${row.saleDate}`
          }
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: {
              paginationModel: {
                page: 0,
                pageSize: 10,
              },
            },
          }}
          sx={{
            minHeight: 520,
            border: 0,
            "& .MuiDataGrid-columnHeaders": {
              bgcolor: "#f8fafc",
            },
          }}
        />
      </Box>

      <SaleDialog
        open={dialogOpen}
        drinks={drinks}
        locations={locations}
        inventory={inventory}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />

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

export default Sales;
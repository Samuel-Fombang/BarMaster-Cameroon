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

import PurchaseDialog from "../components/purchases/PurchaseDialog";
import { getDrinks } from "../services/drinkService";
import { getLocations } from "../services/locationService";
import {
  createPurchase,
  getPurchases,
} from "../services/purchaseService";
import { getSuppliers } from "../services/supplierService";
import type { Drink } from "../types/drink";
import type { Location } from "../types/location";
import type { Purchase } from "../types/purchase";
import type { Supplier } from "../types/supplier";

type PurchaseRow = Purchase & {
  supplierName: string;
  destinationLocationName: string;
  drinkName: string;
  drinkBrand: string;
  bottleSize: string;
};

function Purchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState<"success" | "error">("success");

  const loadData = async () => {
    setLoading(true);

    try {
      const [
        purchaseData,
        supplierData,
        drinkData,
        locationData,
      ] = await Promise.all([
        getPurchases(),
        getSuppliers(),
        getDrinks(),
        getLocations(),
      ]);

      setPurchases(purchaseData);
      setSuppliers(supplierData);
      setDrinks(drinkData);
      setLocations(locationData);
    } catch (error) {
      console.error("Could not load purchases:", error);

      setMessageType("error");
      setMessage(
        "Could not load purchases. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const rows = useMemo<PurchaseRow[]>(() => {
    return purchases.map((purchase) => {
      const supplier = suppliers.find(
        (item) => item.id === purchase.supplierId
      );

      const destinationLocation = locations.find(
        (item) =>
          item.id === purchase.destinationLocationId
      );

      const drink = drinks.find(
        (item) => item.id === purchase.drinkId
      );

      return {
        ...purchase,
        supplierName:
          supplier?.name ?? "Unknown supplier",
        destinationLocationName:
          destinationLocation?.name ??
          "Unknown location",
        drinkName: drink?.name ?? "Unknown drink",
        drinkBrand: drink?.brand ?? "",
        bottleSize: drink?.bottleSize ?? "",
      };
    });
  }, [purchases, suppliers, drinks, locations]);

  const filteredRows = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesSearch =
        !searchText ||
        [
          row.purchaseNumber ?? "",
          row.supplierName,
          row.destinationLocationName,
          row.drinkName,
          row.drinkBrand,
          row.bottleSize,
          row.invoiceNumber,
          row.paymentStatus,
          row.notes,
          row.status ?? "",
        ].some((value) =>
          value.toLowerCase().includes(searchText)
        );

      const matchesSupplier =
        !supplierFilter ||
        row.supplierId === supplierFilter;

      const matchesPayment =
        !paymentFilter ||
        row.paymentStatus === paymentFilter;

      return (
        matchesSearch &&
        matchesSupplier &&
        matchesPayment
      );
    });
  }, [
    rows,
    search,
    supplierFilter,
    paymentFilter,
  ]);

  const handleSave = async (purchase: Purchase) => {
    try {
      await createPurchase(purchase);

      setMessageType("success");
      setMessage("Purchase completed successfully.");

      await loadData();
    } catch (error) {
      console.error("Could not complete purchase:", error);

      setMessageType("error");
      setMessage(
        "Could not complete the purchase. Check the form and backend."
      );

      throw error;
    }
  };

  const columns: GridColDef<PurchaseRow>[] = [
    {
      field: "purchaseNumber",
      headerName: "Purchase Number",
      minWidth: 210,
      flex: 1,
      valueGetter: (_value, row) =>
        row.purchaseNumber ?? "—",
    },
    {
      field: "supplierName",
      headerName: "Supplier",
      minWidth: 220,
      flex: 1.2,
    },
    {
      field: "destinationLocationName",
      headerName: "Warehouse",
      minWidth: 180,
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
      field: "unitBuyingPrice",
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
      field: "invoiceNumber",
      headerName: "Invoice",
      minWidth: 130,
      valueGetter: (_value, row) =>
        row.invoiceNumber || "—",
    },
    {
      field: "paymentStatus",
      headerName: "Payment",
      width: 120,
      renderCell: (params) => {
        const status = params.row.paymentStatus;

        return (
          <Chip
            size="small"
            label={status}
            color={
              status === "Paid"
                ? "success"
                : status === "Partial"
                  ? "warning"
                  : "error"
            }
          />
        );
      },
    },
    {
      field: "purchaseDate",
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

  const totalPurchaseValue = purchases.reduce(
    (total, purchase) =>
      total + (purchase.totalAmount ?? 0),
    0
  );

  const totalBottlesPurchased = purchases.reduce(
    (total, purchase) => total + purchase.quantity,
    0
  );

  const unpaidCount = purchases.filter(
    (purchase) => purchase.paymentStatus === "Unpaid"
  ).length;

  const today = new Date().toDateString();

  const todayCount = purchases.filter((purchase) => {
    if (!purchase.purchaseDate) {
      return false;
    }

    return (
      new Date(purchase.purchaseDate).toDateString() ===
      today
    );
  }).length;

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
            Purchases
          </Typography>

          <Typography color="text.secondary">
            Receive drinks from suppliers into the
            warehouse.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddOutlined />}
          onClick={() => setDialogOpen(true)}
        >
          Receive Purchase
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
            Total Purchases
          </Typography>

          <Typography variant="h4">
            {purchases.length}
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
            Bottles Purchased
          </Typography>

          <Typography variant="h4">
            {totalBottlesPurchased.toLocaleString()}
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
            Purchase Value
          </Typography>

          <Typography variant="h5">
            {totalPurchaseValue.toLocaleString()} FCFA
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
            Today
          </Typography>

          <Typography variant="h4">
            {todayCount}
          </Typography>

          {unpaidCount > 0 && (
            <Typography
              variant="body2"
              color="error"
              sx={{ mt: 0.5 }}
            >
              {unpaidCount} unpaid
            </Typography>
          )}
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
            placeholder="Search purchases..."
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
            label="Supplier"
            value={supplierFilter}
            onChange={(event) =>
              setSupplierFilter(event.target.value)
            }
            sx={{
              width: {
                xs: "100%",
                lg: 260,
              },
            }}
          >
            <MenuItem value="">
              All suppliers
            </MenuItem>

            {suppliers.map((supplier) => (
              <MenuItem
                key={supplier.id ?? supplier.name}
                value={supplier.id ?? ""}
              >
                {supplier.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Payment Status"
            value={paymentFilter}
            onChange={(event) =>
              setPaymentFilter(event.target.value)
            }
            sx={{
              width: {
                xs: "100%",
                lg: 200,
              },
            }}
          >
            <MenuItem value="">
              All payment statuses
            </MenuItem>

            <MenuItem value="Paid">
              Paid
            </MenuItem>

            <MenuItem value="Partial">
              Partial
            </MenuItem>

            <MenuItem value="Unpaid">
              Unpaid
            </MenuItem>
          </TextField>
        </Box>

        <DataGrid
          rows={filteredRows}
          columns={columns}
          loading={loading}
          getRowId={(row) =>
            row.id ??
            row.purchaseNumber ??
            `${row.supplierId}-${row.drinkId}-${row.purchaseDate}`
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

      <PurchaseDialog
        open={dialogOpen}
        suppliers={suppliers}
        drinks={drinks}
        locations={locations}
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

export default Purchases;
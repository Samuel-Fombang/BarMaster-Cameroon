import {
  SearchOutlined,
  SwapHorizOutlined,
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

import TransferDialog from "../components/transfers/TransferDialog";
import { getDrinks } from "../services/drinkService";
import { getInventory } from "../services/inventoryService";
import { getLocations } from "../services/locationService";
import {
  createTransfer,
  getTransfers,
} from "../services/transferService";
import type { Drink } from "../types/drink";
import type { Inventory } from "../types/inventory";
import type { Location } from "../types/location";
import type { Transfer } from "../types/transfer";

type TransferRow = Transfer & {
  sourceLocationName: string;
  destinationLocationName: string;
  drinkName: string;
  drinkBrand: string;
  bottleSize: string;
};

function Transfers() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [destinationFilter, setDestinationFilter] =
    useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState<"success" | "error">("success");

  const loadData = async () => {
    setLoading(true);

    try {
      const [
        transferData,
        inventoryData,
        drinkData,
        locationData,
      ] = await Promise.all([
        getTransfers(),
        getInventory(),
        getDrinks(),
        getLocations(),
      ]);

      setTransfers(transferData);
      setInventory(inventoryData);
      setDrinks(drinkData);
      setLocations(locationData);
    } catch (error) {
      console.error("Could not load transfers:", error);

      setMessageType("error");
      setMessage(
        "Could not load transfers. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const rows = useMemo<TransferRow[]>(() => {
    return transfers.map((transfer) => {
      const sourceLocation = locations.find(
        (location) =>
          location.id === transfer.sourceLocationId
      );

      const destinationLocation = locations.find(
        (location) =>
          location.id === transfer.destinationLocationId
      );

      const drink = drinks.find(
        (item) => item.id === transfer.drinkId
      );

      return {
        ...transfer,
        sourceLocationName:
          sourceLocation?.name ?? "Unknown location",
        destinationLocationName:
          destinationLocation?.name ?? "Unknown location",
        drinkName: drink?.name ?? "Unknown drink",
        drinkBrand: drink?.brand ?? "",
        bottleSize: drink?.bottleSize ?? "",
      };
    });
  }, [transfers, locations, drinks]);

  const filteredRows = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesSearch =
        !searchText ||
        [
          row.transferNumber ?? "",
          row.sourceLocationName,
          row.destinationLocationName,
          row.drinkName,
          row.drinkBrand,
          row.bottleSize,
          row.reason,
          row.status ?? "",
        ].some((value) =>
          value.toLowerCase().includes(searchText)
        );

      const matchesSource =
        !sourceFilter ||
        row.sourceLocationId === sourceFilter;

      const matchesDestination =
        !destinationFilter ||
        row.destinationLocationId ===
          destinationFilter;

      return (
        matchesSearch &&
        matchesSource &&
        matchesDestination
      );
    });
  }, [
    rows,
    search,
    sourceFilter,
    destinationFilter,
  ]);

  const handleSave = async (transfer: Transfer) => {
    try {
      await createTransfer(transfer);

      setMessageType("success");
      setMessage("Transfer completed successfully.");

      await loadData();
    } catch (error) {
      console.error("Could not complete transfer:", error);

      setMessageType("error");
      setMessage(
        "Could not complete the transfer. Check the available stock."
      );

      throw error;
    }
  };

  const columns: GridColDef<TransferRow>[] = [
    {
      field: "transferNumber",
      headerName: "Transfer Number",
      minWidth: 210,
      flex: 1,
      valueGetter: (_value, row) =>
        row.transferNumber ?? "—",
    },
    {
      field: "sourceLocationName",
      headerName: "From",
      minWidth: 170,
      flex: 1,
    },
    {
      field: "destinationLocationName",
      headerName: "To",
      minWidth: 170,
      flex: 1,
    },
    {
      field: "drinkName",
      headerName: "Drink",
      minWidth: 160,
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
      field: "reason",
      headerName: "Reason",
      minWidth: 220,
      flex: 1.2,
      valueGetter: (_value, row) =>
        row.reason || "—",
    },
    {
      field: "transferDate",
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

  const totalTransferred = transfers.reduce(
    (total, transfer) => total + transfer.quantity,
    0
  );

  const completedCount = transfers.filter(
    (transfer) =>
      (transfer.status ?? "Completed") === "Completed"
  ).length;

  const cancelledCount = transfers.filter(
    (transfer) => transfer.status === "Cancelled"
  ).length;

  const today = new Date().toDateString();

  const todayCount = transfers.filter((transfer) => {
    if (!transfer.transferDate) {
      return false;
    }

    return (
      new Date(transfer.transferDate).toDateString() === today
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
            Transfers
          </Typography>

          <Typography color="text.secondary">
            Move drinks between the warehouse, bar and
            other locations.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<SwapHorizOutlined />}
          onClick={() => setDialogOpen(true)}
        >
          New Transfer
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
            Total Transfers
          </Typography>

          <Typography variant="h4">
            {transfers.length}
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
            Bottles Transferred
          </Typography>

          <Typography variant="h4">
            {totalTransferred.toLocaleString()}
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
            Completed
          </Typography>

          <Typography variant="h4">
            {completedCount}
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

          {cancelledCount > 0 && (
            <Typography
              variant="body2"
              color="error"
              sx={{ mt: 0.5 }}
            >
              {cancelledCount} cancelled
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
            placeholder="Search transfers..."
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
            label="From Location"
            value={sourceFilter}
            onChange={(event) =>
              setSourceFilter(event.target.value)
            }
            sx={{
              width: {
                xs: "100%",
                lg: 220,
              },
            }}
          >
            <MenuItem value="">
              All source locations
            </MenuItem>

            {locations.map((location) => (
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
            label="To Location"
            value={destinationFilter}
            onChange={(event) =>
              setDestinationFilter(event.target.value)
            }
            sx={{
              width: {
                xs: "100%",
                lg: 220,
              },
            }}
          >
            <MenuItem value="">
              All destination locations
            </MenuItem>

            {locations.map((location) => (
              <MenuItem
                key={location.id ?? location.name}
                value={location.id ?? ""}
              >
                {location.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <DataGrid
          rows={filteredRows}
          columns={columns}
          loading={loading}
          getRowId={(row) =>
            row.id ??
            row.transferNumber ??
            `${row.sourceLocationId}-${row.destinationLocationId}-${row.drinkId}-${row.transferDate}`
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

      <TransferDialog
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

export default Transfers;
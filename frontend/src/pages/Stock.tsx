import {
  AddOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";

import DeleteStockDialog from "../components/stock/DeleteStockDialog";
import StockDialog from "../components/stock/StockDialog";
import { getDrinks } from "../services/drinkService";
import {
  createStock,
  deleteStock,
  getStocks,
  updateStock,
} from "../services/stockService";
import type { Drink } from "../types/drink";
import type { Stock as StockType } from "../types/stock";

type StockRow = StockType & {
  drinkName: string;
};

function Stock() {
  const [stocks, setStocks] = useState<StockType[]>([]);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStock, setSelectedStock] =
    useState<StockType | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stockToDelete, setStockToDelete] =
    useState<StockType | null>(null);

  const [deleting, setDeleting] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState<"success" | "error">("success");

  const loadData = async () => {
    setLoading(true);

    try {
      const [stockData, drinkData] = await Promise.all([
        getStocks(),
        getDrinks(),
      ]);

      setStocks(stockData);
      setDrinks(drinkData);
    } catch (error) {
      console.error("Could not load stock data:", error);

      setMessageType("error");
      setMessage(
        "Could not load stock. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const rows = useMemo<StockRow[]>(() => {
    return stocks.map((stock) => {
      const drink = drinks.find(
        (item) => item.id === stock.drinkId
      );

      return {
        ...stock,
        drinkName: drink?.name ?? "Unknown drink",
      };
    });
  }, [stocks, drinks]);

  const filteredRows = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return rows;
    }

    return rows.filter((row) =>
      [row.drinkName, row.drinkId].some((value) =>
        value.toLowerCase().includes(searchText)
      )
    );
  }, [rows, search]);

  const availableDrinks = useMemo(() => {
    if (selectedStock) {
      return drinks;
    }

    const drinkIdsWithStock = new Set(
      stocks.map((stock) => stock.drinkId)
    );

    return drinks.filter(
      (drink) =>
        Boolean(drink.id) &&
        !drinkIdsWithStock.has(drink.id as string)
    );
  }, [drinks, stocks, selectedStock]);

  const handleOpenAdd = () => {
    setSelectedStock(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (stock: StockType) => {
    setSelectedStock(stock);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedStock(null);
  };

  const handleSave = async (stock: StockType) => {
    try {
      if (selectedStock?.id) {
        await updateStock(selectedStock.id, stock);
        setMessage("Stock updated successfully.");
      } else {
        await createStock(stock);
        setMessage("Stock added successfully.");
      }

      setMessageType("success");
      await loadData();
    } catch (error) {
      console.error("Could not save stock:", error);

      setMessageType("error");
      setMessage(
        "Could not save the stock record. The drink may already have a stock record."
      );

      throw error;
    }
  };

  const handleOpenDelete = (stock: StockType) => {
    setStockToDelete(stock);
    setDeleteDialogOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false);
    setStockToDelete(null);
  };

  const handleDelete = async () => {
    if (!stockToDelete?.id) {
      return;
    }

    setDeleting(true);

    try {
      await deleteStock(stockToDelete.id);

      setMessageType("success");
      setMessage("Stock record deleted successfully.");

      handleCloseDelete();
      await loadData();
    } catch (error) {
      console.error("Could not delete stock:", error);

      setMessageType("error");
      setMessage("Could not delete the stock record.");
    } finally {
      setDeleting(false);
    }
  };

  const columns: GridColDef<StockRow>[] = [
    {
      field: "drinkName",
      headerName: "Drink",
      flex: 1.3,
      minWidth: 180,
    },
    {
      field: "currentQuantity",
      headerName: "Current Stock",
      width: 140,
    },
    {
      field: "minimumQuantity",
      headerName: "Minimum Stock",
      width: 150,
    },
    {
      field: "stockStatus",
      headerName: "Stock Status",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const current = params.row.currentQuantity;
        const minimum = params.row.minimumQuantity;

        if (current === 0) {
          return (
            <Chip
              size="small"
              label="Out of Stock"
              color="error"
            />
          );
        }

        if (current <= minimum) {
          return (
            <Chip
              size="small"
              label="Low Stock"
              color="warning"
            />
          );
        }

        return (
          <Chip
            size="small"
            label="Available"
            color="success"
          />
        );
      },
    },
    {
      field: "lastUpdated",
      headerName: "Last Updated",
      flex: 1,
      minWidth: 180,
      valueFormatter: (value) => {
        if (!value) {
          return "—";
        }

        return new Date(String(value)).toLocaleString();
      },
    },
    {
      field: "activeStatus",
      headerName: "Status",
      width: 110,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.row.isActive ? "Active" : "Inactive"}
          color={params.row.isActive ? "success" : "default"}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 210,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            height: "100%",
          }}
        >
          <Button
            size="small"
            variant="outlined"
            startIcon={<EditOutlined />}
            onClick={() => handleOpenEdit(params.row)}
          >
            Edit
          </Button>

          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<DeleteOutlined />}
            onClick={() => handleOpenDelete(params.row)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const totalQuantity = stocks.reduce(
    (total, stock) => total + stock.currentQuantity,
    0
  );

  const lowStockCount = stocks.filter(
    (stock) =>
      stock.currentQuantity > 0 &&
      stock.currentQuantity <= stock.minimumQuantity
  ).length;

  const outOfStockCount = stocks.filter(
    (stock) => stock.currentQuantity === 0
  ).length;

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
            Stock
          </Typography>

          <Typography color="text.secondary">
            View and manage current drink stock levels.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddOutlined />}
          onClick={handleOpenAdd}
          disabled={availableDrinks.length === 0}
        >
          Add Stock
        </Button>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, 1fr)",
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
            Total Bottles
          </Typography>

          <Typography variant="h4">
            {totalQuantity.toLocaleString()}
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
            Low Stock
          </Typography>

          <Typography variant="h4">
            {lowStockCount}
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
            Out of Stock
          </Typography>

          <Typography variant="h4">
            {outOfStockCount}
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
        <TextField
          placeholder="Search stock..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          sx={{
            mb: 2,
            width: {
              xs: "100%",
              sm: 360,
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

        <DataGrid
          rows={filteredRows}
          columns={columns}
          loading={loading}
          getRowId={(row) =>
            row.id ?? row.drinkId
          }
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
                page: 0,
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

      <StockDialog
        open={dialogOpen}
        stock={selectedStock}
        drinks={
          selectedStock
            ? drinks
            : availableDrinks
        }
        onClose={handleCloseDialog}
        onSave={handleSave}
      />

      <DeleteStockDialog
        open={deleteDialogOpen}
        stock={stockToDelete}
        deleting={deleting}
        onClose={handleCloseDelete}
        onConfirm={handleDelete}
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

export default Stock;
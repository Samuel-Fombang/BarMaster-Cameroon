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
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";

import DeleteExpenseDialog from "../components/expenses/DeleteExpenseDialog";
import ExpenseDialog from "../components/expenses/ExpenseDialog";
import {
  createExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} from "../services/expenseService";
import type { Expense } from "../types/expense";

function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] =
    useState<Expense | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);
  const [expenseToDelete, setExpenseToDelete] =
    useState<Expense | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState<"success" | "error">("success");

  const loadExpenses = async () => {
    setLoading(true);

    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (error) {
      console.error("Could not load expenses:", error);

      setMessageType("error");
      setMessage(
        "Could not load expenses. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadExpenses();
  }, []);

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        expenses
          .map((expense) => expense.category)
          .filter(Boolean)
      )
    ).sort();
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return expenses.filter((expense) => {
      const matchesSearch =
        !searchText ||
        [
          expense.expenseNumber ?? "",
          expense.category,
          expense.description,
          expense.paymentMethod,
          expense.referenceNumber,
          expense.notes,
          expense.status ?? "",
        ].some((value) =>
          value.toLowerCase().includes(searchText)
        );

      const matchesCategory =
        !categoryFilter ||
        expense.category === categoryFilter;

      const matchesPayment =
        !paymentFilter ||
        expense.paymentMethod === paymentFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPayment
      );
    });
  }, [
    expenses,
    search,
    categoryFilter,
    paymentFilter,
  ]);

  const handleOpenAdd = () => {
    setSelectedExpense(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedExpense(null);
  };

  const handleSave = async (expense: Expense) => {
    try {
      if (selectedExpense?.id) {
        await updateExpense(selectedExpense.id, expense);

        setMessageType("success");
        setMessage("Expense updated successfully.");
      } else {
        await createExpense(expense);

        setMessageType("success");
        setMessage("Expense added successfully.");
      }

      await loadExpenses();
    } catch (error) {
      console.error("Could not save expense:", error);

      setMessageType("error");
      setMessage("Could not save the expense.");

      throw error;
    }
  };

  const handleOpenDelete = (expense: Expense) => {
    setExpenseToDelete(expense);
    setDeleteDialogOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false);
    setExpenseToDelete(null);
  };

  const handleDelete = async () => {
    if (!expenseToDelete?.id) {
      return;
    }

    setDeleting(true);

    try {
      await deleteExpense(expenseToDelete.id);

      setMessageType("success");
      setMessage("Expense deleted successfully.");

      handleCloseDelete();
      await loadExpenses();
    } catch (error) {
      console.error("Could not delete expense:", error);

      setMessageType("error");
      setMessage("Could not delete the expense.");
    } finally {
      setDeleting(false);
    }
  };

  const columns: GridColDef<Expense>[] = [
    {
      field: "expenseNumber",
      headerName: "Expense Number",
      minWidth: 210,
      flex: 1,
      valueGetter: (_value, row) =>
        row.expenseNumber ?? "—",
    },
    {
      field: "category",
      headerName: "Category",
      minWidth: 140,
      flex: 0.8,
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 240,
      flex: 1.4,
    },
    {
      field: "amount",
      headerName: "Amount",
      minWidth: 150,
      valueFormatter: (value) =>
        `${Number(value).toLocaleString()} FCFA`,
    },
    {
      field: "paymentMethod",
      headerName: "Payment Method",
      minWidth: 170,
      valueFormatter: (value) => {
        if (value === "MTN_MOMO") {
          return "MTN Mobile Money";
        }

        if (value === "ORANGE_MONEY") {
          return "Orange Money";
        }

        if (value === "BankTransfer") {
          return "Bank Transfer";
        }

        return String(value);
      },
    },
    {
      field: "referenceNumber",
      headerName: "Reference",
      minWidth: 150,
      valueGetter: (_value, row) =>
        row.referenceNumber || "—",
    },
    {
      field: "expenseDate",
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
      width: 120,
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

  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const today = new Date().toDateString();

  const todayExpenses = expenses.filter((expense) => {
    return (
      new Date(expense.expenseDate).toDateString() === today
    );
  });

  const todayTotal = todayExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthTotal = expenses
    .filter((expense) => {
      const date = new Date(expense.expenseDate);

      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    })
    .reduce(
      (total, expense) => total + expense.amount,
      0
    );

  const categoryTotals = expenses.reduce<
    Record<string, number>
  >((totals, expense) => {
    totals[expense.category] =
      (totals[expense.category] ?? 0) +
      expense.amount;

    return totals;
  }, {});

  const highestCategory =
    Object.entries(categoryTotals).sort(
      (first, second) => second[1] - first[1]
    )[0]?.[0] ?? "—";

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
            Expenses
          </Typography>

          <Typography color="text.secondary">
            Record and manage business expenses.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddOutlined />}
          onClick={handleOpenAdd}
        >
          Add Expense
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
            Total Expenses
          </Typography>

          <Typography variant="h5">
            {totalExpenses.toLocaleString()} FCFA
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

          <Typography variant="h5">
            {todayTotal.toLocaleString()} FCFA
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
            This Month
          </Typography>

          <Typography variant="h5">
            {monthTotal.toLocaleString()} FCFA
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
            Highest Category
          </Typography>

          <Typography variant="h5">
            {highestCategory}
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
            placeholder="Search expenses..."
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
            label="Category"
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
            sx={{
              width: {
                xs: "100%",
                lg: 220,
              },
            }}
          >
            <MenuItem value="">
              All categories
            </MenuItem>

            {categories.map((category) => (
              <MenuItem
                key={category}
                value={category}
              >
                {category}
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

            <MenuItem value="BankTransfer">
              Bank Transfer
            </MenuItem>
          </TextField>
        </Box>

        <DataGrid
          rows={filteredExpenses}
          columns={columns}
          loading={loading}
          getRowId={(row) =>
            row.id ??
            row.expenseNumber ??
            `${row.category}-${row.description}-${row.expenseDate}`
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

      <ExpenseDialog
        open={dialogOpen}
        expense={selectedExpense}
        onClose={handleCloseDialog}
        onSave={handleSave}
      />

      <DeleteExpenseDialog
        open={deleteDialogOpen}
        expense={expenseToDelete}
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

export default Expenses;
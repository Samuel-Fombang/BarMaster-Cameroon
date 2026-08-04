import { DownloadOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  type GridColDef,
} from "@mui/x-data-grid";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { getExpenses } from "../../services/expenseService";
import type { Expense } from "../../types/expense";
import { exportReportToPdf } from "../../utils/exportReportToPdf";

function formatPaymentMethod(
  paymentMethod?: string
): string {
  if (paymentMethod === "MTN_MOMO") {
    return "MTN Mobile Money";
  }

  if (paymentMethod === "ORANGE_MONEY") {
    return "Orange Money";
  }

  if (paymentMethod === "BankTransfer") {
    return "Bank Transfer";
  }

  return paymentMethod || "—";
}

function ExpenseReport() {
  const [expenses, setExpenses] =
    useState<Expense[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState("");

  const [
    paymentFilter,
    setPaymentFilter,
  ] = useState("");

  useEffect(() => {
    const loadExpenses = async () => {
      setLoading(true);

      try {
        const data = await getExpenses();
        setExpenses(data);
      } catch (error) {
        console.error(
          "Could not load expense report:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    void loadExpenses();
  }, []);

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        expenses
          .map(
            (expense) =>
              expense.category
          )
          .filter(Boolean)
      )
    ).sort();
  }, [expenses]);

  const filteredExpenses =
    useMemo(() => {
      return expenses.filter(
        (expense) => {
          const matchesCategory =
            !categoryFilter ||
            expense.category ===
              categoryFilter;

          const matchesPayment =
            !paymentFilter ||
            expense.paymentMethod ===
              paymentFilter;

          return (
            matchesCategory &&
            matchesPayment
          );
        }
      );
    }, [
      expenses,
      categoryFilter,
      paymentFilter,
    ]);

  const totalExpenses =
    filteredExpenses.reduce(
      (total, expense) =>
        total + expense.amount,
      0
    );

  const currentMonth =
    new Date().getMonth();

  const currentYear =
    new Date().getFullYear();

  const monthlyExpenses =
    filteredExpenses
      .filter((expense) => {
        if (!expense.expenseDate) {
          return false;
        }

        const date = new Date(
          expense.expenseDate
        );

        return (
          date.getMonth() ===
            currentMonth &&
          date.getFullYear() ===
            currentYear
        );
      })
      .reduce(
        (total, expense) =>
          total + expense.amount,
        0
      );

  const averageExpense =
    filteredExpenses.length > 0
      ? totalExpenses /
        filteredExpenses.length
      : 0;

  const categoryTotals =
    filteredExpenses.reduce<
      Record<string, number>
    >((totals, expense) => {
      totals[expense.category] =
        (totals[
          expense.category
        ] ?? 0) + expense.amount;

      return totals;
    }, {});

  const highestCategory =
    Object.entries(
      categoryTotals
    ).sort(
      (first, second) =>
        second[1] - first[1]
    )[0]?.[0] ?? "—";

  const handleDownloadPdf = () => {
    exportReportToPdf({
      title: "Expense Report",
      fileName:
        "barmaster-expense-report.pdf",
      columns: [
        "Expense Number",
        "Category",
        "Description",
        "Amount",
        "Payment",
        "Reference",
        "Date",
      ],
      rows: filteredExpenses.map(
        (expense) => [
          expense.expenseNumber ??
            "—",
          expense.category,
          expense.description,
          `${Number(
            expense.amount
          ).toLocaleString()} FCFA`,
          formatPaymentMethod(
            expense.paymentMethod
          ),
          expense.referenceNumber ||
            "—",
          expense.expenseDate
            ? new Date(
                expense.expenseDate
              ).toLocaleString()
            : "—",
        ]
      ),
      summary: [
        {
          label: "Expense Records",
          value:
            filteredExpenses.length.toLocaleString(),
        },
        {
          label: "Total Expenses",
          value: `${totalExpenses.toLocaleString()} FCFA`,
        },
        {
          label: "This Month",
          value: `${monthlyExpenses.toLocaleString()} FCFA`,
        },
        {
          label: "Average Expense",
          value: `${Math.round(
            averageExpense
          ).toLocaleString()} FCFA`,
        },
        {
          label:
            "Highest Category",
          value: highestCategory,
        },
      ],
    });
  };

  const columns: GridColDef<Expense>[] =
    [
      {
        field: "expenseNumber",
        headerName:
          "Expense Number",
        minWidth: 210,
        flex: 1,
        valueGetter: (
          _value,
          row
        ) =>
          row.expenseNumber ?? "—",
      },
      {
        field: "category",
        headerName: "Category",
        minWidth: 150,
        flex: 0.8,
      },
      {
        field: "description",
        headerName: "Description",
        minWidth: 230,
        flex: 1.3,
      },
      {
        field: "amount",
        headerName: "Amount",
        minWidth: 150,
        valueFormatter: (value) =>
          `${Number(
            value ?? 0
          ).toLocaleString()} FCFA`,
      },
      {
        field: "paymentMethod",
        headerName: "Payment",
        minWidth: 170,
        valueFormatter: (value) =>
          formatPaymentMethod(
            String(value ?? "")
          ),
      },
      {
        field: "referenceNumber",
        headerName: "Reference",
        minWidth: 150,
        valueGetter: (
          _value,
          row
        ) =>
          row.referenceNumber ||
          "—",
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

          return new Date(
            String(value)
          ).toLocaleString();
        },
      },
    ];

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 8,
        }}
      >
        <CircularProgress />
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
        justifyContent="flex-end"
        alignItems={{
          xs: "stretch",
          sm: "center",
        }}
        sx={{ mb: 2 }}
      >
        <Button
          variant="contained"
          startIcon={
            <DownloadOutlined />
          }
          onClick={
            handleDownloadPdf
          }
          disabled={
            filteredExpenses.length ===
            0
          }
        >
          Download PDF
        </Button>
      </Stack>

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
            border:
              "1px solid #e5e7eb",
            borderRadius: 3,
            p: 2,
          }}
        >
          <Typography color="text.secondary">
            Expense Records
          </Typography>

          <Typography variant="h5">
            {filteredExpenses.length}
          </Typography>
        </Box>

        <Box
          sx={{
            border:
              "1px solid #e5e7eb",
            borderRadius: 3,
            p: 2,
          }}
        >
          <Typography color="text.secondary">
            Total Expenses
          </Typography>

          <Typography variant="h5">
            {totalExpenses.toLocaleString()}{" "}
            FCFA
          </Typography>
        </Box>

        <Box
          sx={{
            border:
              "1px solid #e5e7eb",
            borderRadius: 3,
            p: 2,
          }}
        >
          <Typography color="text.secondary">
            This Month
          </Typography>

          <Typography variant="h5">
            {monthlyExpenses.toLocaleString()}{" "}
            FCFA
          </Typography>
        </Box>

        <Box
          sx={{
            border:
              "1px solid #e5e7eb",
            borderRadius: 3,
            p: 2,
          }}
        >
          <Typography color="text.secondary">
            Average Expense
          </Typography>

          <Typography variant="h5">
            {Math.round(
              averageExpense
            ).toLocaleString()}{" "}
            FCFA
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Highest:{" "}
            {highestCategory}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          gap: 2,
          mb: 2,
        }}
      >
        <TextField
          select
          label="Category"
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(
              event.target.value
            )
          }
          sx={{
            width: {
              xs: "100%",
              md: 260,
            },
          }}
        >
          <MenuItem value="">
            All categories
          </MenuItem>

          {categories.map(
            (category) => (
              <MenuItem
                key={category}
                value={category}
              >
                {category}
              </MenuItem>
            )
          )}
        </TextField>

        <TextField
          select
          label="Payment Method"
          value={paymentFilter}
          onChange={(event) =>
            setPaymentFilter(
              event.target.value
            )
          }
          sx={{
            width: {
              xs: "100%",
              md: 260,
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
        getRowId={(row) =>
          row.id ??
          row.expenseNumber ??
          `${row.category}-${row.description}-${row.expenseDate}`
        }
        disableRowSelectionOnClick
        pageSizeOptions={[
          5,
          10,
          20,
        ]}
        initialState={{
          pagination: {
            paginationModel: {
              page: 0,
              pageSize: 10,
            },
          },
        }}
        sx={{
          minHeight: 480,
          border:
            "1px solid #e5e7eb",
          borderRadius: 2,
          "& .MuiDataGrid-columnHeaders":
            {
              bgcolor: "#f8fafc",
            },
        }}
      />
    </Box>
  );
}

export default ExpenseReport;
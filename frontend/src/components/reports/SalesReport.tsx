import { DownloadOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
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

import { getDrinks } from "../../services/drinkService";
import { getLocations } from "../../services/locationService";
import { getSales } from "../../services/saleService";
import type { Drink } from "../../types/drink";
import type { Location } from "../../types/location";
import type { Sale } from "../../types/sale";
import { exportReportToPdf } from "../../utils/exportReportToPdf";

type SalesReportRow = Sale & {
  locationName: string;
  drinkName: string;
  drinkBrand: string;
};

function formatPaymentMethod(
  paymentMethod?: string
): string {
  if (paymentMethod === "MTN_MOMO") {
    return "MTN Mobile Money";
  }

  if (paymentMethod === "ORANGE_MONEY") {
    return "Orange Money";
  }

  return paymentMethod || "—";
}

function SalesReport() {
  const [sales, setSales] =
    useState<Sale[]>([]);

  const [drinks, setDrinks] =
    useState<Drink[]>([]);

  const [locations, setLocations] =
    useState<Location[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    locationFilter,
    setLocationFilter,
  ] = useState("");

  const [
    paymentFilter,
    setPaymentFilter,
  ] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const [
          salesData,
          drinksData,
          locationsData,
        ] = await Promise.all([
          getSales(),
          getDrinks(),
          getLocations(),
        ]);

        setSales(salesData);
        setDrinks(drinksData);
        setLocations(locationsData);
      } catch (error) {
        console.error(
          "Could not load sales report:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, []);

  const rows =
    useMemo<SalesReportRow[]>(() => {
      return sales.map((sale) => {
        const drink = drinks.find(
          (item) =>
            item.id === sale.drinkId
        );

        const location =
          locations.find(
            (item) =>
              item.id ===
              sale.locationId
          );

        return {
          ...sale,
          locationName:
            location?.name ??
            "Unknown location",
          drinkName:
            drink?.name ??
            "Unknown drink",
          drinkBrand:
            drink?.brand ?? "",
        };
      });
    }, [
      sales,
      drinks,
      locations,
    ]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesLocation =
        !locationFilter ||
        row.locationId ===
          locationFilter;

      const matchesPayment =
        !paymentFilter ||
        row.paymentMethod ===
          paymentFilter;

      return (
        matchesLocation &&
        matchesPayment
      );
    });
  }, [
    rows,
    locationFilter,
    paymentFilter,
  ]);

  const totalRevenue =
    filteredRows.reduce(
      (total, sale) =>
        total +
        (sale.totalAmount ?? 0),
      0
    );

  const totalBottles =
    filteredRows.reduce(
      (total, sale) =>
        total + sale.quantity,
      0
    );

  const totalTransactions =
    filteredRows.length;

  const averageSale =
    totalTransactions > 0
      ? totalRevenue /
        totalTransactions
      : 0;

  const handleDownloadPdf = () => {
    exportReportToPdf({
      title: "Sales Report",
      fileName:
        "barmaster-sales-report.pdf",
      columns: [
        "Sale Number",
        "Location",
        "Drink",
        "Brand",
        "Quantity",
        "Revenue",
        "Payment",
        "Date",
        "Status",
      ],
      rows: filteredRows.map(
        (sale) => [
          sale.saleNumber ?? "—",
          sale.locationName,
          sale.drinkName,
          sale.drinkBrand || "—",
          sale.quantity,
          `${Number(
            sale.totalAmount ?? 0
          ).toLocaleString()} FCFA`,
          formatPaymentMethod(
            sale.paymentMethod
          ),
          sale.saleDate
            ? new Date(
                sale.saleDate
              ).toLocaleString()
            : "—",
          sale.status ??
            "Completed",
        ]
      ),
      summary: [
        {
          label:
            "Sales Transactions",
          value:
            totalTransactions.toLocaleString(),
        },
        {
          label: "Bottles Sold",
          value:
            totalBottles.toLocaleString(),
        },
        {
          label: "Total Revenue",
          value: `${totalRevenue.toLocaleString()} FCFA`,
        },
        {
          label: "Average Sale",
          value: `${Math.round(
            averageSale
          ).toLocaleString()} FCFA`,
        },
      ],
    });
  };

  const columns: GridColDef<SalesReportRow>[] =
    [
      {
        field: "saleNumber",
        headerName: "Sale Number",
        minWidth: 210,
        flex: 1,
        valueGetter: (
          _value,
          row
        ) =>
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
        valueGetter: (
          _value,
          row
        ) =>
          row.drinkBrand || "—",
      },
      {
        field: "quantity",
        headerName: "Quantity",
        width: 110,
      },
      {
        field: "totalAmount",
        headerName: "Revenue",
        minWidth: 150,
        valueFormatter: (value) =>
          `${Number(
            value ?? 0
          ).toLocaleString()} FCFA`,
      },
      {
        field: "paymentMethod",
        headerName: "Payment",
        minWidth: 160,
        valueFormatter: (value) =>
          formatPaymentMethod(
            String(value ?? "")
          ),
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

          return new Date(
            String(value)
          ).toLocaleString();
        },
      },
      {
        field: "status",
        headerName: "Status",
        width: 125,
        renderCell: (params) => (
          <Chip
            size="small"
            label={
              params.row.status ??
              "Completed"
            }
            color={
              params.row.status ===
              "Cancelled"
                ? "error"
                : "success"
            }
          />
        ),
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
          onClick={handleDownloadPdf}
          disabled={
            filteredRows.length === 0
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
            Sales Transactions
          </Typography>

          <Typography variant="h5">
            {totalTransactions}
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
            Bottles Sold
          </Typography>

          <Typography variant="h5">
            {totalBottles.toLocaleString()}
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
            Total Revenue
          </Typography>

          <Typography variant="h5">
            {totalRevenue.toLocaleString()}{" "}
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
            Average Sale
          </Typography>

          <Typography variant="h5">
            {Math.round(
              averageSale
            ).toLocaleString()}{" "}
            FCFA
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
          label="Location"
          value={locationFilter}
          onChange={(event) =>
            setLocationFilter(
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
            All locations
          </MenuItem>

          {locations
            .filter(
              (location) =>
                location.type ===
                "SalesArea"
            )
            .map((location) => (
              <MenuItem
                key={
                  location.id ??
                  location.name
                }
                value={
                  location.id ?? ""
                }
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

          <MenuItem value="Credit">
            Credit
          </MenuItem>
        </TextField>
      </Box>

      <DataGrid
        rows={filteredRows}
        columns={columns}
        getRowId={(row) =>
          row.id ??
          row.saleNumber ??
          `${row.locationId}-${row.drinkId}-${row.saleDate}`
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

export default SalesReport;
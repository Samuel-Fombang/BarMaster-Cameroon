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

import { getDrinks } from "../../services/drinkService";
import { getLocations } from "../../services/locationService";
import { getSales } from "../../services/saleService";
import type { Drink } from "../../types/drink";
import type { Location } from "../../types/location";
import type { Sale } from "../../types/sale";
import { exportReportToPdf } from "../../utils/exportReportToPdf";

type ProfitReportRow = Sale & {
  locationName: string;
  drinkName: string;
  drinkBrand: string;
};

function ProfitReport() {
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
    drinkFilter,
    setDrinkFilter,
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
          "Could not load profit report:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, []);

  const rows =
    useMemo<ProfitReportRow[]>(() => {
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

      const matchesDrink =
        !drinkFilter ||
        row.drinkId ===
          drinkFilter;

      return (
        matchesLocation &&
        matchesDrink
      );
    });
  }, [
    rows,
    locationFilter,
    drinkFilter,
  ]);

  const totalRevenue =
    filteredRows.reduce(
      (total, sale) =>
        total +
        (sale.totalAmount ?? 0),
      0
    );

  const totalCost =
    filteredRows.reduce(
      (total, sale) =>
        total +
        (sale.totalCost ?? 0),
      0
    );

  const totalProfit =
    filteredRows.reduce(
      (total, sale) =>
        total +
        (sale.profit ?? 0),
      0
    );

  const profitMargin =
    totalRevenue > 0
      ? (totalProfit /
          totalRevenue) *
        100
      : 0;

  const handleDownloadPdf = () => {
    exportReportToPdf({
      title: "Profit Report",
      fileName:
        "barmaster-profit-report.pdf",
      columns: [
        "Sale Number",
        "Location",
        "Drink",
        "Brand",
        "Quantity",
        "Revenue",
        "Cost",
        "Profit",
        "Date",
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
          `${Number(
            sale.totalCost ?? 0
          ).toLocaleString()} FCFA`,
          `${Number(
            sale.profit ?? 0
          ).toLocaleString()} FCFA`,
          sale.saleDate
            ? new Date(
                sale.saleDate
              ).toLocaleString()
            : "—",
        ]
      ),
      summary: [
        {
          label: "Total Revenue",
          value: `${totalRevenue.toLocaleString()} FCFA`,
        },
        {
          label: "Total Cost",
          value: `${totalCost.toLocaleString()} FCFA`,
        },
        {
          label: "Total Profit",
          value: `${totalProfit.toLocaleString()} FCFA`,
        },
        {
          label: "Profit Margin",
          value: `${profitMargin.toFixed(
            1
          )}%`,
        },
      ],
    });
  };

  const columns: GridColDef<ProfitReportRow>[] =
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
        field: "totalCost",
        headerName: "Cost",
        minWidth: 150,
        valueFormatter: (value) =>
          `${Number(
            value ?? 0
          ).toLocaleString()} FCFA`,
      },
      {
        field: "profit",
        headerName: "Profit",
        minWidth: 150,
        valueFormatter: (value) =>
          `${Number(
            value ?? 0
          ).toLocaleString()} FCFA`,
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
            Total Cost
          </Typography>

          <Typography variant="h5">
            {totalCost.toLocaleString()}{" "}
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
            Total Profit
          </Typography>

          <Typography variant="h5">
            {totalProfit.toLocaleString()}{" "}
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
            Profit Margin
          </Typography>

          <Typography variant="h5">
            {profitMargin.toFixed(1)}%
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
          label="Drink"
          value={drinkFilter}
          onChange={(event) =>
            setDrinkFilter(
              event.target.value
            )
          }
          sx={{
            width: {
              xs: "100%",
              md: 300,
            },
          }}
        >
          <MenuItem value="">
            All drinks
          </MenuItem>

          {drinks.map((drink) => (
            <MenuItem
              key={
                drink.id ??
                drink.name
              }
              value={
                drink.id ?? ""
              }
            >
              {drink.name}
              {drink.brand
                ? ` — ${drink.brand}`
                : ""}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {totalCost === 0 &&
        totalRevenue > 0 && (
          <Box
            sx={{
              mb: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: "#fff7ed",
              color: "#9a3412",
            }}
          >
            Profit is currently based
            on buying prices saved in
            the Drinks records. Drinks
            with a buying price of zero
            will make the reported
            profit too high.
          </Box>
        )}

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

export default ProfitReport;

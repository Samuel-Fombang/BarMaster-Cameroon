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
import { getSales } from "../../services/saleService";
import type { Drink } from "../../types/drink";
import type { Sale } from "../../types/sale";
import { exportReportToPdf } from "../../utils/exportReportToPdf";

type BestSellingRow = {
  id: string;
  drinkId: string;
  drinkName: string;
  drinkBrand: string;
  bottleSize: string;
  quantitySold: number;
  salesCount: number;
  totalRevenue: number;
  totalProfit: number;
  averageSellingPrice: number;
};

function BestSellingReport() {
  const [sales, setSales] =
    useState<Sale[]>([]);

  const [drinks, setDrinks] =
    useState<Drink[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    drinkFilter,
    setDrinkFilter,
  ] = useState("");

  const [
    sortFilter,
    setSortFilter,
  ] = useState("Quantity");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const [
          salesData,
          drinksData,
        ] = await Promise.all([
          getSales(),
          getDrinks(),
        ]);

        setSales(salesData);
        setDrinks(drinksData);
      } catch (error) {
        console.error(
          "Could not load best-selling report:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, []);

  const rows =
    useMemo<BestSellingRow[]>(() => {
      const groupedSales = new Map<
        string,
        {
          quantitySold: number;
          salesCount: number;
          totalRevenue: number;
          totalProfit: number;
        }
      >();

      sales.forEach((sale) => {
        const current =
          groupedSales.get(
            sale.drinkId
          ) ?? {
            quantitySold: 0,
            salesCount: 0,
            totalRevenue: 0,
            totalProfit: 0,
          };

        current.quantitySold +=
          sale.quantity;

        current.salesCount += 1;

        current.totalRevenue +=
          sale.totalAmount ?? 0;

        current.totalProfit +=
          sale.profit ?? 0;

        groupedSales.set(
          sale.drinkId,
          current
        );
      });

      return Array.from(
        groupedSales.entries()
      ).map(([drinkId, values]) => {
        const drink = drinks.find(
          (item) =>
            item.id === drinkId
        );

        return {
          id: drinkId,
          drinkId,
          drinkName:
            drink?.name ??
            "Unknown drink",
          drinkBrand:
            drink?.brand ?? "",
          bottleSize:
            drink?.bottleSize ?? "",
          quantitySold:
            values.quantitySold,
          salesCount:
            values.salesCount,
          totalRevenue:
            values.totalRevenue,
          totalProfit:
            values.totalProfit,
          averageSellingPrice:
            values.quantitySold > 0
              ? values.totalRevenue /
                values.quantitySold
              : 0,
        };
      });
    }, [sales, drinks]);

  const filteredRows = useMemo(() => {
    const filtered = rows.filter(
      (row) =>
        !drinkFilter ||
        row.drinkId === drinkFilter
    );

    return [...filtered].sort(
      (first, second) => {
        if (
          sortFilter === "Revenue"
        ) {
          return (
            second.totalRevenue -
            first.totalRevenue
          );
        }

        if (
          sortFilter === "Profit"
        ) {
          return (
            second.totalProfit -
            first.totalProfit
          );
        }

        if (
          sortFilter ===
          "Transactions"
        ) {
          return (
            second.salesCount -
            first.salesCount
          );
        }

        return (
          second.quantitySold -
          first.quantitySold
        );
      }
    );
  }, [
    rows,
    drinkFilter,
    sortFilter,
  ]);

  const totalBottlesSold =
    filteredRows.reduce(
      (total, item) =>
        total + item.quantitySold,
      0
    );

  const totalRevenue =
    filteredRows.reduce(
      (total, item) =>
        total + item.totalRevenue,
      0
    );

  const totalProfit =
    filteredRows.reduce(
      (total, item) =>
        total + item.totalProfit,
      0
    );

  const bestSellingDrink =
    filteredRows[0]?.drinkName ??
    "—";

  const handleDownloadPdf = () => {
    exportReportToPdf({
      title:
        "Best Selling Drinks Report",
      fileName:
        "barmaster-best-selling-report.pdf",
      columns: [
        "Rank",
        "Drink",
        "Brand",
        "Size",
        "Bottles Sold",
        "Transactions",
        "Average Price",
        "Revenue",
        "Profit",
      ],
      rows: filteredRows.map(
        (item, index) => [
          index + 1,
          item.drinkName,
          item.drinkBrand || "—",
          item.bottleSize || "—",
          item.quantitySold,
          item.salesCount,
          `${Math.round(
            item.averageSellingPrice
          ).toLocaleString()} FCFA`,
          `${item.totalRevenue.toLocaleString()} FCFA`,
          `${item.totalProfit.toLocaleString()} FCFA`,
        ]
      ),
      summary: [
        {
          label:
            "Best-Selling Drink",
          value:
            bestSellingDrink,
        },
        {
          label:
            "Bottles Sold",
          value:
            totalBottlesSold.toLocaleString(),
        },
        {
          label:
            "Total Revenue",
          value: `${totalRevenue.toLocaleString()} FCFA`,
        },
        {
          label:
            "Total Profit",
          value: `${totalProfit.toLocaleString()} FCFA`,
        },
        {
          label:
            "Ranked By",
          value: sortFilter,
        },
      ],
    });
  };

  const columns: GridColDef<BestSellingRow>[] =
    [
      {
        field: "ranking",
        headerName: "Rank",
        width: 90,
        sortable: false,
        valueGetter: (
          _value,
          row
        ) =>
          filteredRows.findIndex(
            (item) =>
              item.id === row.id
          ) + 1,
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
        valueGetter: (
          _value,
          row
        ) =>
          row.drinkBrand || "—",
      },
      {
        field: "bottleSize",
        headerName: "Size",
        width: 100,
        valueGetter: (
          _value,
          row
        ) =>
          row.bottleSize || "—",
      },
      {
        field: "quantitySold",
        headerName:
          "Bottles Sold",
        minWidth: 130,
      },
      {
        field: "salesCount",
        headerName:
          "Transactions",
        minWidth: 130,
      },
      {
        field:
          "averageSellingPrice",
        headerName:
          "Average Price",
        minWidth: 150,
        valueFormatter: (value) =>
          `${Math.round(
            Number(value ?? 0)
          ).toLocaleString()} FCFA`,
      },
      {
        field: "totalRevenue",
        headerName: "Revenue",
        minWidth: 150,
        valueFormatter: (value) =>
          `${Number(
            value ?? 0
          ).toLocaleString()} FCFA`,
      },
      {
        field: "totalProfit",
        headerName: "Profit",
        minWidth: 150,
        valueFormatter: (value) =>
          `${Number(
            value ?? 0
          ).toLocaleString()} FCFA`,
      },
    ];

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent:
            "center",
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
            Best-Selling Drink
          </Typography>

          <Typography variant="h5">
            {bestSellingDrink}
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
            {totalBottlesSold.toLocaleString()}
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
            Total Profit
          </Typography>

          <Typography variant="h5">
            {totalProfit.toLocaleString()}{" "}
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

        <TextField
          select
          label="Rank By"
          value={sortFilter}
          onChange={(event) =>
            setSortFilter(
              event.target.value
            )
          }
          sx={{
            width: {
              xs: "100%",
              md: 240,
            },
          }}
        >
          <MenuItem value="Quantity">
            Bottles Sold
          </MenuItem>

          <MenuItem value="Revenue">
            Revenue
          </MenuItem>

          <MenuItem value="Profit">
            Profit
          </MenuItem>

          <MenuItem value="Transactions">
            Transactions
          </MenuItem>
        </TextField>
      </Box>

      <DataGrid
        rows={filteredRows}
        columns={columns}
        getRowId={(row) => row.id}
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

export default BestSellingReport;
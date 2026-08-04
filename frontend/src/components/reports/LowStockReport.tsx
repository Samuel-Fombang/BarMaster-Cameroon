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
import { getInventory } from "../../services/inventoryService";
import { getLocations } from "../../services/locationService";
import type { Drink } from "../../types/drink";
import type { Inventory } from "../../types/inventory";
import type { Location } from "../../types/location";
import { exportReportToPdf } from "../../utils/exportReportToPdf";

type LowStockRow = Inventory & {
  drinkName: string;
  drinkBrand: string;
  bottleSize: string;
  locationName: string;
  locationType: string;
  shortage: number;
  stockStatus: "Out of Stock" | "Low Stock";
};

function formatLocationType(
  locationType?: string
): string {
  if (locationType === "SalesArea") {
    return "Sales Area";
  }

  if (locationType === "DamagedStock") {
    return "Damaged Stock";
  }

  return locationType || "—";
}

function LowStockReport() {
  const [inventory, setInventory] =
    useState<Inventory[]>([]);

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
    statusFilter,
    setStatusFilter,
  ] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const [
          inventoryData,
          drinksData,
          locationsData,
        ] = await Promise.all([
          getInventory(),
          getDrinks(),
          getLocations(),
        ]);

        setInventory(inventoryData);
        setDrinks(drinksData);
        setLocations(locationsData);
      } catch (error) {
        console.error(
          "Could not load low-stock report:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, []);

  const rows =
    useMemo<LowStockRow[]>(() => {
      return inventory
        .filter(
          (item) =>
            item.quantity <=
            item.minimumQuantity
        )
        .map((item) => {
          const drink = drinks.find(
            (drinkItem) =>
              drinkItem.id ===
              item.drinkId
          );

          const location =
            locations.find(
              (locationItem) =>
                locationItem.id ===
                item.locationId
            );

          const stockStatus =
            item.quantity === 0
              ? "Out of Stock"
              : "Low Stock";

          return {
            ...item,
            drinkName:
              drink?.name ??
              "Unknown drink",
            drinkBrand:
              drink?.brand ?? "",
            bottleSize:
              drink?.bottleSize ?? "",
            locationName:
              location?.name ??
              "Unknown location",
            locationType:
              location?.type ?? "",
            shortage: Math.max(
              item.minimumQuantity -
                item.quantity,
              0
            ),
            stockStatus,
          };
        });
    }, [
      inventory,
      drinks,
      locations,
    ]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesLocation =
        !locationFilter ||
        row.locationId ===
          locationFilter;

      const matchesStatus =
        !statusFilter ||
        row.stockStatus ===
          statusFilter;

      return (
        matchesLocation &&
        matchesStatus
      );
    });
  }, [
    rows,
    locationFilter,
    statusFilter,
  ]);

  const outOfStockCount =
    filteredRows.filter(
      (item) =>
        item.stockStatus ===
        "Out of Stock"
    ).length;

  const lowStockCount =
    filteredRows.filter(
      (item) =>
        item.stockStatus ===
        "Low Stock"
    ).length;

  const totalShortage =
    filteredRows.reduce(
      (total, item) =>
        total + item.shortage,
      0
    );

  const affectedLocations =
    new Set(
      filteredRows.map(
        (item) => item.locationId
      )
    ).size;

  const handleDownloadPdf = () => {
    exportReportToPdf({
      title: "Low Stock Report",
      fileName:
        "barmaster-low-stock-report.pdf",
      columns: [
        "Drink",
        "Brand",
        "Size",
        "Location",
        "Location Type",
        "Current",
        "Minimum",
        "Shortage",
        "Status",
        "Last Updated",
      ],
      rows: filteredRows.map(
        (item) => [
          item.drinkName,
          item.drinkBrand || "—",
          item.bottleSize || "—",
          item.locationName,
          formatLocationType(
            item.locationType
          ),
          item.quantity,
          item.minimumQuantity,
          item.shortage,
          item.stockStatus,
          item.updatedAt
            ? new Date(
                item.updatedAt
              ).toLocaleString()
            : "—",
        ]
      ),
      summary: [
        {
          label: "Low-Stock Items",
          value:
            lowStockCount.toLocaleString(),
        },
        {
          label: "Out of Stock",
          value:
            outOfStockCount.toLocaleString(),
        },
        {
          label: "Total Shortage",
          value:
            totalShortage.toLocaleString(),
        },
        {
          label:
            "Affected Locations",
          value:
            affectedLocations.toLocaleString(),
        },
      ],
    });
  };

  const columns: GridColDef<LowStockRow>[] =
    [
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
        field: "locationName",
        headerName: "Location",
        minWidth: 180,
        flex: 1,
      },
      {
        field: "locationType",
        headerName:
          "Location Type",
        minWidth: 150,
        flex: 0.8,
        valueFormatter: (value) =>
          formatLocationType(
            String(value ?? "")
          ),
      },
      {
        field: "quantity",
        headerName: "Current",
        width: 110,
      },
      {
        field: "minimumQuantity",
        headerName: "Minimum",
        width: 110,
      },
      {
        field: "shortage",
        headerName: "Shortage",
        width: 110,
      },
      {
        field: "stockStatus",
        headerName: "Status",
        width: 140,
        renderCell: (params) => (
          <Chip
            size="small"
            label={
              params.row.stockStatus
            }
            color={
              params.row.stockStatus ===
              "Out of Stock"
                ? "error"
                : "warning"
            }
          />
        ),
      },
      {
        field: "updatedAt",
        headerName: "Last Updated",
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
            Low-Stock Items
          </Typography>

          <Typography variant="h5">
            {lowStockCount}
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
            Out of Stock
          </Typography>

          <Typography variant="h5">
            {outOfStockCount}
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
            Total Shortage
          </Typography>

          <Typography variant="h5">
            {totalShortage.toLocaleString()}
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
            Affected Locations
          </Typography>

          <Typography variant="h5">
            {affectedLocations}
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

          {locations.map(
            (location) => (
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
            )
          )}
        </TextField>

        <TextField
          select
          label="Stock Status"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
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
          <MenuItem value="">
            All statuses
          </MenuItem>

          <MenuItem value="Low Stock">
            Low Stock
          </MenuItem>

          <MenuItem value="Out of Stock">
            Out of Stock
          </MenuItem>
        </TextField>
      </Box>

      <DataGrid
        rows={filteredRows}
        columns={columns}
        getRowId={(row) =>
          row.id ??
          `${row.drinkId}-${row.locationId}`
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

export default LowStockReport;
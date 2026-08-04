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
import { getInventory } from "../../services/inventoryService";
import { getLocations } from "../../services/locationService";
import type { Drink } from "../../types/drink";
import type { Inventory } from "../../types/inventory";
import type { Location } from "../../types/location";
import { exportReportToPdf } from "../../utils/exportReportToPdf";

type InventoryReportRow = Inventory & {
  drinkName: string;
  drinkBrand: string;
  bottleSize: string;
  locationName: string;
  locationType: string;
  stockValue: number;
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

function InventoryReport() {
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
    locationTypeFilter,
    setLocationTypeFilter,
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
          "Could not load inventory report:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, []);

  const rows =
    useMemo<InventoryReportRow[]>(() => {
      return inventory.map((item) => {
        const drink = drinks.find(
          (drinkItem) =>
            drinkItem.id === item.drinkId
        );

        const location =
          locations.find(
            (locationItem) =>
              locationItem.id ===
              item.locationId
          );

        const stockValue =
          item.quantity *
          (drink?.buyingPrice ?? 0);

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
          stockValue,
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

      const matchesLocationType =
        !locationTypeFilter ||
        row.locationType ===
          locationTypeFilter;

      return (
        matchesLocation &&
        matchesLocationType
      );
    });
  }, [
    rows,
    locationFilter,
    locationTypeFilter,
  ]);

  const totalQuantity =
    filteredRows.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  const warehouseQuantity =
    filteredRows
      .filter(
        (item) =>
          item.locationType ===
          "Warehouse"
      )
      .reduce(
        (total, item) =>
          total + item.quantity,
        0
      );

  const salesAreaQuantity =
    filteredRows
      .filter(
        (item) =>
          item.locationType ===
          "SalesArea"
      )
      .reduce(
        (total, item) =>
          total + item.quantity,
        0
      );

  const inventoryValue =
    filteredRows.reduce(
      (total, item) =>
        total + item.stockValue,
      0
    );

  const handleDownloadPdf = () => {
    exportReportToPdf({
      title: "Inventory Report",
      fileName:
        "barmaster-inventory-report.pdf",
      columns: [
        "Drink",
        "Brand",
        "Size",
        "Location",
        "Location Type",
        "Quantity",
        "Minimum",
        "Stock Value",
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
          `${item.stockValue.toLocaleString()} FCFA`,
          item.updatedAt
            ? new Date(
                item.updatedAt
              ).toLocaleString()
            : "—",
        ]
      ),
      summary: [
        {
          label: "Total Bottles",
          value:
            totalQuantity.toLocaleString(),
        },
        {
          label: "Warehouse Stock",
          value:
            warehouseQuantity.toLocaleString(),
        },
        {
          label: "Bar Stock",
          value:
            salesAreaQuantity.toLocaleString(),
        },
        {
          label: "Inventory Value",
          value: `${inventoryValue.toLocaleString()} FCFA`,
        },
      ],
    });
  };

  const columns: GridColDef<InventoryReportRow>[] =
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
        headerName: "Location Type",
        minWidth: 150,
        flex: 0.8,
        valueFormatter: (value) =>
          formatLocationType(
            String(value ?? "")
          ),
      },
      {
        field: "quantity",
        headerName: "Quantity",
        width: 120,
      },
      {
        field: "minimumQuantity",
        headerName: "Minimum",
        width: 120,
      },
      {
        field: "stockValue",
        headerName: "Stock Value",
        minWidth: 160,
        valueFormatter: (value) =>
          `${Number(
            value ?? 0
          ).toLocaleString()} FCFA`,
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
            Total Bottles
          </Typography>

          <Typography variant="h5">
            {totalQuantity.toLocaleString()}
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
            Warehouse Stock
          </Typography>

          <Typography variant="h5">
            {warehouseQuantity.toLocaleString()}
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
            Bar Stock
          </Typography>

          <Typography variant="h5">
            {salesAreaQuantity.toLocaleString()}
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
            Inventory Value
          </Typography>

          <Typography variant="h5">
            {inventoryValue.toLocaleString()}{" "}
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
          label="Location Type"
          value={locationTypeFilter}
          onChange={(event) =>
            setLocationTypeFilter(
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
            All location types
          </MenuItem>

          <MenuItem value="Warehouse">
            Warehouse
          </MenuItem>

          <MenuItem value="SalesArea">
            Sales Area
          </MenuItem>

          <MenuItem value="DamagedStock">
            Damaged Stock
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

export default InventoryReport;
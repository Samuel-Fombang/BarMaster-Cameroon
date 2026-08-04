import {
  AddOutlined,
  ClearOutlined,
  DeleteOutlined,
  EditOutlined,
  LocationOnOutlined,
  SearchOutlined,
  StorefrontOutlined,
  WarehouseOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  type GridColDef,
} from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";

import DeleteLocationDialog from "../components/locations/DeleteLocationDialog";
import LocationDialog from "../components/locations/LocationDialog";

import {
  createLocation,
  deleteLocation,
  getLocations,
  updateLocation,
} from "../services/locationService";

import type { Location } from "../types/location";

type StatusFilter =
  | "all"
  | "active"
  | "inactive";

type LocationTypeFilter =
  | "all"
  | "Warehouse"
  | "SalesArea"
  | "DamagedStock";

function Locations() {
  const [locations, setLocations] =
    useState<Location[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [typeFilter, setTypeFilter] =
    useState<LocationTypeFilter>("all");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [
    selectedLocation,
    setSelectedLocation,
  ] = useState<Location | null>(null);

  const [
    deleteDialogOpen,
    setDeleteDialogOpen,
  ] = useState(false);

  const [
    locationToDelete,
    setLocationToDelete,
  ] = useState<Location | null>(null);

  const [deleting, setDeleting] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState<"success" | "error">(
      "success"
    );

  const loadLocations = async () => {
    setLoading(true);

    try {
      const data = await getLocations();

      setLocations(data);
    } catch (error) {
      console.error(
        "Could not load locations:",
        error
      );

      setMessageType("error");

      setMessage(
        "Could not load locations. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadLocations();
  }, []);

  const formatLocationType = (
    value?: string
  ) => {
    if (value === "SalesArea") {
      return "Sales Area";
    }

    if (value === "DamagedStock") {
      return "Damaged Stock";
    }

    if (value === "Warehouse") {
      return "Warehouse";
    }

    return value || "—";
  };

  const filteredLocations =
    useMemo(() => {
      const searchText =
        search.trim().toLowerCase();

      return locations.filter(
        (location) => {
          const matchesSearch =
            !searchText ||
            [
              location.name,
              location.type,
              location.address,
              location.description,
            ].some((value) =>
              (value ?? "")
                .toLowerCase()
                .includes(searchText)
            );

          const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" &&
              location.isActive) ||
            (statusFilter === "inactive" &&
              !location.isActive);

          const matchesType =
            typeFilter === "all" ||
            location.type === typeFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesType
          );
        }
      );
    }, [
      locations,
      search,
      statusFilter,
      typeFilter,
    ]);

  const activeLocationCount =
    locations.filter(
      (location) => location.isActive
    ).length;

  const inactiveLocationCount =
    locations.length -
    activeLocationCount;

  const warehouseCount =
    locations.filter(
      (location) =>
        location.type === "Warehouse"
    ).length;

  const salesAreaCount =
    locations.filter(
      (location) =>
        location.type === "SalesArea"
    ).length;

  const damagedStockCount =
    locations.filter(
      (location) =>
        location.type === "DamagedStock"
    ).length;

  const handleOpenAdd = () => {
    setSelectedLocation(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (
    location: Location
  ) => {
    setSelectedLocation(location);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedLocation(null);
  };

  const handleSave = async (
    location: Location
  ) => {
    try {
      if (selectedLocation?.id) {
        await updateLocation(
          selectedLocation.id,
          location
        );

        setMessage(
          "Location updated successfully."
        );
      } else {
        await createLocation(location);

        setMessage(
          "Location added successfully."
        );
      }

      setMessageType("success");

      await loadLocations();
    } catch (error) {
      console.error(
        "Could not save location:",
        error
      );

      setMessageType("error");

      setMessage(
        "Could not save the location."
      );

      throw error;
    }
  };

  const handleOpenDelete = (
    location: Location
  ) => {
    setLocationToDelete(location);
    setDeleteDialogOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false);
    setLocationToDelete(null);
  };

  const handleDelete = async () => {
    if (!locationToDelete?.id) {
      return;
    }

    setDeleting(true);

    try {
      await deleteLocation(
        locationToDelete.id
      );

      setMessageType("success");

      setMessage(
        "Location deleted successfully."
      );

      handleCloseDelete();

      await loadLocations();
    } catch (error) {
      console.error(
        "Could not delete location:",
        error
      );

      setMessageType("error");

      setMessage(
        "Could not delete the location."
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  const hasActiveFilters =
    Boolean(search) ||
    statusFilter !== "all" ||
    typeFilter !== "all";

  const columns: GridColDef<Location>[] =
    [
      {
        field: "name",
        headerName: "Location",
        flex: 1.2,
        minWidth: 190,
      },
      {
        field: "type",
        headerName: "Type",
        width: 160,
        valueFormatter: (value) =>
          formatLocationType(
            String(value ?? "")
          ),
      },
      {
        field: "address",
        headerName: "Address",
        flex: 1,
        minWidth: 200,
        valueGetter: (_value, row) =>
          row.address || "—",
      },
      {
        field: "description",
        headerName: "Description",
        flex: 1.5,
        minWidth: 260,
        valueGetter: (_value, row) =>
          row.description || "—",
      },
      {
        field: "isActive",
        headerName: "Status",
        width: 130,
        renderCell: (params) => (
          <Chip
            size="small"
            label={
              params.row.isActive
                ? "Active"
                : "Inactive"
            }
            color={
              params.row.isActive
                ? "success"
                : "default"
            }
            variant="outlined"
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
              startIcon={
                <EditOutlined />
              }
              onClick={() =>
                handleOpenEdit(
                  params.row
                )
              }
            >
              Edit
            </Button>

            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={
                <DeleteOutlined />
              }
              onClick={() =>
                handleOpenDelete(
                  params.row
                )
              }
            >
              Delete
            </Button>
          </Box>
        ),
      },
    ];

  return (
    <Box>
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "stretch",
          sm: "center",
        }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4">
            Locations
          </Typography>

          <Typography color="text.secondary">
            Manage warehouses, sales areas,
            and damaged-stock locations.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddOutlined />}
          onClick={handleOpenAdd}
        >
          Add Location
        </Button>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Card>
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography color="text.secondary">
                  Total Locations
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                >
                  {locations.length}
                </Typography>
              </Box>

              <LocationOnOutlined
                fontSize="large"
              />
            </Stack>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              {activeLocationCount} active,{" "}
              {inactiveLocationCount} inactive
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography color="text.secondary">
                  Warehouses
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                >
                  {warehouseCount}
                </Typography>
              </Box>

              <WarehouseOutlined
                fontSize="large"
              />
            </Stack>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Main stock-storage areas
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography color="text.secondary">
                  Sales Areas
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                >
                  {salesAreaCount}
                </Typography>
              </Box>

              <StorefrontOutlined
                fontSize="large"
              />
            </Stack>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Active serving and sales points
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography color="text.secondary">
                  Damaged Stock Areas
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                >
                  {damagedStockCount}
                </Typography>
              </Box>

              <WarningAmberOutlined
                fontSize="large"
              />
            </Stack>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Separated damaged products
            </Typography>
          </CardContent>
        </Card>
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
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "2fr 1fr 1fr",
            },
            gap: 1.5,
            mb: 2,
          }}
        >
          <TextField
            placeholder="Search locations..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
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
            label="Location Type"
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(
                event.target
                  .value as LocationTypeFilter
              )
            }
          >
            <MenuItem value="all">
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

          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target
                  .value as StatusFilter
              )
            }
          >
            <MenuItem value="all">
              All statuses
            </MenuItem>

            <MenuItem value="active">
              Active
            </MenuItem>

            <MenuItem value="inactive">
              Inactive
            </MenuItem>
          </TextField>
        </Box>

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "stretch",
            sm: "center",
          }}
          spacing={1}
          sx={{ mb: 2 }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Showing{" "}
            {filteredLocations.length} of{" "}
            {locations.length} locations
          </Typography>

          {hasActiveFilters && (
            <Button
              size="small"
              startIcon={
                <ClearOutlined />
              }
              onClick={
                handleClearFilters
              }
            >
              Clear Filters
            </Button>
          )}
        </Stack>

        <DataGrid
          rows={filteredLocations}
          columns={columns}
          loading={loading}
          getRowId={(row) =>
            row.id ?? row.name
          }
          disableRowSelectionOnClick
          pageSizeOptions={[
            5,
            10,
            20,
            50,
          ]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
                page: 0,
              },
            },
          }}
          slots={{
            noRowsOverlay: () => (
              <Box
                sx={{
                  minHeight: 300,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Stack
                  alignItems="center"
                  spacing={1}
                >
                  <LocationOnOutlined
                    color="disabled"
                    fontSize="large"
                  />

                  <Typography
                    fontWeight={700}
                  >
                    No locations found
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Add a location or change
                    your filters.
                  </Typography>
                </Stack>
              </Box>
            ),
          }}
          sx={{
            minHeight: 540,
            border: 0,
            "& .MuiDataGrid-columnHeaders":
              {
                bgcolor: "#f8fafc",
              },
          }}
        />
      </Box>

      <LocationDialog
        open={dialogOpen}
        location={selectedLocation}
        onClose={handleCloseDialog}
        onSave={handleSave}
      />

      <DeleteLocationDialog
        open={deleteDialogOpen}
        location={locationToDelete}
        deleting={deleting}
        onClose={handleCloseDelete}
        onConfirm={handleDelete}
      />

      <Snackbar
        open={Boolean(message)}
        autoHideDuration={4000}
        onClose={() =>
          setMessage("")
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={messageType}
          variant="filled"
          onClose={() =>
            setMessage("")
          }
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Locations;
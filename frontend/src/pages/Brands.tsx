import {
  AddOutlined,
  ClearOutlined,
  DeleteOutlined,
  EditOutlined,
  LocalOfferOutlined,
  SearchOutlined,
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

import BrandDialog from "../components/brands/BrandDialog";
import DeleteBrandDialog from "../components/brands/DeleteBrandDialog";

import {
  createBrand,
  deleteBrand,
  getBrands,
  updateBrand,
} from "../services/brandService";

import type { Brand } from "../types/brand";

type StatusFilter =
  | "all"
  | "active"
  | "inactive";

function Brands() {
  const [brands, setBrands] =
    useState<Brand[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [
    selectedBrand,
    setSelectedBrand,
  ] = useState<Brand | null>(null);

  const [
    deleteDialogOpen,
    setDeleteDialogOpen,
  ] = useState(false);

  const [
    brandToDelete,
    setBrandToDelete,
  ] = useState<Brand | null>(null);

  const [deleting, setDeleting] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState<"success" | "error">(
      "success"
    );

  const loadBrands = async () => {
    setLoading(true);

    try {
      const data = await getBrands();
      setBrands(data);
    } catch (error) {
      console.error(
        "Could not load brands:",
        error
      );

      setMessageType("error");

      setMessage(
        "Could not load brands. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBrands();
  }, []);

  const filteredBrands =
    useMemo(() => {
      const searchText =
        search.trim().toLowerCase();

      return brands.filter((brand) => {
        const matchesSearch =
          !searchText ||
          [
            brand.name,
            brand.description,
          ].some((value) =>
            (value ?? "")
              .toLowerCase()
              .includes(searchText)
          );

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" &&
            brand.isActive) ||
          (statusFilter === "inactive" &&
            !brand.isActive);

        return (
          matchesSearch &&
          matchesStatus
        );
      });
    }, [
      brands,
      search,
      statusFilter,
    ]);

  const activeBrandCount =
    brands.filter(
      (brand) => brand.isActive
    ).length;

  const inactiveBrandCount =
    brands.length - activeBrandCount;

  const brandsWithDescription =
    brands.filter((brand) =>
      Boolean(
        brand.description?.trim()
      )
    ).length;

  const handleOpenAdd = () => {
    setSelectedBrand(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (
    brand: Brand
  ) => {
    setSelectedBrand(brand);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedBrand(null);
  };

  const handleSave = async (
    brand: Brand
  ) => {
    try {
      if (selectedBrand?.id) {
        await updateBrand(
          selectedBrand.id,
          brand
        );

        setMessage(
          "Brand updated successfully."
        );
      } else {
        await createBrand(brand);

        setMessage(
          "Brand added successfully."
        );
      }

      setMessageType("success");

      await loadBrands();
    } catch (error) {
      console.error(
        "Could not save brand:",
        error
      );

      setMessageType("error");
      setMessage(
        "Could not save the brand."
      );

      throw error;
    }
  };

  const handleOpenDelete = (
    brand: Brand
  ) => {
    setBrandToDelete(brand);
    setDeleteDialogOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false);
    setBrandToDelete(null);
  };

  const handleDelete = async () => {
    if (!brandToDelete?.id) {
      return;
    }

    setDeleting(true);

    try {
      await deleteBrand(
        brandToDelete.id
      );

      setMessageType("success");

      setMessage(
        "Brand deleted successfully."
      );

      handleCloseDelete();

      await loadBrands();
    } catch (error) {
      console.error(
        "Could not delete brand:",
        error
      );

      setMessageType("error");

      setMessage(
        "Could not delete the brand."
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };

  const hasActiveFilters =
    Boolean(search) ||
    statusFilter !== "all";

  const columns: GridColDef<Brand>[] =
    [
      {
        field: "name",
        headerName: "Brand",
        flex: 1,
        minWidth: 190,
      },
      {
        field: "description",
        headerName: "Description",
        flex: 1.8,
        minWidth: 300,
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
        field: "createdAt",
        headerName: "Created",
        minWidth: 170,
        flex: 0.8,
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
            Brands
          </Typography>

          <Typography color="text.secondary">
            Create and manage drink brands.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddOutlined />}
          onClick={handleOpenAdd}
        >
          Add Brand
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
                  Total Brands
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                >
                  {brands.length}
                </Typography>
              </Box>

              <LocalOfferOutlined
                fontSize="large"
              />
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography color="text.secondary">
              Active Brands
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
            >
              {activeBrandCount}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Available for use
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography color="text.secondary">
              Inactive Brands
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
            >
              {inactiveBrandCount}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Currently disabled
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography color="text.secondary">
              With Description
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
            >
              {
                brandsWithDescription
              }
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Properly documented
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
              sm: "2fr 1fr",
            },
            gap: 1.5,
            mb: 2,
          }}
        >
          <TextField
            placeholder="Search brands..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
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
            {filteredBrands.length} of{" "}
            {brands.length} brands
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
          rows={filteredBrands}
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
                  <LocalOfferOutlined
                    color="disabled"
                    fontSize="large"
                  />

                  <Typography
                    fontWeight={700}
                  >
                    No brands found
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Add a brand or change
                    your filters.
                  </Typography>
                </Stack>
              </Box>
            ),
          }}
          sx={{
            minHeight: 520,
            border: 0,
            "& .MuiDataGrid-columnHeaders":
              {
                bgcolor: "#f8fafc",
              },
          }}
        />
      </Box>

      <BrandDialog
        open={dialogOpen}
        brand={selectedBrand}
        onClose={handleCloseDialog}
        onSave={handleSave}
      />

      <DeleteBrandDialog
        open={deleteDialogOpen}
        brand={brandToDelete}
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

export default Brands;
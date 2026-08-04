import {
  AddOutlined,
  BusinessOutlined,
  ClearOutlined,
  DeleteOutlined,
  EditOutlined,
  EmailOutlined,
  PhoneOutlined,
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

import DeleteSupplierDialog from "../components/suppliers/DeleteSupplierDialog";
import SupplierDialog from "../components/suppliers/SupplierDialog";

import {
  createSupplier,
  deleteSupplier,
  getSuppliers,
  updateSupplier,
} from "../services/supplierService";

import type { Supplier } from "../types/supplier";

type StatusFilter =
  | "all"
  | "active"
  | "inactive";

type ContactFilter =
  | "all"
  | "email"
  | "phone"
  | "complete";

function Suppliers() {
  const [suppliers, setSuppliers] =
    useState<Supplier[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [contactFilter, setContactFilter] =
    useState<ContactFilter>("all");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [
    selectedSupplier,
    setSelectedSupplier,
  ] = useState<Supplier | null>(null);

  const [
    deleteDialogOpen,
    setDeleteDialogOpen,
  ] = useState(false);

  const [
    supplierToDelete,
    setSupplierToDelete,
  ] = useState<Supplier | null>(null);

  const [deleting, setDeleting] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState<"success" | "error">(
      "success"
    );

  const loadSuppliers = async () => {
    setLoading(true);

    try {
      const data = await getSuppliers();

      setSuppliers(data);
    } catch (error) {
      console.error(
        "Could not load suppliers:",
        error
      );

      setMessageType("error");

      setMessage(
        "Could not load suppliers. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSuppliers();
  }, []);

  const filteredSuppliers =
    useMemo(() => {
      const searchText =
        search.trim().toLowerCase();

      return suppliers.filter(
        (supplier) => {
          const matchesSearch =
            !searchText ||
            [
              supplier.name,
              supplier.contactPerson,
              supplier.phone,
              supplier.email,
              supplier.address,
            ].some((value) =>
              (value ?? "")
                .toLowerCase()
                .includes(searchText)
            );

          const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" &&
              supplier.isActive) ||
            (statusFilter === "inactive" &&
              !supplier.isActive);

          const hasEmail =
            Boolean(supplier.email?.trim());

          const hasPhone =
            Boolean(supplier.phone?.trim());

          const matchesContact =
            contactFilter === "all" ||
            (contactFilter === "email" &&
              hasEmail) ||
            (contactFilter === "phone" &&
              hasPhone) ||
            (contactFilter === "complete" &&
              hasEmail &&
              hasPhone);

          return (
            matchesSearch &&
            matchesStatus &&
            matchesContact
          );
        }
      );
    }, [
      suppliers,
      search,
      statusFilter,
      contactFilter,
    ]);

  const activeSupplierCount =
    suppliers.filter(
      (supplier) => supplier.isActive
    ).length;

  const inactiveSupplierCount =
    suppliers.length -
    activeSupplierCount;

  const suppliersWithEmail =
    suppliers.filter((supplier) =>
      Boolean(supplier.email?.trim())
    ).length;

  const suppliersWithPhone =
    suppliers.filter((supplier) =>
      Boolean(supplier.phone?.trim())
    ).length;

  const handleOpenAdd = () => {
    setSelectedSupplier(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (
    supplier: Supplier
  ) => {
    setSelectedSupplier(supplier);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSupplier(null);
  };

  const handleSave = async (
    supplier: Supplier
  ) => {
    try {
      if (selectedSupplier?.id) {
        await updateSupplier(
          selectedSupplier.id,
          supplier
        );

        setMessage(
          "Supplier updated successfully."
        );
      } else {
        await createSupplier(supplier);

        setMessage(
          "Supplier added successfully."
        );
      }

      setMessageType("success");

      await loadSuppliers();
    } catch (error) {
      console.error(
        "Could not save supplier:",
        error
      );

      setMessageType("error");

      setMessage(
        "Could not save the supplier."
      );

      throw error;
    }
  };

  const handleOpenDelete = (
    supplier: Supplier
  ) => {
    setSupplierToDelete(supplier);
    setDeleteDialogOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false);
    setSupplierToDelete(null);
  };

  const handleDelete = async () => {
    if (!supplierToDelete?.id) {
      return;
    }

    setDeleting(true);

    try {
      await deleteSupplier(
        supplierToDelete.id
      );

      setMessageType("success");

      setMessage(
        "Supplier deleted successfully."
      );

      handleCloseDelete();

      await loadSuppliers();
    } catch (error) {
      console.error(
        "Could not delete supplier:",
        error
      );

      setMessageType("error");

      setMessage(
        "Could not delete the supplier."
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setContactFilter("all");
  };

  const hasActiveFilters =
    Boolean(search) ||
    statusFilter !== "all" ||
    contactFilter !== "all";

  const columns: GridColDef<Supplier>[] =
    [
      {
        field: "name",
        headerName: "Supplier",
        flex: 1.2,
        minWidth: 210,
      },
      {
        field: "contactPerson",
        headerName: "Contact Person",
        flex: 1,
        minWidth: 170,
        valueGetter: (_value, row) =>
          row.contactPerson || "—",
      },
      {
        field: "phone",
        headerName: "Phone",
        width: 165,
        valueGetter: (_value, row) =>
          row.phone || "—",
      },
      {
        field: "email",
        headerName: "Email",
        flex: 1.2,
        minWidth: 220,
        valueGetter: (_value, row) =>
          row.email || "—",
      },
      {
        field: "address",
        headerName: "Address",
        flex: 1,
        minWidth: 210,
        valueGetter: (_value, row) =>
          row.address || "—",
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
            Suppliers
          </Typography>

          <Typography color="text.secondary">
            Create and manage drink
            suppliers.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddOutlined />}
          onClick={handleOpenAdd}
        >
          Add Supplier
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
                  Total Suppliers
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                >
                  {suppliers.length}
                </Typography>
              </Box>

              <BusinessOutlined
                fontSize="large"
              />
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography color="text.secondary">
              Active Suppliers
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
            >
              {activeSupplierCount}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              {inactiveSupplierCount} inactive
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
                  With Email
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                >
                  {suppliersWithEmail}
                </Typography>
              </Box>

              <EmailOutlined
                fontSize="large"
              />
            </Stack>
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
                  With Phone
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                >
                  {suppliersWithPhone}
                </Typography>
              </Box>

              <PhoneOutlined
                fontSize="large"
              />
            </Stack>
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
            placeholder="Search suppliers..."
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

          <TextField
            select
            label="Contact Details"
            value={contactFilter}
            onChange={(event) =>
              setContactFilter(
                event.target
                  .value as ContactFilter
              )
            }
          >
            <MenuItem value="all">
              All suppliers
            </MenuItem>

            <MenuItem value="email">
              Has email
            </MenuItem>

            <MenuItem value="phone">
              Has phone
            </MenuItem>

            <MenuItem value="complete">
              Email and phone
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
            {filteredSuppliers.length} of{" "}
            {suppliers.length} suppliers
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
          rows={filteredSuppliers}
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
                  <BusinessOutlined
                    color="disabled"
                    fontSize="large"
                  />

                  <Typography
                    fontWeight={700}
                  >
                    No suppliers found
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Add a supplier or change
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

      <SupplierDialog
        open={dialogOpen}
        supplier={selectedSupplier}
        onClose={handleCloseDialog}
        onSave={handleSave}
      />

      <DeleteSupplierDialog
        open={deleteDialogOpen}
        supplier={supplierToDelete}
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

export default Suppliers;
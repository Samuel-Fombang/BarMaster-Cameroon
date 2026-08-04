import {
  AddOutlined,
  CategoryOutlined,
  ClearOutlined,
  DeleteOutlined,
  EditOutlined,
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

import CategoryDialog from "../components/categories/CategoryDialog";
import DeleteCategoryDialog from "../components/categories/DeleteCategoryDialog";

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../services/categoryService";

import type { Category } from "../types/category";

type StatusFilter =
  | "all"
  | "active"
  | "inactive";

function Categories() {
  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState<Category | null>(null);

  const [
    deleteDialogOpen,
    setDeleteDialogOpen,
  ] = useState(false);

  const [
    categoryToDelete,
    setCategoryToDelete,
  ] = useState<Category | null>(null);

  const [deleting, setDeleting] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState<"success" | "error">(
      "success"
    );

  const loadCategories = async () => {
    setLoading(true);

    try {
      const data = await getCategories();

      setCategories(data);
    } catch (error) {
      console.error(
        "Could not load categories:",
        error
      );

      setMessageType("error");

      setMessage(
        "Could not load categories. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCategories();
  }, []);

  const filteredCategories =
    useMemo(() => {
      const searchText =
        search.trim().toLowerCase();

      return categories.filter(
        (category) => {
          const matchesSearch =
            !searchText ||
            [
              category.name,
              category.description,
            ].some((value) =>
              (value ?? "")
                .toLowerCase()
                .includes(searchText)
            );

          const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" &&
              category.isActive) ||
            (statusFilter === "inactive" &&
              !category.isActive);

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      categories,
      search,
      statusFilter,
    ]);

  const activeCategoryCount =
    categories.filter(
      (category) => category.isActive
    ).length;

  const inactiveCategoryCount =
    categories.length -
    activeCategoryCount;

  const categoriesWithDescription =
    categories.filter(
      (category) =>
        Boolean(
          category.description?.trim()
        )
    ).length;

  const handleOpenAdd = () => {
    setSelectedCategory(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (
    category: Category
  ) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleSave = async (
    category: Category
  ) => {
    try {
      if (selectedCategory?.id) {
        await updateCategory(
          selectedCategory.id,
          category
        );

        setMessage(
          "Category updated successfully."
        );
      } else {
        await createCategory(category);

        setMessage(
          "Category added successfully."
        );
      }

      setMessageType("success");

      await loadCategories();
    } catch (error) {
      console.error(
        "Could not save category:",
        error
      );

      setMessageType("error");

      setMessage(
        "Could not save the category."
      );

      throw error;
    }
  };

  const handleOpenDelete = (
    category: Category
  ) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleDelete = async () => {
    if (!categoryToDelete?.id) {
      return;
    }

    setDeleting(true);

    try {
      await deleteCategory(
        categoryToDelete.id
      );

      setMessageType("success");

      setMessage(
        "Category deleted successfully."
      );

      handleCloseDelete();

      await loadCategories();
    } catch (error) {
      console.error(
        "Could not delete category:",
        error
      );

      setMessageType("error");

      setMessage(
        "Could not delete the category."
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

  const columns: GridColDef<Category>[] =
    [
      {
        field: "name",
        headerName: "Category",
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
            Categories
          </Typography>

          <Typography color="text.secondary">
            Create and manage drink
            categories.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddOutlined />}
          onClick={handleOpenAdd}
        >
          Add Category
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
                  Total Categories
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                >
                  {categories.length}
                </Typography>
              </Box>

              <CategoryOutlined
                fontSize="large"
              />
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography color="text.secondary">
              Active Categories
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
            >
              {activeCategoryCount}
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
              Inactive Categories
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
            >
              {inactiveCategoryCount}
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
                categoriesWithDescription
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
            placeholder="Search categories..."
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
            {filteredCategories.length} of{" "}
            {categories.length} categories
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
          rows={filteredCategories}
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
                  <CategoryOutlined
                    color="disabled"
                    fontSize="large"
                  />

                  <Typography
                    fontWeight={700}
                  >
                    No categories found
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Add a category or change
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

      <CategoryDialog
        open={dialogOpen}
        category={selectedCategory}
        onClose={handleCloseDialog}
        onSave={handleSave}
      />

      <DeleteCategoryDialog
        open={deleteDialogOpen}
        category={categoryToDelete}
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

export default Categories;
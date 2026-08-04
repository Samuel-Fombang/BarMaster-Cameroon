import {
  AddOutlined,
  ClearOutlined,
  DeleteOutlined,
  EditOutlined,
  LocalBarOutlined,
  SearchOutlined,
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
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import DeleteDrinkDialog from "../components/drinks/DeleteDrinkDialog";
import DrinkDialog from "../components/drinks/DrinkDialog";

import {
  createDrink,
  deleteDrink,
  getDrinks,
  updateDrink,
} from "../services/drinkService";
import { getBrands } from "../services/brandService";
import { getCategories } from "../services/categoryService";
import { getSuppliers } from "../services/supplierService";

import type { Brand } from "../types/brand";
import type { Category } from "../types/category";
import type { Drink } from "../types/drink";
import type { Supplier } from "../types/supplier";

type ActiveFilter =
  | "all"
  | "active"
  | "inactive";

type StockFilter =
  | "all"
  | "available"
  | "low"
  | "out";

function Drinks() {
  const [drinks, setDrinks] =
    useState<Drink[]>([]);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [brands, setBrands] =
    useState<Brand[]>([]);

  const [suppliers, setSuppliers] =
    useState<Supplier[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState("");

  const [
    brandFilter,
    setBrandFilter,
  ] = useState("");

  const [
    supplierFilter,
    setSupplierFilter,
  ] = useState("");

  const [
    activeFilter,
    setActiveFilter,
  ] = useState<ActiveFilter>("all");

  const [
    stockFilter,
    setStockFilter,
  ] = useState<StockFilter>("all");

  const [
    drinkDialogOpen,
    setDrinkDialogOpen,
  ] = useState(false);

  const [
    selectedDrink,
    setSelectedDrink,
  ] = useState<Drink | null>(null);

  const [
    deleteDialogOpen,
    setDeleteDialogOpen,
  ] = useState(false);

  const [
    drinkToDelete,
    setDrinkToDelete,
  ] = useState<Drink | null>(null);

  const [deleting, setDeleting] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [
    messageType,
    setMessageType,
  ] = useState<
    "success" | "error"
  >("success");

  const loadData = async () => {
    setLoading(true);

    try {
      const [
        drinkData,
        categoryData,
        brandData,
        supplierData,
      ] = await Promise.all([
        getDrinks(),
        getCategories(),
        getBrands(),
        getSuppliers(),
      ]);

      setDrinks(drinkData);
      setCategories(categoryData);
      setBrands(brandData);
      setSuppliers(supplierData);
    } catch (error) {
      console.error(
        "Could not load drinks:",
        error
      );

      setMessageType("error");

      setMessage(
        "Could not load drinks. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const activeCategories =
    useMemo(() => {
      return categories
        .filter(
          (category) =>
            category.isActive
        )
        .sort((first, second) =>
          first.name.localeCompare(
            second.name
          )
        );
    }, [categories]);

  const activeBrands =
    useMemo(() => {
      return brands
        .filter(
          (brand) =>
            brand.isActive
        )
        .sort((first, second) =>
          first.name.localeCompare(
            second.name
          )
        );
    }, [brands]);

  const activeSuppliers =
    useMemo(() => {
      return suppliers
        .filter(
          (supplier) =>
            supplier.isActive
        )
        .sort((first, second) =>
          first.name.localeCompare(
            second.name
          )
        );
    }, [suppliers]);

  const filteredDrinks =
    useMemo(() => {
      const searchText =
        search
          .trim()
          .toLowerCase();

      return drinks
        .filter((drink) => {
          const searchableValues = [
            drink.name,
            drink.category,
            drink.brand,
            drink.bottleSize,
            drink.supplier,
          ];

          const matchesSearch =
            !searchText ||
            searchableValues.some(
              (value) =>
                (value ?? "")
                  .toLowerCase()
                  .includes(
                    searchText
                  )
            );

          const matchesCategory =
            !categoryFilter ||
            drink.category ===
              categoryFilter;

          const matchesBrand =
            !brandFilter ||
            drink.brand ===
              brandFilter;

          const matchesSupplier =
            !supplierFilter ||
            drink.supplier ===
              supplierFilter;

          const matchesActiveStatus =
            activeFilter === "all" ||
            (activeFilter ===
              "active" &&
              drink.isActive) ||
            (activeFilter ===
              "inactive" &&
              !drink.isActive);

          const currentStock =
            drink.currentStock ?? 0;

          const minimumStock =
            drink.minimumStock ?? 0;

          const isOutOfStock =
            currentStock === 0;

          const isLowStock =
            currentStock > 0 &&
            currentStock <=
              minimumStock;

          const isAvailable =
            currentStock >
            minimumStock;

          const matchesStock =
            stockFilter === "all" ||
            (stockFilter ===
              "out" &&
              isOutOfStock) ||
            (stockFilter ===
              "low" &&
              isLowStock) ||
            (stockFilter ===
              "available" &&
              isAvailable);

          return (
            matchesSearch &&
            matchesCategory &&
            matchesBrand &&
            matchesSupplier &&
            matchesActiveStatus &&
            matchesStock
          );
        })
        .sort((first, second) =>
          first.name.localeCompare(
            second.name
          )
        );
    }, [
      drinks,
      search,
      categoryFilter,
      brandFilter,
      supplierFilter,
      activeFilter,
      stockFilter,
    ]);

  const activeDrinkCount =
    drinks.filter(
      (drink) => drink.isActive
    ).length;

  const inactiveDrinkCount =
    drinks.length -
    activeDrinkCount;

  const lowStockCount =
    drinks.filter((drink) => {
      const currentStock =
        drink.currentStock ?? 0;

      const minimumStock =
        drink.minimumStock ?? 0;

      return (
        currentStock > 0 &&
        currentStock <=
          minimumStock
      );
    }).length;

  const outOfStockCount =
    drinks.filter(
      (drink) =>
        (drink.currentStock ??
          0) === 0
    ).length;

  const handleOpenAdd = () => {
    setSelectedDrink(null);
    setDrinkDialogOpen(true);
  };

  const handleOpenEdit = (
    drink: Drink
  ) => {
    setSelectedDrink(drink);
    setDrinkDialogOpen(true);
  };

  const handleCloseDrinkDialog =
    () => {
      setDrinkDialogOpen(false);
      setSelectedDrink(null);
    };

  const handleSave = async (
    drink: Drink
  ) => {
    try {
      if (selectedDrink?.id) {
        await updateDrink(
          selectedDrink.id,
          drink
        );

        setMessage(
          "Drink updated successfully."
        );
      } else {
        await createDrink(drink);

        setMessage(
          "Drink added successfully."
        );
      }

      setMessageType("success");

      await loadData();
    } catch (error) {
      console.error(
        "Could not save drink:",
        error
      );

      setMessageType("error");

      setMessage(
        "Could not save the drink."
      );

      throw error;
    }
  };

  const handleOpenDelete = (
    drink: Drink
  ) => {
    setDrinkToDelete(drink);
    setDeleteDialogOpen(true);
  };

  const handleCloseDelete =
    () => {
      setDeleteDialogOpen(false);
      setDrinkToDelete(null);
    };

  const handleDelete =
    async () => {
      if (!drinkToDelete?.id) {
        return;
      }

      setDeleting(true);

      try {
        await deleteDrink(
          drinkToDelete.id
        );

        setMessageType("success");

        setMessage(
          "Drink deleted successfully."
        );

        handleCloseDelete();

        await loadData();
      } catch (error) {
        console.error(
          "Could not delete drink:",
          error
        );

        setMessageType("error");

        setMessage(
          "Could not delete the drink."
        );
      } finally {
        setDeleting(false);
      }
    };

  const handleClearFilters =
    () => {
      setSearch("");
      setCategoryFilter("");
      setBrandFilter("");
      setSupplierFilter("");
      setActiveFilter("all");
      setStockFilter("all");
    };

  const hasActiveFilters =
    Boolean(search) ||
    Boolean(categoryFilter) ||
    Boolean(brandFilter) ||
    Boolean(supplierFilter) ||
    activeFilter !== "all" ||
    stockFilter !== "all";

  const columns: GridColDef<Drink>[] =
    [
      {
        field: "name",
        headerName: "Drink",
        flex: 1.2,
        minWidth: 160,
      },
      {
        field: "category",
        headerName: "Category",
        flex: 1,
        minWidth: 145,
        valueGetter: (
          _value,
          row
        ) =>
          row.category || "—",
      },
      {
        field: "brand",
        headerName: "Brand",
        flex: 1,
        minWidth: 145,
        valueGetter: (
          _value,
          row
        ) =>
          row.brand || "—",
      },
      {
        field: "bottleSize",
        headerName: "Size",
        width: 105,
        valueGetter: (
          _value,
          row
        ) =>
          row.bottleSize || "—",
      },
      {
        field: "supplier",
        headerName: "Supplier",
        flex: 1,
        minWidth: 190,
        valueGetter: (
          _value,
          row
        ) =>
          row.supplier || "—",
      },
      {
        field: "buyingPrice",
        headerName:
          "Buying Price",
        width: 145,
        valueFormatter: (
          value
        ) =>
          `${Number(
            value ?? 0
          ).toLocaleString()} FCFA`,
      },
      {
        field: "sellingPrice",
        headerName:
          "Selling Price",
        width: 145,
        valueFormatter: (
          value
        ) =>
          `${Number(
            value ?? 0
          ).toLocaleString()} FCFA`,
      },
      {
        field: "profit",
        headerName:
          "Profit/Bottle",
        width: 145,
        valueGetter: (
          _value,
          row
        ) =>
          (row.sellingPrice ??
            0) -
          (row.buyingPrice ?? 0),
        renderCell: (params) => {
          const profit =
            Number(
              params.value ?? 0
            );

          return (
            <Typography
              variant="body2"
              fontWeight={700}
              color={
                profit < 0
                  ? "error.main"
                  : profit === 0
                    ? "text.secondary"
                    : "success.main"
              }
            >
              {profit.toLocaleString()}{" "}
              FCFA
            </Typography>
          );
        },
      },
      {
        field: "currentStock",
        headerName: "Stock",
        width: 100,
        renderCell: (params) => {
          const currentStock =
            params.row
              .currentStock ?? 0;

          const minimumStock =
            params.row
              .minimumStock ?? 0;

          let color:
            | "success"
            | "warning"
            | "error" =
            "success";

          if (currentStock === 0) {
            color = "error";
          } else if (
            currentStock <=
            minimumStock
          ) {
            color = "warning";
          }

          return (
            <Chip
              size="small"
              label={currentStock}
              color={color}
              variant="outlined"
            />
          );
        },
      },
      {
        field: "minimumStock",
        headerName: "Minimum",
        width: 105,
        valueGetter: (
          _value,
          row
        ) =>
          row.minimumStock ?? 0,
      },
      {
        field: "stockStatus",
        headerName:
          "Stock Status",
        width: 135,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const currentStock =
            params.row
              .currentStock ?? 0;

          const minimumStock =
            params.row
              .minimumStock ?? 0;

          if (currentStock === 0) {
            return (
              <Chip
                size="small"
                label="Out of Stock"
                color="error"
              />
            );
          }

          if (
            currentStock <=
            minimumStock
          ) {
            return (
              <Chip
                size="small"
                label="Low Stock"
                color="warning"
              />
            );
          }

          return (
            <Chip
              size="small"
              label="Available"
              color="success"
            />
          );
        },
      },
      {
        field: "isActive",
        headerName:
          "Product Status",
        width: 135,
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
              alignItems:
                "center",
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
            Drinks
          </Typography>

          <Typography color="text.secondary">
            Add and manage all
            drinks in your bar.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={
            <AddOutlined />
          }
          onClick={handleOpenAdd}
        >
          Add Drink
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
                  Total Drinks
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                >
                  {drinks.length}
                </Typography>
              </Box>

              <LocalBarOutlined fontSize="large" />
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography color="text.secondary">
              Active Drinks
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
            >
              {activeDrinkCount}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              {inactiveDrinkCount}{" "}
              inactive
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography color="text.secondary">
              Low Stock
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
            >
              {lowStockCount}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Items needing
              attention
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
                  Out of Stock
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                >
                  {outOfStockCount}
                </Typography>
              </Box>

              <WarningAmberOutlined fontSize="large" />
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Box
        sx={{
          bgcolor:
            "background.paper",
          border:
            "1px solid #e5e7eb",
          borderRadius: 3,
          p: 2,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
              lg: "2fr repeat(5, 1fr)",
            },
            gap: 1.5,
            mb: 2,
          }}
        >
          <TextField
            placeholder="Search drinks..."
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
            label="Category"
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(
                event.target.value
              )
            }
          >
            <MenuItem value="">
              All categories
            </MenuItem>

            {activeCategories.map(
              (category) => (
                <MenuItem
                  key={
                    category.id ??
                    category.name
                  }
                  value={
                    category.name
                  }
                >
                  {category.name}
                </MenuItem>
              )
            )}
          </TextField>

          <TextField
            select
            label="Brand"
            value={brandFilter}
            onChange={(event) =>
              setBrandFilter(
                event.target.value
              )
            }
          >
            <MenuItem value="">
              All brands
            </MenuItem>

            {activeBrands.map(
              (brand) => (
                <MenuItem
                  key={
                    brand.id ??
                    brand.name
                  }
                  value={brand.name}
                >
                  {brand.name}
                </MenuItem>
              )
            )}
          </TextField>

          <TextField
            select
            label="Supplier"
            value={supplierFilter}
            onChange={(event) =>
              setSupplierFilter(
                event.target.value
              )
            }
          >
            <MenuItem value="">
              All suppliers
            </MenuItem>

            {activeSuppliers.map(
              (supplier) => (
                <MenuItem
                  key={
                    supplier.id ??
                    supplier.name
                  }
                  value={
                    supplier.name
                  }
                >
                  {supplier.name}
                </MenuItem>
              )
            )}
          </TextField>

          <TextField
            select
            label="Product Status"
            value={activeFilter}
            onChange={(event) =>
              setActiveFilter(
                event.target
                  .value as ActiveFilter
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
            label="Stock Status"
            value={stockFilter}
            onChange={(event) =>
              setStockFilter(
                event.target
                  .value as StockFilter
              )
            }
          >
            <MenuItem value="all">
              All stock
            </MenuItem>

            <MenuItem value="available">
              Available
            </MenuItem>

            <MenuItem value="low">
              Low Stock
            </MenuItem>

            <MenuItem value="out">
              Out of Stock
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
            {filteredDrinks.length}{" "}
            of {drinks.length} drinks
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
          rows={filteredDrinks}
          columns={columns}
          loading={loading}
          getRowId={(row) =>
            row.id ??
            `${row.name}-${row.bottleSize}`
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
            sorting: {
              sortModel: [
                {
                  field: "name",
                  sort: "asc",
                },
              ],
            },
          }}
          slots={{
            noRowsOverlay: () => (
              <Box
                sx={{
                  minHeight: 300,
                  display: "grid",
                  placeItems:
                    "center",
                }}
              >
                <Stack
                  alignItems="center"
                  spacing={1}
                >
                  <LocalBarOutlined
                    color="disabled"
                    fontSize="large"
                  />

                  <Typography fontWeight={700}>
                    No drinks found
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Add a drink or
                    change your
                    filters.
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
                bgcolor:
                  "#f8fafc",
              },
          }}
        />
      </Box>

      <DrinkDialog
        open={drinkDialogOpen}
        drink={selectedDrink}
        onClose={
          handleCloseDrinkDialog
        }
        onSave={handleSave}
      />

      <DeleteDrinkDialog
        open={deleteDialogOpen}
        drink={drinkToDelete}
        deleting={deleting}
        onClose={
          handleCloseDelete
        }
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

export default Drinks;
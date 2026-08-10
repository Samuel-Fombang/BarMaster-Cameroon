import {
  AddOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  Chip,
  InputAdornment,
  MenuItem,
  Snackbar,
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

import DeleteInventoryDialog from "../components/inventory/DeleteInventoryDialog";
import InventoryDialog from "../components/inventory/InventoryDialog";

import {
  getDrinks,
} from "../services/drinkService";

import {
  createInventory,
  deleteInventory,
  getInventory,
  updateInventory,
} from "../services/inventoryService";

import {
  getLocations,
} from "../services/locationService";

import type { Drink } from "../types/drink";

import type {
  Inventory as InventoryType,
} from "../types/inventory";

import type { Location } from "../types/location";

type InventoryRow =
  InventoryType & {
    drinkName: string;

    drinkBrand: string;

    bottleSize: string;

    locationName: string;

    locationType: string;

    calculatedTotalStockValue:
      number;
  };

function Inventory() {
  const [
    inventory,
    setInventory,
  ] =
    useState<
      InventoryType[]
    >([]);

  const [
    drinks,
    setDrinks,
  ] =
    useState<Drink[]>([]);

  const [
    locations,
    setLocations,
  ] =
    useState<Location[]>(
      []
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    locationFilter,
    setLocationFilter,
  ] =
    useState("");

  const [
    dialogOpen,
    setDialogOpen,
  ] =
    useState(false);

  const [
    selectedInventory,
    setSelectedInventory,
  ] =
    useState<
      InventoryType | null
    >(null);

  const [
    deleteDialogOpen,
    setDeleteDialogOpen,
  ] =
    useState(false);

  const [
    inventoryToDelete,
    setInventoryToDelete,
  ] =
    useState<
      InventoryType | null
    >(null);

  const [
    deleting,
    setDeleting,
  ] =
    useState(false);

  const [
    message,
    setMessage,
  ] =
    useState("");

  const [
    messageType,
    setMessageType,
  ] =
    useState<
      "success" | "error"
    >("success");

  const normaliseId = (
    value: unknown
  ) =>
    String(value ?? "")
      .trim()
      .toLowerCase();

  const loadData =
    async () => {
      setLoading(true);

      try {
        const [
          inventoryData,
          drinkData,
          locationData,
        ] =
          await Promise.all(
            [
              getInventory(),

              getDrinks(),

              getLocations(),
            ]
          );

        setInventory(
          inventoryData
        );

        setDrinks(
          drinkData
        );

        setLocations(
          locationData
        );
      } catch (error) {
        console.error(
          "Could not load inventory data:",
          error
        );

        setMessageType(
          "error"
        );

        setMessage(
          "Could not load inventory. Check that the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    void loadData();
  }, []);

  const rows =
    useMemo<
      InventoryRow[]
    >(() => {
      return inventory.map(
        (item) => {
          const drink =
            drinks.find(
              (
                drinkItem
              ) =>
                normaliseId(
                  drinkItem.id
                ) ===
                normaliseId(
                  item.drinkId
                )
            );

          const location =
            locations.find(
              (
                locationItem
              ) =>
                normaliseId(
                  locationItem.id
                ) ===
                normaliseId(
                  item.locationId
                )
            );

          const quantity =
            Number(
              item.quantity
            ) || 0;

          const pricePerBottle =
            Number(
              item.pricePerBottle
            ) || 0;

          const calculatedTotalStockValue =
            quantity *
            pricePerBottle;

          return {
            ...item,

            quantity,

            pricePerBottle,

            totalStockValue:
              calculatedTotalStockValue,

            calculatedTotalStockValue,

            drinkName:
              drink?.name ??
              "Unknown drink",

            drinkBrand:
              drink?.brand ??
              "",

            bottleSize:
              drink?.bottleSize ??
              "",

            locationName:
              location?.name ??
              "Unknown location",

            locationType:
              location?.type ??
              "",
          };
        }
      );
    }, [
      inventory,
      drinks,
      locations,
    ]);

  const filteredRows =
    useMemo(() => {
      const searchText =
        search
          .trim()
          .toLowerCase();

      return rows.filter(
        (row) => {
          const matchesSearch =
            !searchText ||
            [
              row.drinkName,

              row.drinkBrand,

              row.bottleSize,

              row.locationName,

              row.locationType,

              String(
                row.pricePerBottle
              ),

              String(
                row.calculatedTotalStockValue
              ),
            ].some(
              (value) =>
                value
                  .toLowerCase()
                  .includes(
                    searchText
                  )
            );

          const matchesLocation =
            !locationFilter ||
            normaliseId(
              row.locationId
            ) ===
              normaliseId(
                locationFilter
              );

          return (
            matchesSearch &&
            matchesLocation
          );
        }
      );
    }, [
      rows,
      search,
      locationFilter,
    ]);

  const handleOpenAdd =
    () => {
      setSelectedInventory(
        null
      );

      setDialogOpen(
        true
      );
    };

  const handleOpenEdit = (
    item: InventoryType
  ) => {
    setSelectedInventory(
      item
    );

    setDialogOpen(
      true
    );
  };

  const handleCloseDialog =
    () => {
      setDialogOpen(
        false
      );

      setSelectedInventory(
        null
      );
    };

  const handleSave =
    async (
      item: InventoryType
    ) => {
      try {
        if (
          selectedInventory?.id
        ) {
          await updateInventory(
            selectedInventory.id,
            item
          );

          setMessage(
            "Inventory updated successfully."
          );
        } else {
          await createInventory(
            item
          );

          setMessage(
            "Inventory added successfully."
          );
        }

        setMessageType(
          "success"
        );

        await loadData();
      } catch (error) {
        console.error(
          "Could not save inventory:",
          error
        );

        setMessageType(
          "error"
        );

        setMessage(
          "Could not save the inventory record. It may already exist for this drink and location."
        );

        throw error;
      }
    };

  const handleOpenDelete = (
    item: InventoryType
  ) => {
    setInventoryToDelete(
      item
    );

    setDeleteDialogOpen(
      true
    );
  };

  const handleCloseDelete =
    () => {
      setDeleteDialogOpen(
        false
      );

      setInventoryToDelete(
        null
      );
    };

  const handleDelete =
    async () => {
      if (
        !inventoryToDelete?.id
      ) {
        return;
      }

      setDeleting(true);

      try {
        await deleteInventory(
          inventoryToDelete.id
        );

        setMessageType(
          "success"
        );

        setMessage(
          "Inventory record deleted successfully."
        );

        handleCloseDelete();

        await loadData();
      } catch (error) {
        console.error(
          "Could not delete inventory:",
          error
        );

        setMessageType(
          "error"
        );

        setMessage(
          "Could not delete the inventory record."
        );
      } finally {
        setDeleting(false);
      }
    };

  const columns:
    GridColDef<InventoryRow>[] =
    [
      {
        field:
          "drinkName",

        headerName:
          "Drink",

        flex: 1.1,

        minWidth:
          160,
      },

      {
        field:
          "drinkBrand",

        headerName:
          "Brand",

        flex: 1,

        minWidth:
          150,

        valueGetter:
          (
            _value,
            row
          ) =>
            row.drinkBrand ||
            "—",
      },

      {
        field:
          "bottleSize",

        headerName:
          "Size",

        width:
          90,

        valueGetter:
          (
            _value,
            row
          ) =>
            row.bottleSize ||
            "—",
      },

      {
        field:
          "locationName",

        headerName:
          "Location",

        flex: 1,

        minWidth:
          160,
      },

      {
        field:
          "quantity",

        headerName:
          "Quantity",

        width:
          105,

        type:
          "number",
      },

      {
        field:
          "pricePerBottle",

        headerName:
          "Price/Bottle",

        minWidth:
          140,

        type:
          "number",

        valueFormatter:
          (value) => {
            const amount =
              Number(
                value
              ) || 0;

            return `${amount.toLocaleString()} FCFA`;
          },
      },

      {
        field:
          "calculatedTotalStockValue",

        headerName:
          "Stock Value",

        minWidth:
          155,

        type:
          "number",

        valueFormatter:
          (value) => {
            const amount =
              Number(
                value
              ) || 0;

            return `${amount.toLocaleString()} FCFA`;
          },
      },

      {
        field:
          "minimumQuantity",

        headerName:
          "Minimum",

        width:
          105,
      },

      {
        field:
          "stockStatus",

        headerName:
          "Stock Status",

        width:
          140,

        sortable:
          false,

        filterable:
          false,

        renderCell:
          (params) => {
            const quantity =
              params.row
                .quantity;

            const minimum =
              params.row
                .minimumQuantity;

            if (
              quantity ===
              0
            ) {
              return (
                <Chip
                  size="small"
                  label="Out of Stock"
                  color="error"
                />
              );
            }

            if (
              quantity <=
              minimum
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
        field:
          "updatedAt",

        headerName:
          "Last Updated",

        minWidth:
          175,

        valueFormatter:
          (value) => {
            if (!value) {
              return "—";
            }

            return new Date(
              String(
                value
              )
            ).toLocaleString();
          },
      },

      {
        field:
          "activeStatus",

        headerName:
          "Status",

        width:
          100,

        sortable:
          false,

        filterable:
          false,

        renderCell:
          (params) => (
            <Chip
              size="small"
              label={
                params.row
                  .isActive
                  ? "Active"
                  : "Inactive"
              }
              color={
                params.row
                  .isActive
                  ? "success"
                  : "default"
              }
            />
          ),
      },

      {
        field:
          "actions",

        headerName:
          "Actions",

        width:
          210,

        sortable:
          false,

        filterable:
          false,

        renderCell:
          (params) => (
            <Box
              sx={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap: 1,

                height:
                  "100%",
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

  const totalQuantity =
    rows.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item.quantity ||
            0
        ),
      0
    );

  const totalInventoryValue =
    rows.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item.calculatedTotalStockValue ||
            0
        ),
      0
    );

  const warehouseQuantity =
    rows
      .filter(
        (row) =>
          row.locationType ===
          "Warehouse"
      )
      .reduce(
        (
          total,
          row
        ) =>
          total +
          Number(
            row.quantity ||
              0
          ),
        0
      );

  const salesAreaQuantity =
    rows
      .filter(
        (row) =>
          row.locationType ===
          "SalesArea"
      )
      .reduce(
        (
          total,
          row
        ) =>
          total +
          Number(
            row.quantity ||
              0
          ),
        0
      );

  const lowStockCount =
    rows.filter(
      (item) =>
        item.quantity >
          0 &&
        item.quantity <=
          item.minimumQuantity
    ).length;

  const deleteDrinkName =
    useMemo(() => {
      if (
        !inventoryToDelete
      ) {
        return "";
      }

      return (
        drinks.find(
          (drink) =>
            normaliseId(
              drink.id
            ) ===
            normaliseId(
              inventoryToDelete.drinkId
            )
        )?.name ?? ""
      );
    }, [
      inventoryToDelete,
      drinks,
    ]);

  const deleteLocationName =
    useMemo(() => {
      if (
        !inventoryToDelete
      ) {
        return "";
      }

      return (
        locations.find(
          (location) =>
            normaliseId(
              location.id
            ) ===
            normaliseId(
              inventoryToDelete.locationId
            )
        )?.name ?? ""
      );
    }, [
      inventoryToDelete,
      locations,
    ]);

  const summaryCardSx = {
    bgcolor:
      "background.paper",

    border:
      "1px solid #e5e7eb",

    borderRadius:
      3,

    p: 2,
  };

  return (
    <Box>
      <Box
        sx={{
          display:
            "flex",

          flexDirection:
            {
              xs:
                "column",

              sm:
                "row",
            },

          justifyContent:
            "space-between",

          alignItems:
            {
              xs:
                "stretch",

              sm:
                "center",
            },

          gap: 2,

          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4">
            Inventory
          </Typography>

          <Typography color="text.secondary">
            Manage drink quantities, bottle prices and stock values at every location.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={
            <AddOutlined />
          }
          onClick={
            handleOpenAdd
          }
        >
          Add Inventory
        </Button>
      </Box>

      <Box
        sx={{
          display:
            "grid",

          gridTemplateColumns:
            {
              xs:
                "1fr",

              sm:
                "repeat(2, 1fr)",

              lg:
                "repeat(5, 1fr)",
            },

          gap: 2,

          mb: 3,
        }}
      >
        <Box
          sx={
            summaryCardSx
          }
        >
          <Typography color="text.secondary">
            Total Bottles
          </Typography>

          <Typography variant="h4">
            {totalQuantity.toLocaleString()}
          </Typography>
        </Box>

        <Box
          sx={
            summaryCardSx
          }
        >
          <Typography color="text.secondary">
            Inventory Value
          </Typography>

          <Typography variant="h5">
            {totalInventoryValue.toLocaleString()}{" "}
            FCFA
          </Typography>
        </Box>

        <Box
          sx={
            summaryCardSx
          }
        >
          <Typography color="text.secondary">
            Warehouse Stock
          </Typography>

          <Typography variant="h4">
            {warehouseQuantity.toLocaleString()}
          </Typography>
        </Box>

        <Box
          sx={
            summaryCardSx
          }
        >
          <Typography color="text.secondary">
            Bar Stock
          </Typography>

          <Typography variant="h4">
            {salesAreaQuantity.toLocaleString()}
          </Typography>
        </Box>

        <Box
          sx={
            summaryCardSx
          }
        >
          <Typography color="text.secondary">
            Low Stock Items
          </Typography>

          <Typography variant="h4">
            {lowStockCount}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          bgcolor:
            "background.paper",

          border:
            "1px solid #e5e7eb",

          borderRadius:
            3,

          p: 2,
        }}
      >
        <Box
          sx={{
            display:
              "flex",

            flexDirection:
              {
                xs:
                  "column",

                sm:
                  "row",
              },

            gap: 2,

            mb: 2,
          }}
        >
          <TextField
            placeholder="Search inventory..."
            value={
              search
            }
            onChange={
              (
                event
              ) =>
                setSearch(
                  event
                    .target
                    .value
                )
            }
            sx={{
              width: {
                xs:
                  "100%",

                sm:
                  360,
              },
            }}
            slotProps={{
              input: {
                startAdornment:
                  (
                    <InputAdornment position="start">
                      <SearchOutlined />
                    </InputAdornment>
                  ),
              },
            }}
          />

          <TextField
            select
            label="Location"
            value={
              locationFilter
            }
            onChange={
              (
                event
              ) =>
                setLocationFilter(
                  event
                    .target
                    .value
                )
            }
            sx={{
              width: {
                xs:
                  "100%",

                sm:
                  240,
              },
            }}
          >
            <MenuItem value="">
              All locations
            </MenuItem>

            {locations.map(
              (
                location
              ) => (
                <MenuItem
                  key={
                    location.id ??
                    location.name
                  }
                  value={
                    location.id ??
                    ""
                  }
                >
                  {
                    location.name
                  }
                </MenuItem>
              )
            )}
          </TextField>
        </Box>

        <DataGrid
          rows={
            filteredRows
          }
          columns={
            columns
          }
          loading={
            loading
          }
          getRowId={
            (row) =>
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
            pagination:
              {
                paginationModel:
                  {
                    pageSize:
                      10,

                    page:
                      0,
                  },
              },
          }}
          sx={{
            minHeight:
              520,

            border:
              0,

            "& .MuiDataGrid-columnHeaders":
              {
                bgcolor:
                  "#f8fafc",
              },
          }}
        />
      </Box>

      <InventoryDialog
        open={
          dialogOpen
        }
        inventory={
          selectedInventory
        }
        drinks={
          drinks
        }
        locations={
          locations
        }
        existingInventory={
          inventory
        }
        onClose={
          handleCloseDialog
        }
        onSave={
          handleSave
        }
      />

      <DeleteInventoryDialog
        open={
          deleteDialogOpen
        }
        inventory={
          inventoryToDelete
        }
        deleting={
          deleting
        }
        drinkName={
          deleteDrinkName
        }
        locationName={
          deleteLocationName
        }
        onClose={
          handleCloseDelete
        }
        onConfirm={
          handleDelete
        }
      />

      <Snackbar
        open={Boolean(
          message
        )}
        autoHideDuration={
          4000
        }
        onClose={() =>
          setMessage("")
        }
        anchorOrigin={{
          vertical:
            "bottom",

          horizontal:
            "right",
        }}
      >
        <Alert
          severity={
            messageType
          }
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

export default Inventory;
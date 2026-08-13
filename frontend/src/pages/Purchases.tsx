import {
  AddOutlined,
  DeleteOutline,
  EditOutlined,
  PictureAsPdfOutlined,
  SearchOutlined,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Snackbar,
  TextField,
  Tooltip,
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

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import PurchaseDialog from "../components/purchases/PurchaseDialog";

import {
  getDrinks,
} from "../services/drinkService";

import {
  getLocations,
} from "../services/locationService";

import {
  createPurchase,
  deletePurchase,
  getPurchases,
  updatePurchase,
} from "../services/purchaseService";

import {
  getSuppliers,
} from "../services/supplierService";

import type { Drink } from "../types/drink";
import type { Location } from "../types/location";
import type { Purchase } from "../types/purchase";
import type { Supplier } from "../types/supplier";

type PurchaseRow =
  Purchase & {
    supplierName: string;
    destinationLocationName: string;
    drinkName: string;
    drinkBrand: string;
    bottleSize: string;
    calculatedTotalAmount: number;
  };

function Purchases() {
  const [
    purchases,
    setPurchases,
  ] =
    useState<Purchase[]>([]);

  const [
    suppliers,
    setSuppliers,
  ] =
    useState<Supplier[]>([]);

  const [
    drinks,
    setDrinks,
  ] =
    useState<Drink[]>([]);

  const [
    locations,
    setLocations,
  ] =
    useState<Location[]>([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    dialogOpen,
    setDialogOpen,
  ] =
    useState(false);

  const [
    selectedPurchase,
    setSelectedPurchase,
  ] =
    useState<Purchase | null>(
      null
    );

  const [
    deleteDialogOpen,
    setDeleteDialogOpen,
  ] =
    useState(false);

  const [
    purchaseToDelete,
    setPurchaseToDelete,
  ] =
    useState<PurchaseRow | null>(
      null
    );

  const [
    deleting,
    setDeleting,
  ] =
    useState(false);

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    supplierFilter,
    setSupplierFilter,
  ] =
    useState("");

  const [
    paymentFilter,
    setPaymentFilter,
  ] =
    useState("");

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
          purchaseData,
          supplierData,
          drinkData,
          locationData,
        ] =
          await Promise.all([
            getPurchases(),
            getSuppliers(),
            getDrinks(),
            getLocations(),
          ]);

        setPurchases(
          purchaseData
        );

        setSuppliers(
          supplierData
        );

        setDrinks(
          drinkData
        );

        setLocations(
          locationData
        );
      } catch (error) {
        console.error(
          "Could not load purchases:",
          error
        );

        setMessageType(
          "error"
        );

        setMessage(
          "Could not load purchases. Check that the backend is running."
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
      PurchaseRow[]
    >(() => {
      return purchases.map(
        (purchase) => {
          const supplier =
            suppliers.find(
              (item) =>
                normaliseId(
                  item.id
                ) ===
                normaliseId(
                  purchase.supplierId
                )
            );

          const destinationLocation =
            locations.find(
              (item) =>
                normaliseId(
                  item.id
                ) ===
                normaliseId(
                  purchase.destinationLocationId
                )
            );

          const drink =
            drinks.find(
              (item) =>
                normaliseId(
                  item.id
                ) ===
                normaliseId(
                  purchase.drinkId
                )
            );

          const quantity =
            Number(
              purchase.quantity
            ) || 0;

          const unitBuyingPrice =
            Number(
              purchase.unitBuyingPrice
            ) || 0;

          const calculatedTotalAmount =
            quantity *
            unitBuyingPrice;

          return {
            ...purchase,

            quantity,

            unitBuyingPrice,

            totalAmount:
              Number(
                purchase.totalAmount
              ) ||
              calculatedTotalAmount,

            calculatedTotalAmount:
              Number(
                purchase.totalAmount
              ) ||
              calculatedTotalAmount,

            supplierName:
              supplier?.name ??
              "Unknown supplier",

            destinationLocationName:
              destinationLocation?.name ??
              "Unknown location",

            drinkName:
              drink?.name ??
              "Unknown drink",

            drinkBrand:
              drink?.brand ??
              "",

            bottleSize:
              drink?.bottleSize ??
              "",
          };
        }
      );
    }, [
      purchases,
      suppliers,
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
              row.purchaseNumber ??
                "",

              row.supplierName,

              row.destinationLocationName,

              row.drinkName,

              row.drinkBrand,

              row.bottleSize,

              row.invoiceNumber,

              row.paymentStatus,

              row.notes,

              row.status ??
                "",
            ].some(
              (value) =>
                String(value)
                  .toLowerCase()
                  .includes(
                    searchText
                  )
            );

          const matchesSupplier =
            !supplierFilter ||
            normaliseId(
              row.supplierId
            ) ===
              normaliseId(
                supplierFilter
              );

          const matchesPayment =
            !paymentFilter ||
            row.paymentStatus ===
              paymentFilter;

          return (
            matchesSearch &&
            matchesSupplier &&
            matchesPayment
          );
        }
      );
    }, [
      rows,
      search,
      supplierFilter,
      paymentFilter,
    ]);

  const handleOpenAdd =
    () => {
      setSelectedPurchase(
        null
      );

      setDialogOpen(
        true
      );
    };

  const handleOpenEdit = (
    purchase: Purchase
  ) => {
    setSelectedPurchase(
      purchase
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

      setSelectedPurchase(
        null
      );
    };

  const handleSave =
    async (
      purchase: Purchase
    ) => {
      try {
        if (
          selectedPurchase?.id
        ) {
          await updatePurchase(
            selectedPurchase.id,
            purchase
          );

          setMessageType(
            "success"
          );

          setMessage(
            "Purchase updated successfully."
          );
        } else {
          await createPurchase(
            purchase
          );

          setMessageType(
            "success"
          );

          setMessage(
            "Purchase completed successfully and inventory increased."
          );
        }

        await loadData();
      } catch (error) {
        console.error(
          "Could not save purchase:",
          error
        );

        setMessageType(
          "error"
        );

        setMessage(
          selectedPurchase
            ? "Could not update the purchase."
            : "Could not complete the purchase. Check the supplier, warehouse, drink and quantity."
        );

        throw error;
      }
    };

  const handleAskDelete = (
    purchase: PurchaseRow
  ) => {
    setPurchaseToDelete(
      purchase
    );

    setDeleteDialogOpen(
      true
    );
  };

  const handleCloseDelete =
    () => {
      if (deleting) {
        return;
      }

      setDeleteDialogOpen(
        false
      );

      setPurchaseToDelete(
        null
      );
    };

  const handleDelete =
    async () => {
      if (
        !purchaseToDelete?.id
      ) {
        setMessageType(
          "error"
        );

        setMessage(
          "This purchase cannot be deleted because its ID is missing."
        );

        return;
      }

      setDeleting(true);

      try {
        await deletePurchase(
          purchaseToDelete.id
        );

        setMessageType(
          "success"
        );

        setMessage(
          "Purchase deleted successfully and inventory adjusted."
        );

        setDeleteDialogOpen(
          false
        );

        setPurchaseToDelete(
          null
        );

        await loadData();
      } catch (error) {
        console.error(
          "Could not delete purchase:",
          error
        );

        setMessageType(
          "error"
        );

        setMessage(
          "Could not delete the purchase. The warehouse may not have enough stock to reverse this purchase."
        );
      } finally {
        setDeleting(false);
      }
    };

  const getSupplierName = (
    id: string
  ) =>
    suppliers.find(
      (supplier) =>
        normaliseId(
          supplier.id
        ) ===
        normaliseId(id)
    )?.name ??
    "All Suppliers";

  const handleDownloadPdf =
    () => {
      if (
        filteredRows.length ===
        0
      ) {
        setMessageType(
          "error"
        );

        setMessage(
          "There are no purchase records to download."
        );

        return;
      }

      const doc =
        new jsPDF({
          orientation:
            "landscape",

          unit:
            "mm",

          format:
            "a4",
        });

      const generatedAt =
        new Date();

      const totalQuantity =
        filteredRows.reduce(
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

      const totalValue =
        filteredRows.reduce(
          (
            total,
            row
          ) =>
            total +
            Number(
              row.calculatedTotalAmount ||
                0
            ),
          0
        );

      const paidCount =
        filteredRows.filter(
          (row) =>
            row.paymentStatus ===
            "Paid"
        ).length;

      const partialCount =
        filteredRows.filter(
          (row) =>
            row.paymentStatus ===
            "Partial"
        ).length;

      const unpaidCount =
        filteredRows.filter(
          (row) =>
            row.paymentStatus ===
            "Unpaid"
        ).length;

      const supplierName =
        supplierFilter
          ? getSupplierName(
              supplierFilter
            )
          : "All Suppliers";

      doc.setFontSize(
        18
      );

      doc.text(
        "IVY EASY LOUNGE",
        14,
        15
      );

      doc.setFontSize(
        13
      );

      doc.text(
        "Purchase Report",
        14,
        23
      );

      doc.setFontSize(
        9
      );

      doc.text(
        `Generated: ${generatedAt.toLocaleString()}`,
        14,
        30
      );

      doc.text(
        `Supplier: ${supplierName}`,
        14,
        36
      );

      doc.text(
        `Payment: ${
          paymentFilter ||
          "All"
        }`,
        100,
        36
      );

      if (
        search.trim()
      ) {
        doc.text(
          `Search: ${search.trim()}`,
          170,
          36
        );
      }

      autoTable(
        doc,
        {
          startY:
            43,

          head: [
            [
              "Purchase No.",
              "Date",
              "Supplier",
              "Warehouse",
              "Drink",
              "Brand",
              "Size",
              "Qty",
              "Unit Price",
              "Total",
              "Invoice",
              "Payment",
              "Status",
            ],
          ],

          body:
            filteredRows.map(
              (row) => [
                row.purchaseNumber ??
                  "—",

                row.purchaseDate
                  ? new Date(
                      row.purchaseDate
                    ).toLocaleDateString()
                  : "—",

                row.supplierName,

                row.destinationLocationName,

                row.drinkName,

                row.drinkBrand ||
                  "—",

                row.bottleSize ||
                  "—",

                Number(
                  row.quantity ||
                    0
                ).toLocaleString(),

                `${Number(
                  row.unitBuyingPrice ||
                    0
                ).toLocaleString()} FCFA`,

                `${Number(
                  row.calculatedTotalAmount ||
                    0
                ).toLocaleString()} FCFA`,

                row.invoiceNumber ||
                  "—",

                row.paymentStatus,

                row.status ??
                  "Completed",
              ]
            ),

          styles: {
            fontSize:
              7,

            cellPadding:
              2,

            overflow:
              "linebreak",
          },

          headStyles: {
            fontStyle:
              "bold",
          },

          columnStyles: {
            0: {
              cellWidth:
                30,
            },

            1: {
              cellWidth:
                20,
            },

            2: {
              cellWidth:
                29,
            },

            3: {
              cellWidth:
                25,
            },

            4: {
              cellWidth:
                28,
            },

            5: {
              cellWidth:
                24,
            },

            6: {
              cellWidth:
                15,
            },

            7: {
              cellWidth:
                12,
            },

            8: {
              cellWidth:
                24,
            },

            9: {
              cellWidth:
                25,
            },

            10: {
              cellWidth:
                24,
            },

            11: {
              cellWidth:
                20,
            },

            12: {
              cellWidth:
                20,
            },
          },
        }
      );

      const finalY =
        (
          doc as jsPDF & {
            lastAutoTable?: {
              finalY: number;
            };
          }
        ).lastAutoTable
          ?.finalY ??
        50;

      doc.setFontSize(
        10
      );

      doc.text(
        `Total records: ${filteredRows.length}`,
        14,
        finalY +
          10
      );

      doc.text(
        `Total bottles purchased: ${totalQuantity.toLocaleString()}`,
        14,
        finalY +
          17
      );

      doc.text(
        `Total purchase value: ${totalValue.toLocaleString()} FCFA`,
        14,
        finalY +
          24
      );

      doc.text(
        `Paid: ${paidCount}`,
        130,
        finalY +
          10
      );

      doc.text(
        `Partial: ${partialCount}`,
        130,
        finalY +
          17
      );

      doc.text(
        `Unpaid: ${unpaidCount}`,
        130,
        finalY +
          24
      );

      const fileDate =
        new Date()
          .toISOString()
          .slice(
            0,
            10
          );

      doc.save(
        `IVY-EASY-LOUNGE-Purchase-Report-${fileDate}.pdf`
      );

      setMessageType(
        "success"
      );

      setMessage(
        "Purchase PDF downloaded successfully."
      );
    };

  const columns:
    GridColDef<PurchaseRow>[] =
    [
      {
        field:
          "purchaseNumber",

        headerName:
          "Purchase Number",

        minWidth:
          200,

        flex:
          1,

        valueGetter:
          (
            _value,
            row
          ) =>
            row.purchaseNumber ??
            "—",
      },

      {
        field:
          "supplierName",

        headerName:
          "Supplier",

        minWidth:
          190,

        flex:
          1,
      },

      {
        field:
          "destinationLocationName",

        headerName:
          "Warehouse",

        minWidth:
          160,

        flex:
          1,
      },

      {
        field:
          "drinkName",

        headerName:
          "Drink",

        minWidth:
          150,

        flex:
          1,
      },

      {
        field:
          "drinkBrand",

        headerName:
          "Brand",

        minWidth:
          140,

        flex:
          1,

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
          "unitBuyingPrice",

        headerName:
          "Unit Price",

        minWidth:
          130,

        type:
          "number",

        valueFormatter:
          (value) =>
            `${Number(
              value ??
                0
            ).toLocaleString()} FCFA`,
      },

      {
        field:
          "calculatedTotalAmount",

        headerName:
          "Total",

        minWidth:
          145,

        type:
          "number",

        valueFormatter:
          (value) =>
            `${Number(
              value ??
                0
            ).toLocaleString()} FCFA`,
      },

      {
        field:
          "invoiceNumber",

        headerName:
          "Invoice",

        minWidth:
          125,

        valueGetter:
          (
            _value,
            row
          ) =>
            row.invoiceNumber ||
            "—",
      },

      {
        field:
          "paymentStatus",

        headerName:
          "Payment",

        width:
          120,

        renderCell:
          (params) => {
            const status =
              params.row
                .paymentStatus;

            return (
              <Chip
                size="small"
                label={
                  status
                }
                color={
                  status ===
                  "Paid"
                    ? "success"
                    : status ===
                        "Partial"
                      ? "warning"
                      : "error"
                }
              />
            );
          },
      },

      {
        field:
          "purchaseDate",

        headerName:
          "Date",

        minWidth:
          170,

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
          "status",

        headerName:
          "Status",

        width:
          120,

        renderCell:
          (params) => (
            <Chip
              size="small"
              label={
                params.row
                  .status ??
                "Completed"
              }
              color="success"
            />
          ),
      },

      {
        field:
          "actions",

        headerName:
          "Actions",

        width:
          120,

        sortable:
          false,

        filterable:
          false,

        disableColumnMenu:
          true,

        renderCell:
          (params) => (
            <Box
              sx={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap:
                  0.5,
              }}
            >
              <Tooltip title="Edit purchase">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() =>
                    handleOpenEdit(
                      params.row
                    )
                  }
                >
                  <EditOutlined fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete purchase">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() =>
                    handleAskDelete(
                      params.row
                    )
                  }
                >
                  <DeleteOutline fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          ),
      },
    ];

  const totalPurchaseValue =
    rows.reduce(
      (
        total,
        purchase
      ) =>
        total +
        Number(
          purchase.calculatedTotalAmount ||
            0
        ),
      0
    );

  const totalBottlesPurchased =
    rows.reduce(
      (
        total,
        purchase
      ) =>
        total +
        Number(
          purchase.quantity ||
            0
        ),
      0
    );

  const unpaidCount =
    rows.filter(
      (purchase) =>
        purchase.paymentStatus ===
        "Unpaid"
    ).length;

  const today =
    new Date().toDateString();

  const todayCount =
    rows.filter(
      (purchase) => {
        if (
          !purchase.purchaseDate
        ) {
          return false;
        }

        return (
          new Date(
            purchase.purchaseDate
          ).toDateString() ===
          today
        );
      }
    ).length;

  return (
    <Box>
      <Box
        sx={{
          display:
            "flex",

          flexDirection: {
            xs:
              "column",

            sm:
              "row",
          },

          justifyContent:
            "space-between",

          alignItems: {
            xs:
              "stretch",

            sm:
              "center",
          },

          gap:
            2,

          mb:
            3,
        }}
      >
        <Box>
          <Typography variant="h4">
            Purchases
          </Typography>

          <Typography color="text.secondary">
            Receive drinks from suppliers into the warehouse.
          </Typography>
        </Box>

        <Box
          sx={{
            display:
              "flex",

            flexDirection: {
              xs:
                "column",

              sm:
                "row",
            },

            gap:
              1,
          }}
        >
          <Button
            variant="outlined"
            startIcon={
              <PictureAsPdfOutlined />
            }
            onClick={
              handleDownloadPdf
            }
          >
            Download PDF
          </Button>

          <Button
            variant="contained"
            startIcon={
              <AddOutlined />
            }
            onClick={
              handleOpenAdd
            }
          >
            Receive Purchase
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display:
            "grid",

          gridTemplateColumns: {
            xs:
              "1fr",

            sm:
              "repeat(2, 1fr)",

            lg:
              "repeat(4, 1fr)",
          },

          gap:
            2,

          mb:
            3,
        }}
      >
        <Box
          sx={{
            bgcolor:
              "background.paper",

            border:
              "1px solid #e5e7eb",

            borderRadius:
              3,

            p:
              2,
          }}
        >
          <Typography color="text.secondary">
            Total Purchases
          </Typography>

          <Typography
            variant="h5"
            fontWeight={
              700
            }
          >
            {rows.length.toLocaleString()}
          </Typography>
        </Box>

        <Box
          sx={{
            bgcolor:
              "background.paper",

            border:
              "1px solid #e5e7eb",

            borderRadius:
              3,

            p:
              2,
          }}
        >
          <Typography color="text.secondary">
            Bottles Purchased
          </Typography>

          <Typography
            variant="h5"
            fontWeight={
              700
            }
          >
            {totalBottlesPurchased.toLocaleString()}
          </Typography>
        </Box>

        <Box
          sx={{
            bgcolor:
              "background.paper",

            border:
              "1px solid #e5e7eb",

            borderRadius:
              3,

            p:
              2,
          }}
        >
          <Typography color="text.secondary">
            Purchase Value
          </Typography>

          <Typography
            variant="h5"
            fontWeight={
              700
            }
          >
            {totalPurchaseValue.toLocaleString()} FCFA
          </Typography>
        </Box>

        <Box
          sx={{
            bgcolor:
              "background.paper",

            border:
              "1px solid #e5e7eb",

            borderRadius:
              3,

            p:
              2,
          }}
        >
          <Typography color="text.secondary">
            Today
          </Typography>

          <Typography
            variant="h5"
            fontWeight={
              700
            }
          >
            {todayCount.toLocaleString()}
          </Typography>

          <Typography
            variant="body2"
            color={
              unpaidCount >
              0
                ? "error"
                : "text.secondary"
            }
            sx={{
              mt:
                0.5,
            }}
          >
            {unpaidCount >
            0
              ? `${unpaidCount} unpaid`
              : "No unpaid purchases"}
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

          p:
            2,
        }}
      >
        <Box
          sx={{
            display:
              "flex",

            flexDirection: {
              xs:
                "column",

              lg:
                "row",
            },

            gap:
              2,

            mb:
              2,
          }}
        >
          <TextField
            placeholder="Search purchases..."
            value={
              search
            }
            onChange={
              (event) =>
                setSearch(
                  event.target.value
                )
            }
            sx={{
              width: {
                xs:
                  "100%",

                lg:
                  340,
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
            label="Supplier"
            value={
              supplierFilter
            }
            onChange={
              (event) =>
                setSupplierFilter(
                  event.target.value
                )
            }
            sx={{
              width: {
                xs:
                  "100%",

                lg:
                  260,
              },
            }}
          >
            <MenuItem value="">
              All suppliers
            </MenuItem>

            {suppliers.map(
              (supplier) => (
                <MenuItem
                  key={
                    supplier.id ??
                    supplier.name
                  }
                  value={
                    supplier.id ??
                    ""
                  }
                >
                  {supplier.name}
                </MenuItem>
              )
            )}
          </TextField>

          <TextField
            select
            label="Payment Status"
            value={
              paymentFilter
            }
            onChange={
              (event) =>
                setPaymentFilter(
                  event.target.value
                )
            }
            sx={{
              width: {
                xs:
                  "100%",

                lg:
                  200,
              },
            }}
          >
            <MenuItem value="">
              All payment statuses
            </MenuItem>

            <MenuItem value="Paid">
              Paid
            </MenuItem>

            <MenuItem value="Partial">
              Partial
            </MenuItem>

            <MenuItem value="Unpaid">
              Unpaid
            </MenuItem>
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
              row.purchaseNumber ??
              `${row.supplierId}-${row.drinkId}-${row.purchaseDate}`
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
                page:
                  0,

                pageSize:
                  10,
              },
            },
          }}
          sx={{
            minHeight:
              520,

            border:
              0,

            "& .MuiDataGrid-columnHeaders": {
              bgcolor:
                "#f8fafc",
            },
          }}
        />
      </Box>

      <PurchaseDialog
        open={
          dialogOpen
        }
        purchase={
          selectedPurchase
        }
        suppliers={
          suppliers
        }
        drinks={
          drinks
        }
        locations={
          locations
        }
        onClose={
          handleCloseDialog
        }
        onSave={
          handleSave
        }
      />

      <Dialog
        open={
          deleteDialogOpen
        }
        onClose={
          deleting
            ? undefined
            : handleCloseDelete
        }
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Delete Purchase?
        </DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to delete purchase{" "}
            <strong>
              {purchaseToDelete
                ?.purchaseNumber ??
                ""}
            </strong>
            ?
          </Typography>

          <Box
            sx={{
              mt:
                2,

              p:
                2,

              bgcolor:
                "#f8fafc",

              borderRadius:
                2,
            }}
          >
            <Typography variant="body2">
              <strong>
                Supplier:
              </strong>{" "}
              {purchaseToDelete
                ?.supplierName ??
                "—"}
            </Typography>

            <Typography variant="body2">
              <strong>
                Drink:
              </strong>{" "}
              {purchaseToDelete
                ?.drinkName ??
                "—"}
            </Typography>

            <Typography variant="body2">
              <strong>
                Warehouse:
              </strong>{" "}
              {purchaseToDelete
                ?.destinationLocationName ??
                "—"}
            </Typography>

            <Typography variant="body2">
              <strong>
                Quantity:
              </strong>{" "}
              {purchaseToDelete
                ?.quantity ??
                0}
            </Typography>

            <Typography variant="body2">
              <strong>
                Total:
              </strong>{" "}
              {Number(
                purchaseToDelete
                  ?.calculatedTotalAmount ??
                  0
              ).toLocaleString()}{" "}
              FCFA
            </Typography>
          </Box>

          <Alert
            severity="warning"
            sx={{
              mt:
                2,
            }}
          >
            Deleting this purchase will remove the purchased quantity from the warehouse inventory.
          </Alert>
        </DialogContent>

        <DialogActions
          sx={{
            p:
              2,
          }}
        >
          <Button
            color="inherit"
            disabled={
              deleting
            }
            onClick={
              handleCloseDelete
            }
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            disabled={
              deleting
            }
            onClick={
              handleDelete
            }
          >
            {deleting
              ? "Deleting..."
              : "Delete Purchase"}
          </Button>
        </DialogActions>
      </Dialog>

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

export default Purchases;
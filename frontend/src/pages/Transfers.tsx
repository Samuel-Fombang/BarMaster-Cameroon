import {
  DeleteOutline,
  EditOutlined,
  PictureAsPdfOutlined,
  SearchOutlined,
  SwapHorizOutlined,
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

import TransferDialog from "../components/transfers/TransferDialog";

import {
  getDrinks,
} from "../services/drinkService";

import {
  getInventory,
} from "../services/inventoryService";

import {
  getLocations,
} from "../services/locationService";

import {
  createTransfer,
  deleteTransfer,
  getTransfers,
  updateTransfer,
} from "../services/transferService";

import type { Drink } from "../types/drink";
import type { Inventory } from "../types/inventory";
import type { Location } from "../types/location";
import type { Transfer } from "../types/transfer";

type TransferRow = Transfer & {
  sourceLocationName: string;
  destinationLocationName: string;

  drinkName: string;
  drinkBrand: string;
  bottleSize: string;

  calculatedTotalPrice: number;
};

function Transfers() {
  const [
    transfers,
    setTransfers,
  ] = useState<Transfer[]>([]);

  const [
    inventory,
    setInventory,
  ] = useState<Inventory[]>([]);

  const [
    drinks,
    setDrinks,
  ] = useState<Drink[]>([]);

  const [
    locations,
    setLocations,
  ] = useState<Location[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    dialogOpen,
    setDialogOpen,
  ] = useState(false);

  const [
    selectedTransfer,
    setSelectedTransfer,
  ] = useState<Transfer | null>(
    null
  );

  const [
    deleteDialogOpen,
    setDeleteDialogOpen,
  ] = useState(false);

  const [
    transferToDelete,
    setTransferToDelete,
  ] = useState<Transfer | null>(
    null
  );

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    sourceFilter,
    setSourceFilter,
  ] = useState("");

  const [
    destinationFilter,
    setDestinationFilter,
  ] = useState("");

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    messageType,
    setMessageType,
  ] = useState<
    "success" | "error"
  >("success");

  const normaliseId = (
    value: unknown
  ) =>
    String(value ?? "")
      .trim()
      .toLowerCase();

  const loadData = async () => {
    setLoading(true);

    try {
      const [
        transferData,
        inventoryData,
        drinkData,
        locationData,
      ] = await Promise.all([
        getTransfers(),
        getInventory(),
        getDrinks(),
        getLocations(),
      ]);

      setTransfers(
        transferData
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
        "Could not load transfers:",
        error
      );

      setMessageType(
        "error"
      );

      setMessage(
        "Could not load transfers. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const rows =
    useMemo<TransferRow[]>(
      () => {
        return transfers.map(
          (transfer) => {
            const sourceLocation =
              locations.find(
                (location) =>
                  normaliseId(
                    location.id
                  ) ===
                  normaliseId(
                    transfer.sourceLocationId
                  )
              );

            const destinationLocation =
              locations.find(
                (location) =>
                  normaliseId(
                    location.id
                  ) ===
                  normaliseId(
                    transfer.destinationLocationId
                  )
              );

            const drink =
              drinks.find(
                (item) =>
                  normaliseId(
                    item.id
                  ) ===
                  normaliseId(
                    transfer.drinkId
                  )
              );

            const quantity =
              Number(
                transfer.quantity
              ) || 0;

            const pricePerBottle =
              Number(
                transfer.pricePerBottle
              ) || 0;

            const calculatedTotalPrice =
              quantity *
              pricePerBottle;

            return {
              ...transfer,

              sourceLocationName:
                sourceLocation?.name ??
                "Unknown location",

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

              pricePerBottle,

              totalPrice:
                calculatedTotalPrice,

              calculatedTotalPrice,
            };
          }
        );
      },
      [
        transfers,
        locations,
        drinks,
      ]
    );

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
              row.transferNumber ??
                "",

              row.sourceLocationName,

              row.destinationLocationName,

              row.drinkName,

              row.drinkBrand,

              row.bottleSize,

              row.reason,

              row.status ?? "",
            ].some((value) =>
              String(value)
                .toLowerCase()
                .includes(
                  searchText
                )
            );

          const matchesSource =
            !sourceFilter ||
            normaliseId(
              row.sourceLocationId
            ) ===
              normaliseId(
                sourceFilter
              );

          const matchesDestination =
            !destinationFilter ||
            normaliseId(
              row.destinationLocationId
            ) ===
              normaliseId(
                destinationFilter
              );

          return (
            matchesSearch &&
            matchesSource &&
            matchesDestination
          );
        }
      );
    }, [
      rows,
      search,
      sourceFilter,
      destinationFilter,
    ]);

  const handleNewTransfer =
    () => {
      setSelectedTransfer(
        null
      );

      setDialogOpen(
        true
      );
    };

  const handleEdit = (
    transfer: Transfer
  ) => {
    setSelectedTransfer(
      transfer
    );

    setDialogOpen(
      true
    );
  };

  const handleSave = async (
    transfer: Transfer
  ) => {
    try {
      if (
        selectedTransfer?.id
      ) {
        await updateTransfer(
          selectedTransfer.id,
          transfer
        );

        setMessageType(
          "success"
        );

        setMessage(
          "Transfer updated successfully."
        );
      } else {
        await createTransfer(
          transfer
        );

        setMessageType(
          "success"
        );

        setMessage(
          "Transfer completed successfully."
        );
      }

      setSelectedTransfer(
        null
      );

      await loadData();
    } catch (error) {
      console.error(
        "Could not save transfer:",
        error
      );

      setMessageType(
        "error"
      );

      setMessage(
        selectedTransfer
          ? "Could not update the transfer."
          : "Could not complete the transfer. Check the available stock."
      );

      throw error;
    }
  };

  const handleAskDelete = (
    transfer: Transfer
  ) => {
    setTransferToDelete(
      transfer
    );

    setDeleteDialogOpen(
      true
    );
  };

  const handleDelete =
    async () => {
      if (
        !transferToDelete?.id
      ) {
        setMessageType(
          "error"
        );

        setMessage(
          "This transfer cannot be deleted because its ID is missing."
        );

        return;
      }

      setDeleting(true);

      try {
        await deleteTransfer(
          transferToDelete.id
        );

        setMessageType(
          "success"
        );

        setMessage(
          "Transfer deleted successfully."
        );

        setDeleteDialogOpen(
          false
        );

        setTransferToDelete(
          null
        );

        await loadData();
      } catch (error) {
        console.error(
          "Could not delete transfer:",
          error
        );

        setMessageType(
          "error"
        );

        setMessage(
          "Could not delete the transfer."
        );
      } finally {
        setDeleting(false);
      }
    };

  const getLocationName = (
    id: string
  ) => {
    return (
      locations.find(
        (location) =>
          normaliseId(
            location.id
          ) ===
          normaliseId(id)
      )?.name ?? "All"
    );
  };

  const handleDownloadPdf =
    () => {
      if (
        filteredRows.length === 0
      ) {
        setMessageType(
          "error"
        );

        setMessage(
          "There are no transfer records to download."
        );

        return;
      }

      const doc =
        new jsPDF({
          orientation:
            "landscape",

          unit: "mm",

          format: "a4",
        });

      const generatedAt =
        new Date();

      const reportTotalQuantity =
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

      const reportTotalValue =
        filteredRows.reduce(
          (
            total,
            row
          ) =>
            total +
            Number(
              row.calculatedTotalPrice ||
                0
            ),
          0
        );

      const sourceName =
        sourceFilter
          ? getLocationName(
              sourceFilter
            )
          : "All Locations";

      const destinationName =
        destinationFilter
          ? getLocationName(
              destinationFilter
            )
          : "All Locations";

      doc.setFontSize(18);

      doc.text(
        "IVY EASY LOUNGE",
        14,
        15
      );

      doc.setFontSize(13);

      doc.text(
        "Stock Transfer Report",
        14,
        23
      );

      doc.setFontSize(9);

      doc.text(
        `Generated: ${generatedAt.toLocaleString()}`,
        14,
        30
      );

      doc.text(
        `From: ${sourceName}`,
        14,
        36
      );

      doc.text(
        `To: ${destinationName}`,
        80,
        36
      );

      if (search.trim()) {
        doc.text(
          `Search filter: ${search.trim()}`,
          150,
          36
        );
      }

      autoTable(
        doc,
        {
          startY: 43,

          head: [
            [
              "Transfer No.",
              "Date",
              "From",
              "To",
              "Drink",
              "Brand",
              "Size",
              "Qty",
              "Price/Bottle",
              "Total",
              "Reason",
              "Status",
            ],
          ],

          body:
            filteredRows.map(
              (row) => [
                row.transferNumber ??
                  "—",

                row.transferDate
                  ? new Date(
                      row.transferDate
                    ).toLocaleDateString()
                  : "—",

                row.sourceLocationName,

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
                  row.pricePerBottle ||
                    0
                ).toLocaleString()} FCFA`,

                `${Number(
                  row.calculatedTotalPrice ||
                    0
                ).toLocaleString()} FCFA`,

                row.reason ||
                  "—",

                row.status ??
                  "Completed",
              ]
            ),

          styles: {
            fontSize: 7,
            cellPadding: 2,
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
                23,
            },

            3: {
              cellWidth:
                23,
            },

            4: {
              cellWidth:
                28,
            },

            5: {
              cellWidth:
                23,
            },

            6: {
              cellWidth:
                14,
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
                24,
            },

            10: {
              cellWidth:
                35,
            },

            11: {
              cellWidth:
                20,
            },
          },

          didDrawPage: (
            data
          ) => {
            const pageCount =
              doc.getNumberOfPages();

            doc.setFontSize(
              8
            );

            doc.text(
              `Page ${pageCount}`,
              doc.internal.pageSize.getWidth() -
                25,
              doc.internal.pageSize.getHeight() -
                7
            );

            if (
              data.pageNumber >
              1
            ) {
              doc.text(
                "IVY EASY LOUNGE - Stock Transfer Report",
                14,
                10
              );
            }
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

      doc.setFontSize(10);

      doc.text(
        `Total records: ${filteredRows.length}`,
        14,
        finalY + 10
      );

      doc.text(
        `Total bottles transferred: ${reportTotalQuantity.toLocaleString()}`,
        14,
        finalY + 17
      );

      doc.text(
        `Total transfer value: ${reportTotalValue.toLocaleString()} FCFA`,
        14,
        finalY + 24
      );

      const fileDate =
        new Date()
          .toISOString()
          .slice(
            0,
            10
          );

      doc.save(
        `IVY-EASY-LOUNGE-Transfer-Report-${fileDate}.pdf`
      );

      setMessageType(
        "success"
      );

      setMessage(
        "Transfer PDF downloaded successfully."
      );
    };

  const columns:
    GridColDef<TransferRow>[] =
    [
      {
        field:
          "transferNumber",

        headerName:
          "Transfer Number",

        minWidth:
          190,

        flex: 1,

        valueGetter:
          (
            _value,
            row
          ) =>
            row.transferNumber ??
            "—",
      },

      {
        field:
          "sourceLocationName",

        headerName:
          "From",

        minWidth:
          160,

        flex: 1,
      },

      {
        field:
          "destinationLocationName",

        headerName:
          "To",

        minWidth:
          160,

        flex: 1,
      },

      {
        field:
          "drinkName",

        headerName:
          "Drink",

        minWidth:
          160,

        flex: 1,
      },

      {
        field:
          "drinkBrand",

        headerName:
          "Brand",

        minWidth:
          145,

        flex: 1,

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
          95,

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
          "Qty",

        width:
          90,

        type:
          "number",
      },

      {
        field:
          "pricePerBottle",

        headerName:
          "Price/Bottle",

        minWidth:
          135,

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
          "calculatedTotalPrice",

        headerName:
          "Total Price",

        minWidth:
          150,

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
          "reason",

        headerName:
          "Reason",

        minWidth:
          190,

        flex: 1,

        valueGetter:
          (
            _value,
            row
          ) =>
            row.reason ||
            "—",
      },

      {
        field:
          "transferDate",

        headerName:
          "Date",

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
              color={
                params.row
                  .status ===
                "Cancelled"
                  ? "error"
                  : "success"
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
              <Tooltip title="Edit transfer">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() =>
                    handleEdit(
                      params.row
                    )
                  }
                >
                  <EditOutlined fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete transfer">
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

  const totalTransferred =
    transfers.reduce(
      (
        total,
        transfer
      ) =>
        total +
        Number(
          transfer.quantity ||
            0
        ),
      0
    );

  const totalTransferValue =
    transfers.reduce(
      (
        total,
        transfer
      ) =>
        total +
        Number(
          transfer.quantity ||
            0
        ) *
          Number(
            transfer.pricePerBottle ||
              0
          ),
      0
    );

  const completedCount =
    transfers.filter(
      (transfer) =>
        (
          transfer.status ??
          "Completed"
        ) ===
        "Completed"
    ).length;

  const today =
    new Date().toDateString();

  const todayCount =
    transfers.filter(
      (transfer) => {
        if (
          !transfer.transferDate
        ) {
          return false;
        }

        return (
          new Date(
            transfer.transferDate
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

          gap:
            2,

          mb:
            3,
        }}
      >
        <Box>
          <Typography variant="h4">
            Transfers
          </Typography>

          <Typography color="text.secondary">
            Move drinks between the warehouse, bar and other locations.
          </Typography>
        </Box>

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
              <SwapHorizOutlined />
            }
            onClick={
              handleNewTransfer
            }
          >
            New Transfer
          </Button>
        </Box>
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

          gap:
            2,

          mb:
            3,
        }}
      >
        {[
          {
            title:
              "Total Transfers",

            value:
              transfers.length.toLocaleString(),
          },

          {
            title:
              "Bottles Transferred",

            value:
              totalTransferred.toLocaleString(),
          },

          {
            title:
              "Transfer Value",

            value:
              `${totalTransferValue.toLocaleString()} FCFA`,
          },

          {
            title:
              "Completed",

            value:
              completedCount.toLocaleString(),
          },

          {
            title:
              "Today",

            value:
              todayCount.toLocaleString(),
          },
        ].map(
          (card) => (
            <Box
              key={
                card.title
              }
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
                {
                  card.title
                }
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  mt:
                    0.5,

                  fontWeight:
                    700,
                }}
              >
                {
                  card.value
                }
              </Typography>
            </Box>
          )
        )}
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

            flexDirection:
              {
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
            placeholder="Search transfers..."
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
              width:
                {
                  xs:
                    "100%",

                  lg:
                    340,
                },
            }}
            slotProps={{
              input:
                {
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
            label="From Location"
            value={
              sourceFilter
            }
            onChange={
              (event) =>
                setSourceFilter(
                  event.target.value
                )
            }
            sx={{
              width:
                {
                  xs:
                    "100%",

                  lg:
                    220,
                },
            }}
          >
            <MenuItem value="">
              All source locations
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

          <TextField
            select
            label="To Location"
            value={
              destinationFilter
            }
            onChange={
              (event) =>
                setDestinationFilter(
                  event.target.value
                )
            }
            sx={{
              width:
                {
                  xs:
                    "100%",

                  lg:
                    220,
                },
            }}
          >
            <MenuItem value="">
              All destination locations
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
              row.transferNumber ??
              `${row.sourceLocationId}-${row.destinationLocationId}-${row.drinkId}-${row.transferDate}`
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

            "& .MuiDataGrid-columnHeaders":
              {
                bgcolor:
                  "#f8fafc",
              },
          }}
        />
      </Box>

      <TransferDialog
        open={
          dialogOpen
        }
        drinks={
          drinks
        }
        locations={
          locations
        }
        inventory={
          inventory
        }
        transfer={
          selectedTransfer
        }
        onClose={() => {
          setDialogOpen(
            false
          );

          setSelectedTransfer(
            null
          );
        }}
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
            : () =>
                setDeleteDialogOpen(
                  false
                )
        }
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Delete Transfer?
        </DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want
            to delete transfer{" "}
            <strong>
              {transferToDelete
                ?.transferNumber ??
                ""}
            </strong>
            ?
          </Typography>

          <Alert
            severity="warning"
            sx={{
              mt:
                2,
            }}
          >
            Deleting a stock transfer may affect the inventory quantities.
          </Alert>
        </DialogContent>

        <DialogActions>
          <Button
            color="inherit"
            disabled={
              deleting
            }
            onClick={() =>
              setDeleteDialogOpen(
                false
              )
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
              : "Delete"}
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
          {
            message
          }
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Transfers;
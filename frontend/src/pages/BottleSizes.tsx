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

import BottleSizeDialog from "../components/bottleSizes/BottleSizeDialog";
import DeleteBottleSizeDialog from "../components/bottleSizes/DeleteBottleSizeDialog";
import {
  createBottleSize,
  deleteBottleSize,
  getBottleSizes,
  updateBottleSize,
} from "../services/bottleSizeService";
import type { BottleSize } from "../types/bottleSize";

function BottleSizes() {
  const [bottleSizes, setBottleSizes] =
    useState<BottleSize[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [
    dialogOpen,
    setDialogOpen,
  ] = useState(false);

  const [
    selectedBottleSize,
    setSelectedBottleSize,
  ] = useState<BottleSize | null>(
    null
  );

  const [
    deleteDialogOpen,
    setDeleteDialogOpen,
  ] = useState(false);

  const [
    bottleSizeToDelete,
    setBottleSizeToDelete,
  ] = useState<BottleSize | null>(
    null
  );

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

  const loadBottleSizes =
    async () => {
      setLoading(true);

      try {
        const data =
          await getBottleSizes();

        setBottleSizes(data);
      } catch (error) {
        console.error(
          "Could not load bottle sizes:",
          error
        );

        setMessageType("error");

        setMessage(
          "Could not load bottle sizes. Check that the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    void loadBottleSizes();
  }, []);

  const filteredBottleSizes =
    useMemo(() => {
      const searchText =
        search
          .trim()
          .toLowerCase();

      if (!searchText) {
        return bottleSizes;
      }

      return bottleSizes.filter(
        (bottleSize) =>
          bottleSize.name
            .toLowerCase()
            .includes(searchText)
      );
    }, [
      bottleSizes,
      search,
    ]);

  const handleOpenAdd = () => {
    setSelectedBottleSize(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (
    bottleSize: BottleSize
  ) => {
    setSelectedBottleSize(
      bottleSize
    );

    setDialogOpen(true);
  };

  const handleCloseDialog =
    () => {
      setDialogOpen(false);
      setSelectedBottleSize(null);
    };

  const handleSave = async (
    bottleSize: Omit<
      BottleSize,
      "id"
    >
  ) => {
    try {
      if (
        selectedBottleSize?.id
      ) {
        await updateBottleSize(
          selectedBottleSize.id,
          bottleSize
        );

        setMessage(
          "Bottle size updated successfully."
        );
      } else {
        await createBottleSize(
          bottleSize
        );

        setMessage(
          "Bottle size added successfully."
        );
      }

      setMessageType("success");

      await loadBottleSizes();
    } catch (error) {
      console.error(
        "Could not save bottle size:",
        error
      );

      setMessageType("error");

      setMessage(
        "Could not save the bottle size."
      );

      throw error;
    }
  };

  const handleOpenDelete = (
    bottleSize: BottleSize
  ) => {
    setBottleSizeToDelete(
      bottleSize
    );

    setDeleteDialogOpen(true);
  };

  const handleCloseDelete =
    () => {
      setDeleteDialogOpen(false);
      setBottleSizeToDelete(null);
    };

  const handleDelete =
    async () => {
      if (
        !bottleSizeToDelete?.id
      ) {
        return;
      }

      setDeleting(true);

      try {
        await deleteBottleSize(
          bottleSizeToDelete.id
        );

        setMessageType("success");

        setMessage(
          "Bottle size deleted successfully."
        );

        handleCloseDelete();

        await loadBottleSizes();
      } catch (error) {
        console.error(
          "Could not delete bottle size:",
          error
        );

        setMessageType("error");

        setMessage(
          "Could not delete the bottle size."
        );
      } finally {
        setDeleting(false);
      }
    };

  const activeCount =
    bottleSizes.filter(
      (bottleSize) =>
        bottleSize.isActive
    ).length;

  const inactiveCount =
    bottleSizes.filter(
      (bottleSize) =>
        !bottleSize.isActive
    ).length;

  const columns: GridColDef<BottleSize>[] =
    [
      {
        field: "name",
        headerName:
          "Bottle Size",
        flex: 1,
        minWidth: 220,
      },
      {
        field: "status",
        headerName: "Status",
        width: 140,
        sortable: false,
        filterable: false,
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
          />
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 220,
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
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          justifyContent:
            "space-between",
          alignItems: {
            xs: "stretch",
            sm: "center",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4">
            Bottle Sizes
          </Typography>

          <Typography color="text.secondary">
            Create and manage
            standard drink sizes.
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
          Add Bottle Size
        </Button>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, 1fr)",
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
            bgcolor:
              "background.paper",
          }}
        >
          <Typography color="text.secondary">
            Total Bottle Sizes
          </Typography>

          <Typography variant="h5">
            {bottleSizes.length}
          </Typography>
        </Box>

        <Box
          sx={{
            border:
              "1px solid #e5e7eb",
            borderRadius: 3,
            p: 2,
            bgcolor:
              "background.paper",
          }}
        >
          <Typography color="text.secondary">
            Active
          </Typography>

          <Typography variant="h5">
            {activeCount}
          </Typography>
        </Box>

        <Box
          sx={{
            border:
              "1px solid #e5e7eb",
            borderRadius: 3,
            p: 2,
            bgcolor:
              "background.paper",
          }}
        >
          <Typography color="text.secondary">
            Inactive
          </Typography>

          <Typography variant="h5">
            {inactiveCount}
          </Typography>
        </Box>
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
        <TextField
          placeholder="Search bottle sizes..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          sx={{
            mb: 2,
            width: {
              xs: "100%",
              sm: 360,
            },
          }}
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

        <DataGrid
          rows={
            filteredBottleSizes
          }
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
          ]}
          initialState={{
            pagination: {
              paginationModel:
                {
                  pageSize: 10,
                  page: 0,
                },
            },
          }}
          sx={{
            minHeight: 520,
            border: 0,
            "& .MuiDataGrid-columnHeaders":
              {
                bgcolor:
                  "#f8fafc",
              },
          }}
        />
      </Box>

      <BottleSizeDialog
        open={dialogOpen}
        bottleSize={
          selectedBottleSize
        }
        onClose={
          handleCloseDialog
        }
        onSave={handleSave}
      />

      <DeleteBottleSizeDialog
        open={
          deleteDialogOpen
        }
        bottleSize={
          bottleSizeToDelete
        }
        deleting={deleting}
        onClose={
          handleCloseDelete
        }
        onConfirm={
          handleDelete
        }
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

export default BottleSizes;
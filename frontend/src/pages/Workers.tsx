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
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";

import DeleteWorkerDialog from "../components/workers/DeleteWorkerDialog";
import WorkerDialog from "../components/workers/WorkerDialog";
import {
  createWorker,
  deleteWorker,
  getWorkers,
  updateWorker,
} from "../services/workerService";
import type {
  CreateWorkerDto,
  UpdateWorkerDto,
  Worker,
} from "../types/worker";

function Workers() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] =
    useState<Worker | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);
  const [workerToDelete, setWorkerToDelete] =
    useState<Worker | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState<"success" | "error">("success");

  const loadWorkers = async () => {
    setLoading(true);

    try {
      const data = await getWorkers();
      setWorkers(data);
    } catch (error) {
      console.error("Could not load workers:", error);

      setMessageType("error");
      setMessage(
        "Could not load workers. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadWorkers();
  }, []);

  const roles = useMemo(() => {
    return Array.from(
      new Set(
        workers
          .map((worker) => worker.role)
          .filter(Boolean)
      )
    ).sort();
  }, [workers]);

  const filteredWorkers = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return workers.filter((worker) => {
      const fullName =
        `${worker.firstName} ${worker.lastName}`.toLowerCase();

      const matchesSearch =
        !searchText ||
        [
          worker.workerNumber,
          fullName,
          worker.phone,
          worker.email,
          worker.role,
          worker.username,
        ].some((value) =>
          value.toLowerCase().includes(searchText)
        );

      const matchesRole =
        !roleFilter ||
        worker.role === roleFilter;

      const matchesStatus =
        !statusFilter ||
        (statusFilter === "Active"
          ? worker.isActive
          : !worker.isActive);

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    workers,
    search,
    roleFilter,
    statusFilter,
  ]);

  const handleOpenAdd = () => {
    setSelectedWorker(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (worker: Worker) => {
    setSelectedWorker(worker);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedWorker(null);
  };

  const handleCreate = async (
    worker: CreateWorkerDto
  ) => {
    try {
      await createWorker(worker);

      setMessageType("success");
      setMessage("Worker added successfully.");

      await loadWorkers();
    } catch (error) {
      console.error("Could not create worker:", error);

      setMessageType("error");
      setMessage(
        "Could not create the worker. The username or email may already exist."
      );

      throw error;
    }
  };

  const handleUpdate = async (
    id: string,
    worker: UpdateWorkerDto
  ) => {
    try {
      await updateWorker(id, worker);

      setMessageType("success");
      setMessage("Worker updated successfully.");

      await loadWorkers();
    } catch (error) {
      console.error("Could not update worker:", error);

      setMessageType("error");
      setMessage(
        "Could not update the worker. Check the form values."
      );

      throw error;
    }
  };

  const handleOpenDelete = (worker: Worker) => {
    setWorkerToDelete(worker);
    setDeleteDialogOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false);
    setWorkerToDelete(null);
  };

  const handleDelete = async () => {
    if (!workerToDelete?.id) {
      return;
    }

    setDeleting(true);

    try {
      await deleteWorker(workerToDelete.id);

      setMessageType("success");
      setMessage("Worker deleted successfully.");

      handleCloseDelete();
      await loadWorkers();
    } catch (error) {
      console.error("Could not delete worker:", error);

      setMessageType("error");
      setMessage("Could not delete the worker.");
    } finally {
      setDeleting(false);
    }
  };

  const columns: GridColDef<Worker>[] = [
    {
      field: "workerNumber",
      headerName: "Worker Number",
      minWidth: 210,
      flex: 1,
    },
    {
      field: "fullName",
      headerName: "Name",
      minWidth: 190,
      flex: 1,
      valueGetter: (_value, row) =>
        `${row.firstName} ${row.lastName}`,
    },
    {
      field: "role",
      headerName: "Role",
      minWidth: 140,
      flex: 0.8,
    },
    {
      field: "phone",
      headerName: "Phone",
      minWidth: 160,
      flex: 0.9,
      valueGetter: (_value, row) =>
        row.phone || "—",
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 220,
      flex: 1.2,
      valueGetter: (_value, row) =>
        row.email || "—",
    },
    {
      field: "username",
      headerName: "Username",
      minWidth: 140,
      flex: 0.8,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
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
      field: "createdAt",
      headerName: "Created",
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
            startIcon={<EditOutlined />}
            onClick={() =>
              handleOpenEdit(params.row)
            }
          >
            Edit
          </Button>

          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<DeleteOutlined />}
            onClick={() =>
              handleOpenDelete(params.row)
            }
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const totalWorkers = workers.length;

  const activeWorkers = workers.filter(
    (worker) => worker.isActive
  ).length;

  const inactiveWorkers = workers.filter(
    (worker) => !worker.isActive
  ).length;

  const managerCount = workers.filter(
    (worker) => worker.role === "Manager"
  ).length;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          justifyContent: "space-between",
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
            Workers
          </Typography>

          <Typography color="text.secondary">
            Manage staff accounts, roles and status.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddOutlined />}
          onClick={handleOpenAdd}
        >
          Add Worker
        </Button>
      </Box>

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
            bgcolor: "background.paper",
            border: "1px solid #e5e7eb",
            borderRadius: 3,
            p: 2,
          }}
        >
          <Typography color="text.secondary">
            Total Workers
          </Typography>

          <Typography variant="h4">
            {totalWorkers}
          </Typography>
        </Box>

        <Box
          sx={{
            bgcolor: "background.paper",
            border: "1px solid #e5e7eb",
            borderRadius: 3,
            p: 2,
          }}
        >
          <Typography color="text.secondary">
            Active Workers
          </Typography>

          <Typography variant="h4">
            {activeWorkers}
          </Typography>
        </Box>

        <Box
          sx={{
            bgcolor: "background.paper",
            border: "1px solid #e5e7eb",
            borderRadius: 3,
            p: 2,
          }}
        >
          <Typography color="text.secondary">
            Inactive Workers
          </Typography>

          <Typography variant="h4">
            {inactiveWorkers}
          </Typography>
        </Box>

        <Box
          sx={{
            bgcolor: "background.paper",
            border: "1px solid #e5e7eb",
            borderRadius: 3,
            p: 2,
          }}
        >
          <Typography color="text.secondary">
            Managers
          </Typography>

          <Typography variant="h4">
            {managerCount}
          </Typography>
        </Box>
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
            display: "flex",
            flexDirection: {
              xs: "column",
              lg: "row",
            },
            gap: 2,
            mb: 2,
          }}
        >
          <TextField
            placeholder="Search workers..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            sx={{
              width: {
                xs: "100%",
                lg: 340,
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

          <TextField
            select
            label="Role"
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(event.target.value)
            }
            sx={{
              width: {
                xs: "100%",
                lg: 220,
              },
            }}
          >
            <MenuItem value="">
              All roles
            </MenuItem>

            {roles.map((role) => (
              <MenuItem
                key={role}
                value={role}
              >
                {role}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            sx={{
              width: {
                xs: "100%",
                lg: 200,
              },
            }}
          >
            <MenuItem value="">
              All statuses
            </MenuItem>

            <MenuItem value="Active">
              Active
            </MenuItem>

            <MenuItem value="Inactive">
              Inactive
            </MenuItem>
          </TextField>
        </Box>

        <DataGrid
          rows={filteredWorkers}
          columns={columns}
          loading={loading}
          getRowId={(row) =>
            row.id ??
            row.workerNumber
          }
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: {
              paginationModel: {
                page: 0,
                pageSize: 10,
              },
            },
          }}
          sx={{
            minHeight: 520,
            border: 0,
            "& .MuiDataGrid-columnHeaders": {
              bgcolor: "#f8fafc",
            },
          }}
        />
      </Box>

      <WorkerDialog
        open={dialogOpen}
        worker={selectedWorker}
        onClose={handleCloseDialog}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />

      <DeleteWorkerDialog
        open={deleteDialogOpen}
        worker={workerToDelete}
        deleting={deleting}
        onClose={handleCloseDelete}
        onConfirm={handleDelete}
      />

      <Snackbar
        open={Boolean(message)}
        autoHideDuration={4000}
        onClose={() => setMessage("")}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={messageType}
          variant="filled"
          onClose={() => setMessage("")}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Workers;
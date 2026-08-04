import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import type { Worker } from "../../types/worker";

type DeleteWorkerDialogProps = {
  open: boolean;
  worker: Worker | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

function DeleteWorkerDialog({
  open,
  worker,
  deleting,
  onClose,
  onConfirm,
}: DeleteWorkerDialogProps) {
  const fullName = worker
    ? `${worker.firstName} ${worker.lastName}`
    : "this worker";

  return (
    <Dialog
      open={open}
      onClose={deleting ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Delete Worker</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete{" "}
          <strong>{fullName}</strong>?
        </DialogContentText>

        <DialogContentText sx={{ mt: 2 }}>
          Worker number:{" "}
          <strong>
            {worker?.workerNumber ?? "—"}
          </strong>
        </DialogContentText>

        <DialogContentText sx={{ mt: 1 }}>
          Role:{" "}
          <strong>{worker?.role ?? "—"}</strong>
        </DialogContentText>

        <DialogContentText sx={{ mt: 2 }}>
          This action cannot be undone.
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          color="inherit"
          disabled={deleting}
        >
          Cancel
        </Button>

        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteWorkerDialog;
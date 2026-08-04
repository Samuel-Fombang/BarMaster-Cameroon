import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import type { Location } from "../../types/location";

type DeleteLocationDialogProps = {
  open: boolean;
  location: Location | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

function DeleteLocationDialog({
  open,
  location,
  deleting,
  onClose,
  onConfirm,
}: DeleteLocationDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={deleting ? undefined : onClose}
    >
      <DialogTitle>Delete Location</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete{" "}
          <strong>{location?.name ?? "this location"}</strong>?
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

export default DeleteLocationDialog;
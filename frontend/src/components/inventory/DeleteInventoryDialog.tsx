import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import type { Inventory } from "../../types/inventory";

type DeleteInventoryDialogProps = {
  open: boolean;
  inventory: Inventory | null;
  deleting: boolean;
  drinkName: string;
  locationName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

function DeleteInventoryDialog({
  open,
  inventory,
  deleting,
  drinkName,
  locationName,
  onClose,
  onConfirm,
}: DeleteInventoryDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={deleting ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Delete Inventory Record</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the inventory record for{" "}
          <strong>{drinkName || "this drink"}</strong> at{" "}
          <strong>{locationName || "this location"}</strong>?
        </DialogContentText>

        <DialogContentText sx={{ mt: 2 }}>
          Current quantity:{" "}
          <strong>{inventory?.quantity ?? 0}</strong>
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

export default DeleteInventoryDialog;
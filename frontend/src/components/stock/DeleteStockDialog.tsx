import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import type { Stock } from "../../types/stock";

type DeleteStockDialogProps = {
  open: boolean;
  stock: Stock | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

function DeleteStockDialog({
  open,
  stock,
  deleting,
  onClose,
  onConfirm,
}: DeleteStockDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={deleting ? undefined : onClose}
    >
      <DialogTitle>Delete Stock Record</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this stock record?
          <br />
          <br />
          Drink ID: <strong>{stock?.drinkId ?? "Unknown"}</strong>
          <br />
          Current quantity:{" "}
          <strong>{stock?.currentQuantity ?? 0}</strong>
          <br />
          <br />
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

export default DeleteStockDialog;
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import type { Supplier } from "../../types/supplier";

type DeleteSupplierDialogProps = {
  open: boolean;
  supplier: Supplier | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

function DeleteSupplierDialog({
  open,
  supplier,
  deleting,
  onClose,
  onConfirm,
}: DeleteSupplierDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={deleting ? undefined : onClose}
    >
      <DialogTitle>Delete Supplier</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete{" "}
          <strong>{supplier?.name ?? "this supplier"}</strong>?
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

export default DeleteSupplierDialog;
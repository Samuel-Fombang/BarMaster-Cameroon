import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import type { Brand } from "../../types/brand";

type DeleteBrandDialogProps = {
  open: boolean;
  brand: Brand | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

function DeleteBrandDialog({
  open,
  brand,
  deleting,
  onClose,
  onConfirm,
}: DeleteBrandDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={deleting ? undefined : onClose}
    >
      <DialogTitle>Delete Brand</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete{" "}
          <strong>{brand?.name ?? "this brand"}</strong>?
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

export default DeleteBrandDialog;
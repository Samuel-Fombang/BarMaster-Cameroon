import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import type { Category } from "../../types/category";

type DeleteCategoryDialogProps = {
  open: boolean;
  category: Category | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

function DeleteCategoryDialog({
  open,
  category,
  deleting,
  onClose,
  onConfirm,
}: DeleteCategoryDialogProps) {
  return (
    <Dialog open={open} onClose={deleting ? undefined : onClose}>
      <DialogTitle>Delete Category</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete{" "}
          <strong>{category?.name ?? "this category"}</strong>?
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

export default DeleteCategoryDialog;
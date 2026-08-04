import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import type { Expense } from "../../types/expense";

type DeleteExpenseDialogProps = {
  open: boolean;
  expense: Expense | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

function DeleteExpenseDialog({
  open,
  expense,
  deleting,
  onClose,
  onConfirm,
}: DeleteExpenseDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={deleting ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Delete Expense</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this expense?
        </DialogContentText>

        <DialogContentText sx={{ mt: 2 }}>
          <strong>{expense?.description ?? "Expense"}</strong>
        </DialogContentText>

        <DialogContentText sx={{ mt: 1 }}>
          Amount:{" "}
          <strong>
            {(expense?.amount ?? 0).toLocaleString()} FCFA
          </strong>
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

export default DeleteExpenseDialog;
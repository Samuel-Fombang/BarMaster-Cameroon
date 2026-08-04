import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import type { BottleSize } from "../../types/bottleSize";

type DeleteBottleSizeDialogProps = {
  open: boolean;
  bottleSize?: BottleSize | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function DeleteBottleSizeDialog({
  open,
  bottleSize,
  deleting,
  onClose,
  onConfirm,
}: DeleteBottleSizeDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={deleting ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>
        Delete Bottle Size
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete{" "}
          <strong>
            {bottleSize?.name ?? "this bottle size"}
          </strong>
          ?
        </DialogContentText>

        <DialogContentText sx={{ mt: 1 }}>
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

export default DeleteBottleSizeDialog;
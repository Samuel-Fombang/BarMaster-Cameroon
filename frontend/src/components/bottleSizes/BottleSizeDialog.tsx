import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import {
  useEffect,
  useState,
} from "react";

import type { BottleSize } from "../../types/bottleSize";

type BottleSizeDialogProps = {
  open: boolean;
  bottleSize?: BottleSize | null;
  onClose: () => void;
  onSave: (
    bottleSize: Omit<BottleSize, "id">
  ) => Promise<void>;
};

type BottleSizeErrors = {
  name?: string;
};

const emptyBottleSize: Omit<
  BottleSize,
  "id"
> = {
  name: "",
  isActive: true,
};

function BottleSizeDialog({
  open,
  bottleSize,
  onClose,
  onSave,
}: BottleSizeDialogProps) {
  const [formData, setFormData] =
    useState<
      Omit<BottleSize, "id">
    >(emptyBottleSize);

  const [errors, setErrors] =
    useState<BottleSizeErrors>({});

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    if (bottleSize) {
      setFormData({
        name: bottleSize.name,
        isActive:
          bottleSize.isActive,
      });
    } else {
      setFormData({
        ...emptyBottleSize,
      });
    }

    setErrors({});
  }, [bottleSize, open]);

  const validate = () => {
    const newErrors: BottleSizeErrors =
      {};

    if (!formData.name.trim()) {
      newErrors.name =
        "Bottle size is required.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length ===
      0
    );
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    setSaving(true);

    try {
      await onSave({
        name: formData.name.trim(),
        isActive:
          formData.isActive,
      });

      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={
        saving ? undefined : onClose
      }
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {bottleSize
          ? "Edit Bottle Size"
          : "Add Bottle Size"}
      </DialogTitle>

      <DialogContent dividers>
        <TextField
          label="Bottle Size"
          value={formData.name}
          onChange={(event) => {
            setFormData((current) => ({
              ...current,
              name: event.target.value,
            }));

            setErrors((current) => ({
              ...current,
              name: undefined,
            }));
          }}
          error={Boolean(errors.name)}
          helperText={
            errors.name ??
            "Examples: 33 cl, 50 cl, 1.5 L, 33 cl Can"
          }
          autoFocus
          fullWidth
          required
          sx={{ mt: 1 }}
        />

        <FormControlLabel
          sx={{ mt: 2 }}
          control={
            <Switch
              checked={
                formData.isActive
              }
              onChange={(event) =>
                setFormData(
                  (current) => ({
                    ...current,
                    isActive:
                      event.target
                        .checked,
                  })
                )
              }
            />
          }
          label="Active Bottle Size"
        />
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          color="inherit"
          disabled={saving}
        >
          Cancel
        </Button>

        <Button
          onClick={handleSave}
          variant="contained"
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : bottleSize
              ? "Update Bottle Size"
              : "Save Bottle Size"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default BottleSizeDialog;
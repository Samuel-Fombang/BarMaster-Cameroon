import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  MenuItem,
  Switch,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

import type { Drink } from "../../types/drink";
import type { Stock } from "../../types/stock";

type StockDialogProps = {
  open: boolean;
  stock?: Stock | null;
  drinks: Drink[];
  onClose: () => void;
  onSave: (stock: Stock) => Promise<void>;
};

type StockErrors = {
  drinkId?: string;
  currentQuantity?: string;
  minimumQuantity?: string;
};

const emptyStock: Stock = {
  drinkId: "",
  currentQuantity: 0,
  minimumQuantity: 0,
  isActive: true,
};

function StockDialog({
  open,
  stock,
  drinks,
  onClose,
  onSave,
}: StockDialogProps) {
  const [formData, setFormData] = useState<Stock>(emptyStock);
  const [errors, setErrors] = useState<StockErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (stock) {
      setFormData({ ...stock });
    } else {
      setFormData({ ...emptyStock });
    }

    setErrors({});
  }, [stock, open]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));
  };

  const validate = () => {
    const newErrors: StockErrors = {};

    if (!formData.drinkId.trim()) {
      newErrors.drinkId = "Please select a drink.";
    }

    if (formData.currentQuantity < 0) {
      newErrors.currentQuantity =
        "Current quantity cannot be negative.";
    }

    if (formData.minimumQuantity < 0) {
      newErrors.minimumQuantity =
        "Minimum quantity cannot be negative.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    setSaving(true);

    try {
      await onSave(formData);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {stock ? "Edit Stock" : "Add Stock"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12 }}>
            <TextField
              select
              label="Drink"
              name="drinkId"
              value={formData.drinkId}
              onChange={handleChange}
              error={Boolean(errors.drinkId)}
              helperText={errors.drinkId}
              fullWidth
              required
              disabled={Boolean(stock)}
            >
              <MenuItem value="">
                Select drink
              </MenuItem>

              {drinks.map((drink) => (
                <MenuItem
                  key={drink.id ?? drink.name}
                  value={drink.id ?? ""}
                >
                  {drink.name}
                  {drink.brand ? ` — ${drink.brand}` : ""}
                  {drink.bottleSize ? ` (${drink.bottleSize})` : ""}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Current Quantity"
              name="currentQuantity"
              type="number"
              value={formData.currentQuantity}
              onChange={handleChange}
              error={Boolean(errors.currentQuantity)}
              helperText={errors.currentQuantity}
              slotProps={{
                htmlInput: {
                  min: 0,
                },
              }}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Minimum Quantity"
              name="minimumQuantity"
              type="number"
              value={formData.minimumQuantity}
              onChange={handleChange}
              error={Boolean(errors.minimumQuantity)}
              helperText={errors.minimumQuantity}
              slotProps={{
                htmlInput: {
                  min: 0,
                },
              }}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormControlLabel
              control={
                <Switch
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
              }
              label="Active Stock"
            />
          </Grid>
        </Grid>
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
          variant="contained"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Stock"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default StockDialog;
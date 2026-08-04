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
import { useEffect, useMemo, useState } from "react";

import type { Drink } from "../../types/drink";
import type { Inventory } from "../../types/inventory";
import type { Location } from "../../types/location";

type InventoryDialogProps = {
  open: boolean;
  inventory?: Inventory | null;
  drinks: Drink[];
  locations: Location[];
  existingInventory: Inventory[];
  onClose: () => void;
  onSave: (inventory: Inventory) => Promise<void>;
};

type InventoryErrors = {
  drinkId?: string;
  locationId?: string;
  quantity?: string;
  minimumQuantity?: string;
};

const emptyInventory: Inventory = {
  drinkId: "",
  locationId: "",
  quantity: 0,
  minimumQuantity: 0,
  isActive: true,
};

function InventoryDialog({
  open,
  inventory,
  drinks,
  locations,
  existingInventory,
  onClose,
  onSave,
}: InventoryDialogProps) {
  const [formData, setFormData] =
    useState<Inventory>(emptyInventory);

  const [errors, setErrors] =
    useState<InventoryErrors>({});

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (inventory) {
      setFormData({ ...inventory });
    } else {
      setFormData({ ...emptyInventory });
    }

    setErrors({});
  }, [inventory, open]);

  const availableDrinks = useMemo(() => {
    if (inventory) {
      return drinks;
    }

    if (!formData.locationId) {
      return drinks;
    }

    const usedDrinkIds = new Set(
      existingInventory
        .filter(
          (item) =>
            item.locationId === formData.locationId
        )
        .map((item) => item.drinkId)
    );

    return drinks.filter(
      (drink) =>
        Boolean(drink.id) &&
        !usedDrinkIds.has(drink.id as string)
    );
  }, [
    drinks,
    existingInventory,
    formData.locationId,
    inventory,
  ]);

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
    const newErrors: InventoryErrors = {};

    if (!formData.locationId.trim()) {
      newErrors.locationId =
        "Please select a location.";
    }

    if (!formData.drinkId.trim()) {
      newErrors.drinkId =
        "Please select a drink.";
    }

    if (formData.quantity < 0) {
      newErrors.quantity =
        "Quantity cannot be negative.";
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
        {inventory
          ? "Edit Inventory"
          : "Add Inventory"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12 }}>
            <TextField
              select
              label="Location"
              name="locationId"
              value={formData.locationId}
              onChange={handleChange}
              error={Boolean(errors.locationId)}
              helperText={errors.locationId}
              fullWidth
              required
              disabled={Boolean(inventory)}
            >
              <MenuItem value="">
                Select location
              </MenuItem>

              {locations
                .filter((location) => location.isActive)
                .map((location) => (
                  <MenuItem
                    key={location.id ?? location.name}
                    value={location.id ?? ""}
                  >
                    {location.name}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>

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
              disabled={
                Boolean(inventory) ||
                !formData.locationId
              }
            >
              <MenuItem value="">
                Select drink
              </MenuItem>

              {availableDrinks
                .filter((drink) => drink.isActive)
                .map((drink) => (
                  <MenuItem
                    key={drink.id ?? drink.name}
                    value={drink.id ?? ""}
                  >
                    {drink.name}
                    {drink.brand
                      ? ` — ${drink.brand}`
                      : ""}
                    {drink.bottleSize
                      ? ` (${drink.bottleSize})`
                      : ""}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              error={Boolean(errors.quantity)}
              helperText={errors.quantity}
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
              error={Boolean(
                errors.minimumQuantity
              )}
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
              label="Active Inventory"
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
          {saving
            ? "Saving..."
            : "Save Inventory"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default InventoryDialog;
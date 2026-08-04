import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import type { Drink } from "../../types/drink";
import type { Inventory } from "../../types/inventory";
import type { Location } from "../../types/location";
import type { Transfer } from "../../types/transfer";

type TransferDialogProps = {
  open: boolean;
  drinks: Drink[];
  locations: Location[];
  inventory: Inventory[];
  onClose: () => void;
  onSave: (transfer: Transfer) => Promise<void>;
};

type TransferErrors = {
  sourceLocationId?: string;
  destinationLocationId?: string;
  drinkId?: string;
  quantity?: string;
  reason?: string;
};

const emptyTransfer: Transfer = {
  sourceLocationId: "",
  destinationLocationId: "",
  drinkId: "",
  quantity: 1,
  reason: "",
};

function TransferDialog({
  open,
  drinks,
  locations,
  inventory,
  onClose,
  onSave,
}: TransferDialogProps) {
  const [formData, setFormData] =
    useState<Transfer>(emptyTransfer);

  const [errors, setErrors] =
    useState<TransferErrors>({});

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData({ ...emptyTransfer });
      setErrors({});
    }
  }, [open]);

  const sourceLocations = useMemo(() => {
    return locations.filter((location) => {
      if (!location.id || !location.isActive) {
        return false;
      }

      return inventory.some(
        (item) =>
          item.locationId === location.id &&
          item.quantity > 0 &&
          item.isActive
      );
    });
  }, [locations, inventory]);

  const availableDrinks = useMemo(() => {
    if (!formData.sourceLocationId) {
      return [];
    }

    const availableDrinkIds = new Set(
      inventory
        .filter(
          (item) =>
            item.locationId === formData.sourceLocationId &&
            item.quantity > 0 &&
            item.isActive
        )
        .map((item) => item.drinkId)
    );

    return drinks.filter(
      (drink) =>
        Boolean(drink.id) &&
        drink.isActive &&
        availableDrinkIds.has(drink.id as string)
    );
  }, [
    drinks,
    inventory,
    formData.sourceLocationId,
  ]);

  const destinationLocations = useMemo(() => {
    return locations.filter(
      (location) =>
        Boolean(location.id) &&
        location.isActive &&
        location.id !== formData.sourceLocationId
    );
  }, [locations, formData.sourceLocationId]);

  const availableQuantity = useMemo(() => {
    if (
      !formData.sourceLocationId ||
      !formData.drinkId
    ) {
      return 0;
    }

    return (
      inventory.find(
        (item) =>
          item.locationId === formData.sourceLocationId &&
          item.drinkId === formData.drinkId
      )?.quantity ?? 0
    );
  }, [
    inventory,
    formData.sourceLocationId,
    formData.drinkId,
  ]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = event.target;

    setFormData((current) => {
      const nextValue =
        type === "number" ? Number(value) : value;

      if (name === "sourceLocationId") {
        return {
          ...current,
          sourceLocationId: String(nextValue),
          destinationLocationId: "",
          drinkId: "",
          quantity: 1,
        };
      }

      if (name === "drinkId") {
        return {
          ...current,
          drinkId: String(nextValue),
          quantity: 1,
        };
      }

      return {
        ...current,
        [name]: nextValue,
      };
    });

    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));
  };

  const validate = () => {
    const newErrors: TransferErrors = {};

    if (!formData.sourceLocationId) {
      newErrors.sourceLocationId =
        "Please select a source location.";
    }

    if (!formData.destinationLocationId) {
      newErrors.destinationLocationId =
        "Please select a destination location.";
    }

    if (
      formData.sourceLocationId &&
      formData.destinationLocationId &&
      formData.sourceLocationId ===
        formData.destinationLocationId
    ) {
      newErrors.destinationLocationId =
        "Destination must be different from source.";
    }

    if (!formData.drinkId) {
      newErrors.drinkId = "Please select a drink.";
    }

    if (formData.quantity <= 0) {
      newErrors.quantity =
        "Quantity must be greater than zero.";
    }

    if (formData.quantity > availableQuantity) {
      newErrors.quantity =
        `Only ${availableQuantity} bottles are available.`;
    }

    if (formData.reason.length > 500) {
      newErrors.reason =
        "Maximum 500 characters.";
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
        Transfer Stock
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12 }}>
            <TextField
              select
              label="From Location"
              name="sourceLocationId"
              value={formData.sourceLocationId}
              onChange={handleChange}
              error={Boolean(errors.sourceLocationId)}
              helperText={errors.sourceLocationId}
              fullWidth
              required
            >
              <MenuItem value="">
                Select source location
              </MenuItem>

              {sourceLocations.map((location) => (
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
              label="To Location"
              name="destinationLocationId"
              value={formData.destinationLocationId}
              onChange={handleChange}
              error={Boolean(
                errors.destinationLocationId
              )}
              helperText={
                errors.destinationLocationId
              }
              fullWidth
              required
              disabled={!formData.sourceLocationId}
            >
              <MenuItem value="">
                Select destination location
              </MenuItem>

              {destinationLocations.map((location) => (
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
              disabled={!formData.sourceLocationId}
            >
              <MenuItem value="">
                Select drink
              </MenuItem>

              {availableDrinks.map((drink) => (
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

          {formData.drinkId && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="info">
                Available quantity:{" "}
                <strong>{availableQuantity}</strong>
              </Alert>
            </Grid>
          )}

          <Grid size={{ xs: 12 }}>
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
                  min: 1,
                  max: availableQuantity || undefined,
                },
              }}
              fullWidth
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              error={Boolean(errors.reason)}
              helperText={errors.reason}
              placeholder="Example: Stock issued to the bar"
              multiline
              rows={3}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Saving this transfer will immediately reduce
              stock at the source and increase stock at the
              destination.
            </Typography>
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
          onClick={handleSave}
          variant="contained"
          disabled={saving}
        >
          {saving
            ? "Transferring..."
            : "Complete Transfer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TransferDialog;
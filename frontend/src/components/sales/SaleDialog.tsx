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
import type {
  PaymentMethod,
  Sale,
} from "../../types/sale";

type SaleDialogProps = {
  open: boolean;
  drinks: Drink[];
  locations: Location[];
  inventory: Inventory[];
  onClose: () => void;
  onSave: (sale: Sale) => Promise<void>;
};

type SaleErrors = {
  locationId?: string;
  drinkId?: string;
  quantity?: string;
  unitSellingPrice?: string;
  paymentMethod?: string;
  customerName?: string;
  notes?: string;
};

const emptySale: Sale = {
  locationId: "",
  drinkId: "",
  quantity: 1,
  unitSellingPrice: 0,
  paymentMethod: "Cash",
  customerName: "",
  notes: "",
};

const paymentMethods: {
  value: PaymentMethod;
  label: string;
}[] = [
  {
    value: "Cash",
    label: "Cash",
  },
  {
    value: "MTN_MOMO",
    label: "MTN Mobile Money",
  },
  {
    value: "ORANGE_MONEY",
    label: "Orange Money",
  },
  {
    value: "Card",
    label: "Card",
  },
  {
    value: "Credit",
    label: "Credit",
  },
];

function SaleDialog({
  open,
  drinks,
  locations,
  inventory,
  onClose,
  onSave,
}: SaleDialogProps) {
  const [formData, setFormData] =
    useState<Sale>(emptySale);

  const [errors, setErrors] =
    useState<SaleErrors>({});

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData({ ...emptySale });
      setErrors({});
    }
  }, [open]);

  const salesLocations = useMemo(() => {
    return locations.filter(
      (location) =>
        location.isActive &&
        location.type === "SalesArea"
    );
  }, [locations]);

  const availableDrinks = useMemo(() => {
    if (!formData.locationId) {
      return [];
    }

    const availableDrinkIds = new Set(
      inventory
        .filter(
          (item) =>
            item.locationId === formData.locationId &&
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
    formData.locationId,
  ]);

  const selectedDrink = useMemo(() => {
    return drinks.find(
      (drink) => drink.id === formData.drinkId
    );
  }, [drinks, formData.drinkId]);

  const availableQuantity = useMemo(() => {
    if (!formData.locationId || !formData.drinkId) {
      return 0;
    }

    return (
      inventory.find(
        (item) =>
          item.locationId === formData.locationId &&
          item.drinkId === formData.drinkId
      )?.quantity ?? 0
    );
  }, [
    inventory,
    formData.locationId,
    formData.drinkId,
  ]);

  const totalAmount =
    formData.quantity * formData.unitSellingPrice;

  const estimatedBuyingPrice =
    selectedDrink?.buyingPrice ?? 0;

  const estimatedCost =
    formData.quantity * estimatedBuyingPrice;

  const estimatedProfit =
    totalAmount - estimatedCost;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = event.target;

    setFormData((current) => {
      const nextValue =
        type === "number" ? Number(value) : value;

      if (name === "locationId") {
        return {
          ...current,
          locationId: String(nextValue),
          drinkId: "",
          quantity: 1,
          unitSellingPrice: 0,
        };
      }

      if (name === "drinkId") {
        const drink = drinks.find(
          (item) => item.id === value
        );

        return {
          ...current,
          drinkId: String(nextValue),
          quantity: 1,
          unitSellingPrice: drink?.sellingPrice ?? 0,
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
    const newErrors: SaleErrors = {};

    if (!formData.locationId) {
      newErrors.locationId =
        "Please select a sales location.";
    }

    if (!formData.drinkId) {
      newErrors.drinkId =
        "Please select a drink.";
    }

    if (formData.quantity <= 0) {
      newErrors.quantity =
        "Quantity must be greater than zero.";
    }

    if (formData.quantity > availableQuantity) {
      newErrors.quantity =
        `Only ${availableQuantity} bottles are available.`;
    }

    if (formData.unitSellingPrice < 0) {
      newErrors.unitSellingPrice =
        "Selling price cannot be negative.";
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod =
        "Please select a payment method.";
    }

    if (formData.customerName.length > 150) {
      newErrors.customerName =
        "Maximum 150 characters.";
    }

    if (formData.notes.length > 500) {
      newErrors.notes =
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
        Record Sale
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12 }}>
            <TextField
              select
              label="Sales Location"
              name="locationId"
              value={formData.locationId}
              onChange={handleChange}
              error={Boolean(errors.locationId)}
              helperText={errors.locationId}
              fullWidth
              required
            >
              <MenuItem value="">
                Select sales location
              </MenuItem>

              {salesLocations.map((location) => (
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
              disabled={!formData.locationId}
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
                  min: 1,
                  max: availableQuantity || undefined,
                },
              }}
              fullWidth
              required
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Unit Selling Price"
              name="unitSellingPrice"
              type="number"
              value={formData.unitSellingPrice}
              onChange={handleChange}
              error={Boolean(
                errors.unitSellingPrice
              )}
              helperText={
                errors.unitSellingPrice
              }
              slotProps={{
                htmlInput: {
                  min: 0,
                },
              }}
              fullWidth
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Alert severity="success">
              Total sale amount:{" "}
              <strong>
                {totalAmount.toLocaleString()} FCFA
              </strong>
            </Alert>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Alert severity="info">
              Estimated profit:{" "}
              <strong>
                {estimatedProfit.toLocaleString()} FCFA
              </strong>
              {" "}based on the drink buying price.
            </Alert>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              select
              label="Payment Method"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              error={Boolean(errors.paymentMethod)}
              helperText={errors.paymentMethod}
              fullWidth
              required
            >
              {paymentMethods.map((method) => (
                <MenuItem
                  key={method.value}
                  value={method.value}
                >
                  {method.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Customer Name"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              error={Boolean(errors.customerName)}
              helperText={errors.customerName}
              placeholder="Optional"
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              error={Boolean(errors.notes)}
              helperText={errors.notes}
              placeholder="Optional sale notes"
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
              Saving this sale will immediately reduce
              stock at the selected bar location.
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
            ? "Saving Sale..."
            : "Complete Sale"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SaleDialog;
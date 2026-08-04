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
import type { Location } from "../../types/location";
import type {
  PaymentStatus,
  Purchase,
} from "../../types/purchase";
import type { Supplier } from "../../types/supplier";

type PurchaseDialogProps = {
  open: boolean;
  suppliers: Supplier[];
  drinks: Drink[];
  locations: Location[];
  onClose: () => void;
  onSave: (purchase: Purchase) => Promise<void>;
};

type PurchaseErrors = {
  supplierId?: string;
  destinationLocationId?: string;
  drinkId?: string;
  quantity?: string;
  unitBuyingPrice?: string;
  invoiceNumber?: string;
  paymentStatus?: string;
  notes?: string;
};

const emptyPurchase: Purchase = {
  supplierId: "",
  destinationLocationId: "",
  drinkId: "",
  quantity: 1,
  unitBuyingPrice: 0,
  invoiceNumber: "",
  paymentStatus: "Paid",
  notes: "",
};

const paymentStatuses: PaymentStatus[] = [
  "Paid",
  "Partial",
  "Unpaid",
];

function PurchaseDialog({
  open,
  suppliers,
  drinks,
  locations,
  onClose,
  onSave,
}: PurchaseDialogProps) {
  const [formData, setFormData] =
    useState<Purchase>(emptyPurchase);

  const [errors, setErrors] =
    useState<PurchaseErrors>({});

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData({ ...emptyPurchase });
      setErrors({});
    }
  }, [open]);

  const warehouseLocations = useMemo(() => {
    return locations.filter(
      (location) =>
        location.isActive &&
        location.type === "Warehouse"
    );
  }, [locations]);

  const selectedDrink = useMemo(() => {
    return drinks.find(
      (drink) => drink.id === formData.drinkId
    );
  }, [drinks, formData.drinkId]);

  const totalAmount =
    formData.quantity * formData.unitBuyingPrice;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = event.target;

    setFormData((current) => {
      const nextValue =
        type === "number" ? Number(value) : value;

      if (name === "drinkId") {
        const drink = drinks.find(
          (item) => item.id === value
        );

        return {
          ...current,
          drinkId: String(nextValue),
          unitBuyingPrice: drink?.buyingPrice ?? 0,
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
    const newErrors: PurchaseErrors = {};

    if (!formData.supplierId) {
      newErrors.supplierId =
        "Please select a supplier.";
    }

    if (!formData.destinationLocationId) {
      newErrors.destinationLocationId =
        "Please select a warehouse.";
    }

    if (!formData.drinkId) {
      newErrors.drinkId =
        "Please select a drink.";
    }

    if (formData.quantity <= 0) {
      newErrors.quantity =
        "Quantity must be greater than zero.";
    }

    if (formData.unitBuyingPrice < 0) {
      newErrors.unitBuyingPrice =
        "Buying price cannot be negative.";
    }

    if (formData.invoiceNumber.length > 100) {
      newErrors.invoiceNumber =
        "Maximum 100 characters.";
    }

    if (!formData.paymentStatus) {
      newErrors.paymentStatus =
        "Please select a payment status.";
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
        Receive Purchase
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12 }}>
            <TextField
              select
              label="Supplier"
              name="supplierId"
              value={formData.supplierId}
              onChange={handleChange}
              error={Boolean(errors.supplierId)}
              helperText={errors.supplierId}
              fullWidth
              required
            >
              <MenuItem value="">
                Select supplier
              </MenuItem>

              {suppliers
                .filter((supplier) => supplier.isActive)
                .map((supplier) => (
                  <MenuItem
                    key={supplier.id ?? supplier.name}
                    value={supplier.id ?? ""}
                  >
                    {supplier.name}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              select
              label="Destination Warehouse"
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
            >
              <MenuItem value="">
                Select warehouse
              </MenuItem>

              {warehouseLocations.map((location) => (
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
            >
              <MenuItem value="">
                Select drink
              </MenuItem>

              {drinks
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

          {selectedDrink && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="info">
                Current default buying price:{" "}
                <strong>
                  {selectedDrink.buyingPrice.toLocaleString()} FCFA
                </strong>
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
                },
              }}
              fullWidth
              required
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Unit Buying Price"
              name="unitBuyingPrice"
              type="number"
              value={formData.unitBuyingPrice}
              onChange={handleChange}
              error={Boolean(errors.unitBuyingPrice)}
              helperText={errors.unitBuyingPrice}
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
              Total purchase amount:{" "}
              <strong>
                {totalAmount.toLocaleString()} FCFA
              </strong>
            </Alert>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Invoice Number"
              name="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={handleChange}
              error={Boolean(errors.invoiceNumber)}
              helperText={errors.invoiceNumber}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              label="Payment Status"
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
              error={Boolean(errors.paymentStatus)}
              helperText={errors.paymentStatus}
              fullWidth
              required
            >
              {paymentStatuses.map((status) => (
                <MenuItem
                  key={status}
                  value={status}
                >
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              error={Boolean(errors.notes)}
              helperText={errors.notes}
              placeholder="Example: New Guinness delivery"
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
              Saving this purchase will immediately
              increase the selected warehouse inventory.
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
            ? "Receiving..."
            : "Complete Purchase"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PurchaseDialog;
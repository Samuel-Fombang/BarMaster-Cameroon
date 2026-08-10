import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
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

  transfer?: Transfer | null;

  onClose: () => void;

  onSave: (transfer: Transfer) => Promise<void>;
};

type TransferErrors = {
  sourceLocationId?: string;
  destinationLocationId?: string;
  drinkId?: string;
  quantity?: string;
  pricePerBottle?: string;
  reason?: string;
};

const emptyTransfer: Transfer = {
  sourceLocationId: "",
  destinationLocationId: "",
  drinkId: "",
  quantity: 1,
  pricePerBottle: 0,
  totalPrice: 0,
  reason: "",
  status: "Completed",
};

function TransferDialog({
  open,
  drinks,
  locations,
  inventory,
  transfer,
  onClose,
  onSave,
}: TransferDialogProps) {
  const [formData, setFormData] =
    useState<Transfer>(emptyTransfer);

  const [errors, setErrors] =
    useState<TransferErrors>({});

  const [saving, setSaving] =
    useState(false);

  const isEditing = Boolean(transfer?.id);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (transfer) {
      setFormData({
        ...transfer,

        quantity:
          Number(transfer.quantity) || 1,

        pricePerBottle:
          Number(transfer.pricePerBottle) || 0,

        totalPrice:
          Number(transfer.quantity || 0) *
          Number(transfer.pricePerBottle || 0),

        reason:
          transfer.reason ?? "",

        status:
          transfer.status ?? "Completed",
      });
    } else {
      setFormData({
        ...emptyTransfer,
      });
    }

    setErrors({});
  }, [open, transfer]);

  const sourceLocations = useMemo(() => {
    return locations.filter((location) => {
      if (!location.id || !location.isActive) {
        return false;
      }

      /*
       * While editing, keep the current source
       * location visible even if inventory has
       * changed after the transfer.
       */
      if (
        isEditing &&
        location.id === formData.sourceLocationId
      ) {
        return true;
      }

      return inventory.some(
        (item) =>
          item.locationId === location.id &&
          item.quantity > 0 &&
          item.isActive
      );
    });
  }, [
    locations,
    inventory,
    isEditing,
    formData.sourceLocationId,
  ]);

  const availableDrinks = useMemo(() => {
    if (!formData.sourceLocationId) {
      return [];
    }

    const availableDrinkIds = new Set(
      inventory
        .filter(
          (item) =>
            item.locationId ===
              formData.sourceLocationId &&
            item.quantity > 0 &&
            item.isActive
        )
        .map((item) =>
          String(item.drinkId).trim()
        )
    );

    return drinks.filter((drink) => {
      if (!drink.id) {
        return false;
      }

      const drinkId =
        String(drink.id).trim();

      if (
        isEditing &&
        drinkId ===
          String(formData.drinkId).trim()
      ) {
        return true;
      }

      return (
        drink.isActive &&
        availableDrinkIds.has(drinkId)
      );
    });
  }, [
    drinks,
    inventory,
    formData.sourceLocationId,
    formData.drinkId,
    isEditing,
  ]);

  const destinationLocations =
    useMemo(() => {
      return locations.filter(
        (location) =>
          Boolean(location.id) &&
          location.isActive &&
          location.id !==
            formData.sourceLocationId
      );
    }, [
      locations,
      formData.sourceLocationId,
    ]);

  const availableQuantity = useMemo(() => {
    if (
      !formData.sourceLocationId ||
      !formData.drinkId
    ) {
      return 0;
    }

    const inventoryQuantity =
      inventory.find(
        (item) =>
          String(item.locationId).trim() ===
            String(
              formData.sourceLocationId
            ).trim() &&
          String(item.drinkId).trim() ===
            String(formData.drinkId).trim()
      )?.quantity ?? 0;

    /*
     * When editing, the original quantity was
     * already removed from the source.
     * Add it back for validation.
     */
    if (
      isEditing &&
      transfer?.sourceLocationId ===
        formData.sourceLocationId &&
      transfer?.drinkId ===
        formData.drinkId
    ) {
      return (
        inventoryQuantity +
        Number(transfer.quantity || 0)
      );
    }

    return inventoryQuantity;
  }, [
    inventory,
    formData.sourceLocationId,
    formData.drinkId,
    isEditing,
    transfer,
  ]);

  const totalPrice = useMemo(() => {
    const quantity =
      Number(formData.quantity) || 0;

    const price =
      Number(formData.pricePerBottle) || 0;

    return quantity * price;
  }, [
    formData.quantity,
    formData.pricePerBottle,
  ]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {
      name,
      value,
      type,
    } = event.target;

    setFormData((current) => {
      const nextValue =
        type === "number"
          ? Number(value)
          : value;

      if (name === "sourceLocationId") {
        return {
          ...current,

          sourceLocationId:
            String(nextValue),

          destinationLocationId: "",

          drinkId: "",

          quantity: 1,
        };
      }

      if (name === "drinkId") {
        return {
          ...current,

          drinkId:
            String(nextValue),

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
    const newErrors: TransferErrors =
      {};

    if (!formData.sourceLocationId) {
      newErrors.sourceLocationId =
        "Please select a source location.";
    }

    if (
      !formData.destinationLocationId
    ) {
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
      newErrors.drinkId =
        "Please select a drink.";
    }

    if (
      !formData.quantity ||
      formData.quantity <= 0
    ) {
      newErrors.quantity =
        "Quantity must be greater than zero.";
    }

    if (
      availableQuantity > 0 &&
      formData.quantity >
        availableQuantity
    ) {
      newErrors.quantity =
        `Only ${availableQuantity} bottles are available.`;
    }

    if (
      formData.pricePerBottle ===
        undefined ||
      formData.pricePerBottle === null ||
      formData.pricePerBottle <= 0
    ) {
      newErrors.pricePerBottle =
        "Enter the price per bottle.";
    }

    if (
      formData.reason &&
      formData.reason.length > 500
    ) {
      newErrors.reason =
        "Maximum 500 characters.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    setSaving(true);

    try {
      await onSave({
        ...formData,

        quantity:
          Number(formData.quantity),

        pricePerBottle:
          Number(
            formData.pricePerBottle
          ),

        totalPrice,
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
        saving
          ? undefined
          : onClose
      }
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {isEditing
          ? "Edit Transfer"
          : "Transfer Stock"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid
          container
          spacing={2}
          sx={{ mt: 0.5 }}
        >
          <Grid size={{ xs: 12 }}>
            <TextField
              select
              label="From Location"
              name="sourceLocationId"
              value={
                formData.sourceLocationId
              }
              onChange={handleChange}
              error={Boolean(
                errors.sourceLocationId
              )}
              helperText={
                errors.sourceLocationId
              }
              fullWidth
              required
            >
              <MenuItem value="">
                Select source location
              </MenuItem>

              {sourceLocations.map(
                (location) => (
                  <MenuItem
                    key={
                      location.id ??
                      location.name
                    }
                    value={
                      location.id ?? ""
                    }
                  >
                    {location.name}
                  </MenuItem>
                )
              )}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              select
              label="To Location"
              name="destinationLocationId"
              value={
                formData.destinationLocationId
              }
              onChange={handleChange}
              error={Boolean(
                errors.destinationLocationId
              )}
              helperText={
                errors.destinationLocationId
              }
              fullWidth
              required
              disabled={
                !formData.sourceLocationId
              }
            >
              <MenuItem value="">
                Select destination location
              </MenuItem>

              {destinationLocations.map(
                (location) => (
                  <MenuItem
                    key={
                      location.id ??
                      location.name
                    }
                    value={
                      location.id ?? ""
                    }
                  >
                    {location.name}
                  </MenuItem>
                )
              )}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              select
              label="Drink"
              name="drinkId"
              value={formData.drinkId}
              onChange={handleChange}
              error={Boolean(
                errors.drinkId
              )}
              helperText={
                errors.drinkId
              }
              fullWidth
              required
              disabled={
                !formData.sourceLocationId
              }
            >
              <MenuItem value="">
                Select drink
              </MenuItem>

              {availableDrinks.map(
                (drink) => (
                  <MenuItem
                    key={
                      drink.id ??
                      drink.name
                    }
                    value={
                      drink.id ?? ""
                    }
                  >
                    {drink.name}

                    {drink.brand
                      ? ` — ${drink.brand}`
                      : ""}

                    {drink.bottleSize
                      ? ` (${drink.bottleSize})`
                      : ""}
                  </MenuItem>
                )
              )}
            </TextField>
          </Grid>

          {formData.drinkId && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="info">
                Available quantity:{" "}
                <strong>
                  {availableQuantity}
                </strong>{" "}
                bottles
              </Alert>
            </Grid>
          )}

          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={
                formData.quantity
              }
              onChange={handleChange}
              error={Boolean(
                errors.quantity
              )}
              helperText={
                errors.quantity
              }
              slotProps={{
                htmlInput: {
                  min: 1,

                  max:
                    availableQuantity ||
                    undefined,
                },
              }}
              fullWidth
              required
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <TextField
              label="Price per Bottle"
              name="pricePerBottle"
              type="number"
              value={
                formData.pricePerBottle
              }
              onChange={handleChange}
              error={Boolean(
                errors.pricePerBottle
              )}
              helperText={
                errors.pricePerBottle ??
                "Enter the current bottle price."
              }
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      FCFA
                    </InputAdornment>
                  ),
                },

                htmlInput: {
                  min: 0,
                  step: 1,
                },
              }}
              fullWidth
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "grey.50",
                p: 2,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Total Transfer Value
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  mt: 0.5,
                  fontWeight: 700,
                }}
              >
                {totalPrice.toLocaleString()}{" "}
                FCFA
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {Number(
                  formData.quantity || 0
                ).toLocaleString()}{" "}
                bottles ×{" "}
                {Number(
                  formData.pricePerBottle ||
                    0
                ).toLocaleString()}{" "}
                FCFA
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Reason"
              name="reason"
              value={
                formData.reason
              }
              onChange={handleChange}
              error={Boolean(
                errors.reason
              )}
              helperText={
                errors.reason
              }
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
              {isEditing
                ? "Saving changes may adjust the stock quantities at the source and destination."
                : "Saving this transfer will immediately reduce stock at the source and increase stock at the destination."}
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
            ? isEditing
              ? "Saving..."
              : "Transferring..."
            : isEditing
              ? "Save Changes"
              : "Complete Transfer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TransferDialog;
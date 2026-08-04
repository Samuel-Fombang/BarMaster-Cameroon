import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

import type { Supplier } from "../../types/supplier";

type SupplierDialogProps = {
  open: boolean;
  supplier?: Supplier | null;
  onClose: () => void;
  onSave: (supplier: Supplier) => Promise<void>;
};

type SupplierErrors = {
  name?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
};

const emptySupplier: Supplier = {
  name: "",
  contactPerson: "",
  phone: "",
  email: "",
  address: "",
  notes: "",
  isActive: true,
};

function SupplierDialog({
  open,
  supplier,
  onClose,
  onSave,
}: SupplierDialogProps) {
  const [formData, setFormData] =
    useState<Supplier>(emptySupplier);

  const [errors, setErrors] =
    useState<SupplierErrors>({});

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (supplier) {
      setFormData({ ...supplier });
    } else {
      setFormData({ ...emptySupplier });
    }

    setErrors({});
  }, [supplier, open]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, checked, type } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));
  };

  const validate = () => {
    const newErrors: SupplierErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Supplier name is required.";
    }

    if (formData.name.length > 120) {
      newErrors.name = "Maximum 120 characters.";
    }

    if (formData.contactPerson.length > 100) {
      newErrors.contactPerson = "Maximum 100 characters.";
    }

    if (formData.phone.length > 30) {
      newErrors.phone = "Maximum 30 characters.";
    }

    if (
      formData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    if (formData.email.length > 150) {
      newErrors.email = "Maximum 150 characters.";
    }

    if (formData.address.length > 250) {
      newErrors.address = "Maximum 250 characters.";
    }

    if (formData.notes.length > 500) {
      newErrors.notes = "Maximum 500 characters.";
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
      maxWidth="md"
    >
      <DialogTitle>
        {supplier ? "Edit Supplier" : "Add Supplier"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Supplier Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={Boolean(errors.name)}
              helperText={errors.name}
              fullWidth
              required
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Contact Person"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              error={Boolean(errors.contactPerson)}
              helperText={errors.contactPerson}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={Boolean(errors.phone)}
              helperText={errors.phone}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={Boolean(errors.address)}
              helperText={errors.address}
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
              multiline
              rows={3}
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
              label="Active Supplier"
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
          {saving ? "Saving..." : "Save Supplier"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SupplierDialog;
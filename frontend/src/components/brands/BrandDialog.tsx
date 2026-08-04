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

import type { Brand } from "../../types/brand";

type BrandDialogProps = {
  open: boolean;
  brand?: Brand | null;
  onClose: () => void;
  onSave: (brand: Brand) => Promise<void>;
};

type BrandErrors = {
  name?: string;
  description?: string;
};

const emptyBrand: Brand = {
  name: "",
  description: "",
  isActive: true,
};

function BrandDialog({
  open,
  brand,
  onClose,
  onSave,
}: BrandDialogProps) {
  const [formData, setFormData] = useState<Brand>(emptyBrand);
  const [errors, setErrors] = useState<BrandErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (brand) {
      setFormData({ ...brand });
    } else {
      setFormData({ ...emptyBrand });
    }

    setErrors({});
  }, [brand, open]);

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
    const newErrors: BrandErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Brand name is required.";
    }

    if (formData.name.length > 100) {
      newErrors.name = "Maximum 100 characters.";
    }

    if (formData.description.length > 250) {
      newErrors.description = "Maximum 250 characters.";
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
        {brand ? "Edit Brand" : "Add Brand"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Brand Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={Boolean(errors.name)}
              helperText={errors.name}
              fullWidth
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={Boolean(errors.description)}
              helperText={errors.description}
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
              label="Active Brand"
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
          {saving ? "Saving..." : "Save Brand"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default BrandDialog;
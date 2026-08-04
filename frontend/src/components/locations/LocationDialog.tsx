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

import type {
  Location,
  LocationType,
} from "../../types/location";

type LocationDialogProps = {
  open: boolean;
  location?: Location | null;
  onClose: () => void;
  onSave: (location: Location) => Promise<void>;
};

type LocationErrors = {
  name?: string;
  type?: string;
  address?: string;
  description?: string;
};

const emptyLocation: Location = {
  name: "",
  type: "Warehouse",
  address: "",
  description: "",
  isActive: true,
};

const locationTypes: {
  value: LocationType;
  label: string;
}[] = [
  {
    value: "Warehouse",
    label: "Warehouse",
  },
  {
    value: "SalesArea",
    label: "Sales Area",
  },
  {
    value: "DamagedStock",
    label: "Damaged Stock",
  },
];

function LocationDialog({
  open,
  location,
  onClose,
  onSave,
}: LocationDialogProps) {
  const [formData, setFormData] =
    useState<Location>(emptyLocation);

  const [errors, setErrors] =
    useState<LocationErrors>({});

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (location) {
      setFormData({ ...location });
    } else {
      setFormData({ ...emptyLocation });
    }

    setErrors({});
  }, [location, open]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = event.target;

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
    const newErrors: LocationErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Location name is required.";
    }

    if (formData.name.length > 100) {
      newErrors.name = "Maximum 100 characters.";
    }

    if (!formData.type) {
      newErrors.type = "Please select a location type.";
    }

    if (formData.address.length > 250) {
      newErrors.address = "Maximum 250 characters.";
    }

    if (formData.description.length > 500) {
      newErrors.description = "Maximum 500 characters.";
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
        {location ? "Edit Location" : "Add Location"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Location Name"
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
              select
              label="Location Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              error={Boolean(errors.type)}
              helperText={errors.type}
              fullWidth
              required
            >
              {locationTypes.map((locationType) => (
                <MenuItem
                  key={locationType.value}
                  value={locationType.value}
                >
                  {locationType.label}
                </MenuItem>
              ))}
            </TextField>
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
              label="Active Location"
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
          {saving ? "Saving..." : "Save Location"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LocationDialog;
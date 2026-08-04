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
  CreateWorkerDto,
  UpdateWorkerDto,
  Worker,
} from "../../types/worker";

type WorkerFormData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: string;
  username: string;
  password: string;
  isActive: boolean;
};

type WorkerErrors = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  role?: string;
  username?: string;
  password?: string;
};

type WorkerDialogProps = {
  open: boolean;
  worker?: Worker | null;
  onClose: () => void;
  onCreate: (worker: CreateWorkerDto) => Promise<void>;
  onUpdate: (
    id: string,
    worker: UpdateWorkerDto
  ) => Promise<void>;
};

const emptyWorker: WorkerFormData = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  role: "Bartender",
  username: "",
  password: "",
  isActive: true,
};

const workerRoles = [
  "Admin",
  "Manager",
  "Bartender",
  "Storekeeper",
  "Cashier",
  "Supervisor",
  "Security",
  "Cleaner",
];

function WorkerDialog({
  open,
  worker,
  onClose,
  onCreate,
  onUpdate,
}: WorkerDialogProps) {
  const [formData, setFormData] =
    useState<WorkerFormData>(emptyWorker);

  const [errors, setErrors] =
    useState<WorkerErrors>({});

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (worker) {
      setFormData({
        firstName: worker.firstName,
        lastName: worker.lastName,
        phone: worker.phone,
        email: worker.email,
        role: worker.role,
        username: worker.username,
        password: "",
        isActive: worker.isActive,
      });
    } else {
      setFormData({ ...emptyWorker });
    }

    setErrors({});
  }, [worker, open]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } =
      event.target;

    setFormData((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));
  };

  const validate = () => {
    const newErrors: WorkerErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName =
        "First name is required.";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName =
        "Last name is required.";
    }

    if (!formData.role.trim()) {
      newErrors.role =
        "Please select a role.";
    }

    if (!formData.username.trim()) {
      newErrors.username =
        "Username is required.";
    }

    if (
      !worker &&
      !formData.password.trim()
    ) {
      newErrors.password =
        "Password is required.";
    }

    if (
      formData.password &&
      formData.password.length < 8
    ) {
      newErrors.password =
        "Password must contain at least 8 characters.";
    }

    if (
      formData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Enter a valid email address.";
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
      if (worker) {
        await onUpdate(worker.id, {
          firstName:
            formData.firstName.trim(),
          lastName:
            formData.lastName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          role: formData.role.trim(),
          username:
            formData.username.trim(),
          password: formData.password,
          isActive: formData.isActive,
        });
      } else {
        await onCreate({
          firstName:
            formData.firstName.trim(),
          lastName:
            formData.lastName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          role: formData.role.trim(),
          username:
            formData.username.trim(),
          password: formData.password,
        });
      }

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
        {worker
          ? "Edit Worker"
          : "Add Worker"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid
          container
          spacing={2}
          sx={{ mt: 0.5 }}
        >
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={Boolean(
                errors.firstName
              )}
              helperText={
                errors.firstName
              }
              fullWidth
              required
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={Boolean(
                errors.lastName
              )}
              helperText={
                errors.lastName
              }
              fullWidth
              required
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={Boolean(
                errors.phone
              )}
              helperText={
                errors.phone
              }
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
              error={Boolean(
                errors.email
              )}
              helperText={
                errors.email
              }
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              select
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              error={Boolean(
                errors.role
              )}
              helperText={errors.role}
              fullWidth
              required
            >
              {workerRoles.map((role) => (
                <MenuItem
                  key={role}
                  value={role}
                >
                  {role}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={Boolean(
                errors.username
              )}
              helperText={
                errors.username
              }
              fullWidth
              required
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label={
                worker
                  ? "New Password"
                  : "Password"
              }
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={Boolean(
                errors.password
              )}
              helperText={
                errors.password ??
                (worker
                  ? "Leave blank to keep the current password."
                  : "Minimum 8 characters.")
              }
              fullWidth
              required={!worker}
            />
          </Grid>

          {worker && (
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    name="isActive"
                    checked={
                      formData.isActive
                    }
                    onChange={
                      handleChange
                    }
                  />
                }
                label="Active Worker"
              />
            </Grid>
          )}
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
            ? "Saving..."
            : worker
              ? "Update Worker"
              : "Save Worker"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default WorkerDialog;
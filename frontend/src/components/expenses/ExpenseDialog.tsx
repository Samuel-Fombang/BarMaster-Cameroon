import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

import type {
  Expense,
  ExpensePaymentMethod,
} from "../../types/expense";

type ExpenseDialogProps = {
  open: boolean;
  expense?: Expense | null;
  onClose: () => void;
  onSave: (expense: Expense) => Promise<void>;
};

type ExpenseErrors = {
  category?: string;
  description?: string;
  amount?: string;
  paymentMethod?: string;
  referenceNumber?: string;
  notes?: string;
  expenseDate?: string;
};

const getCurrentDateTimeValue = () => {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60000;

  return new Date(now.getTime() - timezoneOffset)
    .toISOString()
    .slice(0, 16);
};

const emptyExpense: Expense = {
  category: "",
  description: "",
  amount: 0,
  paymentMethod: "Cash",
  referenceNumber: "",
  notes: "",
  expenseDate: getCurrentDateTimeValue(),
};

const expenseCategories = [
  "Transport",
  "Electricity",
  "Water",
  "Salary",
  "Repairs",
  "Cleaning",
  "Security",
  "Internet",
  "Telephone",
  "Rent",
  "Tax",
  "Supplies",
  "Other",
];

const paymentMethods: {
  value: ExpensePaymentMethod;
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
    value: "BankTransfer",
    label: "Bank Transfer",
  },
];

function ExpenseDialog({
  open,
  expense,
  onClose,
  onSave,
}: ExpenseDialogProps) {
  const [formData, setFormData] =
    useState<Expense>(emptyExpense);

  const [errors, setErrors] =
    useState<ExpenseErrors>({});

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (expense) {
      setFormData({
        ...expense,
        expenseDate: expense.expenseDate
          ? new Date(expense.expenseDate)
              .toISOString()
              .slice(0, 16)
          : getCurrentDateTimeValue(),
      });
    } else {
      setFormData({
        ...emptyExpense,
        expenseDate: getCurrentDateTimeValue(),
      });
    }

    setErrors({});
  }, [expense, open]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = event.target;

    setFormData((current) => ({
      ...current,
      [name]:
        type === "number"
          ? Number(value)
          : value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));
  };

  const validate = () => {
    const newErrors: ExpenseErrors = {};

    if (!formData.category.trim()) {
      newErrors.category =
        "Please select an expense category.";
    }

    if (!formData.description.trim()) {
      newErrors.description =
        "Description is required.";
    }

    if (formData.description.length > 250) {
      newErrors.description =
        "Maximum 250 characters.";
    }

    if (formData.amount <= 0) {
      newErrors.amount =
        "Amount must be greater than zero.";
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod =
        "Please select a payment method.";
    }

    if (formData.referenceNumber.length > 100) {
      newErrors.referenceNumber =
        "Maximum 100 characters.";
    }

    if (formData.notes.length > 500) {
      newErrors.notes =
        "Maximum 500 characters.";
    }

    if (!formData.expenseDate) {
      newErrors.expenseDate =
        "Expense date is required.";
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
      await onSave({
        ...formData,
        expenseDate: new Date(
          formData.expenseDate
        ).toISOString(),
      });

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
        {expense ? "Edit Expense" : "Add Expense"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              error={Boolean(errors.category)}
              helperText={errors.category}
              fullWidth
              required
            >
              <MenuItem value="">
                Select category
              </MenuItem>

              {expenseCategories.map((category) => (
                <MenuItem
                  key={category}
                  value={category}
                >
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              error={Boolean(errors.amount)}
              helperText={errors.amount}
              slotProps={{
                htmlInput: {
                  min: 1,
                },
              }}
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
              fullWidth
              required
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
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

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Expense Date"
              name="expenseDate"
              type="datetime-local"
              value={formData.expenseDate}
              onChange={handleChange}
              error={Boolean(errors.expenseDate)}
              helperText={errors.expenseDate}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              fullWidth
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Reference Number"
              name="referenceNumber"
              value={formData.referenceNumber}
              onChange={handleChange}
              error={Boolean(errors.referenceNumber)}
              helperText={errors.referenceNumber}
              placeholder="Optional receipt or payment reference"
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
              placeholder="Optional notes"
              multiline
              rows={3}
              fullWidth
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
          onClick={handleSave}
          variant="contained"
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : expense
              ? "Update Expense"
              : "Save Expense"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ExpenseDialog;
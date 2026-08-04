import {
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
} from "@mui/material";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { getBottleSizes } from "../../services/bottleSizeService";
import { getBrands } from "../../services/brandService";
import { getCategories } from "../../services/categoryService";
import { getSuppliers } from "../../services/supplierService";

import type { BottleSize } from "../../types/bottleSize";
import type { Brand } from "../../types/brand";
import type { Category } from "../../types/category";
import type { Drink } from "../../types/drink";
import type { Supplier } from "../../types/supplier";

type DrinkDialogProps = {
  open: boolean;
  drink?: Drink | null;
  onClose: () => void;
  onSave: (drink: Drink) => Promise<void>;
};

type DrinkFormErrors = {
  name?: string;
  category?: string;
  brand?: string;
  bottleSize?: string;
  supplier?: string;
  buyingPrice?: string;
  sellingPrice?: string;
  currentStock?: string;
  minimumStock?: string;
};

const emptyDrink: Drink = {
  name: "",
  category: "",
  brand: "",
  bottleSize: "",
  buyingPrice: 0,
  sellingPrice: 0,
  currentStock: 0,
  minimumStock: 0,
  supplier: "",
  isActive: true,
};

function DrinkDialog({
  open,
  drink,
  onClose,
  onSave,
}: DrinkDialogProps) {
  const [formData, setFormData] =
    useState<Drink>(emptyDrink);

  const [errors, setErrors] =
    useState<DrinkFormErrors>({});

  const [saving, setSaving] =
    useState(false);

  const [loadingOptions, setLoadingOptions] =
    useState(false);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [brands, setBrands] =
    useState<Brand[]>([]);

  const [bottleSizes, setBottleSizes] =
    useState<BottleSize[]>([]);

  const [suppliers, setSuppliers] =
    useState<Supplier[]>([]);

  useEffect(() => {
    if (drink) {
      setFormData({
        ...drink,
      });
    } else {
      setFormData({
        ...emptyDrink,
      });
    }

    setErrors({});
  }, [drink, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const loadOptions = async () => {
      setLoadingOptions(true);

      try {
        const [
          categoryData,
          brandData,
          bottleSizeData,
          supplierData,
        ] = await Promise.all([
          getCategories(),
          getBrands(),
          getBottleSizes(),
          getSuppliers(),
        ]);

        setCategories(categoryData);
        setBrands(brandData);
        setBottleSizes(bottleSizeData);
        setSuppliers(supplierData);
      } catch (error) {
        console.error(
          "Could not load drink form options:",
          error
        );
      } finally {
        setLoadingOptions(false);
      }
    };

    void loadOptions();
  }, [open]);

  const activeCategories = useMemo(
    () =>
      categories.filter(
        (category) => category.isActive
      ),
    [categories]
  );

  const activeBrands = useMemo(
    () =>
      brands.filter(
        (brand) => brand.isActive
      ),
    [brands]
  );

  const activeBottleSizes = useMemo(
    () =>
      bottleSizes.filter(
        (bottleSize) =>
          bottleSize.isActive
      ),
    [bottleSizes]
  );

  const activeSuppliers = useMemo(
    () =>
      suppliers.filter(
        (supplier) =>
          supplier.isActive
      ),
    [suppliers]
  );

  const selectedCategory =
    activeCategories.find(
      (category) =>
        category.name ===
        formData.category
    ) ?? null;

  const selectedBrand =
    activeBrands.find(
      (brand) =>
        brand.name === formData.brand
    ) ?? null;

  const selectedBottleSize =
    activeBottleSizes.find(
      (bottleSize) =>
        bottleSize.name ===
        formData.bottleSize
    ) ?? null;

  const selectedSupplier =
    activeSuppliers.find(
      (supplier) =>
        supplier.name ===
        formData.supplier
    ) ?? null;

  const handleTextChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

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

  const validateForm = () => {
    const newErrors: DrinkFormErrors =
      {};

    if (!formData.name.trim()) {
      newErrors.name =
        "Drink name is required.";
    }

    if (!formData.category) {
      newErrors.category =
        "Please select a category.";
    }

    if (!formData.brand) {
      newErrors.brand =
        "Please select a brand.";
    }

    if (!formData.bottleSize) {
      newErrors.bottleSize =
        "Please select a bottle size.";
    }

    if (!formData.supplier) {
      newErrors.supplier =
        "Please select a supplier.";
    }

    if (formData.buyingPrice < 0) {
      newErrors.buyingPrice =
        "Buying price cannot be negative.";
    }

    if (formData.sellingPrice <= 0) {
      newErrors.sellingPrice =
        "Selling price must be greater than zero.";
    }

    if (
      formData.sellingPrice <
      formData.buyingPrice
    ) {
      newErrors.sellingPrice =
        "Selling price should not be below buying price.";
    }

    if (formData.currentStock < 0) {
      newErrors.currentStock =
        "Current stock cannot be negative.";
    }

    if (formData.minimumStock < 0) {
      newErrors.minimumStock =
        "Minimum stock cannot be negative.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length ===
      0
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      await onSave({
        ...formData,
        name: formData.name.trim(),
        category:
          formData.category.trim(),
        brand: formData.brand.trim(),
        bottleSize:
          formData.bottleSize.trim(),
        supplier:
          formData.supplier.trim(),
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
        saving ? undefined : onClose
      }
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        {drink
          ? "Edit Drink"
          : "Add New Drink"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid
          container
          spacing={2}
          sx={{ mt: 0.5 }}
        >
          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <TextField
              label="Drink Name"
              name="name"
              value={formData.name}
              onChange={handleTextChange}
              error={Boolean(
                errors.name
              )}
              helperText={errors.name}
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
            <Autocomplete
              options={activeCategories}
              value={selectedCategory}
              loading={loadingOptions}
              getOptionLabel={(option) =>
                option.name
              }
              isOptionEqualToValue={(
                option,
                value
              ) =>
                option.id === value.id ||
                option.name ===
                  value.name
              }
              onChange={(
                _event,
                value
              ) => {
                setFormData(
                  (current) => ({
                    ...current,
                    category:
                      value?.name ?? "",
                  })
                );

                setErrors(
                  (current) => ({
                    ...current,
                    category:
                      undefined,
                  })
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category"
                  required
                  error={Boolean(
                    errors.category
                  )}
                  helperText={
                    errors.category
                  }
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingOptions ? (
                            <CircularProgress
                              size={20}
                            />
                          ) : null}

                          {
                            params
                              .InputProps
                              .endAdornment
                          }
                        </>
                      ),
                    },
                  }}
                />
              )}
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <Autocomplete
              options={activeBrands}
              value={selectedBrand}
              loading={loadingOptions}
              getOptionLabel={(option) =>
                option.name
              }
              isOptionEqualToValue={(
                option,
                value
              ) =>
                option.id === value.id ||
                option.name ===
                  value.name
              }
              onChange={(
                _event,
                value
              ) => {
                setFormData(
                  (current) => ({
                    ...current,
                    brand:
                      value?.name ?? "",
                  })
                );

                setErrors(
                  (current) => ({
                    ...current,
                    brand: undefined,
                  })
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Brand"
                  required
                  error={Boolean(
                    errors.brand
                  )}
                  helperText={
                    errors.brand
                  }
                />
              )}
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <Autocomplete
              options={
                activeBottleSizes
              }
              value={
                selectedBottleSize
              }
              loading={loadingOptions}
              getOptionLabel={(option) =>
                option.name
              }
              isOptionEqualToValue={(
                option,
                value
              ) =>
                option.id === value.id ||
                option.name ===
                  value.name
              }
              onChange={(
                _event,
                value
              ) => {
                setFormData(
                  (current) => ({
                    ...current,
                    bottleSize:
                      value?.name ?? "",
                  })
                );

                setErrors(
                  (current) => ({
                    ...current,
                    bottleSize:
                      undefined,
                  })
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Bottle Size"
                  required
                  error={Boolean(
                    errors.bottleSize
                  )}
                  helperText={
                    errors.bottleSize
                  }
                />
              )}
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <Autocomplete
              options={activeSuppliers}
              value={selectedSupplier}
              loading={loadingOptions}
              getOptionLabel={(option) =>
                option.name
              }
              isOptionEqualToValue={(
                option,
                value
              ) =>
                option.id === value.id ||
                option.name ===
                  value.name
              }
              onChange={(
                _event,
                value
              ) => {
                setFormData(
                  (current) => ({
                    ...current,
                    supplier:
                      value?.name ?? "",
                  })
                );

                setErrors(
                  (current) => ({
                    ...current,
                    supplier:
                      undefined,
                  })
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Supplier"
                  required
                  error={Boolean(
                    errors.supplier
                  )}
                  helperText={
                    errors.supplier
                  }
                />
              )}
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <TextField
              label="Buying Price (FCFA)"
              name="buyingPrice"
              type="number"
              value={
                formData.buyingPrice
              }
              onChange={
                handleTextChange
              }
              error={Boolean(
                errors.buyingPrice
              )}
              helperText={
                errors.buyingPrice
              }
              slotProps={{
                htmlInput: {
                  min: 0,
                },
              }}
              fullWidth
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <TextField
              label="Selling Price (FCFA)"
              name="sellingPrice"
              type="number"
              value={
                formData.sellingPrice
              }
              onChange={
                handleTextChange
              }
              error={Boolean(
                errors.sellingPrice
              )}
              helperText={
                errors.sellingPrice
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

          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <TextField
              label="Current Stock"
              name="currentStock"
              type="number"
              value={
                formData.currentStock
              }
              onChange={
                handleTextChange
              }
              error={Boolean(
                errors.currentStock
              )}
              helperText={
                errors.currentStock
              }
              slotProps={{
                htmlInput: {
                  min: 0,
                },
              }}
              fullWidth
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <TextField
              label="Minimum Stock"
              name="minimumStock"
              type="number"
              value={
                formData.minimumStock
              }
              onChange={
                handleTextChange
              }
              error={Boolean(
                errors.minimumStock
              )}
              helperText={
                errors.minimumStock
              }
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
                  checked={
                    formData.isActive
                  }
                  onChange={
                    handleTextChange
                  }
                />
              }
              label="Active Drink"
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
          onClick={handleSubmit}
          variant="contained"
          disabled={
            saving || loadingOptions
          }
        >
          {saving
            ? "Saving..."
            : drink
              ? "Update Drink"
              : "Save Drink"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DrinkDialog;
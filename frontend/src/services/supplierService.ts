import axios from "axios";

import api from "./api";
import type { Supplier } from "../types/supplier";

const ENDPOINT = "/Suppliers";

function buildSupplierPayload(supplier: Supplier) {
  return {
    name: supplier.name?.trim() ?? "",
    contactPerson: supplier.contactPerson?.trim() ?? "",
    phone: supplier.phone?.trim() ?? "",
    email: supplier.email?.trim() ?? "",
    address: supplier.address?.trim() ?? "",
    notes: supplier.notes?.trim() ?? "",
    isActive: supplier.isActive ?? true,
  };
}

export function getSupplierErrorMessage(
  error: unknown,
  fallback = "Could not save the supplier."
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | {
          message?: string;
          title?: string;
          errors?: Record<string, string[]>;
        }
      | undefined;

    if (data?.message) {
      return data.message;
    }

    if (data?.errors) {
      const validationMessages =
        Object.values(data.errors).flat();

      if (validationMessages.length > 0) {
        return validationMessages.join(" ");
      }
    }

    if (data?.title) {
      return data.title;
    }
  }

  return fallback;
}

export async function getSuppliers(): Promise<Supplier[]> {
  const response =
    await api.get<Supplier[]>(ENDPOINT);

  return response.data;
}

export async function createSupplier(
  supplier: Supplier
): Promise<Supplier> {
  const response =
    await api.post<Supplier>(
      ENDPOINT,
      buildSupplierPayload(supplier)
    );

  return response.data;
}

export async function updateSupplier(
  id: string,
  supplier: Supplier
): Promise<void> {
  await api.put(
    `${ENDPOINT}/${id}`,
    buildSupplierPayload(supplier)
  );
}

export async function deleteSupplier(
  id: string
): Promise<void> {
  await api.delete(
    `${ENDPOINT}/${id}`
  );
}
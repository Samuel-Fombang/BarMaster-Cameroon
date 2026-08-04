import api from "./api";

import type { Supplier } from "../types/supplier";

const ENDPOINT = "/Suppliers";

export async function getSuppliers(): Promise<Supplier[]> {
  const response = await api.get<Supplier[]>(ENDPOINT);

  return response.data;
}

export async function createSupplier(
  supplier: Supplier
): Promise<Supplier> {
  const response = await api.post<Supplier>(
    ENDPOINT,
    supplier
  );

  return response.data;
}

export async function updateSupplier(
  id: string,
  supplier: Supplier
): Promise<void> {
  await api.put(
    `${ENDPOINT}/${id}`,
    supplier
  );
}

export async function deleteSupplier(
  id: string
): Promise<void> {
  await api.delete(`${ENDPOINT}/${id}`);
}
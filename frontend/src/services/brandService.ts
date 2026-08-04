import api from "./api";

import type { Brand } from "../types/brand";

const ENDPOINT = "/Brands";

export async function getBrands(): Promise<Brand[]> {
  const response = await api.get<Brand[]>(ENDPOINT);

  return response.data;
}

export async function createBrand(
  brand: Brand
): Promise<Brand> {
  const response = await api.post<Brand>(
    ENDPOINT,
    brand
  );

  return response.data;
}

export async function updateBrand(
  id: string,
  brand: Brand
): Promise<void> {
  await api.put(
    `${ENDPOINT}/${id}`,
    brand
  );
}

export async function deleteBrand(
  id: string
): Promise<void> {
  await api.delete(`${ENDPOINT}/${id}`);
}
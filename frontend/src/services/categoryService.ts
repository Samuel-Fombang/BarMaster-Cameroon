import api from "./api";

import type { Category } from "../types/category";

const ENDPOINT = "/Categories";

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<Category[]>(
    ENDPOINT
  );

  return response.data;
}

export async function createCategory(
  category: Category
): Promise<Category> {
  const response = await api.post<Category>(
    ENDPOINT,
    category
  );

  return response.data;
}

export async function updateCategory(
  id: string,
  category: Category
): Promise<void> {
  await api.put(
    `${ENDPOINT}/${id}`,
    category
  );
}

export async function deleteCategory(
  id: string
): Promise<void> {
  await api.delete(`${ENDPOINT}/${id}`);
}
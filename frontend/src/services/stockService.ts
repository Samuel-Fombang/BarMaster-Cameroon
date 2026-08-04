import api from "./api";

import type { Stock } from "../types/stock";

const ENDPOINT = "/Stock";

export async function getStocks(): Promise<Stock[]> {
  const response = await api.get<Stock[]>(ENDPOINT);

  return response.data;
}

export async function createStock(
  stock: Stock
): Promise<Stock> {
  const response = await api.post<Stock>(
    ENDPOINT,
    stock
  );

  return response.data;
}

export async function updateStock(
  id: string,
  stock: Stock
): Promise<void> {
  await api.put(`${ENDPOINT}/${id}`, {
    currentQuantity: stock.currentQuantity,
    minimumQuantity: stock.minimumQuantity,
    isActive: stock.isActive,
  });
}

export async function deleteStock(
  id: string
): Promise<void> {
  await api.delete(`${ENDPOINT}/${id}`);
}
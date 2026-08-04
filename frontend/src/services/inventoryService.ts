import api from "./api";

import type { Inventory } from "../types/inventory";

const ENDPOINT = "/Inventory";

export async function getInventory(): Promise<Inventory[]> {
  const response = await api.get<Inventory[]>(ENDPOINT);

  return response.data;
}

export async function getInventoryByLocation(
  locationId: string
): Promise<Inventory[]> {
  const response = await api.get<Inventory[]>(
    `${ENDPOINT}/location/${locationId}`
  );

  return response.data;
}

export async function getInventoryByDrink(
  drinkId: string
): Promise<Inventory[]> {
  const response = await api.get<Inventory[]>(
    `${ENDPOINT}/drink/${drinkId}`
  );

  return response.data;
}

export async function createInventory(
  inventory: Inventory
): Promise<Inventory> {
  const response = await api.post<Inventory>(
    ENDPOINT,
    inventory
  );

  return response.data;
}

export async function updateInventory(
  id: string,
  inventory: Inventory
): Promise<void> {
  await api.put(`${ENDPOINT}/${id}`, {
    quantity: inventory.quantity,
    minimumQuantity: inventory.minimumQuantity,
    isActive: inventory.isActive,
  });
}

export async function deleteInventory(
  id: string
): Promise<void> {
  await api.delete(`${ENDPOINT}/${id}`);
}
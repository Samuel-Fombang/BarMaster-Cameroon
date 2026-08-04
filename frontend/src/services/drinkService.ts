import api from "./api";

import type { Drink } from "../types/drink";

const ENDPOINT = "/Drinks";

export async function getDrinks(): Promise<Drink[]> {
  const response = await api.get<Drink[]>(
    ENDPOINT
  );

  return response.data;
}

export async function createDrink(
  drink: Drink
): Promise<Drink> {
  const response = await api.post<Drink>(
    ENDPOINT,
    drink
  );

  return response.data;
}

export async function updateDrink(
  id: string,
  drink: Drink
): Promise<void> {
  await api.put(
    `${ENDPOINT}/${id}`,
    drink
  );
}

export async function deleteDrink(
  id: string
): Promise<void> {
  await api.delete(`${ENDPOINT}/${id}`);
}
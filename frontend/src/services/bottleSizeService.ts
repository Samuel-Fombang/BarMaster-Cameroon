import api from "./api";
import type { BottleSize } from "../types/bottleSize";

const endpoint = "/BottleSize";

export async function getBottleSizes(): Promise<
  BottleSize[]
> {
  const response =
    await api.get<BottleSize[]>(endpoint);

  return response.data;
}

export async function createBottleSize(
  bottleSize: Omit<BottleSize, "id">
): Promise<BottleSize> {
  const response =
    await api.post<BottleSize>(
      endpoint,
      bottleSize
    );

  return response.data;
}

export async function updateBottleSize(
  id: string,
  bottleSize: Omit<BottleSize, "id">
): Promise<void> {
  await api.put(
    `${endpoint}/${id}`,
    bottleSize
  );
}

export async function deleteBottleSize(
  id: string
): Promise<void> {
  await api.delete(
    `${endpoint}/${id}`
  );
}
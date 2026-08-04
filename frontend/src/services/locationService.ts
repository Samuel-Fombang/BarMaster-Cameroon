import api from "./api";

import type { Location } from "../types/location";

const ENDPOINT = "/Locations";

export async function getLocations(): Promise<Location[]> {
  const response = await api.get<Location[]>(ENDPOINT);

  return response.data;
}

export async function createLocation(
  location: Location
): Promise<Location> {
  const response = await api.post<Location>(
    ENDPOINT,
    location
  );

  return response.data;
}

export async function updateLocation(
  id: string,
  location: Location
): Promise<void> {
  await api.put(
    `${ENDPOINT}/${id}`,
    location
  );
}

export async function deleteLocation(
  id: string
): Promise<void> {
  await api.delete(`${ENDPOINT}/${id}`);
}
export type LocationType =
  | "Warehouse"
  | "SalesArea"
  | "DamagedStock";

export interface Location {
  id?: string;
  name: string;
  type: LocationType;
  address: string;
  description: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
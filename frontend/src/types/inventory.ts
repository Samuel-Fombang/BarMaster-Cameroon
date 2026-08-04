export interface Inventory {
  id?: string;
  drinkId: string;
  locationId: string;
  quantity: number;
  minimumQuantity: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
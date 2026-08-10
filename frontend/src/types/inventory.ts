export interface Inventory {
  id?: string;

  drinkId: string;
  locationId: string;

  quantity: number;
  minimumQuantity: number;

  pricePerBottle: number;

  totalStockValue?: number;

  isActive: boolean;

  createdAt?: string;
  updatedAt?: string;
}
export interface Stock {
  id?: string;
  drinkId: string;
  currentQuantity: number;
  minimumQuantity: number;
  lastUpdated?: string;
  isActive: boolean;
}
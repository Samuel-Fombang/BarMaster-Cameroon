export interface Drink {
  id?: string;
  name: string;
  category: string;
  brand: string;
  bottleSize: string;
  buyingPrice: number;
  sellingPrice: number;
  currentStock: number;
  minimumStock: number;
  supplier: string;
  isActive: boolean;
}
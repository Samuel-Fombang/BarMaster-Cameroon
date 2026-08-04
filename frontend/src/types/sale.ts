export type PaymentMethod =
  | "Cash"
  | "MTN_MOMO"
  | "ORANGE_MONEY"
  | "Card"
  | "Credit";

export interface Sale {
  id?: string;
  saleNumber?: string;
  locationId: string;
  drinkId: string;
  quantity: number;
  unitSellingPrice: number;
  unitBuyingPrice?: number;
  totalAmount?: number;
  totalCost?: number;
  profit?: number;
  paymentMethod: PaymentMethod;
  customerName: string;
  notes: string;
  status?: string;
  saleDate?: string;
  createdAt?: string;
  updatedAt?: string;
}
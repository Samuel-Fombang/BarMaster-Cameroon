export type PaymentStatus =
  | "Paid"
  | "Partial"
  | "Unpaid";

export interface Purchase {
  id?: string;
  purchaseNumber?: string;
  supplierId: string;
  destinationLocationId: string;
  drinkId: string;
  quantity: number;
  unitBuyingPrice: number;
  totalAmount?: number;
  invoiceNumber: string;
  paymentStatus: PaymentStatus;
  notes: string;
  status?: string;
  purchaseDate?: string;
  createdAt?: string;
  updatedAt?: string;
}
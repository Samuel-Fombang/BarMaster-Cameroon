export type ExpensePaymentMethod =
  | "Cash"
  | "MTN_MOMO"
  | "ORANGE_MONEY"
  | "Card"
  | "BankTransfer";

export interface Expense {
  id?: string;
  expenseNumber?: string;
  category: string;
  description: string;
  amount: number;
  paymentMethod: ExpensePaymentMethod;
  referenceNumber: string;
  notes: string;
  status?: string;
  expenseDate: string;
  createdAt?: string;
  updatedAt?: string;
}
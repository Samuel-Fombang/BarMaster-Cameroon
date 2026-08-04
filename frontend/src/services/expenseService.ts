import api from "./api";

import type { Expense } from "../types/expense";

const ENDPOINT = "/Expense";

export async function getExpenses(): Promise<Expense[]> {
  const response = await api.get<Expense[]>(ENDPOINT);

  return response.data;
}

export async function getExpenseById(
  id: string
): Promise<Expense> {
  const response = await api.get<Expense>(
    `${ENDPOINT}/${id}`
  );

  return response.data;
}

export async function getExpensesByCategory(
  category: string
): Promise<Expense[]> {
  const response = await api.get<Expense[]>(
    `${ENDPOINT}/category/${encodeURIComponent(category)}`
  );

  return response.data;
}

export async function createExpense(
  expense: Expense
): Promise<Expense> {
  const response = await api.post<Expense>(
    ENDPOINT,
    {
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      paymentMethod: expense.paymentMethod,
      referenceNumber: expense.referenceNumber,
      notes: expense.notes,
      expenseDate: expense.expenseDate || null,
    }
  );

  return response.data;
}

export async function updateExpense(
  id: string,
  expense: Expense
): Promise<void> {
  await api.put(`${ENDPOINT}/${id}`, {
    category: expense.category,
    description: expense.description,
    amount: expense.amount,
    paymentMethod: expense.paymentMethod,
    referenceNumber: expense.referenceNumber,
    notes: expense.notes,
    expenseDate: expense.expenseDate,
  });
}

export async function deleteExpense(
  id: string
): Promise<void> {
  await api.delete(`${ENDPOINT}/${id}`);
}
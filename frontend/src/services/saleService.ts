import api from "./api";

import type { Sale } from "../types/sale";

const ENDPOINT = "/Sale";

export async function getSales(): Promise<Sale[]> {
  const response = await api.get<Sale[]>(ENDPOINT);

  return response.data;
}

export async function getSaleById(
  id: string
): Promise<Sale> {
  const response = await api.get<Sale>(
    `${ENDPOINT}/${id}`
  );

  return response.data;
}

export async function getSalesByLocation(
  locationId: string
): Promise<Sale[]> {
  const response = await api.get<Sale[]>(
    `${ENDPOINT}/location/${locationId}`
  );

  return response.data;
}

export async function createSale(
  sale: Sale
): Promise<Sale> {
  const response = await api.post<Sale>(
    ENDPOINT,
    {
      locationId: sale.locationId,
      drinkId: sale.drinkId,
      quantity: sale.quantity,
      unitSellingPrice: sale.unitSellingPrice,
      paymentMethod: sale.paymentMethod,
      customerName: sale.customerName,
      notes: sale.notes,
      saleDate: sale.saleDate || null,
    }
  );

  return response.data;
}

export async function updateSale(
  id: string,
  sale: Sale
): Promise<void> {
  await api.put(`${ENDPOINT}/${id}`, {
    paymentMethod: sale.paymentMethod,
    customerName: sale.customerName,
    notes: sale.notes,
  });
}
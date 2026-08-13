import api from "./api";

import type { Purchase } from "../types/purchase";

const ENDPOINT = "/Purchase";

export async function getPurchases(): Promise<Purchase[]> {
  const response = await api.get<Purchase[]>(
    ENDPOINT
  );

  return response.data;
}

export async function getPurchaseById(
  id: string
): Promise<Purchase> {
  const response = await api.get<Purchase>(
    `${ENDPOINT}/${id}`
  );

  return response.data;
}

export async function getPurchasesBySupplier(
  supplierId: string
): Promise<Purchase[]> {
  const response = await api.get<Purchase[]>(
    `${ENDPOINT}/supplier/${supplierId}`
  );

  return response.data;
}

export async function createPurchase(
  purchase: Purchase
): Promise<Purchase> {
  const response = await api.post<Purchase>(
    ENDPOINT,
    {
      supplierId:
        purchase.supplierId,

      destinationLocationId:
        purchase.destinationLocationId,

      drinkId:
        purchase.drinkId,

      quantity:
        purchase.quantity,

      unitBuyingPrice:
        purchase.unitBuyingPrice,

      invoiceNumber:
        purchase.invoiceNumber,

      paymentStatus:
        purchase.paymentStatus,

      notes:
        purchase.notes,

      purchaseDate:
        purchase.purchaseDate ||
        null,
    }
  );

  return response.data;
}

export async function updatePurchase(
  id: string,
  purchase: Purchase
): Promise<void> {
  await api.put(
    `${ENDPOINT}/${id}`,
    {
      invoiceNumber:
        purchase.invoiceNumber,

      paymentStatus:
        purchase.paymentStatus,

      notes:
        purchase.notes,
    }
  );
}

export async function deletePurchase(
  id: string
): Promise<void> {
  await api.delete(
    `${ENDPOINT}/${id}`
  );
}
import api from "./api";
import type { Transfer } from "../types/transfer";

const ENDPOINT = "/Transfer";

export async function getTransfers(): Promise<Transfer[]> {
  const response = await api.get<Transfer[]>(ENDPOINT);

  return response.data;
}

export async function getTransferById(
  id: string
): Promise<Transfer> {
  const response = await api.get<Transfer>(
    `${ENDPOINT}/${id}`
  );

  return response.data;
}

export async function createTransfer(
  transfer: Transfer
): Promise<Transfer> {
  const response = await api.post<Transfer>(
    ENDPOINT,
    {
      sourceLocationId: transfer.sourceLocationId,

      destinationLocationId:
        transfer.destinationLocationId,

      drinkId: transfer.drinkId,

      quantity: transfer.quantity,

      pricePerBottle: transfer.pricePerBottle,

      totalPrice:
        transfer.quantity * transfer.pricePerBottle,

      reason: transfer.reason,

      transferDate:
        transfer.transferDate || null,
    }
  );

  return response.data;
}

export async function updateTransfer(
  id: string,
  transfer: Transfer
): Promise<void> {
  await api.put(`${ENDPOINT}/${id}`, {
    sourceLocationId: transfer.sourceLocationId,

    destinationLocationId:
      transfer.destinationLocationId,

    drinkId: transfer.drinkId,

    quantity: transfer.quantity,

    pricePerBottle: transfer.pricePerBottle,

    totalPrice:
      transfer.quantity * transfer.pricePerBottle,

    reason: transfer.reason,

    status:
      transfer.status ?? "Completed",

    transferDate:
      transfer.transferDate || null,
  });
}

export async function deleteTransfer(
  id: string
): Promise<void> {
  await api.delete(`${ENDPOINT}/${id}`);
}
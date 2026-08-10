export interface Transfer {
  id?: string;
  transferNumber?: string;

  sourceLocationId: string;
  destinationLocationId: string;
  drinkId: string;

  quantity: number;

  // Entered manually because prices can change.
  pricePerBottle: number;

  // Normally calculated as quantity × pricePerBottle.
  totalPrice?: number;

  reason: string;

  status?: string;
  transferDate?: string;
  createdAt?: string;
  updatedAt?: string;
}
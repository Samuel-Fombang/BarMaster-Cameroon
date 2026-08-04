export interface Transfer {
  id?: string;
  transferNumber?: string;
  sourceLocationId: string;
  destinationLocationId: string;
  drinkId: string;
  quantity: number;
  reason: string;
  status?: string;
  transferDate?: string;
  createdAt?: string;
  updatedAt?: string;
}
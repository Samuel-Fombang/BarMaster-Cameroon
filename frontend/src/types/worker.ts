export interface Worker {
  id: string;
  workerNumber: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: string;
  username: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkerDto {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: string;
  username: string;
  password: string;
}

export interface UpdateWorkerDto {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: string;
  username: string;
  password: string;
  isActive: boolean;
}
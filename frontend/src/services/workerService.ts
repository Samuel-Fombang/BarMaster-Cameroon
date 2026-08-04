import api from "./api";

import type {
  CreateWorkerDto,
  UpdateWorkerDto,
  Worker,
} from "../types/worker";

const ENDPOINT = "/Worker";

export async function getWorkers(): Promise<Worker[]> {
  const response = await api.get<Worker[]>(ENDPOINT);

  return response.data;
}

export async function getWorker(
  id: string
): Promise<Worker> {
  const response = await api.get<Worker>(
    `${ENDPOINT}/${id}`
  );

  return response.data;
}

export async function createWorker(
  worker: CreateWorkerDto
): Promise<Worker> {
  const response = await api.post<Worker>(
    ENDPOINT,
    worker
  );

  return response.data;
}

export async function updateWorker(
  id: string,
  worker: UpdateWorkerDto
): Promise<void> {
  await api.put(
    `${ENDPOINT}/${id}`,
    worker
  );
}

export async function deleteWorker(
  id: string
): Promise<void> {
  await api.delete(`${ENDPOINT}/${id}`);
}
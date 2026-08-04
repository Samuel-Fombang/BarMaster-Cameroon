import api from "./api";
import type { DashboardData } from "../types/dashboard";

const endpoint = "/Dashboard";

export async function getDashboard(): Promise<DashboardData> {
  const response =
    await api.get<DashboardData>(endpoint);

  return response.data;
}
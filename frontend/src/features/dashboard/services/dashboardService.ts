import { fetchWithAuth } from "@/shared/hooks/fetchWithAuth";
import type { ApiResponse } from "@/shared/types/api";
import type { DashboardData } from "@/features/dashboard/types/dashboard";

export const dashboardService = {
  getDashboard: () => fetchWithAuth<ApiResponse<DashboardData>>("dashboard"),
};

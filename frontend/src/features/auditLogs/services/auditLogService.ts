import { fetchWithAuth } from "@/shared/hooks/fetchWithAuth";
import type { ApiResponse, PageResponse } from "@/shared/types/api";
import type { AuditLog, AuditLogMetadata } from "@/features/auditLogs/types/auditLog";

export const auditLogService = {
  getAuditLogs: (params: {
    page: number;
    size: number;
    search?: string;
    role?: string;
    entityType?: string;
    severity?: string;
    ipAddress?: string;
    dateFrom?: string;
    dateTo?: string;
    sort?: string;
  }) => {
    const query = new URLSearchParams();

    query.append("page", String(params.page));
    query.append("size", String(params.size));
    if (params.search) query.append("search", params.search);
    if (params.role) query.append("role", params.role);
    if (params.entityType) query.append("entityType", params.entityType);
    if (params.severity) query.append("severity", params.severity);
    if (params.ipAddress) query.append("ipAddress", params.ipAddress);
    if (params.dateFrom) query.append("dateFrom", params.dateFrom);
    if (params.dateTo) query.append("dateTo", params.dateTo);
    if (params.sort) query.append("sort", params.sort);

    return fetchWithAuth<ApiResponse<PageResponse<AuditLog>>>(
      `audit-logs?${query.toString()}`,
    );
  },

  getAuditLogMeta: () =>
    fetchWithAuth<ApiResponse<AuditLogMetadata>>("audit-logs/meta"),
};

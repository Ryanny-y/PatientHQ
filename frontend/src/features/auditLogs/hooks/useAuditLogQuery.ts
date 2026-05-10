import { useQuery } from "@tanstack/react-query";
import { auditLogService } from "@/features/auditLogs/services/auditLogService";

export const useAuditLogQuery = (params: {
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
  autoRefresh?: boolean;
}) => {
  return useQuery({
    queryKey: ["auditLogs", params],
    queryFn: () => auditLogService.getAuditLogs(params),
    placeholderData: (prev) => prev,
    refetchInterval: params.autoRefresh ? 30_000 : false,
  });
};

export const useAuditLogMetaQuery = (autoRefresh: boolean) => {
  return useQuery({
    queryKey: ["auditLogMeta"],
    queryFn: () => auditLogService.getAuditLogMeta(),
    refetchInterval: autoRefresh ? 30_000 : false,
  });
};

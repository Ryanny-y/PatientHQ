import { fetchWithAuth } from '@/shared/hooks/fetchWithAuth';
import type { ApiResponse, PageResponse } from '@/shared/types/api';
import type { GenerateReportRequest, ReportDto } from '../types/report';

export const reportService = {
  getReports: (params: {
    page?: number;
    size?: number;
    sort?: string;
  }) => {
    const query = new URLSearchParams();

    if (params.page !== undefined) query.append('page', String(params.page));
    if (params.size !== undefined) query.append('size', String(params.size));
    if (params.sort) query.append('sort', params.sort);

    const suffix = query.toString();

    return fetchWithAuth<ApiResponse<PageResponse<ReportDto>>>(
      suffix ? `reports?${suffix}` : 'reports',
    );
  },

  getReportById: (id: string) =>
    fetchWithAuth<ApiResponse<ReportDto>>(`reports/${id}`),

  generateReport: (values: GenerateReportRequest) =>
    fetchWithAuth<ApiResponse<ReportDto>>('reports/generate', {
      method: 'POST',
      body: JSON.stringify({
        patientId: values.patientId,
        generatedBy: values.generatedBy,
        reportType: values.reportType,
        summary: values.summary || null,
      }),
    }),
};

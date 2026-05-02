import { fetchWithAuth } from '@/shared/hooks/fetchWithAuth';
import type { ApiResponse, PageResponse } from '@/shared/types/api';
import type { addVitalSignsFormValues, VitalSigns, VitalSignsMetadata } from '../types/vitalSigns';

export const vitalSignsService = {
  getVitalSigns: (params: {
    page?: number;
    size?: number;
    search?: string;
    patientId?: string;
    dateFilter?: string;
    sort?: string;
  }) => {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.append('page', String(params.page));
    if (params.size !== undefined) query.append('size', String(params.size));
    if (params.search) query.append('search', params.search);
    if (params.patientId) query.append('patientId', params.patientId);
    if (params.dateFilter) query.append('dateFilter', params.dateFilter);
    if (params.sort) query.append('sort', params.sort);

    return fetchWithAuth<ApiResponse<PageResponse<VitalSigns>>>(
      `vital-signs?${query.toString()}`,
    );
  },

  getVitalSignsById: (id: string) =>
    fetchWithAuth<ApiResponse<VitalSigns>>(`vital-signs/${id}`),

  getVitalSignsMeta: () =>
    fetchWithAuth<ApiResponse<VitalSignsMetadata>>('vital-signs/meta'),

  createVitalSigns: (values: addVitalSignsFormValues) =>
    fetchWithAuth<ApiResponse<VitalSigns>>('vital-signs', {
      method: 'POST',
      body: JSON.stringify(values),
    }),

  updateVitalSigns: (id: string, values: Partial<addVitalSignsFormValues>) =>
    fetchWithAuth<ApiResponse<VitalSigns>>(`vital-signs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(values),
    }),

  deleteVitalSigns: (id: string) =>
    fetchWithAuth<ApiResponse<void>>(`vital-signs/${id}`, {
      method: 'DELETE',
    }),
};

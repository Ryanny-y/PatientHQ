import { fetchWithAuth } from '@/shared/hooks/fetchWithAuth';
import type { ApiResponse } from '@/shared/types/api';
import type { addVitalSignsFormValues, VitalSigns, VitalSignsMetadata } from '../types/vitalSigns';

export const vitalSignsService = {
  getVitalSigns: () =>
    fetchWithAuth<ApiResponse<VitalSigns[]>>('vital-signs'),

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

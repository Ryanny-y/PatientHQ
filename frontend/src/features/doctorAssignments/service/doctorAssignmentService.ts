import { fetchWithAuth } from '@/shared/hooks/fetchWithAuth';
import type { ApiResponse, PageResponse } from '@/shared/types/api';
import type {
  AssignDoctorRequest,
  DoctorAssignment,
  ReassignDoctorRequest,
} from '../types/assignment';

export const doctorAssignmentService = {
  getAssignments: (params: {
    page?: number;
    size?: number;
    activeOnly?: boolean;
    sort?: string;
  }) => {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.append('page', String(params.page));
    if (params.size !== undefined) query.append('size', String(params.size));
    if (params.activeOnly !== undefined) query.append('activeOnly', String(params.activeOnly));
    if (params.sort) query.append('sort', params.sort);

    return fetchWithAuth<ApiResponse<PageResponse<DoctorAssignment>>>(
      `doctor-assignments?${query.toString()}`,
    );
  },

  getAssignmentById: (id: string) =>
    fetchWithAuth<ApiResponse<DoctorAssignment>>(`doctor-assignments/${id}`),

  assignDoctor: (request: AssignDoctorRequest) =>
    fetchWithAuth<ApiResponse<DoctorAssignment>>('doctor-assignments/assign', {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  reassignDoctor: (request: ReassignDoctorRequest) =>
    fetchWithAuth<ApiResponse<DoctorAssignment>>('doctor-assignments/reassign', {
      method: 'PATCH',
      body: JSON.stringify(request),
    }),

  deleteAssignment: (id: string) =>
    fetchWithAuth<ApiResponse<void>>(`doctor-assignments/${id}`, {
      method: 'DELETE',
    }),
};

import { fetchWithAuth } from '@/shared/hooks/fetchWithAuth';
import type { ApiResponse, PageResponse } from '@/shared/types/api';
import type {
  AssignDoctorRequest,
  DoctorAssignment,
  DoctorAssignmentMeta,
  ReassignDoctorRequest,
} from '../types/assignment';

export const doctorAssignmentService = {
  getAssignments: (params: {
    page?: number;
    size?: number;
    search?: string;
    isActive?: boolean;
    patientStatus?: string;
    sort?: string;
  }) => {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.append('page', String(params.page));
    if (params.size !== undefined) query.append('size', String(params.size));
    if (params.search) query.append('search', params.search);
    if (params.isActive !== undefined) query.append('isActive', String(params.isActive));
    if (params.patientStatus) query.append('patientStatus', params.patientStatus);
    if (params.sort) query.append('sort', params.sort);

    return fetchWithAuth<ApiResponse<PageResponse<DoctorAssignment>>>(
      `doctor-assignments?${query.toString()}`,
    );
  },

  getDoctorAssignmentMeta: () =>
    fetchWithAuth<ApiResponse<DoctorAssignmentMeta>>(
      'doctor-assignments/meta',
    ),

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

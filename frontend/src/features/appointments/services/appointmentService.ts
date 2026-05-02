import { fetchWithAuth } from '@/shared/hooks/fetchWithAuth';
import type { ApiResponse, PageResponse } from '@/shared/types/api';
import type {
  Appointment,
  AppointmentStats,
  CreateAppointmentFormValues,
  UpdateAppointmentFormValues,
} from '../types/appointment';

export const appointmentService = {
  getAppointments: (params: {
    page?: number;
    size?: number;
    search?: string;
    status?: string;
    patientId?: string;
    doctorId?: string;
    sort?: string;
  }) => {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.append('page', String(params.page));
    if (params.size !== undefined) query.append('size', String(params.size));
    if (params.search) query.append('search', params.search);
    if (params.status) query.append('status', params.status);
    if (params.patientId) query.append('patientId', params.patientId);
    if (params.doctorId) query.append('doctorId', params.doctorId);
    if (params.sort) query.append('sort', params.sort);

    return fetchWithAuth<ApiResponse<PageResponse<Appointment>>>(
      `appointments?${query.toString()}`,
    );
  },

  getAppointmentsMeta: () => fetchWithAuth<ApiResponse<AppointmentStats>>('appointments/meta'),

  getAppointmentById: (id: string) =>
    fetchWithAuth<ApiResponse<Appointment>>(`appointments/${id}`),

  createAppointment: (values: CreateAppointmentFormValues) =>
    fetchWithAuth<ApiResponse<Appointment>>('appointments', {
      method: 'POST',
      body: JSON.stringify({
        patientId: values.patientId,
        doctorId: values.doctorId,
        appointmentDate: values.appointmentDate,
        reason: values.reason || null,
        notes: values.notes || null,
      }),
    }),

  updateAppointment: (id: string, values: UpdateAppointmentFormValues) =>
    fetchWithAuth<ApiResponse<Appointment>>(`appointments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        ...(values.appointmentDate ? { appointmentDate: values.appointmentDate } : {}),
        ...(values.reason !== undefined ? { reason: values.reason } : {}),
        ...(values.status ? { status: values.status } : {}),
        ...(values.notes !== undefined ? { notes: values.notes } : {}),
      }),
    }),

  deleteAppointment: (id: string) =>
    fetchWithAuth<ApiResponse<void>>(`appointments/${id}`, {
      method: 'DELETE',
    }),
};

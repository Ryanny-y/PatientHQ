package com.patienthq.backend.features.appointment.service;

import com.patienthq.backend.features.appointment.dto.AppointmentDto;
import com.patienthq.backend.features.appointment.dto.AppointmentMetadataDto;
import com.patienthq.backend.features.appointment.dto.request.CreateAppointmentRequest;
import com.patienthq.backend.features.appointment.dto.request.UpdateAppointmentRequest;
import com.patienthq.backend.features.appointment.model.AppointmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface AppointmentService {

    AppointmentDto createAppointment(CreateAppointmentRequest request);

    Page<AppointmentDto> getAllAppointments(String search, AppointmentStatus status, UUID patientId, UUID doctorId, Pageable pageable);

    AppointmentDto getAppointmentById(UUID id);

    AppointmentDto updateAppointment(UUID id, UpdateAppointmentRequest request);

    void deleteAppointment(UUID id);

    AppointmentMetadataDto getAppointmentMetadata();
}

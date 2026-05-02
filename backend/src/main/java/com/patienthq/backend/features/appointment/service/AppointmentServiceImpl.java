package com.patienthq.backend.features.appointment.service;

import com.patienthq.backend.features.appointment.AppointmentMapper;
import com.patienthq.backend.features.appointment.dto.AppointmentDto;
import com.patienthq.backend.features.appointment.dto.AppointmentMetadataDto;
import com.patienthq.backend.features.appointment.dto.request.CreateAppointmentRequest;
import com.patienthq.backend.features.appointment.dto.request.UpdateAppointmentRequest;
import com.patienthq.backend.features.appointment.exception.AppointmentNotFoundException;
import com.patienthq.backend.features.appointment.model.Appointment;
import com.patienthq.backend.features.appointment.model.AppointmentStatus;
import com.patienthq.backend.features.appointment.repository.AppointmentRepository;
import com.patienthq.backend.features.doctor.model.Doctor;
import com.patienthq.backend.features.doctor.repository.DoctorRepository;
import com.patienthq.backend.features.patient.model.Patient;
import com.patienthq.backend.features.patient.repository.PatientRepository;
import com.patienthq.backend.shared.exceptions.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentMapper appointmentMapper;

    @Override
    @Transactional
    public AppointmentDto createAppointment(CreateAppointmentRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Patient not found with id: " + request.getPatientId()));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Doctor not found with id: " + request.getDoctorId()));

        if (!doctor.getUser().getIsActive()) {
            throw new AppException(HttpStatus.CONFLICT, "Doctor " + doctor.getFullName() + " is not active");
        }

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDate(request.getAppointmentDate())
                .reason(request.getReason())
                .notes(request.getNotes())
                .build();

        return appointmentMapper.toDto(appointmentRepository.save(appointment));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AppointmentDto> getAllAppointments(String search, AppointmentStatus status, UUID patientId, UUID doctorId, Pageable pageable) {
        String formattedSearch = (search == null) ? null : "%" + search.toLowerCase() + "%";
        return appointmentRepository.findAllAppointments(formattedSearch, status, patientId, doctorId, pageable)
                .map(appointmentMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public AppointmentDto getAppointmentById(UUID id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new AppointmentNotFoundException(id));
        return appointmentMapper.toDto(appointment);
    }

    @Override
    @Transactional
    public AppointmentDto updateAppointment(UUID id, UpdateAppointmentRequest request) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new AppointmentNotFoundException(id));

        if (request.getAppointmentDate() != null) appointment.setAppointmentDate(request.getAppointmentDate());
        if (request.getReason() != null) appointment.setReason(request.getReason());
        if (request.getStatus() != null) appointment.setStatus(request.getStatus());
        if (request.getNotes() != null) appointment.setNotes(request.getNotes());

        return appointmentMapper.toDto(appointmentRepository.save(appointment));
    }

    @Override
    @Transactional
    public void deleteAppointment(UUID id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new AppointmentNotFoundException(id));
        appointmentRepository.delete(appointment);
    }

    @Override
    @Transactional(readOnly = true)
    public AppointmentMetadataDto getAppointmentMetadata() {
        long totalAppointments = appointmentRepository.count();

        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();

        long todaysAppointments = appointmentRepository.countTodaysAppointments(startOfDay, endOfDay);

        long pendingAppointments = appointmentRepository.countByStatus(AppointmentStatus.PENDING);

        LocalDateTime startOfWeek = LocalDateTime.now()
                .with(DayOfWeek.MONDAY)
                .toLocalDate()
                .atStartOfDay();

        long completedThisWeek = appointmentRepository.countCompletedThisWeek(startOfWeek);

        return AppointmentMetadataDto.builder()
                .totalAppointments(totalAppointments)
                .todaysAppointments(todaysAppointments)
                .pendingAppointments(pendingAppointments)
                .completedThisWeek(completedThisWeek)
                .build();
    }
}

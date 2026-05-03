package com.patienthq.backend.features.report.service;

import com.patienthq.backend.features.appointment.model.Appointment;
import com.patienthq.backend.features.appointment.model.AppointmentStatus;
import com.patienthq.backend.features.appointment.repository.AppointmentRepository;
import com.patienthq.backend.features.patient.model.Patient;
import com.patienthq.backend.features.patient.repository.PatientRepository;
import com.patienthq.backend.features.report.ReportMapper;
import com.patienthq.backend.features.report.dto.ReportDto;
import com.patienthq.backend.features.report.dto.request.GenerateReportRequest;
import com.patienthq.backend.features.report.exception.ReportNotFoundException;
import com.patienthq.backend.features.report.model.Report;
import com.patienthq.backend.features.report.model.ReportType;
import com.patienthq.backend.features.report.repository.ReportRepository;
import com.patienthq.backend.features.user.model.User;
import com.patienthq.backend.features.user.service.UserService;
import com.patienthq.backend.shared.exceptions.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final PatientRepository patientRepository;
    private final UserService userService;
    private final ReportMapper reportMapper;
    private final AppointmentRepository appointmentRepository;

    @Override
    @Transactional
    public ReportDto generateReport(GenerateReportRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Patient not found with id: " + request.getPatientId()));

        User user = userService.getUserById(request.getGeneratedBy());

        Report report = Report.builder()
                .patient(patient)
                .generatedBy(user)
                .reportType(request.getReportType())
                .summary(generateSummary(patient, request.getReportType(), request.getNotes()))
                .build();

        return reportMapper.toDto(reportRepository.save(report));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReportDto> getAllReports(Pageable pageable) {
        return reportRepository.findAllReports(pageable).map(reportMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public ReportDto getReportById(UUID id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ReportNotFoundException(id));
        return reportMapper.toDto(report);
    }

    private String generateSummary(Patient patient, ReportType reportType, String notes) {
        return switch (reportType) {
            case ReportType.PATIENT_SUMMARY -> generatePatientSummary(patient, notes);
//            case "Medical Summary" -> generateMedicalSummary(patient, notes);
            case ReportType.APPOINTMENT_SUMMARY -> generateAppointmentSummary(patient, notes);
            default -> throw new AppException(HttpStatus.BAD_REQUEST, "Invalid report type");
        };
    }

        private String generatePatientSummary(Patient patient, String notes) {
            return String.format("""
                            PATIENT SUMMARY
                            
                            Name: %s
                            Status: %s
                            Blood Type: %s
                            
                            Overview:
                            Patient is currently registered and under monitoring.
                            
                            Notes:
                            %s
                            """,
                    patient.getFullName(),
                    patient.getStatus(),
                    patient.getBloodType(),
                    notes != null ? notes : "None"
            );
    }

//    private String generateMedicalSummary(Patient patient, String notes) {
//        List<MedicalRecord> records = medicalRecordRepository.findByPatientId(patient.getUserId());
//
//        String diagnoses = records.stream()
//                .map(MedicalRecord::getDiagnosis)
//                .distinct()
//                .reduce((a, b) -> a + ", " + b)
//                .orElse("No records");
//
//        return String.format("""
//        MEDICAL SUMMARY
//
//        Patient: %s
//
//        Diagnoses:
//        %s
//
//        Total Records: %d
//
//        Notes:
//        %s
//        """,
//                patient.getFullName(),
//                diagnoses,
//                records.size(),
//                notes != null ? notes : "None"
//        );
//    }

    private String generateAppointmentSummary(Patient patient, String notes) {
        List<Appointment> appointments = appointmentRepository.findAppointmentsByPatientId(patient.getPatientId());

        Map<AppointmentStatus, Long> counts =
                appointments.stream()
                        .collect(Collectors.groupingBy(
                                Appointment::getStatus,
                                Collectors.counting()
                        ));

        long completed = counts.getOrDefault(AppointmentStatus.COMPLETED, 0L);
        long pending = counts.getOrDefault(AppointmentStatus.PENDING, 0L);

        return String.format("""
                        APPOINTMENT SUMMARY
                        
                        Patient: %s
                        
                        Total Appointments: %d
                        Completed: %d
                        Pending: %d
                        
                        Notes:
                        %s
                        """,
                patient.getFullName(),
                appointments.size(),
                completed,
                pending,
                notes != null ? notes : "None"
        );
    }
}

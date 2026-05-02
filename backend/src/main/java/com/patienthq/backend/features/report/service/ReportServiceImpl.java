package com.patienthq.backend.features.report.service;

import com.patienthq.backend.features.patient.model.Patient;
import com.patienthq.backend.features.patient.repository.PatientRepository;
import com.patienthq.backend.features.report.ReportMapper;
import com.patienthq.backend.features.report.dto.ReportDto;
import com.patienthq.backend.features.report.dto.request.GenerateReportRequest;
import com.patienthq.backend.features.report.exception.ReportNotFoundException;
import com.patienthq.backend.features.report.model.Report;
import com.patienthq.backend.features.report.repository.ReportRepository;
import com.patienthq.backend.features.user.model.User;
import com.patienthq.backend.features.user.repository.UserRepository;
import com.patienthq.backend.features.user.service.UserService;
import com.patienthq.backend.shared.exceptions.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final PatientRepository patientRepository;
    private final UserService userService;
    private final UserRepository userRepository;
    private final ReportMapper reportMapper;

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
                .summary(request.getSummary())
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
}

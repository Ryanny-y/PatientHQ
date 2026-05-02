package com.patienthq.backend.features.report;

import com.patienthq.backend.features.report.dto.ReportDto;
import com.patienthq.backend.features.report.model.Report;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReportMapper {

    @Mapping(source = "patient.patientId", target = "patientId")
    @Mapping(source = "patient.fullName", target = "patientName")
    @Mapping(source = "generatedBy.userId", target = "generatedBy")
    @Mapping(source = "generatedBy.username", target = "generatedByUsername")
    ReportDto toDto(Report report);
}

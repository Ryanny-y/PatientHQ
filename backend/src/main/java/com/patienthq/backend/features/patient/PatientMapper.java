package com.patienthq.backend.features.patient;

import com.patienthq.backend.features.patient.dto.PatientDto;
import com.patienthq.backend.features.patient.model.Patient;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface PatientMapper {
    PatientDto toDto(Patient patient);
}

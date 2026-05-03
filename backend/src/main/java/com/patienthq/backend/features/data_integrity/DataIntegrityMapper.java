package com.patienthq.backend.features.data_integrity;

import com.patienthq.backend.features.data_integrity.dto.DataIntegrityDto;
import com.patienthq.backend.features.data_integrity.model.DataIntegrity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DataIntegrityMapper {

    @Mapping(source = "patient.patientId", target = "patientId")
    @Mapping(source = "patient.fullName", target = "patientName")
    DataIntegrityDto toDto(DataIntegrity dataIntegrity);
}

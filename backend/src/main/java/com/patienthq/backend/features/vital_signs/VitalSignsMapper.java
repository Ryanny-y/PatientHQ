package com.patienthq.backend.features.vital_signs;

import com.patienthq.backend.features.vital_signs.dto.VitalSignsDto;
import com.patienthq.backend.features.vital_signs.model.VitalSign;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface VitalSignsMapper {

    @Mapping(source = "patient.patientId", target = "patientId")
    @Mapping(source = "recordedBy.nurseId", target = "recordedBy")
    @Mapping(source = "patient.fullName", target = "patientName")
    @Mapping(source = "recordedBy.fullName", target = "recordedByName")
    VitalSignsDto toDto(VitalSign vitalSign);
}

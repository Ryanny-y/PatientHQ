package com.patienthq.backend.features.medical_record;

import com.patienthq.backend.features.medical_record.dto.MedicalRecordDto;
import com.patienthq.backend.features.medical_record.model.MedicalRecord;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MedicalRecordMapper {
    MedicalRecordDto toDto(MedicalRecord medicalRecord);

    MedicalRecord toEntity(MedicalRecordDto medicalRecordDto);
}

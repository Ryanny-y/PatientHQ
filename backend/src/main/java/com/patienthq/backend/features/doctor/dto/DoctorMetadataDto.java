package com.patienthq.backend.features.doctor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorMetadataDto {
    private long totalDoctors;
    private long activeDoctors;
    private long inactiveDoctors;
    private List<String> specializations;
}

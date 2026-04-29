package com.patienthq.backend.features.nurse.dto;

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
public class NurseMetadataDto {
    private long totalNurses;
    private long activeNurses;
    private long inactiveNurses;
    private List<String> wards;
}

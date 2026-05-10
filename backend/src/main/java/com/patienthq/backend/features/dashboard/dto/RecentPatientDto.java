package com.patienthq.backend.features.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentPatientDto {
    private String id;
    private String name;
    private int age;
    private String condition;
    private String assignedDoctor;
    private String registeredAt;
    private String status;
}

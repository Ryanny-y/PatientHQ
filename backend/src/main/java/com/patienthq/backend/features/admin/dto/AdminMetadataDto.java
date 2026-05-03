package com.patienthq.backend.features.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminMetadataDto {
    private long totalAdmins;
    private long activeAccounts;
    private long inactiveAccounts;
    private long recentlyAdded;
}

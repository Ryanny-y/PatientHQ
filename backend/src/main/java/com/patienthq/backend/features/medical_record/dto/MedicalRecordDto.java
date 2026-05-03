    package com.patienthq.backend.features.medical_record.dto;

    import lombok.AllArgsConstructor;
    import lombok.Builder;
    import lombok.Getter;
    import lombok.NoArgsConstructor;

    import java.time.LocalDateTime;
    import java.util.UUID;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public class MedicalRecordDto {
        private UUID recordId;
        private UUID patientId;
        private UUID doctorId;
        private String diagnosis;
        private String treatment;
        private String prescription;
        private String notes;
        private LocalDateTime createdAt;
    }

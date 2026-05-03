package com.patienthq.backend.features.data_integrity.model;

import com.patienthq.backend.features.patient.model.Patient;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "data_integrity")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DataIntegrity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "integrity_id")
    private UUID integrityId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false, unique = true)
    private Patient patient;

    @Column(name = "hash_value", nullable = false)
    private String hashValue;

    @Column(name = "last_checked")
    private LocalDateTime lastChecked;

    @Column(name = "status", length = 50)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private IntegrityStatus status = IntegrityStatus.VALID;

    @PrePersist
    protected void onCreate() {
        if (this.lastChecked == null) {
            this.lastChecked = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = IntegrityStatus.VALID;
        }
    }
}

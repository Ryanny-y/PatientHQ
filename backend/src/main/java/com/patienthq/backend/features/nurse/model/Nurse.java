package com.patienthq.backend.features.nurse.model;

import com.patienthq.backend.features.user.model.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "nurse_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Nurse {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "nurse_id", nullable = false, unique = true)
    private UUID nurseId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "assigned_ward", nullable = false)
    private String assignedWard;

    @Column(name = "license_number", nullable = false, unique = true)
    private String licenseNumber;

    @Column(name = "contact_number")
    private String contactNumber;

    @Column(name = "email")
    private String email;
}

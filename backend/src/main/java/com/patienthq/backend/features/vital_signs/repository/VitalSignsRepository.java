package com.patienthq.backend.features.vital_signs.repository;

import com.patienthq.backend.features.vital_signs.model.VitalSign;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VitalSignsRepository extends JpaRepository<VitalSign, UUID> {
    @Override
    @EntityGraph(attributePaths = {"patient", "recordedBy"})
    List<VitalSign> findAll();
}

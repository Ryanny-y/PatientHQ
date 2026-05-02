package com.patienthq.backend.features.report.repository;

import com.patienthq.backend.features.report.model.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ReportRepository extends JpaRepository<Report, UUID> {

    @Query("""
        SELECT r FROM Report r
        LEFT JOIN FETCH r.patient p
        LEFT JOIN FETCH r.generatedBy u
    """)
    Page<Report> findAllReports(Pageable pageable);
}

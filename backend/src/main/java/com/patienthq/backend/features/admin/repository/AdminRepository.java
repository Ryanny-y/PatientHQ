package com.patienthq.backend.features.admin.repository;

import com.patienthq.backend.features.admin.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdminRepository extends JpaRepository<Admin, UUID>, PagingAndSortingRepository<Admin, UUID> {
}

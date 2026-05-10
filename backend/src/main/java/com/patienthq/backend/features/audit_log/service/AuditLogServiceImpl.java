package com.patienthq.backend.features.audit_log.service;

import com.patienthq.backend.features.audit_log.AuditLogMapper;
import com.patienthq.backend.features.audit_log.dto.AuditLogDto;
import com.patienthq.backend.features.audit_log.dto.AuditLogMetadataDto;
import com.patienthq.backend.features.audit_log.model.AuditLog;
import com.patienthq.backend.features.audit_log.repository.AuditLogRepository;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final AuditLogMapper auditLogMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLogDto> getAuditLogs(
            String search,
            String role,
            String entityType,
            String severity,
            String ipAddress,
            LocalDate dateFrom,
            LocalDate dateTo,
            Pageable pageable
    ) {
        String formattedSearch = search == null || search.isBlank()
                ? null
                : search.trim().toLowerCase(Locale.ROOT);
        String formattedRole = role == null || role.equalsIgnoreCase("All")
                ? null
                : role.trim().toLowerCase(Locale.ROOT);
        String formattedEntityType = entityType == null || entityType.equalsIgnoreCase("All")
                ? null
                : entityType.trim();
        String formattedSeverity = severity == null || severity.equalsIgnoreCase("All")
                ? null
                : severity.trim().toLowerCase(Locale.ROOT);
        String formattedIpAddress = ipAddress == null || ipAddress.isBlank()
                ? null
                : ipAddress.trim();
        LocalDateTime from = dateFrom == null ? null : dateFrom.atStartOfDay();
        LocalDateTime to = dateTo == null ? null : dateTo.plusDays(1).atStartOfDay();

        return auditLogRepository.findAll(
                buildSpecification(
                        formattedSearch,
                        formattedRole,
                        formattedEntityType,
                        formattedSeverity,
                        formattedIpAddress,
                        from,
                        to
                ),
                pageable
        ).map(auditLogMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public AuditLogMetadataDto getMetadata() {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        return AuditLogMetadataDto.builder()
                .totalLogsToday(auditLogRepository.countByCreatedAtBetween(start, end))
                .failedLoginAttempts(auditLogRepository.countByCreatedAtBetweenAndActionIgnoreCase(start, end, "LOGIN_FAILED"))
                .criticalActions(auditLogRepository.countCriticalBetween(start, end))
                .activeUsersToday(auditLogRepository.countActiveUsersBetween(start, end))
                .build();
    }

    private Specification<AuditLog> buildSpecification(
            String search,
            String role,
            String entityType,
            String severity,
            String ipAddress,
            LocalDateTime from,
            LocalDateTime to
    ) {
        return (root, query, cb) -> {
            if (query != null && AuditLog.class.equals(query.getResultType())) {
                root.fetch("user", JoinType.LEFT).fetch("role", JoinType.LEFT);
            }

            var user = root.join("user", JoinType.LEFT);
            var roleJoin = user.join("role", JoinType.LEFT);
            List<Predicate> predicates = new ArrayList<>();

            if (search != null) {
                String likeSearch = "%" + search + "%";
                List<Predicate> searchPredicates = new ArrayList<>();
                searchPredicates.add(cb.like(cb.lower(user.get("username")), likeSearch));
                searchPredicates.add(cb.like(cb.lower(root.get("action")), likeSearch));
                searchPredicates.add(cb.like(cb.lower(root.get("entityType")), likeSearch));
                searchPredicates.add(cb.like(cb.lower(cb.coalesce(root.get("description"), "")), likeSearch));

                try {
                    searchPredicates.add(cb.equal(root.get("logId"), UUID.fromString(search)));
                } catch (IllegalArgumentException ignored) {
                    // Search text is not a UUID, so skip direct log id matching.
                }

                predicates.add(cb.or(searchPredicates.toArray(Predicate[]::new)));
            }

            if (role != null) {
                predicates.add(cb.or(
                        cb.equal(cb.lower(roleJoin.get("roleName")), role),
                        cb.equal(cb.lower(roleJoin.get("roleName")), "role_" + role)
                ));
            }

            if (entityType != null) {
                predicates.add(cb.equal(root.get("entityType"), entityType));
            }

            if (ipAddress != null) {
                predicates.add(cb.like(root.get("ipAddress"), "%" + ipAddress + "%"));
            }

            if (from != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), from));
            }

            if (to != null) {
                predicates.add(cb.lessThan(root.get("createdAt"), to));
            }

            if (severity != null) {
                predicates.add(resolveSeverityPredicate(severity, root, cb));
            }

            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }

    private Predicate resolveSeverityPredicate(
            String severity,
            jakarta.persistence.criteria.Root<AuditLog> root,
            jakarta.persistence.criteria.CriteriaBuilder cb
    ) {
        Predicate critical = cb.or(
                cb.like(cb.lower(root.get("action")), "%failed%"),
                cb.like(cb.lower(root.get("action")), "%delete%"),
                cb.like(cb.lower(root.get("action")), "%critical%"),
                cb.like(cb.lower(cb.coalesce(root.get("description"), "")), "%failed%"),
                cb.like(cb.lower(cb.coalesce(root.get("description"), "")), "%unauthorized%"),
                cb.like(cb.lower(cb.coalesce(root.get("description"), "")), "%critical%")
        );
        Predicate warning = cb.or(
                cb.like(cb.lower(root.get("action")), "%update%"),
                cb.like(cb.lower(root.get("action")), "%create%"),
                cb.like(cb.lower(root.get("action")), "%reset%"),
                cb.like(cb.lower(cb.coalesce(root.get("description"), "")), "%pending%")
        );

        if ("critical".equals(severity)) {
            return critical;
        }

        if ("warning".equals(severity)) {
            return warning;
        }

        return cb.and(cb.not(critical), cb.not(warning));
    }
}

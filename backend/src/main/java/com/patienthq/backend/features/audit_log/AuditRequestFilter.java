package com.patienthq.backend.features.audit_log;

import com.patienthq.backend.features.audit_log.model.AuditLog;
import com.patienthq.backend.features.audit_log.repository.AuditLogRepository;
import com.patienthq.backend.shared.security.UserPrincipal;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Locale;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class AuditRequestFilter extends OncePerRequestFilter {

    private final AuditLogRepository auditLogRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        filterChain.doFilter(request, response);

        if (!shouldAudit(request)) {
            return;
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal userPrincipal)) {
            return;
        }

        auditLogRepository.save(
                AuditLog.builder()
                        .user(userPrincipal.getUser())
                        .action(resolveAction(request, response))
                        .entityType(resolveEntityType(request))
                        .entityId(resolveEntityId(request))
                        .description(resolveDescription(request, response))
                        .ipAddress(resolveIpAddress(request))
                        .build()
        );
    }

    private boolean shouldAudit(HttpServletRequest request) {
        String method = request.getMethod();
        String path = request.getRequestURI();

        return path.startsWith("/api/v1/")
                && !path.startsWith("/api/v1/audit-logs")
                && !path.startsWith("/api/v1/auth/refresh-token")
                && !method.equalsIgnoreCase("GET")
                && !method.equalsIgnoreCase("OPTIONS");
    }

    private String resolveAction(HttpServletRequest request, HttpServletResponse response) {
        String outcome = response.getStatus() >= 400 ? "FAILED" : "SUCCESS";
        return request.getMethod().toUpperCase(Locale.ROOT) + "_" + resolveEntityType(request) + "_" + outcome;
    }

    private String resolveEntityType(HttpServletRequest request) {
        String[] parts = request.getRequestURI().replace("/api/v1/", "").split("/");
        if (parts.length == 0 || parts[0].isBlank()) {
            return "SYSTEM";
        }

        return parts[0]
                .replace("-", "_")
                .toUpperCase(Locale.ROOT);
    }

    private UUID resolveEntityId(HttpServletRequest request) {
        String[] parts = request.getRequestURI().split("/");
        for (int i = parts.length - 1; i >= 0; i--) {
            try {
                return UUID.fromString(parts[i]);
            } catch (IllegalArgumentException ignored) {
                // Keep walking backwards until a UUID path segment is found.
            }
        }

        return null;
    }

    private String resolveDescription(HttpServletRequest request, HttpServletResponse response) {
        return "%s %s completed with HTTP %d".formatted(
                request.getMethod().toUpperCase(Locale.ROOT),
                request.getRequestURI(),
                response.getStatus()
        );
    }

    private String resolveIpAddress(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }

        return request.getRemoteAddr();
    }
}

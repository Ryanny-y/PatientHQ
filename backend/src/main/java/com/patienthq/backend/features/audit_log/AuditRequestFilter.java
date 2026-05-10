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
import java.util.Set;
import java.util.Locale;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class AuditRequestFilter extends OncePerRequestFilter {

    private static final Set<String> AUDITED_METHODS = Set.of("POST", "PUT", "PATCH", "DELETE");

    private final AuditLogRepository auditLogRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        Exception requestException = null;

        try {
            filterChain.doFilter(request, response);
        } catch (ServletException | IOException | RuntimeException ex) {
            requestException = ex;
            throw ex;
        } finally {
            auditRequest(request, response, requestException);
        }
    }

    private boolean shouldAudit(HttpServletRequest request) {
        String method = request.getMethod().toUpperCase(Locale.ROOT);
        String path = request.getRequestURI();

        return path.startsWith("/api/v1/")
                && !path.startsWith("/api/v1/audit-logs")
                && !path.startsWith("/api/v1/auth")
                && AUDITED_METHODS.contains(method);
    }

    private void auditRequest(
            HttpServletRequest request,
            HttpServletResponse response,
            Exception requestException
    ) {
        if (!shouldAudit(request)) {
            return;
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal userPrincipal)) {
            return;
        }

        try {
            auditLogRepository.save(
                    AuditLog.builder()
                            .user(userPrincipal.getUser())
                            .action(resolveAction(request, response, requestException))
                            .entityType(resolveEntityType(request))
                            .entityId(resolveEntityId(request))
                            .description(resolveDescription(request, response, requestException))
                            .ipAddress(resolveIpAddress(request))
                            .build()
            );
        } catch (RuntimeException ignored) {
            // Auditing must not mask the original request result.
        }
    }

    private String resolveAction(
            HttpServletRequest request,
            HttpServletResponse response,
            Exception requestException
    ) {
        String outcome = requestException != null || response.getStatus() >= 400 ? "FAILED" : "SUCCESS";
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

    private String resolveDescription(
            HttpServletRequest request,
            HttpServletResponse response,
            Exception requestException
    ) {
        String description = "%s %s completed with HTTP %d".formatted(
                request.getMethod().toUpperCase(Locale.ROOT),
                request.getRequestURI(),
                response.getStatus()
        );

        if (requestException == null) {
            return description;
        }

        return description + " (" + requestException.getClass().getSimpleName() + ")";
    }

    private String resolveIpAddress(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }

        return request.getRemoteAddr();
    }
}

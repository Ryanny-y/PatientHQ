# Data Integrity Module

## Overview

The Data Integrity module provides tamper detection for patient-related data using SHA-256 cryptographic hashing. It ensures the integrity of patient records, medical records, vital signs, and appointments.

---

## Architecture

### Components

```
data_integrity/
├── model/
│   ├── DataIntegrity.java          ← JPA entity
│   └── IntegrityStatus.java        ← VALID, PENDING, TAMPERED
├── dto/
│   ├── DataIntegrityDto.java       ← Response DTO
│   └── IntegrityVerificationDto.java ← Verification result DTO
├── exception/
│   └── DataIntegrityNotFoundException.java
├── repository/
│   └── DataIntegrityRepository.java
├── service/
│   ├── PatientIntegrityService.java
│   └── PatientIntegrityServiceImpl.java
├── DataIntegrityMapper.java
└── DataIntegrityController.java
```

---

## API Endpoints

### Base Path: `/api/v1/patients/{patientId}/integrity`

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Get stored integrity record |
| `GET` | `/verify` | Verify integrity (recompute and compare) |
| `POST` | `/` | Recompute and store new hash |

---

## Integrity Scope

The hash includes **ALL** of the following data for a patient:

1. **Patient record** (from `patients` table)
2. **All medical records** (from `medical_records` table)
3. **All vital signs** (from `vital_signs` table)
4. **All appointments** (from `appointments` table)

### Data Ordering

- Medical records: `ORDER BY created_at, record_id`
- Vital signs: `ORDER BY recorded_at, vital_id`
- Appointments: `ORDER BY created_at, appointment_id`

---

## Workflow

### 1. When Patient Data is Modified

Any modification to:
- Patient record (update)
- Medical records (create/update/delete)
- Vital signs (create)
- Appointments (create/update/delete)

**Automatically triggers:**
```java
patientIntegrityService.markPending(patientId);
```

This sets `status = PENDING` in the `data_integrity` table.

---

### 2. Verification Flow

**Endpoint:** `GET /api/v1/patients/{patientId}/integrity/verify`

**Process:**
1. Fetch all patient-related data from database
2. Compute current hash using SHA-256
3. Compare with stored hash
4. Update status:
   - `VALID` if hashes match
   - `TAMPERED` if hashes differ
5. Update `last_checked` timestamp
6. Return verification result

**Response:**
```json
{
  "success": true,
  "message": "Integrity verification completed",
  "data": {
    "patientId": "uuid",
    "patientName": "John Doe",
    "status": "VALID",
    "currentHash": "abc123...",
    "storedHash": "abc123...",
    "isValid": true,
    "verifiedAt": "2024-01-15T10:30:00"
  }
}
```

---

### 3. Recompute Hash

**Endpoint:** `POST /api/v1/patients/{patientId}/integrity`

**Process:**
1. Fetch all patient-related data
2. Compute new hash
3. Store/update in `data_integrity` table
4. Set `status = VALID`
5. Update `last_checked` timestamp

**Use Cases:**
- Initial hash creation for new patients
- Reset integrity after confirmed legitimate changes
- Periodic integrity baseline updates

---

## Hashing Algorithm

### Implementation

```java
private String computePatientDataHash(UUID patientId) {
    Map<String, Object> aggregatedData = new LinkedHashMap<>();
    
    // 1. Patient data
    aggregatedData.put("patient", fetchPatientData(patientId));
    
    // 2. Medical records (ordered)
    aggregatedData.put("medical_records", fetchMedicalRecords(patientId));
    
    // 3. Vital signs (ordered)
    aggregatedData.put("vital_signs", fetchVitalSigns(patientId));
    
    // 4. Appointments (ordered)
    aggregatedData.put("appointments", fetchAppointments(patientId));
    
    return hashData(aggregatedData);
}
```

### Hash Computation

1. **Serialize to JSON** (deterministic, using Jackson ObjectMapper)
2. **Compute SHA-256** hash of JSON bytes
3. **Convert to hex string**

### Determinism Guarantees

- Uses `LinkedHashMap` for consistent key ordering
- Explicit `ORDER BY` in SQL queries
- Null values handled consistently
- Timestamps converted to ISO-8601 strings

---

## Integration Points

### Service Layer Integration

All services that modify patient-related data must call:

```java
patientIntegrityService.markPending(patientId);
```

**Already integrated in:**
- `PatientServiceImpl.updatePatient()`
- `AppointmentServiceImpl.createAppointment()`
- `AppointmentServiceImpl.updateAppointment()`
- `AppointmentServiceImpl.deleteAppointment()`
- `VitalSignsServiceImpl.createVitalSigns()`

**TODO: Integrate in medical_records service when implemented**

---

## Database Schema

```sql
CREATE TABLE data_integrity (
    integrity_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL UNIQUE,
    hash_value VARCHAR(255) NOT NULL,
    last_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'VALID',
    
    CONSTRAINT fk_integrity_patient
        FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
        ON DELETE CASCADE
);
```

---

## Status States

| Status | Description |
|--------|-------------|
| `VALID` | Hash matches current data |
| `PENDING` | Data modified, hash not yet verified |
| `TAMPERED` | Hash mismatch detected |

---

## Edge Cases Handled

1. **Patient not found** → 404 error
2. **No integrity record** → Auto-create on recompute
3. **No related records** → Empty collections hashed (valid)
4. **Null values** → Handled consistently in JSON serialization
5. **Concurrent modifications** → Transaction isolation ensures consistency

---

## Security Considerations

1. **SHA-256** provides cryptographic strength
2. **No hash in API responses** (except verification endpoint)
3. **Read-only verification** doesn't modify data
4. **Transaction boundaries** prevent partial updates
5. **Deterministic hashing** prevents false positives

---

## Performance Notes

1. **JdbcTemplate** used for efficient bulk data fetching
2. **Indexed queries** on patient_id foreign keys
3. **Lazy loading** for JPA entities
4. **Transaction read-only** for verification queries
5. **Async marking** possible for high-volume systems

---

## Usage Examples

### 1. Get Current Integrity Status

```bash
GET /api/v1/patients/{patientId}/integrity
```

### 2. Verify Integrity

```bash
GET /api/v1/patients/{patientId}/integrity/verify
```

### 3. Recompute Hash (After Legitimate Changes)

```bash
POST /api/v1/patients/{patientId}/integrity
```

---

## Monitoring & Alerts

**Recommended monitoring:**
- Count of `TAMPERED` status records
- Count of `PENDING` status records older than threshold
- Frequency of verification requests
- Hash computation performance metrics

**Alert triggers:**
- Any `TAMPERED` status detected
- `PENDING` status exceeding 24 hours
- Verification failures

---

## Future Enhancements

1. **Audit trail** for integrity status changes
2. **Scheduled verification** jobs
3. **Blockchain integration** for immutable audit log
4. **Digital signatures** for non-repudiation
5. **Differential hashing** for performance optimization
6. **Merkle tree** for partial verification

---

## Testing

### Unit Tests
- Hash computation determinism
- Null value handling
- Empty collection handling
- Status transitions

### Integration Tests
- End-to-end verification flow
- Concurrent modification handling
- Transaction rollback scenarios
- Performance under load

---

## Compliance

This module supports:
- **HIPAA** audit requirements
- **GDPR** data integrity obligations
- **FDA 21 CFR Part 11** electronic records integrity
- **ISO 27001** information security controls

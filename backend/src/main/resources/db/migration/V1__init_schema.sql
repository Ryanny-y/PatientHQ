-- Enable UUID support
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. ROLES (UNCHANGED - INT PK)
CREATE TABLE roles (
    role_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- 2. USERS
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    refresh_token TEXT,
    refresh_token_exp TIMESTAMP,
    role_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- 3. ADMIN PROFILES
CREATE TABLE admin_profiles (
    admin_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(20),
    email VARCHAR(100),

    CONSTRAINT fk_admin_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- 4. DOCTOR PROFILES
CREATE TABLE doctor_profiles (
    doctor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    license_number VARCHAR(100) UNIQUE,
    contact_number VARCHAR(20),
    email VARCHAR(100),

    CONSTRAINT fk_doctor_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- 5. NURSE PROFILES
CREATE TABLE nurse_profiles (
    nurse_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    assigned_ward VARCHAR(100),
    license_number VARCHAR(100) UNIQUE,
    contact_number VARCHAR(20),
    email VARCHAR(100),

    CONSTRAINT fk_nurse_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- 6. PATIENTS
CREATE TABLE patients (
    patient_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    contact_number VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    blood_type VARCHAR(10),
    allergies TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_number VARCHAR(20),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. DOCTOR ASSIGNMENTS
CREATE TABLE doctor_assignments (
    assignment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    doctor_id UUID NOT NULL,
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_assignment_patient
        FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_assignment_doctor
        FOREIGN KEY (doctor_id) REFERENCES doctor_profiles(doctor_id)
        ON DELETE CASCADE
);

-- 8. MEDICAL RECORDS
CREATE TABLE medical_records (
    record_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    doctor_id UUID NOT NULL,
    diagnosis TEXT NOT NULL,
    treatment TEXT,
    prescription TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_record_patient
        FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_record_doctor
        FOREIGN KEY (doctor_id) REFERENCES doctor_profiles(doctor_id)
        ON DELETE CASCADE
);

-- 9. VITAL SIGNS
CREATE TABLE vital_signs (
    vital_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    recorded_by UUID NOT NULL,
    temperature DECIMAL(5,2),
    heart_rate INT,
    respiratory_rate INT,
    oxygen_saturation DECIMAL(5,2),
    blood_pressure VARCHAR(20),
    weight DECIMAL(6,2),
    height DECIMAL(6,2),
    notes TEXT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_vital_patient
        FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_vital_nurse
        FOREIGN KEY (recorded_by) REFERENCES nurse_profiles(nurse_id)
        ON DELETE CASCADE
);

-- 10. APPOINTMENTS
CREATE TABLE appointments (
    appointment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    doctor_id UUID NOT NULL,
    appointment_date TIMESTAMP NOT NULL,
    reason TEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_appointment_patient
        FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_appointment_doctor
        FOREIGN KEY (doctor_id) REFERENCES doctor_profiles(doctor_id)
        ON DELETE CASCADE
);

-- 11. REPORTS
CREATE TABLE reports (
    report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    generated_by UUID NOT NULL,
    report_type VARCHAR(100),
    summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_report_patient
        FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_report_user
        FOREIGN KEY (generated_by) REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- 12. AUDIT LOGS
CREATE TABLE audit_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    description TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- 13. DATA INTEGRITY
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

-- 14. SYSTEM SETTINGS
CREATE TABLE system_settings (
    setting_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_name VARCHAR(100) NOT NULL UNIQUE,
    setting_value VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. PATIENT HISTORY VIEW
CREATE VIEW patient_history AS

SELECT
    patient_id,
    'MEDICAL_RECORD' AS event_type,
    record_id AS reference_id,
    diagnosis AS description,
    created_at AS event_date
FROM medical_records

UNION ALL

SELECT
    patient_id,
    'VITAL_SIGNS',
    vital_id,
    'Vitals Recorded',
    recorded_at
FROM vital_signs

UNION ALL

SELECT
    patient_id,
    'APPOINTMENT',
    appointment_id,
    status,
    appointment_date
FROM appointments;
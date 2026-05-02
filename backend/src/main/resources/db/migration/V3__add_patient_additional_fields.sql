ALTER TABLE patients
ADD COLUMN existing_conditions TEXT DEFAULT '',
ADD COLUMN notes TEXT DEFAULT '',
ADD COLUMN emergency_contact_relationship VARCHAR(50) DEFAULT 'Other';
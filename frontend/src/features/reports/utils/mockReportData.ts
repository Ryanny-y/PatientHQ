import type { ReportRecord, HistoryEvent, PatientSummary } from '../types/report';

export const mockReports: ReportRecord[] = [
  {
    report_id: 9001,
    patient_id: 1001,
    patient_name: 'Juan Dela Cruz',
    generated_by: 'Dr. Elena Rodriguez',
    report_type: 'Medical Summary',
    summary: 'Patient hypertension follow-up with stable vitals and continued medication adherence.',
    created_at: '2026-04-26',
  },
  {
    report_id: 9002,
    patient_id: 1002,
    patient_name: 'Maria Santos',
    generated_by: 'Nurse Carla Mendoza',
    report_type: 'Appointment Summary',
    summary: 'Follow-up consultation scheduled with endocrinology for diabetes care planning.',
    created_at: '2026-04-27',
  },
  {
    report_id: 9003,
    patient_id: 1003,
    patient_name: 'Pedro Reyes',
    generated_by: 'Dr. Antonio Garcia',
    report_type: 'Patient Summary',
    summary: 'Clinical summary for chronic cardiac review with latest lab highlights.',
    created_at: '2026-04-24',
  },
  {
    report_id: 9004,
    patient_id: 1004,
    patient_name: 'Ana Lopez',
    generated_by: 'System Auditor',
    report_type: 'Operational Report',
    summary: 'Daily operational performance and patient throughput across cardiology.',
    created_at: '2026-04-25',
  },
  {
    report_id: 9005,
    patient_id: 1005,
    patient_name: 'Carlos Mendoza',
    generated_by: 'Dr. Miguel Santos',
    report_type: 'Admission Report',
    summary: 'Admission review and transfer readiness assessment for orthopedic care.',
    created_at: '2026-04-23',
  },
  {
    report_id: 9006,
    generated_by: 'Nurse Carla Mendoza',
    report_type: 'Operational Report',
    summary: 'Shift summary capturing patient activity, staffing, and nurse handover notes.',
    created_at: '2026-04-27',
  },
];

export const mockHistoryEvents: HistoryEvent[] = [
  {
    patient_id: 1001,
    patient_name: 'Juan Dela Cruz',
    event_type: 'MEDICAL_RECORD',
    reference_id: 501,
    description: 'Hypertension Stage 1 diagnosis recorded with treatment plan set.',
    event_date: '2026-04-26 09:30',
  },
  {
    patient_id: 1001,
    patient_name: 'Juan Dela Cruz',
    event_type: 'VITAL_SIGNS',
    reference_id: 602,
    description: 'Blood pressure and pulse documented during clinical check-in.',
    event_date: '2026-04-26 10:00',
  },
  {
    patient_id: 1002,
    patient_name: 'Maria Santos',
    event_type: 'APPOINTMENT',
    reference_id: 7002,
    description: 'Endocrinology consultation confirmed for diabetes care.',
    event_date: '2026-04-27 14:00',
  },
  {
    patient_id: 1003,
    patient_name: 'Pedro Reyes',
    event_type: 'MEDICAL_RECORD',
    reference_id: 503,
    description: 'ECG results entered and cardiac medication review completed.',
    event_date: '2026-04-24 11:00',
  },
  {
    patient_id: 1004,
    patient_name: 'Ana Lopez',
    event_type: 'APPOINTMENT',
    reference_id: 7004,
    description: 'Neurology follow-up scheduled for migraine assessment.',
    event_date: '2026-04-27 09:00',
  },
  {
    patient_id: 1005,
    patient_name: 'Carlos Mendoza',
    event_type: 'VITAL_SIGNS',
    reference_id: 605,
    description: 'Post-admission mobility and pain assessment documented.',
    event_date: '2026-04-23 16:15',
  },
  {
    patient_id: 1001,
    patient_name: 'Juan Dela Cruz',
    event_type: 'APPOINTMENT',
    reference_id: 7001,
    description: 'Cardiology follow-up consultation completed and notes finalized.',
    event_date: '2026-04-28 10:30',
  },
];

export const mockPatients: PatientSummary[] = [
  {
    patient_id: 1001,
    full_name: 'Juan Dela Cruz',
    status: 'Active',
    assigned_doctor: 'Dr. Antonio Garcia',
    last_visit: '2026-04-28',
    total_events: 12,
  },
  {
    patient_id: 1002,
    full_name: 'Maria Santos',
    status: 'Under Review',
    assigned_doctor: 'Dr. Elena Rodriguez',
    last_visit: '2026-04-27',
    total_events: 8,
  },
  {
    patient_id: 1003,
    full_name: 'Pedro Reyes',
    status: 'Active',
    assigned_doctor: 'Dr. Antonio Garcia',
    last_visit: '2026-04-24',
    total_events: 10,
  },
  {
    patient_id: 1004,
    full_name: 'Ana Lopez',
    status: 'Discharged',
    assigned_doctor: 'Dr. Miguel Santos',
    last_visit: '2026-04-27',
    total_events: 6,
  },
];

export const mockUsers = [
  { id: 12, name: 'Dr. Antonio Garcia' },
  { id: 13, name: 'Dr. Elena Rodriguez' },
  { id: 22, name: 'Nurse Carla Mendoza' },
  { id: 99, name: 'System Auditor' },
];

export const reportTypes = [
  'Patient Summary',
  'Medical Summary',
  'Appointment Summary',
  'Admission Report',
  'Operational Report',
] as const;

export const reportOutputFormats = ['PDF', 'CSV', 'Print Preview'] as const;

export const mockReportStats = {
  totalReports: 1428,
  todayReports: 5,
  monthlyReports: 82,
  mostRequestedType: 'Medical Summary',
};

export const mockAnalytics = {
  monthlyReports: [
    { month: 'Jan', value: 98 },
    { month: 'Feb', value: 112 },
    { month: 'Mar', value: 123 },
    { month: 'Apr', value: 142 },
    { month: 'May', value: 130 },
    { month: 'Jun', value: 118 },
  ],
  appointmentOutcomes: [
    { label: 'Completed', value: 54, color: 'bg-emerald-500' },
    { label: 'Confirmed', value: 26, color: 'bg-sky-500' },
    { label: 'Pending', value: 12, color: 'bg-amber-500' },
    { label: 'Cancelled', value: 8, color: 'bg-rose-500' },
  ],
  commonDiagnoses: [
    { label: 'Hypertension', count: 74 },
    { label: 'Diabetes', count: 58 },
    { label: 'Migraine', count: 34 },
    { label: 'Orthopedic Review', count: 29 },
  ],
  dailyActivity: [
    { day: 'Mon', value: 62 },
    { day: 'Tue', value: 78 },
    { day: 'Wed', value: 85 },
    { day: 'Thu', value: 72 },
    { day: 'Fri', value: 90 },
    { day: 'Sat', value: 48 },
    { day: 'Sun', value: 39 },
  ],
  staffActivity: [
    { label: 'Reports Generated', value: 34 },
    { label: 'Patient Reviews', value: 22 },
    { label: 'Clinician Notes', value: 18 },
    { label: 'Follow-ups Scheduled', value: 14 },
  ],
};

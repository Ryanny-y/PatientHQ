import type { StatCardData, ActivityItem, SecurityStatusItem, RecentPatient } from '@/features/dashboard/types/dashboard';

export const mockStats: StatCardData[] = [
  { title: 'Total Patients', value: '2,847', change: '+12 this week', trend: 'up', icon: 'Users', color: 'blue' },
  { title: 'Doctors Active', value: '48', change: '3 on leave', trend: 'neutral', icon: 'Stethoscope', color: 'emerald' },
  { title: 'Nurses Active', value: '124', change: '+5 this month', trend: 'up', icon: 'HeartPulse', color: 'violet' },
  { title: 'Pending Appointments', value: '73', change: '18 urgent', trend: 'down', icon: 'CalendarClock', color: 'amber' },
];

export const mockActivities: ActivityItem[] = [
  { id: '1', user: 'Dr. Sarah Chen', role: 'Doctor', action: 'Accessed medical record', resource: 'Patient #P-00412', time: '2 min ago', status: 'info' },
  { id: '2', user: 'Admin Rivera', role: 'Admin', action: 'Created new account', resource: 'Nurse J. Santos', time: '14 min ago', status: 'success' },
  { id: '3', user: 'Nurse Patel', role: 'Nurse', action: 'Updated vitals', resource: 'Patient #P-00389', time: '31 min ago', status: 'success' },
  { id: '4', user: 'Dr. Marcus Lee', role: 'Doctor', action: 'Prescribed medication', resource: 'Patient #P-00401', time: '1 hr ago', status: 'info' },
  { id: '5', user: 'Admin Rivera', role: 'Admin', action: 'Modified RBAC policy', resource: 'Nurse Role', time: '2 hr ago', status: 'warning' },
  { id: '6', user: 'Dr. Sarah Chen', role: 'Doctor', action: 'Discharged patient', resource: 'Patient #P-00375', time: '3 hr ago', status: 'success' },
];

export const mockSecurityStatus: SecurityStatusItem[] = [
  { label: 'RBAC Active', status: 'active', description: 'Role-based access control enforced across all modules' },
  { label: 'Audit Logs Running', status: 'running', description: 'All user actions are being recorded in real-time' },
  { label: 'Integrity Check Passed', status: 'passed', description: 'Last verified: today at 06:00 AM — no anomalies found' },
  { label: 'Encryption Enabled', status: 'enabled', description: 'AES-256 encryption active for all stored patient data' },
];

export const mockRecentPatients: RecentPatient[] = [
  { id: 'P-00847', name: 'Maria Santos', age: 54, condition: 'Hypertension', assignedDoctor: 'Dr. Sarah Chen', registeredAt: 'Today, 9:14 AM', status: 'Admitted' },
  { id: 'P-00846', name: 'James Reyes', age: 32, condition: 'Appendicitis', assignedDoctor: 'Dr. Marcus Lee', registeredAt: 'Today, 8:02 AM', status: 'Critical' },
  { id: 'P-00845', name: 'Linda Cruz', age: 67, condition: 'Diabetes Type 2', assignedDoctor: 'Dr. Sarah Chen', registeredAt: 'Yesterday, 4:30 PM', status: 'Outpatient' },
  { id: 'P-00844', name: 'Robert Tan', age: 45, condition: 'Fractured Tibia', assignedDoctor: 'Dr. Ana Gomez', registeredAt: 'Yesterday, 2:15 PM', status: 'Admitted' },
  { id: 'P-00843', name: 'Elena Flores', age: 28, condition: 'Pneumonia', assignedDoctor: 'Dr. Marcus Lee', registeredAt: 'Yesterday, 11:00 AM', status: 'Discharged' },
];

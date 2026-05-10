export interface StatCardData {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  color: 'blue' | 'emerald' | 'violet' | 'amber';
}

export interface ActivityItem {
  id: string;
  user: string;
  role: 'Admin' | 'Doctor' | 'Nurse';
  action: string;
  resource: string;
  time: string;
  status: 'success' | 'warning' | 'info';
}

export interface SecurityStatusItem {
  label: string;
  status: 'active' | 'running' | 'passed' | 'enabled';
  description: string;
}

export interface RecentPatient {
  id: string;
  name: string;
  age: number;
  condition: string;
  assignedDoctor: string;
  registeredAt: string;
  status: 'Admitted' | 'Outpatient' | 'Discharged' | 'Critical';
}

export interface DashboardData {
  stats: StatCardData[];
  activities: ActivityItem[];
  securityStatus: SecurityStatusItem[];
  recentPatients: RecentPatient[];
}

export type navItem =
  | { type: 'link'; label: string; icon: string; path: string }
  | { type: 'group'; label: string; children: { label: string; icon: string; path: string }[] };

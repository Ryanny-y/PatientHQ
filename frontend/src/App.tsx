import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/shared/context/AuthContext";
import LoginPage from "@/features/auth/LoginPage";
import AdminDashboard from "@/features/dashboard/AdminDashboard";
import { type ReactNode, type ReactElement } from "react";
import DashboardHome from "./features/dashboard/components/DashboardHome";
import AdminAccountsPage from "./features/adminAccounts/AdminAccountsPage";
import DoctorAccountsPage from "./features/doctorAccounts/DoctorAccountsPage";
import NurseAccountsPage from "./features/nurseAccounts/NurseAccountsPage";
import PatientListPage from "./features/patients/pages/PatientListPage";
import RegisterPatientPage from "./features/patients/pages/RegisterPatientPage";
import AssignDoctorPage from "./features/doctorAssignments/AssignDoctorPage";
import MedicalRecordsPage from "./features/medicalRecords/pages/MedicalRecordsPage";
import MonitoringPage from "./features/monitoring/MonitoringPage";
import AppointmentsPage from "./features/appointments/pages/AppointmentsPage";
import ReportsHistoryPage from "./features/reports/ReportsHistoryPage";
import AuditLogsPage from "./features/auditLogs/components/AuditLogsPage";
import RolesPermissionsPage from "./features/rolesPermissions/RolesPermissionsPage";
import DataIntegrityPage from "./features/dataIntegrity/DataIntegrityPage";
import { Toaster } from "sonner";
import UnauthorizedState from "./features/auditLogs/components/UnauthorizedState";
import { hasPermission, PERMISSIONS } from "./shared/security/permissions";
const ProtectedRoute = ({
  children,
  permission,
}: {
  children: ReactNode;
  permission?: string;
}): ReactElement => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (permission && !hasPermission(user, permission)) {
    return <UnauthorizedState />;
  }

  return <>{children}</>;
};

const AppRoutes = (): ReactElement => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />

    <Route
      element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />

      <Route
        path="dashboard"
        element={
          <ProtectedRoute permission={PERMISSIONS.DASHBOARD_VIEW}>
            <DashboardHome />
          </ProtectedRoute>
        }
      />
      <Route path="users">
        <Route
          path="admins"
          element={
            <ProtectedRoute permission={PERMISSIONS.USER_MANAGEMENT_VIEW}>
              <AdminAccountsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="doctors"
          element={
            <ProtectedRoute permission={PERMISSIONS.USER_MANAGEMENT_VIEW}>
              <DoctorAccountsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="nurses"
          element={
            <ProtectedRoute permission={PERMISSIONS.USER_MANAGEMENT_VIEW}>
              <NurseAccountsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="patients" element={<ProtectedRoute permission={PERMISSIONS.PATIENT_VIEW}><PatientListPage /></ProtectedRoute>} />
      <Route path="patients/register" element={<ProtectedRoute permission={PERMISSIONS.PATIENT_CREATE}><RegisterPatientPage /></ProtectedRoute>} />
      <Route path="patients/assign" element={<ProtectedRoute permission={PERMISSIONS.DOCTOR_ASSIGNMENT_ASSIGN}><AssignDoctorPage /></ProtectedRoute>} />
      <Route path="records" element={<ProtectedRoute permission={PERMISSIONS.MEDICAL_RECORD_VIEW}><MedicalRecordsPage /></ProtectedRoute>} />
      <Route path="monitoring" element={<ProtectedRoute permission={PERMISSIONS.VITAL_SIGNS_VIEW}><MonitoringPage /></ProtectedRoute>} />
      <Route path="appointments" element={<ProtectedRoute permission={PERMISSIONS.APPOINTMENT_VIEW}><AppointmentsPage /></ProtectedRoute>} />
      <Route path="reports" element={<ProtectedRoute permission={PERMISSIONS.REPORT_VIEW}><ReportsHistoryPage /></ProtectedRoute>} />
      <Route path="audit" element={<ProtectedRoute permission={PERMISSIONS.AUDIT_LOG_VIEW}><AuditLogsPage /></ProtectedRoute>} />
      <Route path="integrity" element={<ProtectedRoute permission={PERMISSIONS.DATA_INTEGRITY_VIEW}><DataIntegrityPage /></ProtectedRoute>} />
      <Route path="roles-permissions" element={<ProtectedRoute permission={PERMISSIONS.ROLE_MANAGEMENT_VIEW}><RolesPermissionsPage /></ProtectedRoute>} />
    </Route>
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

const App = (): ReactElement => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
      <Toaster richColors />
    </AuthProvider>
  </BrowserRouter>
);

export default App;

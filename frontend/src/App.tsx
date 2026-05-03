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
import { hasPermission } from "./shared/security/permissions";
const ProtectedRoute = ({
  children,
  permission,
}: {
  children: ReactNode;
  permission?: string;
}): ReactElement => {
  const { user } = useAuth();

  if (permission && !hasPermission(user, permission)) {
    return <UnauthorizedState />;
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
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
          <ProtectedRoute permission="DASHBOARD_VIEW">
            <DashboardHome />
          </ProtectedRoute>
        }
      />
      <Route path="users">
        <Route
          path="admins"
          element={
            <ProtectedRoute permission="USER_MANAGEMENT_VIEW">
              <AdminAccountsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="doctors"
          element={
            <ProtectedRoute permission="USER_MANAGEMENT_VIEW">
              <DoctorAccountsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="nurses"
          element={
            <ProtectedRoute permission="USER_MANAGEMENT_VIEW">
              <NurseAccountsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="patients" element={<PatientListPage />} />
      <Route path="patients/register" element={<RegisterPatientPage />} />
      <Route path="patients/assign" element={<AssignDoctorPage />} />
      <Route path="records" element={<MedicalRecordsPage />} />
      <Route path="monitoring" element={<MonitoringPage />} />
      <Route path="appointments" element={<AppointmentsPage />} />
      <Route path="reports" element={<ReportsHistoryPage />} />
      <Route path="audit" element={<AuditLogsPage />} />
      <Route path="integrity" element={<DataIntegrityPage />} />
      <Route path="roles-permissions" element={<RolesPermissionsPage />} />
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

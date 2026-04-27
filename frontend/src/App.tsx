import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/shared/context/AuthContext";
import LoginPage from "@/features/auth/components/LoginPage";
import AdminDashboard from "@/features/dashboard/AdminDashboard";
import { type ReactNode, type ReactElement } from "react";
import DashboardHome from "./features/dashboard/components/DashboardHome";
import AdminAccountsPage from "./features/adminAccounts/components/AdminAccountsPage";
import DoctorAccountsPage from "./features/doctorAccounts/components/DoctorAccountsPage";
import NurseAccountsPage from "./features/nurseAccounts/NurseAccountsPage";
import PatientListPage from "./features/patients/pages/PatientListPage";
import RegisterPatientPage from "./features/patients/pages/RegisterPatientPage";
import AssignDoctorPage from './features/patients/pages/AssignDoctorPage';
import MedicalRecordsPage from './features/medicalRecords/pages/MedicalRecordsPage';
import AppointmentsPage from './features/appointments/pages/AppointmentsPage';
import ReportsHistoryPage from './features/reports/pages/ReportsHistoryPage';
import AuditLogsPage from './features/auditLogs/components/AuditLogsPage';
import { Toaster } from "sonner";
const ProtectedRoute = ({
  children,
}: {
  children: ReactNode;
}): ReactElement => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes = (): ReactElement => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/admin"
      element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<DashboardHome />} />
      <Route path="users/admins" element={<AdminAccountsPage />} />
      <Route path="users/doctors" element={<DoctorAccountsPage />} />
      <Route path="users/nurses" element={<NurseAccountsPage />} />
      <Route path="patients" element={<PatientListPage />} />
      <Route path="patients/register" element={<RegisterPatientPage />} />
      <Route path="patients/assign" element={<AssignDoctorPage />} />
      <Route path="records" element={<MedicalRecordsPage />} />
      <Route path="appointments" element={<AppointmentsPage />} />
      <Route path="reports" element={<ReportsHistoryPage />} />
      <Route path="audit" element={<AuditLogsPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

const App = (): ReactElement => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
      <Toaster />
    </AuthProvider>
  </BrowserRouter>
);

export default App;

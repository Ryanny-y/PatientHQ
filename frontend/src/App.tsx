import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/shared/context/AuthContext';
import LoginPage from '@/features/auth/components/LoginPage';
import AdminDashboard from '@/features/dashboard/components/AdminDashboard';
import { type ReactNode, type ReactElement } from 'react';

const ProtectedRoute = ({ children }: { children: ReactNode }): ReactElement => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes = (): ReactElement => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/admin/*"
      element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

const App = (): ReactElement => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;

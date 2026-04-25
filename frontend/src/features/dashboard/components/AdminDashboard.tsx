import { useState, type ReactElement } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '@/features/dashboard/components/Sidebar';
import Navbar from '@/features/dashboard/components/Navbar';
import DashboardHome from '@/features/dashboard/components/DashboardHome';
import PlaceholderPage from '@/features/dashboard/components/PlaceholderPage';
import AdminAccountsPage from '@/features/adminAccounts/components/AdminAccountsPage';

const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/users/admins': 'Admin Accounts',
  '/admin/users/doctors': 'Doctor Accounts',
  '/admin/users/nurses': 'Nurse Accounts',
  '/admin/patients': 'Patient List',
  '/admin/patients/register': 'Register Patient',
  '/admin/patients/assign': 'Assign Doctor',
  '/admin/records': 'Medical Records',
  '/admin/monitoring': 'Monitoring',
  '/admin/appointments': 'Appointments',
  '/admin/reports': 'Reports & History',
  '/admin/audit': 'Audit Logs',
  '/admin/integrity': 'Data Integrity',
  '/admin/settings': 'System Settings',
};

const AdminDashboard = (): ReactElement => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const activePath = location.pathname;
  const pageTitle = pageTitles[activePath] ?? 'Dashboard';

  const handleNavigate = (path: string): void => {
    navigate(path);
    setMobileOpen(false);
  };

  const renderContent = (): ReactElement => {
    switch (activePath) {
      case '/admin/dashboard': return <DashboardHome />;
      case '/admin/users/admins': return <AdminAccountsPage />;
      default: return <PlaceholderPage title={pageTitle} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        activePath={activePath}
        onNavigate={handleNavigate}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar pageTitle={pageTitle} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

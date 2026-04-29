import { useState, type ReactElement } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "@/features/dashboard/components/Sidebar";
import Navbar from "@/features/dashboard/components/Navbar";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/users/admins": "Admin Accounts",
  "/users/doctors": "Doctor Accounts",
  "/users/nurses": "Nurse Accounts",
  "/patients": "Patient List",
  "/patients/register": "Register Patient",
  "/patients/assign": "Assign Doctor",
  "/records": "Medical Records",
  "/monitoring": "Monitoring",
  "/appointments": "Appointments",
  "/reports": "Reports & History",
  "/audit": "Audit Logs",
  "/integrity": "Data Integrity",
  "/settings": "System Settings",
};

const AdminDashboard = (): ReactElement => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const activePath = location.pathname;
  const pageTitle = pageTitles[activePath] ?? "Dashboard";

  const handleNavigate = (path: string): void => {
    navigate(path);
    setMobileOpen(false);
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
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

import { useState, type ReactElement } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "@/features/dashboard/components/Sidebar";
import Navbar from "@/features/dashboard/components/Navbar";

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/users/admins": "Admin Accounts",
  "/admin/users/doctors": "Doctor Accounts",
  "/admin/users/nurses": "Nurse Accounts",
  "/admin/patients": "Patient List",
  "/admin/patients/register": "Register Patient",
  "/admin/patients/assign": "Assign Doctor",
  "/admin/records": "Medical Records",
  "/admin/monitoring": "Monitoring",
  "/admin/appointments": "Appointments",
  "/admin/reports": "Reports & History",
  "/admin/audit": "Audit Logs",
  "/admin/integrity": "Data Integrity",
  "/admin/settings": "System Settings",
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

        {/* 🔥 THIS is where routed pages render */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

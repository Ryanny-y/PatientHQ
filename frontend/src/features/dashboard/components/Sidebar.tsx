import { type ReactElement } from "react";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Stethoscope,
  HeartPulse,
  ClipboardList,
  UserPlus,
  UserCheck,
  FileText,
  Activity,
  CalendarDays,
  BarChart3,
  ScrollText,
  ShieldCheck,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { hasPermission } from "@/shared/security/permissions";
import { useAuth } from "@/shared/context/AuthContext";

interface NavChild {
  label: string;
  icon: React.ElementType;
  path: string;
}

interface NavGroup {
  type: "group";
  label: string;
  children: NavChild[];
  permission?: string;
}

interface NavLink {
  type: "link";
  label: string;
  icon: React.ElementType;
  path: string;
  permission?: string;
}

type NavItem = NavLink | NavGroup;

const navItems: NavItem[] = [
  {
    type: "link",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    permission: "DASHBOARD_VIEW",
  },
  {
    type: "group",
    label: "User Management",
    children: [
      { label: "Admin Accounts", icon: UserCog, path: "/users/admins" },
      { label: "Doctor Accounts", icon: Stethoscope, path: "/users/doctors" },
      { label: "Nurse Accounts", icon: HeartPulse, path: "/users/nurses" },
    ],
    permission: "USER_MANAGEMENT_VIEW",
  },
  {
    type: "group",
    label: "Patients",
    children: [
      { label: "Patient List", icon: ClipboardList, path: "/patients" },
      { label: "Register Patient", icon: UserPlus, path: "/patients/register" },
      { label: "Assign Doctor", icon: UserCheck, path: "/patients/assign" },
    ],
    permission: "PATIENT_VIEW",
  },
  {
    type: "link",
    label: "Medical Records",
    icon: FileText,
    path: "/records",
    permission: "MEDICAL_RECORD_VIEW",
  },
  {
    type: "link",
    label: "Monitoring",
    icon: Activity,
    path: "/monitoring",
    permission: "VITAL_SIGNS_VIEW",
  },
  {
    type: "link",
    label: "Appointments",
    icon: CalendarDays,
    path: "/appointments",
    permission: "APPOINTMENT_VIEW",
  },
  {
    type: "link",
    label: "Reports & History",
    icon: BarChart3,
    path: "/reports",
    permission: "REPORT_VIEW",
  },
  { type: "link", label: "Audit Logs", icon: ScrollText, path: "/audit", permission: "AUDIT_LOG_VIEW" },
  {
    type: "link",
    label: "Data Integrity",
    icon: ShieldCheck,
    path: "/integrity",
    permission: "DATA_INTEGRITY_VIEW",
  },
  // { type: "link", label: "System Settings", icon: Settings, path: "/settings" },
  {
    type: "link",
    label: "Roles & Permissions",
    icon: Settings,
    path: "/roles-permissions",
    permission: "ROLE_MANAGEMENT_VIEW"
  },
];

interface SidebarContentProps {
  activePath: string;
  onNavigate: (path: string) => void;
}

const SidebarContent = ({
  activePath,
  onNavigate,
}: SidebarContentProps): ReactElement => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 leading-none">
              PatientHQ
            </p>
            <p className="text-xs text-slate-400">Admin Console</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems
          .filter(
            (item) => !item.permission || hasPermission(user, item.permission),
          )
          .map((item) => {
            if (item.type === "link") {
              const Icon = item.icon;
              const isActive = activePath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </button>
              );
            }

            return (
              <div key={item.label} className="pt-2">
                <p className="px-3 mb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                  {item.label}
                </p>
                {item.children.map((child) => {
                  const Icon = child.icon;
                  const isActive = activePath === child.path;
                  return (
                    <button
                      key={child.path}
                      onClick={() => onNavigate(child.path)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                        isActive
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {child.label}
                    </button>
                  );
                })}
              </div>
            );
          })}
      </nav>

      <div className="px-4 py-4 border-t border-slate-100">
        <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-blue-50">
          <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
            <Users className="h-3 w-3 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-blue-800 truncate">
              System Administrator
            </p>
            <p className="text-[10px] text-blue-500">Full Access</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SidebarProps {
  activePath: string;
  onNavigate: (path: string) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const Sidebar = ({
  activePath,
  onNavigate,
  mobileOpen,
  onMobileClose,
}: SidebarProps): ReactElement => (
  <>
    <aside className="hidden lg:flex flex-col w-65 shrink-0 bg-white border-r border-slate-100 h-screen sticky top-0">
      <SidebarContent activePath={activePath} onNavigate={onNavigate} />
    </aside>

    {mobileOpen && (
      <div className="lg:hidden fixed inset-0 z-50 flex">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onMobileClose}
        />
        <aside className="relative w-65 bg-white h-full shadow-2xl flex flex-col">
          <button
            onClick={onMobileClose}
            className="absolute top-4 right-4 h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <SidebarContent activePath={activePath} onNavigate={onNavigate} />
        </aside>
      </div>
    )}
  </>
);

export default Sidebar;

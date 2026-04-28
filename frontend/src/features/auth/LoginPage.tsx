import { type ReactElement } from 'react';
import { ShieldCheck, Lock, Users, FileText, Activity } from 'lucide-react';
import LoginForm from '@/features/auth/components/LoginForm';

const featureItems = [
  { icon: Lock, label: 'End-to-End Encryption', desc: 'All patient data encrypted at rest and in transit' },
  { icon: Users, label: 'Role-Based Access Control', desc: 'Granular permissions for Admin, Doctor & Nurse roles' },
  { icon: FileText, label: 'Complete Audit Trails', desc: 'Every action logged with timestamp and user identity' },
  { icon: Activity, label: 'Real-Time Monitoring', desc: 'Live system health and data integrity checks' },
];

const LoginPage = (): ReactElement => (
  <div className="min-h-screen flex">
    {/* Left branding panel */}
    <div className="hidden lg:flex lg:w-[55%] bg-linear-to-br from-blue-700 via-blue-600 to-blue-800 relative overflow-hidden flex-col justify-between p-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/5"></div>
        <div className="absolute top-1/2 -right-24 h-80 w-80 rounded-full bg-white/5"></div>
        <div className="absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-white/5"></div>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        ></div>
      </div>

      {/* Logo */}
      <div className="relative flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
          <ShieldCheck className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-lg leading-none">PatientHQ</p>
          <p className="text-blue-200 text-xs">Hospital Data Protection System</p>
        </div>
      </div>

      {/* Main content */}
      <div className="relative space-y-8">
        <div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-3">
            Protecting Patient Data<br />
            <span className="text-blue-200">with Precision</span>
          </h2>
          <p className="text-blue-100 text-base leading-relaxed max-w-sm">
            A comprehensive hospital management platform built with security-first architecture to safeguard sensitive medical records.
          </p>
        </div>

        <div className="space-y-4">
          {featureItems.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">{label}</p>
                <p className="text-blue-200 text-xs">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom badges */}
      <div className="relative flex items-center gap-3 flex-wrap">
        {['HIPAA Compliant', 'ISO 27001', 'SOC 2 Type II'].map((badge) => (
          <span
            key={badge}
            className="px-3 py-1 rounded-full bg-white/15 text-white text-xs font-medium border border-white/20"
          >
            {badge}
          </span>
        ))}
      </div>
    </div>

    {/* Right login panel */}
    <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
      <LoginForm />
    </div>
  </div>
);

export default LoginPage;

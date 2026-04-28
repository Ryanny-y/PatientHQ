import { type ReactElement } from "react";
import { MoreVertical, Eye, Edit, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Patient } from "@/features/patients/types/patient";
import StatusBadge from "@/features/patients/components/StatusBadge";
import { calculateAge } from "@/features/patients/utils/patientUtils";

interface PatientCardListProps {
  patients: Patient[];
  onViewProfile: (patient: Patient) => void;
  onEditPatient: (patient: Patient) => void;
  onViewHistory: (patient: Patient) => void;
}

const PatientCardList = ({
  patients,
  onViewProfile,
  onEditPatient,
  onViewHistory,
}: PatientCardListProps): ReactElement => {
  if (patients.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-100 p-8 text-center text-slate-500">
        No patients found
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {patients.map((patient) => (
        <div
          key={patient.patientId}
          className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-slate-900">
                {patient.fullName}
              </h3>
              <p className="text-sm text-blue-600">#{patient.patientId}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onViewProfile(patient)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEditPatient(patient)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Patient
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewHistory(patient)}>
                  <History className="mr-2 h-4 w-4" />
                  View History
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Status:</span>
              <StatusBadge status={patient.status} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Age / Gender:</span>
              <span className="font-medium">
                {calculateAge(patient.dateOfBirth)} / {patient.gender}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Blood Type:</span>
              <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-700">
                {patient.bloodType}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Assigned Doctor:</span>
              <span className="font-medium text-right">
                {patient.assignedDoctor || "Unassigned"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientCardList;

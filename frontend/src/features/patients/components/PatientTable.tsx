import { type ReactElement } from "react";
import {
  MoreVertical,
  Eye,
  Edit,
  History,
  UserPlus,
  FileText,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Patient } from "@/features/patients/types/patient";
import StatusBadge from "@/features/patients/components/StatusBadge";
import {
  calculateAge,
  formatDate,
} from "@/features/patients/utils/patientUtils";

interface PatientTableProps {
  patients: Patient[];
  onViewProfile: (patient: Patient) => void;
  onEditPatient: (patient: Patient) => void;
  onViewHistory: (patient: Patient) => void;
  onAssignDoctor: (patient: Patient) => void;
}

const PatientTable = ({
  patients,
  onViewProfile,
  onEditPatient,
  onViewHistory,
  onAssignDoctor,
}: PatientTableProps): ReactElement => {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold">Patient ID</TableHead>
              <TableHead className="font-semibold">Full Name</TableHead>
              <TableHead className="font-semibold">Age</TableHead>
              <TableHead className="font-semibold">Gender</TableHead>
              <TableHead className="font-semibold">Contact Number</TableHead>
              <TableHead className="font-semibold">Blood Type</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Registered Date</TableHead>
              <TableHead className="font-semibold">Assigned Doctor</TableHead>
              <TableHead className="font-semibold text-right sticky right-0 bg-slate-50">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center text-slate-500 py-8"
                >
                  No patients found
                </TableCell>
              </TableRow>
            ) : (
              patients.map((patient) => (
                <TableRow key={patient.patientId} className="hover:bg-slate-50">
                  <TableCell className="font-medium text-blue-600">
                    #{patient.patientId}
                  </TableCell>
                  <TableCell className="font-medium">
                    {patient.fullName}
                  </TableCell>
                  <TableCell>{calculateAge(patient.dateOfBirth)}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {patient.contactNumber}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-700">
                      {patient.bloodType}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={patient.status} />
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {formatDate(patient.createdAt)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {patient.assignedDoctor || "Unassigned"}
                  </TableCell>
                  <TableCell className="text-right sticky right-0 bg-white">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => onViewProfile(patient)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onEditPatient(patient)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Patient
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onViewHistory(patient)}
                        >
                          <History className="mr-2 h-4 w-4" />
                          View History
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onAssignDoctor(patient)}
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          Assign Doctor
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Create Record
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PatientTable;

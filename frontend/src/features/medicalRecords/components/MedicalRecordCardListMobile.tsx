import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Printer,
  FileText,
  Archive,
  User,
} from "lucide-react";
import { type ReactElement } from "react";
import type { MedicalRecord, UserRole } from "../types/medicalRecord";
import { StatusBadge } from "./StatusBadge";

interface MedicalRecordCardListMobileProps {
  records: MedicalRecord[];
  userRole: UserRole;
  onViewRecord: (record: MedicalRecord) => void;
  onEditRecord: (record: MedicalRecord) => void;
  onPrintRecord: (record: MedicalRecord) => void;
  onGenerateReport: (record: MedicalRecord) => void;
  onArchiveRecord: (record: MedicalRecord) => void;
}

export const MedicalRecordCardListMobile = ({
  records,
  userRole,
  onViewRecord,
  onEditRecord,
  onPrintRecord,
  onGenerateReport,
  onArchiveRecord,
}: MedicalRecordCardListMobileProps): ReactElement => {
  const canEdit = userRole === "admin" || userRole === "doctor";
  const canArchive = userRole === "admin";

  const truncateText = (text: string, maxLength: number = 80) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <Card
          key={record.record_id}
          className="rounded-xl border-slate-200 shadow-sm"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-slate-900">
                  Record #{record.record_id}
                </div>
                <div className="text-sm text-slate-500 mt-1">
                  {new Date(record.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={record.patient_status || "Active"} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => onViewRecord(record)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Record
                    </DropdownMenuItem>
                    {canEdit && (
                      <DropdownMenuItem onClick={() => onEditRecord(record)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Record
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onPrintRecord(record)}>
                      <Printer className="mr-2 h-4 w-4" />
                      Print Summary
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onGenerateReport(record)}>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Report
                    </DropdownMenuItem>
                    {canArchive && (
                      <DropdownMenuItem
                        onClick={() => onArchiveRecord(record)}
                        className="text-orange-600 focus:text-orange-600"
                      >
                        <Archive className="mr-2 h-4 w-4" />
                        Archive Record
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium text-slate-900">
                    {record.patient_name}
                  </div>
                  <div className="text-sm text-slate-500">
                    Patient ID: {record.patient_id}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium text-slate-700">
                    {record.doctor_name}
                  </div>
                  <div className="text-sm text-slate-500">
                    Attending Physician
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-slate-700 mb-1">
                  Diagnosis
                </div>
                <div className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
                  {truncateText(record.diagnosis)}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-slate-700 mb-1">
                  Treatment
                </div>
                <div className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
                  {truncateText(record.treatment)}
                </div>
              </div>

              {record.prescription && (
                <div>
                  <div className="text-sm font-medium text-slate-700 mb-1">
                    Prescription
                  </div>
                  <div className="text-sm text-slate-600 bg-blue-50 rounded-lg p-3 border-l-4 border-blue-200">
                    {truncateText(record.prescription)}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      {records.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No medical records found matching your criteria.
        </div>
      )}
    </div>
  );
};

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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Printer,
  FileText,
  Archive,
} from "lucide-react";
import { type ReactElement } from "react";
import type { MedicalRecord, UserRole } from "../types/medicalRecord";
import { StatusBadge } from "./StatusBadge";

interface MedicalRecordsTableProps {
  records: MedicalRecord[];
  userRole: UserRole;
  onViewRecord: (record: MedicalRecord) => void;
  onEditRecord: (record: MedicalRecord) => void;
  onPrintRecord: (record: MedicalRecord) => void;
  onGenerateReport: (record: MedicalRecord) => void;
  onArchiveRecord: (record: MedicalRecord) => void;
}

export const MedicalRecordsTable = ({
  records,
  userRole,
  onViewRecord,
  onEditRecord,
  onPrintRecord,
  onGenerateReport,
  onArchiveRecord,
}: MedicalRecordsTableProps): ReactElement => {
  const canEdit = userRole === "admin" || userRole === "doctor";
  const canArchive = userRole === "admin";

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50">
            <TableHead className="font-semibold text-slate-700">
              Record ID
            </TableHead>
            <TableHead className="font-semibold text-slate-700">
              Patient
            </TableHead>
            <TableHead className="font-semibold text-slate-700">
              Doctor
            </TableHead>
            <TableHead className="font-semibold text-slate-700">
              Diagnosis
            </TableHead>
            <TableHead className="font-semibold text-slate-700">
              Treatment Summary
            </TableHead>
            <TableHead className="font-semibold text-slate-700">
              Created
            </TableHead>
            <TableHead className="font-semibold text-slate-700">
              Status
            </TableHead>
            <TableHead className="font-semibold text-slate-700 w-17.5">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow
              key={record.record_id}
              className="hover:bg-slate-50/50 transition-colors"
            >
              <TableCell className="font-medium text-slate-900">
                #{record.record_id}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium text-slate-900">
                    {record.patient_name}
                  </div>
                  <div className="text-sm text-slate-500">
                    ID: {record.patient_id}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-slate-700">
                {record.doctor_name}
              </TableCell>
              <TableCell>
                <div title={record.diagnosis} className="max-w-50">
                  {truncateText(record.diagnosis)}
                </div>
              </TableCell>
              <TableCell>
                <div title={record.treatment} className="max-w-50">
                  {truncateText(record.treatment)}
                </div>
              </TableCell>
              <TableCell className="text-slate-600">
                <div>{new Date(record.created_at).toLocaleDateString()}</div>
                {record.last_updated &&
                  record.last_updated !== record.created_at && (
                    <div className="text-xs text-slate-400">
                      Updated:{" "}
                      {new Date(record.last_updated).toLocaleDateString()}
                    </div>
                  )}
              </TableCell>
              <TableCell>
                <StatusBadge status={record.patient_status || "Active"} />
              </TableCell>
              <TableCell>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {records.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No medical records found matching your criteria.
        </div>
      )}
    </div>
  );
};

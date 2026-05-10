import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Printer,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  User,
} from "lucide-react";
import { type ReactElement } from "react";
import type { MedicalRecord } from "../types/medicalRecord";
import { StatusBadge } from "./StatusBadge";

interface ViewMedicalRecordDrawerProps {
  record: MedicalRecord | null;
  open: boolean;
  onClose: () => void;
  onPrint: (record: MedicalRecord) => void;
}

export const ViewMedicalRecordDrawer = ({
  record,
  open,
  onClose,
  onPrint,
}: ViewMedicalRecordDrawerProps): ReactElement => {
  if (!record) return <></>;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader className="pb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-semibold text-slate-900">
              Medical Record #{record.recordId}
            </SheetTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPrint(record)}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] pr-6">
          <div className="space-y-6">
            {/* Patient Information */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Patient ID
                  </label>
                  <div className="text-sm text-slate-900 mt-1">
                    #{record.patientId}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Full Name
                  </label>
                  <div className="text-sm text-slate-900 mt-1">
                    {record.patientName}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Status
                  </label>
                  <div className="mt-1">
                    <StatusBadge status={record.patientStatus || "Active"} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Doctor
                  </label>
                  <div className="text-sm text-slate-900 mt-1">
                    {record.doctorName}
                  </div>
                </div>
              </div>
            </div>

            {/* Clinical Record */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Clinical Record
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Record ID
                  </label>
                  <div className="text-lg font-semibold text-slate-900 mt-1">
                    #{record.recordId}
                  </div>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Diagnosis
                  </label>
                  <div className="text-sm text-slate-900 mt-2 p-3 bg-slate-50 rounded-lg border-l-4 border-red-200">
                    {record.diagnosis}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Treatment Plan
                  </label>
                  <div className="text-sm text-slate-900 mt-2 p-3 bg-slate-50 rounded-lg border-l-4 border-blue-200">
                    {record.treatment}
                  </div>
                </div>

                {record.prescription && (
                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      Prescription
                    </label>
                    <div className="text-sm text-slate-900 mt-2 p-3 bg-blue-50 rounded-lg border-l-4 border-green-200">
                      {record.prescription}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Clinical Notes
                  </label>
                  <div className="text-sm text-slate-900 mt-2 p-3 bg-slate-50 rounded-lg">
                    {record.notes}
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Created:{" "}
                    {new Date(record.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  {record.lastUpdated &&
                    record.lastUpdated !== record.createdAt && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Updated:{" "}
                        {new Date(record.lastUpdated).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">
                      Appointment Completed
                    </div>
                    <div className="text-sm text-slate-500">
                      {record.appointmentSummary ||
                        "Patient consultation completed"}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">
                      Record Created
                    </div>
                    <div className="text-sm text-slate-500">
                      Medical record documented in system
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">
                      Follow-up Recommended
                    </div>
                    <div className="text-sm text-slate-500">
                      Patient advised to return for follow-up assessment
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Next visit:{" "}
                      {new Date(
                        Date.now() + 14 * 24 * 60 * 60 * 1000,
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

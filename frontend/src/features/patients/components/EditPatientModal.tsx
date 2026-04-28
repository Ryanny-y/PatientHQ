import { type ReactElement, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/features/adminAccounts/components/FormField";
import { editPatientSchema, type editPatientFormValues, type Patient } from "@/features/patients/types/patient";
import { EditIcon } from "lucide-react";

interface EditPatientModalProps {
  patient: Patient | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: editPatientFormValues) => void;
}

const EditPatientModal = ({
  patient,
  open,
  onClose,
  onSave,
}: EditPatientModalProps): ReactElement => {
  const form = useForm<editPatientFormValues>({
    resolver: zodResolver(editPatientSchema),
    defaultValues: patient
      ? {
          fullName: patient.fullName,
          dateOfBirth: patient.dateOfBirth,
          gender: patient.gender,
          contactNumber: patient.contactNumber,
          email: patient.email,
          address: patient.address,
          bloodType: patient.bloodType,
          allergies: patient.allergies,
          emergencyContactName: patient.emergencyContactName,
          emergencyContactNumber: patient.emergencyContactNumber,
          status: patient.status,
        }
      : {
          fullName: "",
          dateOfBirth: "",
          gender: undefined,
          contactNumber: "",
          email: "",
          address: "",
          bloodType: undefined,
          allergies: "",
          emergencyContactName: "",
          emergencyContactNumber: "",
          status: "ACTIVE",
        },
  });

  useEffect(() => {
    if (patient) {
      form.reset({
        fullName: patient.fullName,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        contactNumber: patient.contactNumber,
        email: patient.email,
        address: patient.address,
        bloodType: patient.bloodType,
        allergies: patient.allergies,
        emergencyContactName: patient.emergencyContactName,
        emergencyContactNumber: patient.emergencyContactNumber,
        status: patient.status,
      });
    }
  }, [patient, form]);

  const onSubmit = (values: editPatientFormValues): void => {
    onSave(values);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto px-6">
        <DialogHeader className="flex items-center gap-2 pl-0">
          <EditIcon />
          <DialogTitle>Edit Patient Information</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Full Name"
              error={form.formState.errors.fullName?.message}
              required
            >
              <Input {...form.register("fullName")} />
            </FormField>

            <FormField
              label="Date of Birth"
              error={form.formState.errors.dateOfBirth?.message}
              required
            >
              <Input type="date" {...form.register("dateOfBirth")} />
            </FormField>

            <FormField
              label="Gender"
              error={form.formState.errors.gender?.message}
              required
            >
              <Controller
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <FormField
              label="Blood Type"
              error={form.formState.errors.bloodType?.message}
            >
              <Controller
                control={form.control}
                name="bloodType"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <FormField
              label="Contact Number"
              error={form.formState.errors.contactNumber?.message}
              required
            >
              <Input {...form.register("contactNumber")} />
            </FormField>

            <FormField
              label="Email"
              error={form.formState.errors.email?.message}
            >
              <Input type="email" {...form.register("email")} />
            </FormField>
          </div>

          <FormField
            label="Address"
            error={form.formState.errors.address?.message}
            required
          >
            <Textarea {...form.register("address")} rows={2} />
          </FormField>

          <FormField
            label="Allergies"
            error={form.formState.errors.allergies?.message}
          >
            <Input {...form.register("allergies")} placeholder="None" />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Emergency Contact Name"
              error={form.formState.errors.emergencyContactName?.message}
              required
            >
              <Input {...form.register("emergencyContactName")} />
            </FormField>

            <FormField
              label="Emergency Contact Number"
              error={form.formState.errors.emergencyContactNumber?.message}
              required
            >
              <Input {...form.register("emergencyContactNumber")} />
            </FormField>
          </div>

          <FormField
            label="Status"
            error={form.formState.errors.status?.message}
          >
            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="ADMITTED">Admitted</SelectItem>
                    <SelectItem value="DISCHARGED">Discharged</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>

          <DialogFooter className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPatientModal;

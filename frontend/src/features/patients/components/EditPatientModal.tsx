import { type ReactElement, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/features/adminAccounts/components/FormField';
import type { Patient } from '@/features/patients/types/Patient';

const editPatientSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  contact_number: z.string().min(10, 'Contact number must be at least 10 digits'),
  email: z.string().email('Please enter a valid email'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  blood_type: z.string().min(1, 'Blood type is required'),
  allergies: z.string(),
  emergency_contact_name: z.string().min(2, 'Emergency contact name is required'),
  emergency_contact_number: z.string().min(10, 'Emergency contact number must be at least 10 digits'),
  status: z.enum(['ACTIVE', 'ADMITTED', 'DISCHARGED', 'INACTIVE']),
});

type editPatientFormValues = z.infer<typeof editPatientSchema>;

interface EditPatientModalProps {
  patient: Patient | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: editPatientFormValues) => void;
}

const EditPatientModal = ({ patient, open, onClose, onSave }: EditPatientModalProps): ReactElement => {
  const form = useForm<editPatientFormValues>({
    resolver: zodResolver(editPatientSchema),
    defaultValues: {
      full_name: '',
      date_of_birth: '',
      gender: '',
      contact_number: '',
      email: '',
      address: '',
      blood_type: '',
      allergies: '',
      emergency_contact_name: '',
      emergency_contact_number: '',
      status: 'ACTIVE',
    },
  });

  useEffect(() => {
    if (patient) {
      form.reset({
        full_name: patient.full_name,
        date_of_birth: patient.date_of_birth,
        gender: patient.gender,
        contact_number: patient.contact_number,
        email: patient.email,
        address: patient.address,
        blood_type: patient.blood_type,
        allergies: patient.allergies,
        emergency_contact_name: patient.emergency_contact_name,
        emergency_contact_number: patient.emergency_contact_number,
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Patient Information</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Full Name" error={form.formState.errors.full_name?.message} required>
              <Input {...form.register('full_name')} />
            </FormField>

            <FormField label="Date of Birth" error={form.formState.errors.date_of_birth?.message} required>
              <Input type="date" {...form.register('date_of_birth')} />
            </FormField>

            <FormField label="Gender" error={form.formState.errors.gender?.message} required>
              <Controller
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <FormField label="Blood Type" error={form.formState.errors.blood_type?.message}>
              <Controller
                control={form.control}
                name="blood_type"
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

            <FormField label="Contact Number" error={form.formState.errors.contact_number?.message} required>
              <Input {...form.register('contact_number')} />
            </FormField>

            <FormField label="Email" error={form.formState.errors.email?.message}>
              <Input type="email" {...form.register('email')} />
            </FormField>
          </div>

          <FormField label="Address" error={form.formState.errors.address?.message} required>
            <Textarea {...form.register('address')} rows={2} />
          </FormField>

          <FormField label="Allergies" error={form.formState.errors.allergies?.message}>
            <Input {...form.register('allergies')} placeholder="None" />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Emergency Contact Name" error={form.formState.errors.emergency_contact_name?.message} required>
              <Input {...form.register('emergency_contact_name')} />
            </FormField>

            <FormField label="Emergency Contact Number" error={form.formState.errors.emergency_contact_number?.message} required>
              <Input {...form.register('emergency_contact_number')} />
            </FormField>
          </div>

          <FormField label="Status" error={form.formState.errors.status?.message}>
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

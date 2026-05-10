import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "../services/adminService";

export const useAdminMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admins"] });
    queryClient.invalidateQueries({ queryKey: ["adminsMeta"] });

  }

  const createAdmin = useMutation({
    mutationFn: adminService.createAdmin,
    onSuccess: invalidate,
  });

  const updateAdmin = useMutation({
    mutationFn: ({ id, values }: any) =>
      adminService.updateAdmin(id, values),
    onSuccess: invalidate,
  });

  const deleteAdmin = useMutation({
    mutationFn: adminService.deleteAdmin,
    onSuccess: invalidate,
  });

  const toggleStatus = useMutation({
    mutationFn: adminService.toggleStatus,
    onSuccess: invalidate,
  });

  const resetPassword = useMutation({
    mutationFn: ({ id, values }: any) =>
      adminService.resetPassword(id, values),
  });

  return {
    createAdmin,
    updateAdmin,
    deleteAdmin,
    toggleStatus,
    resetPassword,
  };
};

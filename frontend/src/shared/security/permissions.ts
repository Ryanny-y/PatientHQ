export const hasPermission = (
  user: any,
  permission: string
): boolean => {
  return user?.permissions?.includes(permission);
};

export const hasAnyPermission = (
  user: any,
  permissions: string[]
): boolean => {
  return permissions.some(p =>
    user?.permissions?.includes(p)
  );
};
export const isAdminUser = (
  user?: {
    app_metadata?: Record<string, any> | null;
  } | null
): boolean => {
  return user?.app_metadata?.is_admin === true;
};

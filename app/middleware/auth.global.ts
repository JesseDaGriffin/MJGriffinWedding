export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser();
  const bypassCookie = useCookie('sb_bypass_auth');

  if (process.dev && bypassCookie.value === 'true') {
    if (!user.value) {
      user.value = {
        id: 'mock-test-user-id',
        email: 'dagriffinwedding@gmail.com', // Admin by default
        role: 'authenticated',
        app_metadata: {
          is_admin: true
        },
        user_metadata: {
          first_name: 'Test',
          last_name: 'User'
        }
      } as any;
    }
  }

  const normalizedPath = to.path.replace(/\/$/, '') || '/';
  const publicPaths = ['/login', '/unsubscribe', '/reset-password'];

  // Redirect to login if trying to access a protected route
  if (!user.value && !publicPaths.includes(normalizedPath)) {
    return navigateTo('/login');
  }

  // Redirect to home if logged in and trying to access login
  if (user.value && normalizedPath === '/login') {
    return navigateTo('/');
  }
});

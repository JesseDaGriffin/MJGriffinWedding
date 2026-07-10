export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser();
  const bypassCookie = useCookie('sb_bypass_auth');

  if (process.dev && bypassCookie.value === 'true') {
    if (!user.value) {
      user.value = {
        id: 'mock-test-user-id',
        email: 'dagriffinwedding@gmail.com', // Admin by default
        role: 'authenticated',
        user_metadata: {
          first_name: 'Test',
          last_name: 'User'
        }
      } as any;
    }
  }

  // Redirect to login if trying to access a protected route
  if (!user.value && to.path !== '/login') {
    return navigateTo('/login');
  }

  // Redirect to home if logged in and trying to access login
  if (user.value && to.path === '/login') {
    return navigateTo('/');
  }
});


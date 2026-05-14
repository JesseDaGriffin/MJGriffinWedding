export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser();

  // Redirect to login if trying to access a protected route
  if (!user.value && to.path !== '/login') {
    return navigateTo('/login');
  }

  // Redirect to home if logged in and trying to access login
  if (user.value && to.path === '/login') {
    return navigateTo('/');
  }
});

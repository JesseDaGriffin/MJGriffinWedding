<template>
  <div class="layout">
    <header class="header">
      <div class="container header-content">

        <!-- Logo -->
        <NuxtLink to="/" class="logo">M &amp; J</NuxtLink>

        <!-- Desktop nav (hidden on mobile) -->
        <nav class="nav-desktop">
          <NuxtLink to="/" class="nav-link" @click="closeMenu">Home</NuxtLink>
          <NuxtLink to="/itinerary" class="nav-link" @click="closeMenu">Itinerary</NuxtLink>
          <NuxtLink to="/travel" class="nav-link" @click="closeMenu">Travel</NuxtLink>
          <NuxtLink to="/ceremony" class="nav-link" @click="closeMenu">Ceremony</NuxtLink>
          <NuxtLink to="/registry" class="nav-link" @click="closeMenu">Registry</NuxtLink>
          <NuxtLink to="/contact" class="nav-link" @click="closeMenu">Contact</NuxtLink>
          <NuxtLink to="/questionnaire" class="nav-link" @click="closeMenu">Questionnaire</NuxtLink>
          <div v-if="isAdmin" class="admin-group desktop-only">
            <span class="nav-link nav-link--admin admin-label">Admin Tools ▼</span>
            <div class="admin-dropdown">
              <NuxtLink to="/responses" class="dropdown-item" @click="closeMenu">Responses</NuxtLink>
              <NuxtLink to="/announcements" class="dropdown-item" @click="closeMenu">Announcements</NuxtLink>
            </div>
          </div>
        </nav>

        <!-- Desktop right-side actions (hidden on mobile) -->
        <div class="header-actions-desktop">
          <NuxtLink to="/rsvp" class="btn rsvp-btn">RSVP</NuxtLink>

          <!-- User dropdown -->
          <div v-if="isAuthenticated" class="user-menu" ref="userMenuRef">
            <button class="user-icon-btn" @click="isDropdownOpen = !isDropdownOpen" aria-label="Account menu">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </button>
            <div class="dropdown" :class="{ 'dropdown-open': isDropdownOpen }">
              <div class="dropdown-inner">
                <NuxtLink to="/account" class="dropdown-item" @click="isDropdownOpen = false">Account</NuxtLink>
                <button @click="logout" class="dropdown-item dropdown-item--danger">Logout</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Hamburger button (mobile only) -->
        <button class="mobile-menu-btn" @click="toggleMenu" aria-label="Toggle menu">
          <span :class="{ 'open': isMenuOpen }"></span>
          <span :class="{ 'open': isMenuOpen }"></span>
          <span :class="{ 'open': isMenuOpen }"></span>
        </button>

      </div>

      <!-- Mobile nav drawer (slides down below header) -->
      <nav class="nav-mobile" :class="{ 'nav-mobile--open': isMenuOpen }">
        <NuxtLink to="/" class="mobile-nav-link" @click="closeMenu">Home</NuxtLink>
        <NuxtLink to="/itinerary" class="mobile-nav-link" @click="closeMenu">Itinerary</NuxtLink>
        <NuxtLink to="/travel" class="mobile-nav-link" @click="closeMenu">Travel</NuxtLink>
        <NuxtLink to="/ceremony" class="mobile-nav-link" @click="closeMenu">Ceremony</NuxtLink>
        <NuxtLink to="/registry" class="mobile-nav-link" @click="closeMenu">Registry</NuxtLink>
        <NuxtLink to="/contact" class="mobile-nav-link" @click="closeMenu">Contact</NuxtLink>
        <NuxtLink to="/questionnaire" class="mobile-nav-link" @click="closeMenu">Questionnaire</NuxtLink>
        <template v-if="isAdmin">
          <div class="mobile-nav-divider"></div>
          <span class="mobile-nav-link mobile-nav-link--admin" style="font-weight: 700; opacity: 0.8; pointer-events: none;">Admin Tools</span>
          <NuxtLink to="/responses" class="mobile-nav-link mobile-nav-link--admin pl-md" @click="closeMenu">Responses</NuxtLink>
          <NuxtLink to="/announcements" class="mobile-nav-link mobile-nav-link--admin pl-md" @click="closeMenu">Announcements</NuxtLink>
        </template>
        <div class="mobile-nav-divider"></div>
        <NuxtLink to="/rsvp" class="btn rsvp-btn mobile-rsvp" @click="closeMenu">RSVP</NuxtLink>
        <template v-if="isAuthenticated">
          <NuxtLink to="/account" class="mobile-nav-link" @click="closeMenu">Account</NuxtLink>
          <button @click="logout" class="mobile-nav-link mobile-nav-link--danger">Logout</button>
        </template>
      </nav>
    </header>

    <main class="main-content">
      <slot />
    </main>

    <footer class="footer">
      <div class="container">
        <p>The Griffin Wedding — March 13, 2027</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const isMenuOpen = ref(false);
const isDropdownOpen = ref(false);
const isAuthenticated = ref(false);
const isAdmin = ref(false);
const router = useRouter();
const userMenuRef = ref(null);

const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));

const toggleMenu = () => { isMenuOpen.value = !isMenuOpen.value; };
const closeMenu = () => { isMenuOpen.value = false; };

const logout = async () => {
  isDropdownOpen.value = false;
  closeMenu();
  await supabase.auth.signOut();
  localStorage.removeItem('wedding_auth');
  localStorage.removeItem('wedding_admin');
  isAuthenticated.value = false;
  isAdmin.value = false;
  router.push('/login');
};

watchEffect(() => {
  if (user.value) {
    isAuthenticated.value = true;
    const isLocalAdmin = import.meta.client ? localStorage.getItem('wedding_admin') === 'true' : false;
    if (user.value.email?.toLowerCase() === 'dagriffinwedding@gmail.com' || isLocalAdmin) {
      isAdmin.value = true;
    }
  } else {
    isAuthenticated.value = false;
    isAdmin.value = false;
  }
});
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ─── Header ─── */
.header {
  background-color: rgba(28, 28, 28, 0.95);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  gap: 1rem;
}

.logo {
  font-family: var(--font-heading);
  font-size: 1.7rem;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
  text-decoration: none;
}

/* ─── Desktop nav ─── */
.nav-desktop {
  display: flex;
  align-items: center;
  gap: 1.4rem;
  flex: 1;
  justify-content: center;
}

.nav-link {
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  transition: var(--transition);
  text-decoration: none;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--color-primary);
}

.nav-link--admin {
  color: var(--color-accent) !important;
}

/* ─── Desktop right actions ─── */
.header-actions-desktop {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.rsvp-btn {
  font-size: 0.875rem;
  padding: 0.5rem 1.2rem;
  color: #fff !important;
}

/* ─── User icon dropdown ─── */
.user-menu {
  position: relative;
}

.user-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.78);
  cursor: pointer;
  transition: var(--transition);
}

.user-icon-btn:hover {
  background: rgba(107, 142, 35, 0.22);
  border-color: var(--color-primary);
  color: #fff;
}

.dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  padding-top: 8px;
  min-width: 140px;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-4px);
  transition: opacity 0.2s ease, transform 0.2s ease;
  z-index: 200;
}

.dropdown-open {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

.dropdown-inner {
  background: #1e1e1e;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.7rem 1rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-family: var(--font-body);
  transition: background 0.15s;
  text-decoration: none;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

.dropdown-item--danger { color: #ff6b6b; }
.dropdown-item--danger:hover { background: rgba(255, 107, 107, 0.1); }

/* ─── Admin Grouping ─── */
.admin-group {
  position: relative;
  display: flex;
  align-items: center;
}

.admin-label {
  cursor: pointer;
  display: inline-block;
}

.admin-dropdown {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background: #1e1e1e;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--border-radius);
  padding: 0.5rem 0;
  min-width: 160px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
  z-index: 200;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}

.admin-group:hover .admin-dropdown {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(-50%) translateY(0);
}

.pl-md {
  padding-left: 1.5rem !important;
}

/* ─── Hamburger ─── */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
}

.mobile-menu-btn span {
  display: block;
  width: 24px;
  height: 2px;
  background: #fff;
  border-radius: 2px;
  transition: var(--transition);
}

/* ─── Mobile nav drawer ─── */
.nav-mobile {
  display: none;
  flex-direction: column;
  background: #1a1a1a;
  border-top: none;
  padding: 0 1.5rem;
  gap: 0.15rem;
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.35s ease, padding 0.35s ease, border-top 0s;
}

.nav-mobile--open {
  max-height: 600px;
  padding: 1rem 1.5rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.mobile-nav-link {
  display: block;
  padding: 0.65rem 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: 1rem;
  font-weight: 500;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  text-decoration: none;
  background: none;
  border-left: none;
  border-right: none;
  border-top: none;
  width: 100%;
  text-align: left;
  font-family: var(--font-body);
  cursor: pointer;
  transition: color 0.2s;
}

.mobile-nav-link:last-child {
  border-bottom: none;
}

.mobile-nav-link:hover,
.mobile-nav-link.router-link-active {
  color: var(--color-primary);
}

.mobile-nav-link--admin { color: var(--color-accent) !important; }
.mobile-nav-link--danger { color: #ff6b6b !important; }

.mobile-nav-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0.5rem 0;
}

.mobile-rsvp {
  display: inline-block;
  margin-bottom: 0.5rem;
  text-align: center;
}

/* ─── Layout ─── */
.main-content {
  flex-grow: 1;
}

.footer {
  background: #111;
  padding: var(--spacing-md) 0;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer p {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.85rem;
  letter-spacing: 0.4px;
}

/* ─── Responsive ─── */
@media (max-width: 900px) {
  .nav-desktop,
  .header-actions-desktop {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .nav-mobile {
    display: flex;
  }
}

@media (max-width: 600px) {
  .logo { font-size: 1.4rem; }
}
</style>

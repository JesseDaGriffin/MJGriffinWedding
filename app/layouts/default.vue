<template>
  <div class="layout">
    <header class="header">
      <div class="container header-content">
        <NuxtLink to="/" class="logo">M & J</NuxtLink>
        <nav class="nav" :class="{ 'nav-open': isMenuOpen }">
          <NuxtLink to="/" class="nav-link" @click="closeMenu">Home</NuxtLink>
          <NuxtLink to="/itinerary" class="nav-link" @click="closeMenu">Itinerary</NuxtLink>
          <NuxtLink to="/travel" class="nav-link" @click="closeMenu">Travel</NuxtLink>
          <NuxtLink to="/ceremony" class="nav-link" @click="closeMenu">Ceremony</NuxtLink>
          <NuxtLink to="/registry" class="nav-link" @click="closeMenu">Registry</NuxtLink>
          <NuxtLink to="/contact" class="nav-link" @click="closeMenu">Contact</NuxtLink>
          <NuxtLink to="/questionnaire" class="nav-link" @click="closeMenu">Questionnaire</NuxtLink>
          <NuxtLink v-if="isAdmin" to="/responses" class="nav-link text-accent" @click="closeMenu">Responses</NuxtLink>
          <NuxtLink to="/rsvp" class="btn rsvp-btn" @click="closeMenu">RSVP</NuxtLink>
          <NuxtLink v-if="isAuthenticated" to="/account" class="nav-link" @click="closeMenu">Account</NuxtLink>
          <button v-if="isAuthenticated" @click="logout" class="nav-link logout-btn">Logout</button>
        </nav>
        <button class="mobile-menu-btn" @click="toggleMenu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>

    <main class="main-content">
      <slot />
    </main>

    <footer class="footer">
      <div class="container footer-content">
        <p>Maddie & Jesse's Wedding - Mar 13, 2027</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const isMenuOpen = ref(false);
const isAuthenticated = ref(false);
const isAdmin = ref(false);
const router = useRouter();

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const logout = async () => {
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
    if (user.value.email?.toLowerCase() === 'dagriffinwedding@gmail.com' || localStorage.getItem('wedding_admin') === 'true') {
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

.header {
  background-color: rgba(28, 28, 28, 0.9);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
}

.logo {
  font-family: var(--font-heading);
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
}

.nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: var(--color-text);
  font-weight: 500;
}

.nav-link:hover, .nav-link.router-link-active {
  color: var(--color-primary);
}

.logout-btn {
  background: none;
  border: none;
  font-family: var(--font-body);
  font-size: 1rem;
  cursor: pointer;
}

.rsvp-btn {
  color: #fff !important;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  flex-direction: column;
  gap: 5px;
}

.mobile-menu-btn span {
  display: block;
  width: 25px;
  height: 2px;
  background-color: #fff;
  transition: var(--transition);
}

.main-content {
  flex-grow: 1;
}

.footer {
  background-color: #111;
  padding: var(--spacing-md) 0;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
  }

  .nav {
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    background-color: var(--color-charcoal);
    flex-direction: column;
    padding: var(--spacing-md);
    gap: var(--spacing-md);
    transform: translateY(-150%);
    transition: transform 0.3s ease-in-out;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .nav.nav-open {
    transform: translateY(0);
  }
}
</style>

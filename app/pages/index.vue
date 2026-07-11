<template>
    <div class="landing-page">
        <!-- Hero / Title Section -->
        <section class="hero-section">
            <!-- Decorative skull frame corners -->
            <div class="frame-decor frame-decor--left" aria-hidden="true"></div>
            <div
                class="frame-decor frame-decor--right"
                aria-hidden="true"
            ></div>

            <div class="hero-container">
                <!-- Centered Text Block -->
                <header class="hero-header-text">
                    <h1 class="gothic-title">Till Death</h1>
                    <h2 class="couple-names">Maddie &amp; Jesse</h2>
                    <p class="wedding-details">
                        March 13th, 2027 &bull; Las Vegas, NV
                    </p>

                    <div class="countdown-text">{{ daysRemainingText }}</div>

                    <div v-if="user" class="hero-actions">
                        <NuxtLink to="/rsvp" class="btn rsvp-hero-btn"
                            >RSVP Now</NuxtLink
                        >
                    </div>
                </header>
            </div>

            <div class="framed-content">
                <!-- Inline Navigation (Desktop Only) -->
                <nav class="hero-nav">
                    <NuxtLink to="/" class="hero-nav-link">Home</NuxtLink>
                    <NuxtLink to="/itinerary" class="hero-nav-link"
                        >Itinerary</NuxtLink
                    >
                    <NuxtLink to="/travel" class="hero-nav-link"
                        >Travel</NuxtLink
                    >
                    <NuxtLink to="/ceremony" class="hero-nav-link"
                        >Ceremony</NuxtLink
                    >
                    <NuxtLink to="/registry" class="hero-nav-link"
                        >Registry</NuxtLink
                    >
                    <NuxtLink to="/contact" class="hero-nav-link"
                        >Contact</NuxtLink
                    >
                    <NuxtLink to="/questionnaire" class="hero-nav-link"
                        >Questionnaire</NuxtLink
                    >

                    <!-- User Menu Dropdown (instead of RSVP) -->
                    <div
                        v-if="isAuthenticated"
                        class="user-menu"
                        ref="userMenuRef"
                    >
                        <button
                            class="user-icon-btn"
                            @click="isDropdownOpen = !isDropdownOpen"
                            aria-label="Account menu"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                width="18"
                                height="18"
                            >
                                <path
                                    d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
                                />
                            </svg>
                        </button>
                        <div
                            class="dropdown"
                            :class="{ 'dropdown-open': isDropdownOpen }"
                        >
                            <div class="dropdown-inner">
                                <NuxtLink
                                    to="/account"
                                    class="dropdown-item"
                                    @click="isDropdownOpen = false"
                                    >Account</NuxtLink
                                >
                                <template v-if="isAdmin">
                                    <div class="dropdown-divider"></div>
                                    <div class="dropdown-header">
                                        Admin Tools
                                    </div>
                                    <NuxtLink
                                        to="/responses"
                                        class="dropdown-item dropdown-item--admin"
                                        @click="isDropdownOpen = false"
                                        >Responses</NuxtLink
                                    >
                                    <NuxtLink
                                        to="/questionnaires"
                                        class="dropdown-item dropdown-item--admin"
                                        @click="isDropdownOpen = false"
                                        >Questionnaires</NuxtLink
                                    >
                                    <NuxtLink
                                        to="/announcements"
                                        class="dropdown-item dropdown-item--admin"
                                        @click="isDropdownOpen = false"
                                        >Announcements</NuxtLink
                                    >
                                </template>
                                <div class="dropdown-divider"></div>
                                <button
                                    @click="logout"
                                    class="dropdown-item dropdown-item--danger"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                    <NuxtLink
                        v-else
                        to="/login"
                        class="hero-nav-link hero-nav-link--login"
                        >Login</NuxtLink
                    >
                </nav>

                <!-- Wide Couple Portrait Carousel -->
                <div class="couple-photo-container">
                    <ImageCarousel placeholderText="Our Favorite Memories" />
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watchEffect } from "vue";

useHead({
    htmlAttrs: {
        class: "html--home",
    },
    bodyAttrs: {
        class: "body--home",
    },
});

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const targetDate = "2027-03-13T00:00:00";

const isAuthenticated = ref(false);
const isAdmin = ref(false);
const isDropdownOpen = ref(false);
const userMenuRef = ref(null);
const router = useRouter();

const handleClickOutside = (event) => {
    if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
        isDropdownOpen.value = false;
    }
};

onMounted(() => {
    document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
});

const logout = async () => {
    isDropdownOpen.value = false;
    const bypassCookie = useCookie("sb_bypass_auth");
    bypassCookie.value = null;
    await supabase.auth.signOut();
    localStorage.removeItem("wedding_auth");
    localStorage.removeItem("wedding_admin");
    isAuthenticated.value = false;
    isAdmin.value = false;
    router.push("/login");
};

watchEffect(() => {
    if (user.value) {
        isAuthenticated.value = true;
        const isLocalAdmin = import.meta.client
            ? localStorage.getItem("wedding_admin") === "true"
            : false;
        if (
            user.value.email?.toLowerCase() === "dagriffinwedding@gmail.com" ||
            isLocalAdmin
        ) {
            isAdmin.value = true;
        } else {
            isAdmin.value = false;
        }
    } else {
        isAuthenticated.value = false;
        isAdmin.value = false;
    }
});

const daysRemainingText = computed(() => {
    const weddingDate = new Date(targetDate).getTime();
    const now = new Date().getTime();
    const difference = weddingDate - now;

    if (difference > 0) {
        const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
        return `${days} Days To Go`;
    } else if (difference > -86400000) {
        return "Today is the Day!";
    } else {
        return "Happily Married!";
    }
});
</script>

<style scoped>
.landing-page {
    background-color: transparent;
    min-height: 100vh;
    overflow-x: hidden;
}

.hero-section {
    padding: 4rem 0 2rem;
    position: relative;
}

.framed-content {
    order: 2;
    width: 100%;
    max-width: 1160px;
    margin: 0 auto;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 0;
    transition:
        padding-top 0.3s ease,
        margin-top 0.3s ease;
}

.frame-decor {
    position: absolute;
    pointer-events: none; /* Let clicks pass through to nav links/buttons underneath */
    z-index: 5;
    background-repeat: no-repeat;
    filter: brightness(0.9) saturate(0.7) contrast(1.05);
    opacity: 0.85;
    mix-blend-mode: screen;
}

.frame-decor--left {
    left: calc(50% - 580px - 4.5rem);
    top: 0;
    width: 440px;
    height: 622px; /* 440px / 0.707 aspect ratio */
    background-image: url("/img/frames/corner_top_left_skulls_roses.png");
    background-size: contain;
    background-position: top left;
}

.frame-decor--right {
    right: calc(50% - 580px - 5rem);
    top: 0;
    width: 510px;
    height: 721px; /* 510px / 0.707 aspect ratio */
    background-image: url("/img/frames/corner_top_right_skulls_roses.png");
    background-size: contain;
    background-position: top right;
}

.hero-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 1100px;
    margin: 15px auto 0 auto;
    padding: 0 1rem;
    position: relative;
    z-index: 10;
}

.hero-header-text {
    text-align: center;
    margin-bottom: 1rem;
    order: 1;
}

.gothic-title {
    font-family: var(--font-gothic);
    font-size: 5.5rem;
    font-weight: 400;
    color: var(--color-cream-muted);
    margin-bottom: 0.5rem;
    line-height: 1;
    text-transform: none; /* Blackletter fonts should use normal casing */
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.couple-names {
    font-family: var(--font-heading);
    font-size: 2.2rem;
    font-weight: 500;
    color: var(--color-primary);
    letter-spacing: 0.25em;
    text-transform: uppercase;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    border-bottom: none;
    padding-bottom: 0;
    display: block;
}

.wedding-details {
    font-family: var(--font-heading);
    font-size: 0.95rem;
    color: var(--color-amethyst-dark);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
}

.countdown-text {
    font-family: var(--font-heading);
    font-size: 0.9rem;
    color: var(--color-primary);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-top: 0.5rem;
    margin-bottom: 1.25rem;
}

/* Inline Navigation for Desktop */
.hero-nav {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.8rem;
    width: 100%;
    max-width: 900px;
    margin: 1.5rem 0 2.5rem;
    padding: 0.8rem 0;
    border-top: 1px solid rgba(197, 168, 128, 0.12);
    border-bottom: 1px solid rgba(197, 168, 128, 0.12);
    order: 2;
    position: relative;
    z-index: 20; /* Ensure dropdown menu displays over the photo container */
}

.hero-nav-link {
    font-family: var(--font-heading);
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--color-cream-muted);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    border-bottom: 1px solid transparent;
    padding-bottom: 2px;
}

.hero-nav-link:hover,
.hero-nav-link.router-link-active {
    color: var(--color-link);
    border-bottom-color: var(--color-link);
}

.hero-nav-link--rsvp {
    font-weight: 700;
    color: var(--color-cream-muted);
}

/* Couple Photo Container with Carousel */
.couple-photo-container {
    width: 100%;
    max-width: 1000px;
    margin-bottom: 2rem;
    order: 3;
}

.hero-actions {
    margin-top: 0.5rem;
    margin-bottom: 1rem;
}

.rsvp-hero-btn {
    padding: 0.7rem 2rem;
    font-size: 0.85rem;
    background-color: var(--color-sapphire-muted);
    border-color: var(--color-sapphire-muted);
    color: var(--color-cream-muted) !important;
}

.rsvp-hero-btn:hover {
    background-color: var(--color-sapphire-muted-hover);
    border-color: var(--color-sapphire-muted-hover);
    color: var(--color-cream-muted) !important;
    box-shadow: 0 4px 15px rgba(71, 94, 122, 0.35);
}

.story-section,
.gallery-section {
    padding-top: 3rem;
    padding-bottom: 3rem;
}

.about-content {
    max-width: 800px;
    margin: 0 auto;
    font-size: 1.05rem;
    line-height: 1.8;
    padding: 2.5rem;
}

.mb-md {
    margin-bottom: var(--spacing-md);
}

.text-center {
    text-align: center;
}

/* ── Responsive Styling ── */
@media (min-width: 1201px) {
    .hero-section {
        padding-top: 8.5rem;
        padding-bottom: 1.5rem;
    }

    .frame-decor--left {
        width: 360px;
        height: 509px;
        left: calc(50% - 440px);
    }

    .frame-decor--right {
        width: 420px;
        height: 594px;
        right: calc(50% - 440px);
    }

    .gothic-title {
        font-size: 4.2rem;
    }

    .couple-names {
        font-size: 1.8rem;
        margin-top: 0.25rem;
        margin-bottom: 0.75rem;
    }

    .wedding-details {
        font-size: 0.85rem;
        margin-bottom: 0.25rem;
    }

    .countdown-text {
        font-size: 0.8rem;
        margin-top: 0.25rem;
        margin-bottom: 1rem;
    }

    .hero-nav {
        margin: 1rem 0 1.75rem;
        gap: 1.4rem;
        padding: 0.6rem 0;
    }

    .couple-photo-container {
        max-width: 820px;
        margin-bottom: 1rem;
    }
}

@media (max-width: 1200px) {
    .frame-decor {
        display: none;
    }
    .framed-content {
        padding-top: 2rem;
        margin-top: 0;
    }
}

@media (max-width: 900px) {
    .landing-page {
        min-height: 100%;
        height: 100%;
        overflow: hidden; /* Prevent page scrolling on mobile */
    }

    .hero-section {
        height: 100%;
        display: flex;
        flex-direction: column; /* Vertical flex direction */
        padding: 0;
        margin: 0;
    }

    .hero-container {
        flex: 0 0 35%; /* Reduce height to 35% */
        height: 35%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding: 0.5rem 1rem 0 1rem;
    }

    .hero-header-text {
        padding: 0;
        margin: 0;
        text-align: center;
    }

    .hero-actions {
        margin-top: 0.6rem; /* Slightly reduced margin to keep it compact */
        margin-bottom: 0.5rem;
    }

    .framed-content {
        flex: 0 0 47%; /* Reduce height to 47% to push the carousel up further */
        height: 47%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 0;
    }

    .couple-photo-container {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0 0.75rem 1.25rem 0.75rem; /* Reduced padding to allow the carousel to expand larger on mobile */
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .couple-photo-placeholder {
        width: 100%;
        max-height: 100%;
        aspect-ratio: 16 / 9.5;
    }

    .gothic-title {
        font-size: 2.3rem; /* Reduced from 3rem */
        margin-bottom: 0.4rem;
    }

    .couple-names {
        font-size: 1.1rem; /* Reduced from 1.25rem */
        letter-spacing: 0.15em;
        margin-top: 0.2rem;
        margin-bottom: 0.5rem;
    }

    .wedding-details {
        font-size: 0.75rem; /* Reduced from 0.8rem */
        margin-bottom: 0.3rem;
    }

    .countdown-text {
        font-size: 0.7rem; /* Reduced from 0.75rem */
        margin-top: 0.2rem;
        margin-bottom: 0;
    }

    .hero-nav {
        display: none; /* Hide page inline navigation on mobile */
    }

    .about-content {
        padding: 1.5rem;
    }
}

@media (max-width: 480px) {
    .gothic-title {
        font-size: 3.2rem;
    }

    .couple-names {
        font-size: 1.3rem;
    }
}

/* User dropdown inside inline menu */
.user-menu {
    position: relative;
    display: inline-flex;
    align-items: center;
    transform: translateY(-2px);
    margin-left: 0.5rem;
}

@media (min-width: 1201px) {
    .user-menu,
    .hero-nav-link--login {
        position: relative;
        left: -1rem; /* Move slightly to the left to clear the crystal without causing wrapping */
    }
}

.user-icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 50%;
    color: var(--color-cream-muted);
    cursor: pointer;
    transition: var(--transition);
}

.user-icon-btn:hover {
    background: rgba(197, 168, 128, 0.15);
    border-color: var(--color-primary);
    color: var(--color-primary);
}

.dropdown {
    position: absolute;
    left: 50%;
    transform: translateX(-50%) translateY(-10px);
    top: 100%;
    padding-top: 8px;
    min-width: 170px;
    opacity: 0;
    pointer-events: none;
    transition:
        opacity 0.2s ease,
        transform 0.2s ease;
    z-index: 200;
}

.dropdown-open {
    opacity: 1;
    pointer-events: auto;
    transform: translateX(-50%) translateY(0);
}

.dropdown-inner {
    background: #181414;
    border: var(--gold-border);
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
}

.dropdown-item {
    display: block;
    width: 100%;
    padding: 0.7rem 1.2rem;
    font-size: 0.85rem;
    color: var(--color-cream-muted);
    background: none;
    border: none;
    text-align: center;
    cursor: pointer;
    font-family: var(--font-heading);
    letter-spacing: 0.05em;
    transition:
        background 0.15s,
        color 0.15s;
    text-decoration: none;
}

.dropdown-item:hover {
    background: rgba(197, 168, 128, 0.1);
    color: var(--color-primary);
}

.dropdown-item--danger {
    color: #ff6b6b;
}

.dropdown-item--danger:hover {
    background: rgba(255, 107, 107, 0.1);
    color: #ff6b6b;
}

.dropdown-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.08);
    margin: 4px 0;
}

.dropdown-header {
    padding: 0.6rem 1rem 0.3rem;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--color-accent);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    opacity: 0.85;
    pointer-events: none;
    text-align: center;
}

.dropdown-item--admin {
    color: var(--color-accent);
}

.dropdown-item--admin:hover {
    background: rgba(162, 144, 180, 0.08);
    color: var(--color-accent);
}
</style>

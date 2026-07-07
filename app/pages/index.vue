<template>
    <div class="landing-page">
        <!-- Hero / Title Section -->
        <section class="hero-section">
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
                <!-- Decorative skull frame corners -->
                <div
                    class="frame-decor frame-decor--left"
                    aria-hidden="true"
                ></div>
                <div
                    class="frame-decor frame-decor--right"
                    aria-hidden="true"
                ></div>

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

                <!-- Wide Couple Portrait Placeholder -->
                <div class="couple-photo-container">
                    <div class="couple-photo-placeholder">
                        <div class="placeholder-overlay">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.2"
                                class="placeholder-icon"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                                />
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                                />
                            </svg>
                            <div class="placeholder-text-main">
                                Maddie &amp; Jesse
                            </div>
                            <div class="placeholder-text-sub">
                                Insert Portrait Here
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- About Us Section -->
        <section class="section container story-section">
            <h2 class="text-center mb-md">Our Story</h2>
            <GlassCard class="about-content">
                <p class="text-center">
                    Welcome to the official home of the soon-to-be Griffins! We
                    are so thrilled to celebrate our special day with the people
                    we love most.
                </p>
            </GlassCard>
        </section>

        <!-- Gallery Carousel Section -->
        <section class="section container gallery-section">
            <h2 class="text-center mb-md">Gallery</h2>
            <ImageCarousel placeholderText="Our Favorite Memories" />
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watchEffect } from "vue";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const targetDate = "2027-03-13T00:00:00";

const isAuthenticated = ref(false);
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
    await supabase.auth.signOut();
    localStorage.removeItem("wedding_auth");
    localStorage.removeItem("wedding_admin");
    isAuthenticated.value = false;
    router.push("/login");
};

watchEffect(() => {
    if (user.value) {
        isAuthenticated.value = true;
    } else {
        isAuthenticated.value = false;
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

.framed-content {
    order: 2;
    width: 100%;
    max-width: 1160px;
    margin: -8rem auto 0; /* Pull framed content up into the header's negative space */
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 7rem; /* push the nav down below the skulls */
    transition:
        padding-top 0.3s ease,
        margin-top 0.3s ease;
}

.frame-decor {
    position: absolute;
    pointer-events: none; /* Let clicks pass through to nav links/buttons underneath */
    z-index: 5;
    background-repeat: no-repeat;
    filter: brightness(1.1) saturate(0.8) contrast(1)
        drop-shadow(0 8px 25px rgba(0, 0, 0, 0.8));
    opacity: 0.95;
}

.frame-decor--left {
    left: -4.5rem;
    top: -1.2rem;
    width: 440px;
    height: 622px; /* 440px / 0.707 aspect ratio */
    background-image: url("/img/frames/corner_top_left_skulls_roses.png");
    background-size: contain;
    background-position: top left;
}

.frame-decor--right {
    right: -5rem;
    top: -0.5rem;
    width: 510px;
    height: 721px; /* 510px / 0.707 aspect ratio */
    background-image: url("/img/frames/corner_top_right_skulls_roses.png");
    background-size: contain;
    background-position: top right;
}

.hero-section {
    padding: 4rem 0 2rem;
}

.hero-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 1100px;
    margin: 0 auto;
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

/* Portrait / Couple Photo Container */
.couple-photo-container {
    width: 100%;
    max-width: 1000px;
    margin-bottom: 2rem;
    order: 3;
}

.couple-photo-placeholder {
    width: 100%;
    aspect-ratio: 21 / 9; /* Wide landscape aspect ratio */
    background: linear-gradient(135deg, #181414 0%, #090707 100%);
    border: var(--gold-border);
    border-radius: var(--border-radius);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    box-shadow:
        inset 0 0 40px rgba(0, 0, 0, 0.8),
        0 10px 25px rgba(0, 0, 0, 0.6);
}

/* Subtle inner editorial gold border frame */
.couple-photo-placeholder::after {
    content: "";
    position: absolute;
    inset: 12px;
    border: 1px dashed rgba(197, 168, 128, 0.15);
    pointer-events: none;
}

.placeholder-overlay {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    color: rgba(197, 168, 128, 0.4);
    z-index: 2;
}

.placeholder-icon {
    width: 42px;
    height: 42px;
    margin-bottom: 0.75rem;
    color: var(--color-primary);
    opacity: 0.6;
}

.placeholder-text-main {
    font-family: var(--font-heading);
    font-size: 1.2rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--color-primary);
    margin-bottom: 0.25rem;
}

.placeholder-text-sub {
    font-family: var(--font-body);
    font-size: 0.8rem;
    color: var(--color-cream-muted);
    letter-spacing: 0.05em;
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
    .hero-section {
        height: calc(100vh - 72px); /* Stretch to fill viewport height below fixed header */
        display: flex;
        flex-direction: column; /* Vertical flex direction */
        padding: 0;
        margin: 0;
    }

    .hero-container {
        flex: 0 0 60%; /* Top area occupies 60% of vertical height */
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding: 0 1.5rem;
    }

    .hero-header-text {
        padding: 0;
        margin: 0;
        text-align: center;
    }

    .framed-content {
        flex: 0 0 40%; /* Bottom area occupies 40% of vertical height */
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
        padding: 0 0 1.5rem; /* Give it a little breathing room at the bottom */
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
        font-size: 3.2rem;
        margin-bottom: 0.25rem;
    }

    .couple-names {
        font-size: 1.4rem;
        letter-spacing: 0.15em;
        margin-top: 0.25rem;
        margin-bottom: 0.5rem;
    }
    
    .wedding-details {
        font-size: 0.85rem;
        margin-bottom: 0.25rem;
    }
    
    .countdown-text {
        font-size: 0.8rem;
        margin-top: 0.25rem;
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
    min-width: 140px;
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
</style>

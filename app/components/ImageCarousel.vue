<template>
    <div class="carousel-container" ref="containerRef">
        <div class="carousel" v-if="images && images.length > 0">
            <div class="carousel-frame">
                <div
                    class="carousel-track"
                    ref="trackRef"
                    @scroll="handleScroll"
                    :style="{
                        scrollSnapType: isProgrammaticScroll
                            ? 'none'
                            : 'x mandatory',
                    }"
                >
                    <div
                        class="carousel-slide"
                        v-for="(image, index) in images"
                        :key="image.id"
                        :ref="
                            (el) => {
                                if (el) slides[index] = el;
                            }
                        "
                    >
                        <img
                            :src="image.url"
                            alt="Wedding Memory"
                            class="carousel-image"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div class="carousel empty-state" v-else>
            <div class="carousel-frame">
                <div class="carousel-track">
                    <div class="carousel-slide placeholder-slide">
                        <span>{{
                            pending ? "Loading memories..." : placeholderText
                        }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from "vue";

const props = defineProps({
    placeholderText: {
        type: String,
        default: "Our Favorite Memories",
    },
});

// Fetch images from our new Cloudinary API
const { data: galleryData, pending } = await useFetch("/api/gallery");

const allImages = ref([]);
const images = ref([]);

if (galleryData.value) {
    allImages.value = galleryData.value.images || [];
    images.value = allImages.value.slice(0, 15);
}

watch(galleryData, (newData) => {
    if (newData) {
        allImages.value = newData.images || [];
        images.value = allImages.value.slice(0, 15);
    }
});

const currentIndex = ref(2);
const trackRef = ref(null);
const containerRef = ref(null);
const slides = ref([]);
let autoplayInterval = null;
const isProgrammaticScroll = ref(false);
let observer = null;
const isVisible = ref(false);

const loadMore = () => {
    if (images.value.length >= allImages.value.length) return;
    const currentLength = images.value.length;
    const nextImages = allImages.value.slice(currentLength, currentLength + 15);
    images.value.push(...nextImages);
};

const handleScroll = () => {
    if (!trackRef.value || slides.value.length === 0) return;
    if (isProgrammaticScroll.value) return;

    const trackCenter =
        trackRef.value.scrollLeft + trackRef.value.clientWidth / 2;

    let closestIndex = 0;
    let minDistance = Infinity;

    slides.value.forEach((slide, index) => {
        if (!slide) return;
        const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
        const distance = Math.abs(slideCenter - trackCenter);
        if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
        }
    });

    if (currentIndex.value !== closestIndex) {
        currentIndex.value = closestIndex;
        if (closestIndex >= images.value.length - 3) {
            loadMore();
        }
    }
};

const smoothScrollTo = (element, target, duration) => {
    const start = element.scrollLeft;
    const change = target - start;
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-in-out cubic easing for buttery smooth transitions
        const easeInOutCubic =
            progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        element.scrollLeft = start + change * easeInOutCubic;

        if (progress < 1) {
            requestAnimationFrame(animateScroll);
        }
    };

    requestAnimationFrame(animateScroll);
};

const goToSlide = (index, instant = false) => {
    if (images.value && index >= 0 && index < images.value.length) {
        currentIndex.value = index;
        if (index >= images.value.length - 3) {
            loadMore();
        }
        const slide = slides.value[index];
        if (slide && trackRef.value) {
            isProgrammaticScroll.value = true;
            const scrollLeft =
                slide.offsetLeft -
                trackRef.value.clientWidth / 2 +
                slide.clientWidth / 2;

            if (instant) {
                trackRef.value.scrollLeft = scrollLeft;
                isProgrammaticScroll.value = false;
            } else {
                // Use custom easing smooth scroll for a slower, elegant glide transition (1200ms)
                smoothScrollTo(trackRef.value, scrollLeft, 1200);

                setTimeout(() => {
                    isProgrammaticScroll.value = false;
                }, 1250);
            }
        }
    }
};

const nextSlide = () => {
    if (images.value && images.value.length > 0) {
        const newIndex = (currentIndex.value + 1) % images.value.length;
        goToSlide(newIndex);
    }
};

const prevSlide = () => {
    if (images.value && images.value.length > 0) {
        const newIndex =
            currentIndex.value === 0
                ? images.value.length - 1
                : currentIndex.value - 1;
        goToSlide(newIndex);
    }
};

const autoNextSlide = () => {
    if (isVisible.value) {
        nextSlide();
    }
};

// Optional: Auto-play the carousel
const startAutoplay = () => {
    autoplayInterval = setInterval(autoNextSlide, 2000); // Switch more frequently (every 2 seconds)
};

const stopAutoplay = () => {
    if (autoplayInterval) clearInterval(autoplayInterval);
};

onMounted(() => {
    observer = new IntersectionObserver(
        (entries) => {
            if (entries[0]) {
                isVisible.value = entries[0].isIntersecting;
            }
        },
        { threshold: 0.1 },
    );

    if (containerRef.value) {
        observer.observe(containerRef.value);
    }

    startAutoplay();
    setTimeout(() => {
        if (trackRef.value) {
            goToSlide(2, true); // Start on picture 3 (index 2) instantly
        }
    }, 100);
});

onUnmounted(() => {
    stopAutoplay();
    if (observer) {
        observer.disconnect();
    }
});
</script>

<style scoped>
.carousel-container {
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
}

.carousel {
    position: relative;
    overflow: hidden;
    border-radius: var(--border-radius);
    aspect-ratio: 21 / 9; /* Wide landscape aspect ratio matching portrait */
    background: linear-gradient(135deg, #181414 0%, #090707 100%);
    border: var(--gold-border);
    box-shadow:
        inset 0 0 40px rgba(0, 0, 0, 0.8),
        0 10px 25px rgba(0, 0, 0, 0.6);
}

.carousel::after {
    content: "";
    position: absolute;
    inset: 12px;
    border: 1px dashed rgba(197, 168, 128, 0.15);
    pointer-events: none;
    z-index: 3; /* Render dashed lines on top of slides */
}

.carousel-frame {
    position: absolute;
    inset: 13px; /* Strictly confines content inside the 12px dashed gold border */
    overflow: hidden;
    border-radius: calc(var(--border-radius) - 4px);
}

.carousel-track {
    display: flex;
    width: 100%;
    height: 100%;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: auto; /* Custom smooth JS scroll handles animation */
    scrollbar-width: none;
    -ms-overflow-style: none;
    position: relative;
    gap: 16px;
    padding: 0 50%;
    align-items: center;
}

.carousel-track::-webkit-scrollbar {
    display: none;
}

.carousel-slide {
    flex: 0 0 auto;
    height: 100%; /* Fill the vertical space of the absolute-positioned track */
    scroll-snap-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease;
}

.carousel-image {
    height: 100%;
    width: auto;
    max-width: 80vw;
    object-fit: contain;
}
.placeholder-slide {
    background-color: transparent;
    box-shadow: none;
    color: var(--color-primary);
    font-size: 1.3rem;
    font-family: var(--font-heading);
    letter-spacing: 0.15em;
    text-transform: uppercase;
}

.empty-state .carousel-track {
    padding: 0;
    justify-content: center;
}

/* Carousel buttons removed */

/* Carousel counter styling removed */

/* Glass panel styling removed */
</style>

<template>
    <div
        class="decorative-divider"
        :class="[
            `decorative-divider--${variant}`,
            `decorative-divider--${size}`,
        ]"
        aria-hidden="true"
    >
        <img :src="imageSrc" :alt="''" class="divider-image" loading="lazy" />
    </div>
</template>

<script setup>
const props = defineProps({
    variant: {
        type: String,
        default: "gothic-jewel",
        validator: (v) =>
            [
                "gothic-jewel",
                "skull-roses",
                "gothic-jewel-bottom",
                "skull-roses-top",
            ].includes(v),
    },
    size: {
        type: String,
        default: "md",
        validator: (v) => ["sm", "md", "lg"].includes(v),
    },
});

const imageMap = {
    "gothic-jewel": "/img/frames/horizontal_banner_center_gothic_jewel.png",
    "skull-roses": "/img/frames/horizontal_banner_center_skull_roses.png",
    "gothic-jewel-bottom":
        "/img/frames/horizontal_border_bottom_gothic_jewel_1.png",
    "skull-roses-top": "/img/frames/horizontal_border_top_skulls_roses.png",
};

const imageSrc = computed(
    () => imageMap[props.variant] || imageMap["gothic-jewel"],
);
</script>

<style scoped>
.decorative-divider {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 142px;
    pointer-events: none;
    user-select: none;
    overflow: hidden;
}

.divider-image {
    display: block;
    width: 100%;
    height: auto;
    object-fit: contain;
    filter: brightness(0.9) saturate(1)
        drop-shadow(0 6px 15px rgba(0, 0, 0, 0.8));
    opacity: 0.95;
    transition: opacity 0.4s ease;
}

/* Size variants */
.decorative-divider--sm .divider-image {
    max-width: 320px;
}

.decorative-divider--md .divider-image {
    max-width: 650px;
}

.decorative-divider--lg .divider-image {
    max-width: 900px;
}

/* Spacing */
.decorative-divider--sm {
    margin: 1rem auto 0.25rem;
}

.decorative-divider--md {
    margin: 1.5rem auto 0.5rem;
}

.decorative-divider--lg {
    margin: 2rem auto 0.75rem;
}

/* Responsive: scale down on mobile */
@media (max-width: 768px) {
    .decorative-divider--sm .divider-image {
        max-width: 150px;
    }
    .decorative-divider--md .divider-image {
        max-width: 220px;
    }
    .decorative-divider--lg .divider-image {
        max-width: 320px;
    }
    .decorative-divider--sm {
        margin: 0.75rem auto 0.15rem;
    }
    .decorative-divider--md {
        margin: 1rem auto 0.25rem;
    }
    .decorative-divider--lg {
        margin: 1.25rem auto 0.4rem;
    }
}
</style>

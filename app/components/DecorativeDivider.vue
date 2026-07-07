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
        default: "skull-roses",
        validator: (v) =>
            [
                "skull-roses",
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
    "skull-roses": "/img/frames/horizontal_banner_center_skull_roses.png",
    "skull-roses-top": "/img/frames/horizontal_border_top_skulls_roses.png",
};

const imageSrc = computed(
    () => imageMap[props.variant] || imageMap["skull-roses"],
);
</script>

<style scoped>
.decorative-divider {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    pointer-events: none;
    user-select: none;
    overflow: hidden;
}

.divider-image {
    display: block;
    width: 100%;
    height: auto;
    object-fit: contain;
    filter: brightness(1.15) saturate(0.85) contrast(1.0)
        drop-shadow(0 4px 10px rgba(0, 0, 0, 0.7));
    opacity: 0.95;
    transition: opacity 0.4s ease;
}

/* Size variants */
.decorative-divider--sm .divider-image {
    max-width: 480px;
}

.decorative-divider--md .divider-image {
    max-width: 960px;
}

.decorative-divider--lg .divider-image {
    max-width: 1160px;
}

/* Spacing */
.decorative-divider--sm {
    margin: 0.35rem auto 0.05rem;
}

.decorative-divider--md {
    margin: 0.5rem auto 0.05rem;
}

.decorative-divider--lg {
    margin: 0.75rem auto 0.05rem;
}

/* Responsive: scale down on mobile */
@media (max-width: 768px) {
    .decorative-divider--sm .divider-image {
        max-width: 240px;
    }
    .decorative-divider--md .divider-image {
        max-width: 460px;
    }
    .decorative-divider--lg .divider-image {
        max-width: 600px;
    }
    .decorative-divider--sm {
        margin: 0.2rem auto 0.05rem;
    }
    .decorative-divider--md {
        margin: 0.3rem auto 0.05rem;
    }
    .decorative-divider--lg {
        margin: 0.4rem auto 0.05rem;
    }
}
</style>

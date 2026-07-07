<template>
  <div 
    class="decorative-divider" 
    :class="[`decorative-divider--${variant}`, `decorative-divider--${size}`]" 
    aria-hidden="true"
  >
    <img 
      :src="imageSrc" 
      :alt="''" 
      class="divider-image"
      loading="lazy"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'gothic-jewel',
    validator: (v) => ['gothic-jewel', 'skull-roses', 'gothic-jewel-bottom', 'skull-roses-top'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  }
});

const imageMap = {
  'gothic-jewel': '/img/frames/horizontal_banner_center_gothic_jewel.png',
  'skull-roses': '/img/frames/horizontal_banner_center_skull_roses.png',
  'gothic-jewel-bottom': '/img/frames/horizontal_border_bottom_gothic_jewel_1.png',
  'skull-roses-top': '/img/frames/horizontal_border_top_skulls_roses.png',
};

const imageSrc = computed(() => imageMap[props.variant] || imageMap['gothic-jewel']);
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
  filter: brightness(0.75) saturate(0.9);
  opacity: 0.85;
  transition: opacity 0.4s ease;
}

/* Size variants */
.decorative-divider--sm .divider-image {
  max-width: 280px;
}

.decorative-divider--md .divider-image {
  max-width: 480px;
}

.decorative-divider--lg .divider-image {
  max-width: 700px;
}

/* Spacing */
.decorative-divider--sm {
  margin: 1rem auto;
}

.decorative-divider--md {
  margin: 1.5rem auto;
}

.decorative-divider--lg {
  margin: 2rem auto;
}

/* Responsive: scale down on mobile */
@media (max-width: 600px) {
  .decorative-divider--sm .divider-image {
    max-width: 180px;
  }
  .decorative-divider--md .divider-image {
    max-width: 280px;
  }
  .decorative-divider--lg .divider-image {
    max-width: 400px;
  }
}
</style>

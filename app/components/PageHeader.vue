<template>
  <div class="page-header">
    <h1 class="text-center" :class="{ 'mb-xs': true }">{{ title }}</h1>
    <DecorativeDivider variant="skull-roses" size="sm" />
    <p v-if="subtitle" class="text-center subtitle" :class="subtitleClass">{{ subtitle }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  subtitleClass: {
    type: String,
    default: 'mb-lg'
  }
});
</script>

<style scoped>
.page-header {
  margin-bottom: var(--spacing-md);
}

.text-center {
  text-align: center;
}

.mb-xs {
  margin-bottom: 0.25rem;
}

.mb-sm {
  margin-bottom: var(--spacing-sm);
}

.mb-md {
  margin-bottom: var(--spacing-md);
}

.mb-lg {
  margin-bottom: var(--spacing-lg);
}

.page-header h1 {
  color: var(--color-cream);
  font-weight: 500;
  letter-spacing: 0.08em;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
}

.subtitle {
  color: var(--color-cream-muted);
  font-size: 1.1rem;
  font-weight: 300;
  line-height: 1.6;
  opacity: 0.85;
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 768px) {
  .page-header {
    margin-bottom: var(--spacing-sm);
  }

  .page-header h1 {
    letter-spacing: 0.05em;
  }

  .subtitle {
    font-size: 0.95rem;
    margin-top: 0.75rem; /* Compensate for the hidden DecorativeDivider */
    padding: 0 0.5rem;
  }
}

@media (max-width: 480px) {
  .subtitle {
    font-size: 0.85rem;
    margin-top: 0.6rem;
    line-height: 1.5;
  }
}
</style>

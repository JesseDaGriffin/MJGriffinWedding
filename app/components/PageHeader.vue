<template>
  <div class="page-header">
    <h1 class="text-center" :class="{ 'mb-md': !subtitle, 'mb-sm': subtitle }">{{ title }}</h1>
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

.mb-sm {
  margin-bottom: var(--spacing-sm);
}

.mb-md {
  margin-bottom: var(--spacing-md);
}

.mb-lg {
  margin-bottom: var(--spacing-lg);
}

.subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
}
</style>

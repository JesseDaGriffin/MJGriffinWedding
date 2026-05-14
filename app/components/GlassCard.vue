<template>
  <div class="card glass-panel" :class="customClass">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  customClass: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
.card {
  background-color: var(--color-card-bg);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: var(--transition);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  border-color: rgba(255, 255, 255, 0.2);
}

.glass-panel {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  border-radius: var(--border-radius);
}
</style>

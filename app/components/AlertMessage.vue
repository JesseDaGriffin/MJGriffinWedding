<template>
  <div v-if="message" :class="['alert-message', type]">
    <slot>{{ message }}</slot>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'error', // 'error', 'success', 'info'
    validator: (value) => ['error', 'success', 'info'].includes(value)
  }
});
</script>

<style scoped>
.alert-message {
  font-size: 0.9rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  text-align: center;
  padding: 0.75rem;
  border-radius: var(--border-radius);
  border: 1px solid transparent;
}

.error {
  color: #ff6b6b;
  background-color: rgba(255, 107, 107, 0.1);
  border-color: rgba(255, 107, 107, 0.2);
}

.success {
  color: #4CAF50;
  background-color: rgba(76, 175, 80, 0.1);
  border-color: rgba(76, 175, 80, 0.2);
}

.info {
  color: #2196F3;
  background-color: rgba(33, 150, 243, 0.1);
  border-color: rgba(33, 150, 243, 0.2);
}
</style>

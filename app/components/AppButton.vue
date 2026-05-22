<template>
  <button 
    :type="type" 
    class="btn" 
    :class="[
      `btn-${variant}`, 
      { 'w-100': block, 'loading': loading }
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="spinner"></span>
    <span :class="{ 'invisible': loading }">
      <slot>{{ loading && loadingText ? loadingText : text }}</slot>
    </span>
    <!-- Absolute positioning for loading text to keep button width stable -->
    <span v-if="loading && loadingText" class="loading-text">{{ loadingText }}</span>
  </button>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: 'Submit'
  },
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary' // primary, secondary
  },
  block: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: ''
  }
});

defineEmits(['click']);
</script>

<style scoped>
.w-100 {
  width: 100%;
}

.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  overflow: hidden;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn:disabled:hover {
  transform: none;
  box-shadow: none;
}

.invisible {
  opacity: 0;
}

.loading-text {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  position: absolute;
  left: 1rem;
}

.loading-text .spinner {
  position: static;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>

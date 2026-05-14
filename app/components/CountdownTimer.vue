<template>
  <div class="countdown-container glass-panel mt-lg">
    <div class="countdown-item">
      <span class="countdown-value">{{ days }}</span>
      <span class="countdown-label">Days</span>
    </div>
    <div class="countdown-item">
      <span class="countdown-value">{{ hours }}</span>
      <span class="countdown-label">Hours</span>
    </div>
    <div class="countdown-item">
      <span class="countdown-value">{{ minutes }}</span>
      <span class="countdown-label">Minutes</span>
    </div>
    <div class="countdown-item">
      <span class="countdown-value">{{ seconds }}</span>
      <span class="countdown-label">Seconds</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  targetDate: {
    type: String,
    required: true
  }
});

const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);
let timer;

const calculateTimeLeft = () => {
  const weddingDate = new Date(props.targetDate).getTime();
  const now = new Date().getTime();
  const difference = weddingDate - now;

  if (difference > 0) {
    days.value = Math.floor(difference / (1000 * 60 * 60 * 24));
    hours.value = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    minutes.value = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    seconds.value = Math.floor((difference % (1000 * 60)) / 1000);
  }
};

onMounted(() => {
  calculateTimeLeft();
  timer = setInterval(calculateTimeLeft, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.countdown-container {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  display: inline-flex;
}

.countdown-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}

.countdown-value {
  font-size: 2.5rem;
  font-weight: 700;
  font-family: var(--font-heading);
  color: var(--color-accent);
}

.countdown-label {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.glass-panel {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  border-radius: var(--border-radius);
}

.mt-lg {
  margin-top: var(--spacing-lg);
}

@media (max-width: 768px) {
  .countdown-container {
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
  }
  .countdown-item {
    min-width: 60px;
  }
  .countdown-value {
    font-size: 1.8rem;
  }
}
</style>

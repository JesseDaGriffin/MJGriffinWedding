<template>
  <div class="carousel-container">
    <div class="carousel glass-panel">
      <div class="carousel-track">
        <div class="carousel-slide placeholder-slide">
          <span>{{ placeholderText }}</span>
        </div>
      </div>
      <button class="carousel-btn prev-btn">❮</button>
      <button class="carousel-btn next-btn">❯</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  placeholderText: {
    type: String,
    default: 'Picture of Us 1'
  }
});
</script>

<style scoped>
.carousel-container {
  max-width: 800px;
  margin: 0 auto;
}

.carousel {
  position: relative;
  overflow: hidden;
  border-radius: var(--border-radius);
  aspect-ratio: 16 / 9;
}

.carousel-track {
  display: flex;
  height: 100%;
}

.carousel-slide {
  min-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-slide {
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--color-text);
  font-size: 1.5rem;
  font-family: var(--font-heading);
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  color: #fff;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.carousel-btn:hover {
  background: var(--color-primary);
}

.prev-btn { left: 10px; }
.next-btn { right: 10px; }

.glass-panel {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  border-radius: var(--border-radius);
}
</style>

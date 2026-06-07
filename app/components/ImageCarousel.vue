<template>
  <div class="carousel-container">
    <div class="carousel glass-panel" v-if="images && images.length > 0">
      <div class="carousel-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div 
          class="carousel-slide" 
          v-for="(image, index) in images" 
          :key="image.id"
        >
          <img :src="image.url" alt="Wedding Memory" class="carousel-image" />
        </div>
      </div>
      <button class="carousel-btn prev-btn" @click="prevSlide">❮</button>
      <button class="carousel-btn next-btn" @click="nextSlide">❯</button>
      
      <div class="carousel-dots">
        <span 
          v-for="(_, index) in images" 
          :key="index"
          class="dot"
          :class="{ active: index === currentIndex }"
          @click="goToSlide(index)"
        ></span>
      </div>
    </div>
    
    <div class="carousel glass-panel empty-state" v-else>
      <div class="carousel-track">
        <div class="carousel-slide placeholder-slide">
          <span>{{ pending ? 'Loading memories...' : placeholderText }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  placeholderText: {
    type: String,
    default: 'Our Favorite Memories'
  }
})

// Fetch images from our new Cloudinary API
const { data: images, pending } = await useFetch('/api/gallery')

const currentIndex = ref(0)
let autoplayInterval = null

const nextSlide = () => {
  if (images.value && images.value.length > 0) {
    currentIndex.value = (currentIndex.value + 1) % images.value.length
  }
}

const prevSlide = () => {
  if (images.value && images.value.length > 0) {
    currentIndex.value = currentIndex.value === 0 ? images.value.length - 1 : currentIndex.value - 1
  }
}

const goToSlide = (index) => {
  currentIndex.value = index
}

// Optional: Auto-play the carousel
const startAutoplay = () => {
  autoplayInterval = setInterval(nextSlide, 5000) // Change image every 5 seconds
}

const stopAutoplay = () => {
  if (autoplayInterval) clearInterval(autoplayInterval)
}

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})
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
  transition: transform 0.5s ease-in-out;
}

.carousel-slide {
  min-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  z-index: 2;
}

.carousel-btn:hover {
  background: var(--color-primary);
}

.prev-btn { left: 10px; }
.next-btn { right: 10px; }

.carousel-dots {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 2;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background 0.3s;
}

.dot.active {
  background: #fff;
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

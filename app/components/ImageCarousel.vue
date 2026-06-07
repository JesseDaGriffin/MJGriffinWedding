<template>
  <div class="carousel-container" ref="containerRef">
    <div class="carousel glass-panel" v-if="images && images.length > 0">
      <div class="carousel-track" ref="trackRef" @scroll="handleScroll">
        <div 
          class="carousel-slide" 
          v-for="(image, index) in images" 
          :key="image.id"
          :ref="el => { if (el) slides[index] = el }"
        >
          <img :src="image.url" alt="Wedding Memory" class="carousel-image" />
        </div>
      </div>
      <button class="carousel-btn prev-btn" @click="prevSlide">❮</button>
      <button class="carousel-btn next-btn" @click="nextSlide">❯</button>
      
      <div class="carousel-counter" v-if="allImages.length > 0">
        {{ currentIndex + 1 }} / {{ allImages.length }}
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
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'

const props = defineProps({
  placeholderText: {
    type: String,
    default: 'Our Favorite Memories'
  }
})

// Fetch images from our new Cloudinary API
const { data: galleryData, pending } = await useFetch('/api/gallery')

const allImages = ref([])
const images = ref([])

if (galleryData.value) {
  allImages.value = galleryData.value.images || []
  images.value = allImages.value.slice(0, 15)
}

watch(galleryData, (newData) => {
  if (newData) {
    allImages.value = newData.images || []
    images.value = allImages.value.slice(0, 15)
  }
})

const currentIndex = ref(0)
const trackRef = ref(null)
const containerRef = ref(null)
const slides = ref([])
let autoplayInterval = null
let isProgrammaticScroll = false
let observer = null
const isVisible = ref(false)

const loadMore = () => {
  if (images.value.length >= allImages.value.length) return
  const currentLength = images.value.length
  const nextImages = allImages.value.slice(currentLength, currentLength + 15)
  images.value.push(...nextImages)
}

const handleScroll = () => {
  if (!trackRef.value || slides.value.length === 0) return
  if (isProgrammaticScroll) return
  
  const trackCenter = trackRef.value.scrollLeft + trackRef.value.clientWidth / 2
  
  let closestIndex = 0
  let minDistance = Infinity
  
  slides.value.forEach((slide, index) => {
    if (!slide) return
    const slideCenter = slide.offsetLeft + slide.clientWidth / 2
    const distance = Math.abs(slideCenter - trackCenter)
    if (distance < minDistance) {
      minDistance = distance
      closestIndex = index
    }
  })
  
  if (currentIndex.value !== closestIndex) {
    currentIndex.value = closestIndex
    if (closestIndex >= images.value.length - 3) {
      loadMore()
    }
  }
}

const goToSlide = (index) => {
  if (images.value && index >= 0 && index < images.value.length) {
    currentIndex.value = index
    if (index >= images.value.length - 3) {
      loadMore()
    }
    const slide = slides.value[index]
    if (slide && trackRef.value) {
      isProgrammaticScroll = true
      const scrollLeft = slide.offsetLeft - (trackRef.value.clientWidth / 2) + (slide.clientWidth / 2)
      trackRef.value.scrollTo({ left: scrollLeft, behavior: 'smooth' })
      setTimeout(() => { isProgrammaticScroll = false }, 500)
    }
  }
}

const nextSlide = () => {
  if (images.value && images.value.length > 0) {
    const newIndex = (currentIndex.value + 1) % images.value.length
    goToSlide(newIndex)
  }
}

const prevSlide = () => {
  if (images.value && images.value.length > 0) {
    const newIndex = currentIndex.value === 0 ? images.value.length - 1 : currentIndex.value - 1
    goToSlide(newIndex)
  }
}

const autoNextSlide = () => {
  if (isVisible.value) {
    nextSlide()
  }
}

// Optional: Auto-play the carousel
const startAutoplay = () => {
  autoplayInterval = setInterval(autoNextSlide, 5000) // Change image every 5 seconds
}

const stopAutoplay = () => {
  if (autoplayInterval) clearInterval(autoplayInterval)
}

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    if (entries[0]) {
      isVisible.value = entries[0].isIntersecting
    }
  }, { threshold: 0.1 })
  
  if (containerRef.value) {
    observer.observe(containerRef.value)
  }

  startAutoplay()
  setTimeout(() => {
    if (trackRef.value) {
      goToSlide(0)
    }
  }, 100)
})

onUnmounted(() => {
  stopAutoplay()
  if (observer) {
    observer.disconnect()
  }
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
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  position: relative;
  gap: 16px;
  padding: 0 50%;
  align-items: center;
}

.carousel-track::-webkit-scrollbar {
  display: none;
}

.carousel-slide {
  flex: 0 0 auto;
  height: 90%;
  scroll-snap-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  transition: transform 0.3s ease;
}

.carousel-image {
  height: 100%;
  width: auto;
  max-width: 80vw;
  object-fit: contain;
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

.carousel-counter {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-family: var(--font-body);
  z-index: 2;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
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
</style>

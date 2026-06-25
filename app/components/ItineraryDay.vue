<template>
  <div class="timeline-item">
    <!-- Timeline Marker -->
    <div class="timeline-marker">
      <div class="marker-pulse"></div>
      <div class="marker-dot"></div>
    </div>
    
    <!-- Timeline Content -->
    <GlassCard class="timeline-content">
      <!-- Header -->
      <div class="day-header">
        <h2 class="day-title">
          Day {{ day.dayNumber }}: {{ day.dayOfWeek }}
        </h2>
        <span class="day-date">{{ day.date }}</span>
      </div>
      
      <!-- Subtle Fade Divider -->
      <div class="day-divider"></div>
      
      <!-- Events -->
      <div class="day-events">
        <div v-for="(event, index) in day.events" :key="index" class="event-block">
          <h3 class="event-title">{{ event.title }}</h3>
          
          <!-- Event Description -->
          <p v-if="event.description" class="event-desc" v-html="event.description"></p>
          
          <!-- Optional Action/Link -->
          <div v-if="event.link" class="event-link-wrapper">
            <NuxtLink 
              v-if="!event.link.isExternal" 
              :to="event.link.to" 
              :class="event.link.class || 'btn btn-secondary btn-sm'"
            >
              {{ event.link.text }}
            </NuxtLink>
            <a 
              v-else 
              :href="event.link.to" 
              target="_blank" 
              rel="noopener noreferrer" 
              :class="event.link.class || 'btn btn-secondary btn-sm'"
            >
              {{ event.link.text }}
            </a>
          </div>
          
          <!-- Activities List -->
          <ul v-if="event.activities && event.activities.length" class="activity-list">
            <li v-for="(activity, aIndex) in event.activities" :key="aIndex" class="activity-item" v-html="activity"></li>
          </ul>
          
          <!-- Optional Sub-Description -->
          <p v-if="event.subDescription" class="event-desc sub-desc" v-html="event.subDescription"></p>
        </div>
      </div>
    </GlassCard>
  </div>
</template>

<script setup>
defineProps({
  day: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.timeline-item {
  position: relative;
  margin-bottom: 3.5rem;
  padding-left: 4rem;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

/* ─── Timeline Marker ─── */
.timeline-marker {
  position: absolute;
  top: 1.5rem;
  left: 9px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.marker-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--color-green-desaturated);
  border: 2px solid var(--color-charcoal);
  box-shadow: 0 0 10px var(--color-green-desaturated);
  z-index: 2;
}

.marker-pulse {
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid rgba(121, 145, 84, 0.4);
  animation: pulse 2.5s infinite ease-out;
  pointer-events: none;
  z-index: 1;
}

@keyframes pulse {
  0% {
    transform: scale(0.6);
    opacity: 1;
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}

/* ─── Card Content styling ─── */
.timeline-content {
  padding: 2.25rem 2.5rem;
}

/* Scroll-Reveal transition initial state */
.timeline-item .timeline-content {
  opacity: 0;
  transform: translateY(40px) scale(0.96);
  filter: blur(3px);
  transition:
    opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) var(--reveal-delay, 0s),
    transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) var(--reveal-delay, 0s),
    filter 0.6s ease var(--reveal-delay, 0s),
    box-shadow 0.5s ease calc(var(--reveal-delay, 0s) + 0.3s);
}

.timeline-item.revealed .timeline-content {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
  box-shadow: 0 0 18px rgba(197, 168, 128, 0.15), 0 8px 32px rgba(0, 0, 0, 0.25);
}

/* Scroll-Reveal marker transition */
.timeline-item .timeline-marker {
  transform: scale(0);
  opacity: 0;
  transition:
    transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) calc(var(--reveal-delay, 0s) + 0.25s),
    opacity 0.3s ease calc(var(--reveal-delay, 0s) + 0.25s);
}

.timeline-item.revealed .timeline-marker {
  transform: scale(1);
  opacity: 1;
}

/* ─── Day Header ─── */
.day-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.day-title {
  font-size: 2rem;
  margin-bottom: 0;
  color: var(--color-cream-muted);
  font-family: var(--font-heading);
}

.day-date {
  font-size: 1.1rem;
  color: var(--color-cream-muted);
  font-weight: 400;
  font-family: var(--font-body);
}

.day-divider {
  height: 1px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 60%, rgba(255, 255, 255, 0) 100%);
  margin: 1.25rem 0;
}

/* ─── Event Content ─── */
.event-block {
  margin-bottom: 1.5rem;
}

.event-block:last-child {
  margin-bottom: 0;
}

.event-title {
  font-size: 1.35rem;
  color: var(--color-accent);
  margin-bottom: 0.75rem;
  font-family: var(--font-heading);
}

.event-desc {
  color: var(--color-cream-muted);
  line-height: 1.7;
  font-size: 1.05rem;
  margin-bottom: 0.75rem;
}

.sub-desc {
  margin-top: 1rem;
  margin-bottom: 0;
}

/* ─── Activities List ─── */
.activity-list {
  list-style: none;
  padding: 0;
  margin: 0.75rem 0 1.25rem 0.25rem;
}

.activity-item {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--color-cream-muted);
  line-height: 1.6;
  font-size: 1.05rem;
}

.activity-item:last-child {
  margin-bottom: 0;
}

.activity-item::before {
  content: "";
  position: absolute;
  left: 4px;
  top: 9px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--color-accent);
  box-shadow: 0 0 8px var(--color-accent);
}

/* Deep selection to style dynamic HTML links within events */
:deep(.event-link) {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease, text-shadow 0.2s ease;
}

:deep(.event-link:hover) {
  border-bottom-color: var(--color-primary);
  text-shadow: 0 0 8px rgba(197, 168, 128, 0.4);
}

:deep(strong) {
  color: var(--color-cream-muted);
  font-weight: 600;
}

/* ─── Buttons inside events ─── */
.event-link-wrapper {
  margin: 1.25rem 0;
}

.btn-sm {
  padding: 0.5rem 1.25rem;
  font-size: 0.9rem;
}

@media (max-width: 600px) {
  .timeline-item {
    padding-left: 2.5rem;
  }
  
  .timeline-marker {
    left: 4px;
  }
  
  .timeline-content {
    padding: 1.5rem;
  }
  
  .day-title {
    font-size: 1.6rem;
  }
  
  .day-date {
    font-size: 0.95rem;
  }
}
</style>

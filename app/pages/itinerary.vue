<template>
  <div class="container section">
    <PageHeader 
      title="Weekend Itinerary" 
      subtitle="A guide to our wedding weekend in Las Vegas" 
      subtitle-class="subtitle" 
    />
    <div class="timeline">
      
      <!-- Day 1 -->
      <div class="timeline-item">
        <div class="timeline-marker"></div>
        <GlassCard class="timeline-content">
          <h2 class="day-title">Day 1: Friday</h2>
          <h3 class="event-title text-accent">Family Day</h3>
          <p class="event-desc">
            We'll be spending the day with our families as everyone arrives and settles in. 
            Enjoy your first day in Vegas! If you're looking for things to do, check out the strip or relax by the pool.
          </p>
        </GlassCard>
      </div>

      <!-- Day 2 -->
      <div class="timeline-item">
        <div class="timeline-marker"></div>
        <GlassCard class="timeline-content">
          <h2 class="day-title">Day 2: Saturday</h2>
          <h3 class="event-title text-accent">The Big Day</h3>
          <p class="event-desc mb-sm">
            This is it! We are getting married today.
          </p>
          <NuxtLink to="/ceremony" class="btn btn-secondary mb-sm inline-block">View Ceremony Details</NuxtLink>
          
          <h3 class="event-title text-accent mt-md">After Party</h3>
          <p class="event-desc">
            Join us at <strong>Play Playground</strong> for a night of fun, games, and celebration to cap off our wedding day!
          </p>
        </GlassCard>
      </div>

      <!-- Day 3 -->
      <div class="timeline-item">
        <div class="timeline-marker"></div>
        <GlassCard class="timeline-content">
          <h2 class="day-title">Day 3: Sunday</h2>
          <h3 class="event-title text-accent">Reception Dinner</h3>
          <p class="event-desc">
            In the evening, we will host a reception dinner for everyone to come together, share a meal, and celebrate.
          </p>
          <p class="event-desc mt-sm">
            Later in the night, we'll be going out on the town! (Adults only)
          </p>
        </GlassCard>
      </div>

      <!-- Day 4 -->
      <div class="timeline-item">
        <div class="timeline-marker"></div>
        <GlassCard class="timeline-content">
          <h2 class="day-title">Day 4: Monday</h2>
          <h3 class="event-title text-accent">Farewells &amp; Us Time</h3>
          <p class="event-desc">
            Most people will be traveling back home today. Safe travels!
            Maddie and Jesse will be spending the rest of the day relaxing and enjoying our first day of married life together.
          </p>
        </GlassCard>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, useTemplateRef } from 'vue';

const revealElements = ref([]);
let observer = null;

onMounted(() => {
  const items = document.querySelectorAll('.timeline-item');

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  items.forEach((el, index) => {
    el.style.setProperty('--reveal-delay', `${index * 0.15}s`);
    observer.observe(el);
  });
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});
</script>

<style scoped>
.text-center { text-align: center; }
.mb-sm { margin-bottom: var(--spacing-sm); }
.mb-md { margin-bottom: var(--spacing-md); }
.mb-lg { margin-bottom: var(--spacing-lg); }
.mt-sm { margin-top: var(--spacing-sm); }
.mt-md { margin-top: var(--spacing-md); }

.subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.2rem;
}

.text-accent {
  color: var(--color-accent);
}

.inline-block {
  display: inline-block;
}

.timeline {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  padding: 2rem 0;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 20px;
  width: 2px;
  background-color: var(--color-primary);
}

.timeline-item {
  position: relative;
  margin-bottom: 3rem;
  padding-left: 60px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

/* ─── Card animation ─── */
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
  box-shadow: 0 0 18px rgba(107, 142, 35, 0.1), 0 8px 32px rgba(0, 0, 0, 0.25);
}

/* ─── Marker animation ─── */
.timeline-marker {
  position: absolute;
  top: 0;
  left: 11px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--color-background);
  border: 4px solid var(--color-primary);
  box-shadow: 0 0 0 4px rgba(107, 142, 35, 0.2);
  transform: scale(0);
  opacity: 0;
  transition:
    transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) calc(var(--reveal-delay, 0s) + 0.25s),
    opacity 0.3s ease calc(var(--reveal-delay, 0s) + 0.25s),
    box-shadow 0.4s ease calc(var(--reveal-delay, 0s) + 0.4s);
}

.timeline-item.revealed .timeline-marker {
  transform: scale(1);
  opacity: 1;
  box-shadow: 0 0 0 4px rgba(107, 142, 35, 0.2), 0 0 12px rgba(107, 142, 35, 0.35);
}

.timeline-content {
  padding: 2rem;
}

.day-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.5rem;
}

.event-title {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

.event-desc {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
}

@media (min-width: 768px) {
  .timeline::before {
    left: 50%;
    transform: translateX(-50%);
  }
  
  .timeline-item {
    width: 50%;
    padding-left: 0;
    padding-right: 40px;
    text-align: right;
  }
  
  .timeline-item:nth-child(even) {
    margin-left: 50%;
    padding-right: 0;
    padding-left: 40px;
    text-align: left;
  }
  
  .timeline-marker {
    left: auto;
    right: -10px;
  }
  
  .timeline-item:nth-child(even) .timeline-marker {
    left: -10px;
    right: auto;
  }

  /* Desktop: cards slide toward the line */
  .timeline-item:nth-child(odd) .timeline-content {
    transform: translateX(-50px) scale(0.96);
  }

  .timeline-item:nth-child(even) .timeline-content {
    transform: translateX(50px) scale(0.96);
  }

  .timeline-item.revealed .timeline-content {
    transform: translateX(0) scale(1);
  }
}
</style>

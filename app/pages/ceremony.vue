<template>
  <div class="container section">
    <h1 class="text-center mb-md">The Ceremony</h1>
    
    <div class="ceremony-grid">
      <!-- Main Info -->
      <GlassCard class="main-info">
        <h2 class="mb-sm text-primary">Saturday, March 13th, 2027</h2>
        <p class="location-details mb-md">
          <strong>Location:</strong> To Be Announced<br>
          Las Vegas, NV
        </p>

        <h3 class="mb-sm text-accent">Dress Code</h3>
        <p class="mb-md">
          Semi-formal / Cocktail attire. We want you to look and feel your best as we celebrate!
        </p>

        <h3 class="mb-sm text-accent">Transportation</h3>
        <p>
          Information regarding transportation to and from the ceremony venue will be provided closer to the date. 
          We recommend using ride-share services if you are staying on the Strip.
        </p>
      </GlassCard>

      <!-- Schedule -->
      <GlassCard class="schedule">
        <h2 class="mb-md">Schedule</h2>
        <ul class="schedule-list">
          <li>
            <span class="time">3:30 PM</span>
            <div class="event">
              <h4>Guest Arrival</h4>
              <p>Please arrive early to find your seats.</p>
            </div>
          </li>
          <li>
            <span class="time">4:00 PM</span>
            <div class="event">
              <h4>Ceremony Begins</h4>
              <p>The main event!</p>
            </div>
          </li>
          <li>
            <span class="time">4:45 PM</span>
            <div class="event">
              <h4>Photos & Cocktails</h4>
              <p>Stick around for some quick photos.</p>
            </div>
          </li>
        </ul>
      </GlassCard>

      <!-- After Party -->
      <GlassCard class="after-party full-width">
        <div class="after-party-content">
          <h2 class="mb-sm">The After Party</h2>
          <h3 class="text-accent mb-sm">Play Playground Las Vegas</h3>
          <p class="mb-md">
            The celebration doesn't end after we say "I do"! Join us at Play Playground for a night of immersive games, drinks, and unforgettable fun.
          </p>
          <a href="https://www.playplayground.com/" target="_blank" class="btn btn-secondary">Visit Play Playground Website</a>
        </div>
      </GlassCard>

    </div>
  </div>
</template>

<style scoped>
.text-center { text-align: center; }
.mb-sm { margin-bottom: var(--spacing-sm); }
.mb-md { margin-bottom: var(--spacing-md); }
.text-primary { color: var(--color-primary); }
.text-accent { color: var(--color-accent); }

.ceremony-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  max-width: 1000px;
  margin: 0 auto;
}

.main-info, .schedule {
  padding: 2.5rem;
}

.full-width {
  grid-column: 1 / -1;
}

.location-details {
  font-size: 1.2rem;
  line-height: 1.6;
}

/* Schedule List */
.schedule-list {
  list-style: none;
  padding: 0;
}

.schedule-list li {
  display: flex;
  margin-bottom: 1.5rem;
  position: relative;
}

.schedule-list li:last-child {
  margin-bottom: 0;
}

.time {
  min-width: 90px;
  font-weight: 700;
  color: var(--color-accent-alt);
  font-family: var(--font-heading);
}

.event h4 {
  margin-bottom: 0.25rem;
  color: #fff;
  font-size: 1.1rem;
}

.event p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
}

/* After Party */
.after-party {
  background: linear-gradient(rgba(0, 59, 70, 0.8), rgba(0, 59, 70, 0.9)), url('/placeholder-party.jpg') center/cover;
  text-align: center;
  padding: 4rem 2rem;
}

.after-party-content {
  max-width: 600px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .ceremony-grid {
    grid-template-columns: 1fr;
  }
}
</style>

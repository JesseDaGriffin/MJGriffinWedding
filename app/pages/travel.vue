<template>
  <div class="container section">
    <PageHeader 
      title="Travel & Accommodations" 
      subtitle="Information to help you plan your trip to Las Vegas." 
    />
    <div class="travel-grid">
      <!-- Flights -->
      <GlassCard class="text-center">
        <div class="icon-container">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 5-4 4-3-1-2 2 5 2 2 5 2-2-1-3 4-4 5 6l1.2-.7c.4-.2.7-.6.6-1.1z"/>
            </svg>
          </span>
        </div>
        <h2 class="mb-sm">Flights</h2>
        <p class="mb-md">
          We recommend flying into <strong>Harry Reid International Airport (LAS)</strong>. 
          It is the closest and most convenient airport to the Las Vegas Strip.
        </p>
        <p class="small-text">
          Pro Tip: Book your flights 3-4 months in advance for the best rates.
        </p>
      </GlassCard>

      <!-- Hotels -->
      <GlassCard class="text-center">
        <div class="icon-container">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
              <path d="M9 22v-4h6v4"></path>
              <path d="M8 6h.01"></path>
              <path d="M16 6h.01"></path>
              <path d="M12 6h.01"></path>
              <path d="M12 10h.01"></path>
              <path d="M12 14h.01"></path>
              <path d="M16 10h.01"></path>
              <path d="M16 14h.01"></path>
              <path d="M8 10h.01"></path>
              <path d="M8 14h.01"></path>
            </svg>
          </span>
        </div>
        <h2 class="mb-sm">Accommodations</h2>
        <p class="mb-md">
          We are currently organizing a hotel block for our guests. 
          Details and booking links will be provided here soon!
        </p>
        <p class="small-text">
          Check back for updates on where we'll be staying.
        </p>
      </GlassCard>

      <!-- Getting Around -->
      <GlassCard class="text-center full-width">
        <div class="icon-container">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
              <circle cx="7" cy="17" r="2"></circle>
              <path d="M9 17h6"></path>
              <circle cx="17" cy="17" r="2"></circle>
            </svg>
          </span>
        </div>
        <h2 class="mb-sm">Getting Around</h2>
        <div class="transport-info">
          <div class="transport-item">
            <h4>Ride Share</h4>
            <p>Uber and Lyft are widely available and often the easiest way to navigate off-strip or from the airport.</p>
          </div>
          <div class="transport-item">
            <h4>Walking</h4>
            <p>The Strip is very walkable, but remember things are farther apart than they appear!</p>
          </div>
          <div class="transport-item">
            <h4>Monorail</h4>
            <p>A great option for traveling quickly up and down the East side of the Strip.</p>
          </div>
        </div>
      </GlassCard>

    </div>
  </div>
</template>

<style scoped>
.text-center { text-align: center; }
.mb-sm { margin-bottom: var(--spacing-sm); }
.mb-md { margin-bottom: var(--spacing-md); }
.mb-lg { margin-bottom: var(--spacing-lg); }

.travel-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  max-width: 1000px;
  margin: 0 auto;
}

.full-width {
  grid-column: 1 / -1;
}

.icon-container {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.small-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
}

.transport-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
  text-align: left;
}

.transport-item h4 {
  color: var(--color-accent);
  margin-bottom: 0.5rem;
}

.transport-item p {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
}

@media (max-width: 768px) {
  .travel-grid {
    grid-template-columns: 1fr;
  }
  .transport-info {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
</style>

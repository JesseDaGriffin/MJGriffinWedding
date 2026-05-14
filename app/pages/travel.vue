<template>
  <div class="container section">
    <h1 class="text-center mb-md">Travel & Accommodations</h1>
    <p class="text-center mb-lg">Information to help you plan your trip to Las Vegas.</p>

    <div class="travel-grid">
      <!-- Flights -->
      <GlassCard class="text-center">
        <div class="icon-container">
          <span class="icon">✈️</span>
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
          <span class="icon">🏨</span>
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
          <span class="icon">🚕</span>
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

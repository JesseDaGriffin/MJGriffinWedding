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
          We are currently looking at booking at the <a href="https://www.caesars.com/flamingo-las-vegas" target="_blank" rel="noopener noreferrer">Flamingo Hotel</a>. 
        </p>
        <div class="nearby-hotels">
          <p class="mb-sm">For other convenient options right in the Center Strip, these nearby hotels are also excellent choices:</p>
          <ul class="hotel-list">
            <li><a href="https://www.caesars.com/linq" target="_blank" rel="noopener noreferrer">The LINQ</a></li>
            <li><a href="https://www.caesars.com/planet-hollywood" target="_blank" rel="noopener noreferrer">Planet Hollywood</a></li>
            <li><a href="https://www.caesars.com/paris-las-vegas" target="_blank" rel="noopener noreferrer">Paris Hotel</a></li>
          </ul>
        </div>
        <p class="small-text mt-md">
          Check back for updates on where we'll be staying.
        </p>
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



.icon-container {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.small-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
}



.nearby-hotels {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.nearby-hotels p {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.5;
}

.hotel-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem 1rem;
  margin-top: var(--spacing-sm);
}

.hotel-list li a {
  font-size: 0.9rem;
  padding: 0.35rem 0.85rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  display: inline-block;
  transition: var(--transition);
}

.hotel-list li a:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: var(--color-accent);
  color: #fff;
}

.mt-md {
  margin-top: var(--spacing-md);
}

@media (max-width: 768px) {
  .travel-grid {
    grid-template-columns: 1fr;
  }
}
</style>

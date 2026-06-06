<template>
  <div class="container section">
    <div class="registry-container text-center">
      <PageHeader title="Registry" />
      
      <GlassCard class="registry-card">
        <div class="icon-container mb-md">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-gift">
              <polyline points="20 12 20 22 4 22 4 12"></polyline>
              <rect x="2" y="7" width="20" height="5"></rect>
              <line x1="12" y1="22" x2="12" y2="7"></line>
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
            </svg>
          </span>
        </div>
        
        <h2 class="mb-sm text-primary">Your Presence is the Best Gift</h2>
        
        <p class="mb-lg description">
          Your presence at our wedding is the greatest gift of all. 
          Given the travel involved for our destination wedding in Las Vegas, 
          the cost of your attendance is more than enough for us!
        </p>

        <div class="divider mb-lg"></div>

        <p class="mb-md">
          However, if you're feeling incredibly generous and would like to contribute to this wedding or our honeymoon fund, you can do so below.
        </p>

        <a href="https://venmo.com/u/Jesse_da_Griffin" target="_blank" class="btn venmo-btn">
          <span class="venmo-icon">v</span> Contribute via Venmo
        </a>
      </GlassCard>
    </div>
  </div>
</template>

<style scoped>
.registry-container {
  max-width: 700px;
  margin: 0 auto;
}

.text-center { text-align: center; }
.mb-sm { margin-bottom: var(--spacing-sm); }
.mb-md { margin-bottom: var(--spacing-md); }
.mb-lg { margin-bottom: var(--spacing-lg); }
.text-primary { color: var(--color-primary); }

.registry-card {
  padding: 3rem 2rem;
}

.icon-container {
  font-size: 4rem;
}

.description {
  font-size: 1.1rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}

.venmo-btn {
  background-color: #008CFF;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  padding: 1rem 2rem;
}

.venmo-btn:hover {
  background-color: #0077D9;
}

.venmo-icon {
  font-family: Arial, sans-serif;
  font-weight: bold;
  font-style: italic;
  font-size: 1.2rem;
}
</style>

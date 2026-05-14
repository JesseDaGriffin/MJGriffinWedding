<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Maddie & Jesse</h1>
        <p class="hero-subtitle">Are getting married</p>
        <p class="hero-date">March 13th, 2027 • Las Vegas, NV</p>
        
        <CountdownTimer targetDate="2027-03-13T00:00:00" />
      </div>
    </section>

    <!-- About Us Section -->
    <section class="section container">
      <h2 class="text-center mb-md">Our Story</h2>
      <GlassCard class="about-content">
        <p class="text-center">
          Welcome to our wedding website! We are so thrilled to celebrate our special day with the people we love most.
          Las Vegas has always been a special place for us, filled with fun, memories, and now, the beginning of our forever.
          We can't wait for you to join us for an unforgettable weekend.
        </p>
      </GlassCard>
    </section>

    <!-- Gallery Carousel Section -->
    <section class="section container">
      <h2 class="text-center mb-md">Gallery</h2>
      <ImageCarousel placeholderText="Our Favorite Memories" />
    </section>
  </div>
</template>

<style scoped>
.hero {
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(rgba(28, 28, 28, 0.6), rgba(28, 28, 28, 0.8)), var(--color-phthalo-green);
  /* TODO: Add a nice background image url() here */
}

.hero-title {
  font-size: 5rem;
  margin-bottom: 0.5rem;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.hero-subtitle {
  font-size: 1.5rem;
  font-family: var(--font-heading);
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.hero-date {
  font-size: 1.2rem;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.mb-md {
  margin-bottom: var(--spacing-md);
}

.text-center {
  text-align: center;
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
  font-size: 1.1rem;
  line-height: 1.8;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 3rem;
  }
}
</style>

<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <p class="hero-prelude">The Wedding of</p>
        <h1 class="hero-title">Maddie & Jesse</h1>
        <p class="hero-surname">Griffin</p>
        <p class="hero-date">March 13th, 2027 • Las Vegas, NV</p>
        
        <CountdownTimer targetDate="2027-03-13T00:00:00" />

        <div v-if="user" class="hero-actions">
          <NuxtLink to="/rsvp" class="btn rsvp-hero-btn">RSVP Now</NuxtLink>
        </div>
      </div>
    </section>

    <!-- About Us Section -->
    <section class="section container">
      <h2 class="text-center mb-md">Our Story</h2>
      <GlassCard class="about-content">
        <p class="text-center">
          Welcome to the official home of the soon-to-be Griffins! We are so thrilled to celebrate our
          special day with the people we love most.
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

<script setup>
const user = useSupabaseUser();
</script>

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

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-prelude {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.hero-title {
  font-size: 5rem;
  margin-bottom: 0;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.hero-surname {
  font-family: var(--font-heading);
  font-size: 2.2rem;
  color: var(--color-primary);
  letter-spacing: 8px;
  text-transform: uppercase;
  margin-bottom: 1.25rem;
}

.hero-date {
  font-size: 1.2rem;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.hero-actions {
  margin-top: var(--spacing-lg);
}

.rsvp-hero-btn {
  display: inline-block;
  font-size: 1.2rem;
  padding: 1rem 3rem;
  font-family: var(--font-heading);
  letter-spacing: 1px;
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

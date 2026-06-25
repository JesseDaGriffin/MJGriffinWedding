<template>
  <div class="container section">
    <PageHeader title="The Ceremony" />
    
    <div class="ceremony-grid">
      <!-- Main Info -->
      <GlassCard class="main-info">
        <h2 class="mb-sm text-primary">Saturday, March 13th, 2027</h2>
        <p class="location-details mb-md">
          <strong>Location:</strong> Valley of Fire State Park <br>Las Vegas, NV
        </p>

        <h3 class="mb-sm text-accent">Dress Code</h3>
        <p class="mb-md">
          Cocktail attire. We're aiming for a stylish, dressed-up look. A suit, sport coat, cocktail dress, dressy jumpsuit, or elegant separates are all wonderful choices. We expect the weather to be around 70-75°F, so lighter fabrics are encouraged. If you'd like to embrace our wedding aesthetic, jewel-tone colors are especially welcome.
        </p>

        <h3 class="mb-sm text-accent">Transportation</h3>
        <p>
          We will be providing a shuttle for our guests. The shuttle will depart from the <a href="https://www.caesars.com/flamingo-las-vegas" target="_blank" rel="noopener noreferrer">Pink Flamingo Hotel</a> at 3:00 PM and take everyone to the Valley of Fire for the ceremony and celebration.
        </p>
      </GlassCard>

      <!-- Schedule -->
      <GlassCard class="schedule">
        <h2 class="mb-md">Schedule</h2>
        <ul class="schedule-list">
          <li>
            <span class="time">3:00 PM</span>
            <div class="event">
              <h4>Depart for Valley of Fire</h4>
              <p>Depart on the shuttle bus.</p>
            </div>
          </li>
          <li>
            <span class="time">4:30 PM</span>
            <div class="event">
              <h4>Ceremony Begins</h4>
              <p>The main event!</p>
            </div>
          </li>
          <li>
            <span class="time">4:45 PM</span>
            <div class="event">
              <h4>Group Photos</h4>
              <p>Everyone will be asked to join for group photos.</p>
            </div>
          </li>
          <li>
            <span class="time">5:00 PM</span>
            <div class="event">
              <h4>Dessert</h4>
              <p>Enjoy some sweet treats.</p>
            </div>
          </li>
          <li>
            <span class="time">5:45 PM</span>
            <div class="event">
              <h4>Couple Portraits</h4>
              <p>Guests can enjoy beverages and hang out while the newlyweds take photos (we all arrive and leave together!)</p>
            </div>
          </li>
          <li>
            <span class="time">6:45 PM</span>
            <div class="event">
              <h4>Leave Desert</h4>
              <p>Head back to the city.</p>
            </div>
          </li>
          <li>
            <span class="time">8:00 PM</span>
            <div class="event">
              <h4>Vegas Drop-off</h4>
              <p>Arrive back in Las Vegas.</p>
            </div>
          </li>
          <li>
            <span class="time">9:30 PM</span>
            <div class="event">
              <h4>The After Party</h4>
              <p>Play @ Luxor.</p>
            </div>
          </li>
        </ul>
      </GlassCard>

      <!-- After Party -->
      <GlassCard class="after-party full-width">
        <div class="after-party-grid">
          <div class="after-party-info">
            <h2 class="mb-sm">The After Party</h2>
            <h3 class="text-accent mb-sm">Play Playground Las Vegas</h3>
            <p class="mb-md">
              The celebration doesn't end after we say "I do"! Join us at Play Playground for a night of immersive games, drinks, and unforgettable fun. 
              <br><br><strong>Please note: All guests must be 21+ to attend the after party.</strong>
            </p>
            <a href="https://www.playplayground.com/" target="_blank" class="btn btn-secondary">Visit Play Playground Website</a>
          </div>
          
          <div class="after-party-passes">
            <h3 class="mb-sm">Pass Options</h3>
            <ul class="pass-list">
              <li>
                <strong>Play Pass (Starts at $43)</strong>
                195 game credits (~90 mins), access to 20+ games, includes 1 Duck Duck Boom ride.
              </li>
              <li>
                <strong>VIP Play Pass ($69)</strong>
                3 hours unlimited game play, one (1) complimentary cocktail or mocktail.
              </li>
              <li>
                <strong>Party Play Pass ($99)</strong>
                3 hours unlimited game play, 3 drink tickets, souvenir cup & swag bag.
              </li>
            </ul>
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
.text-primary { color: var(--color-primary); }
.text-accent { color: var(--color-accent); }

.ceremony-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  max-width: 1000px;
  margin: 0 auto;
}

.main-info {
  position: relative;
  overflow: hidden;
  background: transparent;
  z-index: 1;
}

.main-info::before {
  content: '';
  position: absolute;
  inset: 0 0 -60px 0;
  background: linear-gradient(rgba(28, 28, 28, 0.85), rgba(28, 28, 28, 0.9)), url('/img/Valley-of-Fire-State-Park-Seven-Sisters-Blue-Sky-At-Dusk.jpg') center top / cover;
  z-index: -1;
  pointer-events: none;
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
  color: var(--color-amethyst-blue);
  font-family: var(--font-heading);
}

.event h4 {
  margin-bottom: 0.25rem;
  color: var(--color-cream-muted);
  font-size: 1.1rem;
}

.event p {
  color: var(--color-cream-muted);
  font-size: 0.95rem;
}

/* After Party */
.after-party {
  background: linear-gradient(rgba(0, 59, 70, 0.8), rgba(0, 59, 70, 0.9)), url('/placeholder-party.jpg') center/cover;
  padding: 4rem 2rem;
}

.after-party-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
}

.after-party-info {
  text-align: left;
}

.after-party-passes {
  background: rgba(0, 0, 0, 0.3);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: left;
}

.pass-list {
  list-style: none;
  padding: 0;
}

.pass-list li {
  margin-bottom: 1.25rem;
  font-size: 0.95rem;
  color: var(--color-cream-muted);
  line-height: 1.5;
}

.pass-list li strong {
  color: var(--color-accent);
  display: block;
  font-size: 1.05rem;
  margin-bottom: 0.25rem;
}

.pass-list li:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .ceremony-grid {
    grid-template-columns: 1fr;
  }
  .after-party-grid {
    grid-template-columns: 1fr;
  }
}
</style>

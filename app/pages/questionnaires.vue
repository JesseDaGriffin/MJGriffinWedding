<template>
  <div class="container section">
    <h1 class="text-center mb-md">Admin Questionnaires Dashboard</h1>
    
    <div v-if="!isAdmin" class="text-center">
      <p>You do not have permission to view this page.</p>
    </div>

    <div v-else class="dashboard-grid">
      <!-- Summary Section -->
      <GlassCard class="summary-card full-width">
        <h2 class="mb-sm text-primary">Overview Summary</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-value">{{ mockData.summary.totalResponses }}</span>
            <span class="stat-label">Total Responses</span>
          </div>
        </div>

        <div class="activity-summary mt-md" v-if="mockData.summary.topActivities.length">
          <h3 class="mb-sm text-center" style="font-size: 1.1rem; color: rgba(255,255,255,0.8);">Activity Interest Counts</h3>
          <div class="activity-summary-grid">
            <div class="activity-summary-item" v-for="act in mockData.summary.topActivities" :key="act.name">
              <span class="activity-summary-count">{{ act.count }}</span>
              <span class="activity-summary-name">{{ act.name }}</span>
            </div>
          </div>
        </div>
      </GlassCard>

      <!-- Individual Questionnaires as Cards -->
      <div class="responses-cards full-width mt-md">
        <h2 class="mb-sm text-primary">Guest Submissions</h2>
        
        <div class="cards-grid mt-sm">
          <div class="response-card" v-for="response in mockData.responses" :key="response.id">
            <div class="response-header">
              <div class="guest-info">
                <h3>{{ response.name }}</h3>
                <a :href="'mailto:' + response.email" class="guest-email">{{ response.email }}</a>
              </div>
              <div class="travel-dates">
                <div class="date-badge">
                  <span class="date-label">ARRIVE</span>
                  <span class="date-val">{{ response.arrival_date || 'TBD' }}</span>
                </div>
                <div class="date-badge">
                  <span class="date-label">DEPART</span>
                  <span class="date-val">{{ response.departure_date || 'TBD' }}</span>
                </div>
              </div>
            </div>
            
            <div class="response-body mt-sm">
              <div class="activities-section" v-if="response.activities && response.activities.length">
                <span class="section-label">Interested In:</span>
                <div class="activity-badges">
                  <span class="activity-badge" v-for="act in mapActivities(response.activities)" :key="act">
                    {{ act }}
                  </span>
                </div>
              </div>
              
              <div class="suggestions-section mt-sm" v-if="response.suggestions">
                <span class="section-label">Suggestions / Ideas:</span>
                <p class="suggestions-text">"{{ response.suggestions }}"</p>
              </div>
            </div>
          </div>
          
          <div v-if="mockData.responses.length === 0" class="no-data">
            <p>No questionnaire submissions yet.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const isAdmin = ref(false);
const loading = ref(true);

const availableActivities = [
  { id: 'gambling', name: 'Casino / Gambling' },
  { id: 'shows', name: 'Shows & Entertainment' },
  { id: 'dining', name: 'Fine Dining' },
  { id: 'sightseeing', name: 'Sightseeing' },
  { id: 'pool', name: 'Pool / Cabana Time' },
  { id: 'clubbing', name: 'Nightlife / Clubbing' }
];

const mockData = ref({
  summary: {
    totalResponses: 0,
    topActivities: []
  },
  responses: []
});

const mapActivities = (activitiesArray) => {
  if (!activitiesArray || !Array.isArray(activitiesArray)) return [];
  return activitiesArray.map(id => {
    const found = availableActivities.find(a => a.id === id);
    return found ? found.name : id;
  });
};

onMounted(async () => {
  if (user.value && (user.value.email?.toLowerCase() === 'dagriffinwedding@gmail.com' || localStorage.getItem('wedding_admin') === 'true')) {
    isAdmin.value = true;
    await fetchQuestionnaires();
  } else {
    loading.value = false;
  }
});

const fetchQuestionnaires = async () => {
  try {
    const res = await $fetch('/api/admin/questionnaires');
    
    if (!res.success) {
      throw new Error(res.error || 'Failed to fetch questionnaires');
    }

    // Tally activities
    const activityCounts = {};
    res.data.forEach(q => {
      if (q.activities && Array.isArray(q.activities)) {
        q.activities.forEach(id => {
          activityCounts[id] = (activityCounts[id] || 0) + 1;
        });
      }
    });

    const topActivities = Object.keys(activityCounts)
      .map(id => {
        const found = availableActivities.find(a => a.id === id);
        return { name: found ? found.name : id, count: activityCounts[id] };
      })
      .sort((a, b) => b.count - a.count);

    mockData.value.summary.totalResponses = res.data.length;
    mockData.value.summary.topActivities = topActivities;
    mockData.value.responses = res.data;
  } catch (error) {
    console.error('Error fetching questionnaires:', error.message);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.text-center { text-align: center; }
.mb-sm { margin-bottom: var(--spacing-sm); }
.mb-md { margin-bottom: var(--spacing-md); }
.mt-md { margin-top: var(--spacing-md); }
.text-primary { color: var(--color-primary); }

.full-width {
  grid-column: 1 / -1;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-md);
  max-width: 1000px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-md);
  margin-top: var(--spacing-sm);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  font-family: var(--font-heading);
  color: var(--color-accent);
}

.stat-label {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.7);
}

.activity-summary-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.activity-summary-item {
  background: rgba(0,0,0,0.2);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.activity-summary-count {
  background: var(--color-primary);
  color: #fff;
  font-weight: bold;
  font-size: 1.1rem;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-summary-name {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.9);
}

.cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-md);
}

.response-card {
  background: rgba(30, 30, 30, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  transition: transform 0.2s;
}

.response-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255,255,255,0.15);
}

.response-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  padding-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.guest-info h3 {
  margin: 0 0 0.2rem 0;
  color: var(--color-accent);
  font-family: var(--font-heading);
  font-size: 1.4rem;
}

.guest-email {
  color: rgba(255,255,255,0.6);
  font-size: 0.9rem;
  text-decoration: none;
}
.guest-email:hover {
  color: var(--color-primary);
}

.travel-dates {
  display: flex;
  gap: 0.8rem;
}

.date-badge {
  display: flex;
  flex-direction: column;
  background: rgba(0,0,0,0.3);
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.05);
  min-width: 90px;
}

.date-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  color: rgba(255,255,255,0.5);
  letter-spacing: 1px;
}

.date-val {
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
}

.section-label {
  display: block;
  font-size: 0.8rem;
  text-transform: uppercase;
  color: rgba(255,255,255,0.5);
  margin-bottom: 0.5rem;
  letter-spacing: 0.5px;
}

.activity-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.suggestions-text {
  background: rgba(0,0,0,0.2);
  padding: 1rem;
  border-radius: 6px;
  border-left: 3px solid var(--color-primary);
  font-style: italic;
  margin: 0;
  color: rgba(255,255,255,0.85);
  line-height: 1.5;
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: rgba(255,255,255,0.5);
}
</style>

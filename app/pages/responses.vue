<template>
  <div class="container section">
    <h1 class="text-center mb-md">Admin Responses Dashboard</h1>
    
    <div v-if="!isAdmin" class="text-center">
      <p>You do not have permission to view this page.</p>
    </div>

    <div v-else class="dashboard-grid">
      <!-- Summary Section -->
      <GlassCard class="summary-card full-width">
        <h2 class="mb-sm text-primary">Overview Summary</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-value">{{ mockData.summary.attending }}</span>
            <span class="stat-label">Attending</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ mockData.summary.declined }}</span>
            <span class="stat-label">Declined</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ mockData.summary.totalAdults }}</span>
            <span class="stat-label">Total Adults</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ mockData.summary.totalKids }}</span>
            <span class="stat-label">Total Kids</span>
          </div>
        </div>

        <div class="event-summary mt-md">
          <div class="event-summary-item">
            <span class="event-name">Ceremony</span>
            <div class="event-counts">
              <span class="count-badge">{{ mockData.eventTotals.ceremonyAdults }} Adults</span>
              <span class="count-badge" v-if="mockData.eventTotals.ceremonyKids > 0">{{ mockData.eventTotals.ceremonyKids }} Kids</span>
            </div>
          </div>
          <div class="event-summary-item">
            <span class="event-name">Dinner</span>
            <div class="event-counts">
              <span class="count-badge">{{ mockData.eventTotals.dinnerAdults }} Adults</span>
              <span class="count-badge" v-if="mockData.eventTotals.dinnerKids > 0">{{ mockData.eventTotals.dinnerKids }} Kids</span>
            </div>
          </div>
          <div class="event-summary-item">
            <span class="event-name">After Party</span>
            <div class="event-counts">
              <span class="count-badge">{{ mockData.eventTotals.afterpartyAdults }} Adults</span>
            </div>
          </div>
        </div>
      </GlassCard>

      <!-- Individual Responses -->
      <GlassCard class="responses-list full-width mt-md">
        <h2 class="mb-sm text-primary">Individual Responses</h2>
        
        <div class="table-responsive">
          <table class="responses-table">
            <thead>
              <tr>
                <th>Guest Name</th>
                <th>Guest Email</th>
                <th>Status</th>
                <th>Ceremony</th>
                <th>Dinner</th>
                <th>After Party</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="response in mockData.responses" :key="response.id">
                <td>{{ response.name }}</td>
                <td>{{ response.email }}</td>
                <td>
                  <span :class="response.attending ? 'status-yes' : 'status-no'">
                    {{ response.attending ? 'Attending' : 'Declined' }}
                  </span>
                </td>
                <td>{{ response.attending_ceremony ? `Yes (${response.ceremony_adults}A/${response.ceremony_kids}K)` : 'No' }}</td>
                <td>{{ response.attending_dinner ? `Yes (${response.dinner_adults}A/${response.dinner_kids}K)` : 'No' }}</td>
                <td>{{ response.attending_afterparty ? `Yes (${response.afterparty_adults}A)` : 'No' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const isAdmin = ref(false);
const loading = ref(true);

const mockData = ref({
  summary: {
    attending: 0,
    declined: 0,
    totalAdults: 0,
    totalKids: 0
  },
  eventTotals: {
    ceremonyAdults: 0,
    ceremonyKids: 0,
    dinnerAdults: 0,
    dinnerKids: 0,
    afterpartyAdults: 0
  },
  responses: []
});

onMounted(async () => {
  if (user.value && (user.value.email?.toLowerCase() === 'dagriffinwedding@gmail.com' || localStorage.getItem('wedding_admin') === 'true')) {
    isAdmin.value = true;
    await fetchResponses();
  } else {
    loading.value = false;
  }
});

const fetchResponses = async () => {
  try {
    const res = await $fetch('/api/admin/responses');
    
    if (!res.success) {
      throw new Error(res.error || 'Failed to fetch responses');
    }

    let attending = 0;
    let declined = 0;
    let adults = 0;
    let kids = 0;
    let ceremonyAdults = 0;
    let ceremonyKids = 0;
    let dinnerAdults = 0;
    let dinnerKids = 0;
    let afterpartyAdults = 0;

    const formattedResponses = res.data.map(r => {
      if (r.attending) {
        attending++;
        adults += r.adults_count || 0;
        kids += r.kids_count || 0;
        
        if (r.attending_ceremony) {
          ceremonyAdults += r.ceremony_adults || 0;
          ceremonyKids += r.ceremony_kids || 0;
        }
        if (r.attending_dinner) {
          dinnerAdults += r.dinner_adults || 0;
          dinnerKids += r.dinner_kids || 0;
        }
        if (r.attending_afterparty) {
          afterpartyAdults += r.afterparty_adults || 0;
        }
      } else {
        declined++;
      }
      
      return {
        id: r.id,
        name: r.name,
        email: r.email,
        attending: r.attending,
        adults_count: r.adults_count,
        kids_count: r.kids_count,
        attending_ceremony: r.attending_ceremony,
        ceremony_adults: r.ceremony_adults || 0,
        ceremony_kids: r.ceremony_kids || 0,
        attending_dinner: r.attending_dinner,
        dinner_adults: r.dinner_adults || 0,
        dinner_kids: r.dinner_kids || 0,
        attending_afterparty: r.attending_afterparty,
        afterparty_adults: r.afterparty_adults || 0,
        afterparty_kids: r.afterparty_kids || 0
      };
    });

    mockData.value.summary = { attending, declined, totalAdults: adults, totalKids: kids };
    mockData.value.eventTotals = { ceremonyAdults, ceremonyKids, dinnerAdults, dinnerKids, afterpartyAdults };
    mockData.value.responses = formattedResponses;
  } catch (error) {
    console.error('Error fetching responses:', error.message);
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
.text-sm { font-size: 1.1rem; opacity: 0.6; font-weight: 500; margin-left: 2px; }

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
  color: var(--color-cream-muted);
}

.table-responsive {
  overflow-x: auto;
}

.responses-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: var(--spacing-sm);
}

.responses-table th, .responses-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.responses-table th {
  color: var(--color-primary);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 1px;
}

.status-yes {
  color: #4CAF50;
  font-weight: bold;
}

.status-no {
  color: #F44336;
  font-weight: bold;
}

.event-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.event-summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(0, 0, 0, 0.15);
  padding: 0.8rem 1.2rem;
  border-radius: var(--border-radius);
  border: 1px solid rgba(255, 255, 255, 0.05);
  min-width: 140px;
}

.event-name {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.event-counts {
  display: flex;
  gap: 0.5rem;
}

.count-badge {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.8rem;
  color: var(--color-cream-muted);
}
</style>

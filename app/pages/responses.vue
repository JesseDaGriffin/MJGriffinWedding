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
      </GlassCard>

      <!-- Individual Responses -->
      <GlassCard class="responses-list full-width mt-md">
        <h2 class="mb-sm text-primary">Individual Responses</h2>
        
        <div class="table-responsive">
          <table class="responses-table">
            <thead>
              <tr>
                <th>Guest Email</th>
                <th>Status</th>
                <th>Adults</th>
                <th>Kids</th>
                <th>Ceremony</th>
                <th>Dinner</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="response in mockData.responses" :key="response.id">
                <td>{{ response.email }}</td>
                <td>
                  <span :class="response.attending ? 'status-yes' : 'status-no'">
                    {{ response.attending ? 'Attending' : 'Declined' }}
                  </span>
                </td>
                <td>{{ response.adults_count }}</td>
                <td>{{ response.kids_count }}</td>
                <td>{{ response.attending_ceremony ? 'Yes' : 'No' }}</td>
                <td>{{ response.attending_dinner ? 'Yes' : 'No' }}</td>
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
    const { data, error } = await supabase
      .from('rsvps')
      .select('*, auth.users(email)');

    if (error) throw error;

    let attending = 0;
    let declined = 0;
    let adults = 0;
    let kids = 0;

    const formattedResponses = data.map(r => {
      if (r.attending) {
        attending++;
        adults += r.adults_count || 0;
        kids += r.kids_count || 0;
      } else {
        declined++;
      }
      
      return {
        id: r.id,
        email: r.users?.email || 'Unknown',
        attending: r.attending,
        adults_count: r.adults_count,
        kids_count: r.kids_count,
        attending_ceremony: r.attending_ceremony,
        attending_dinner: r.attending_dinner
      };
    });

    mockData.value.summary = { attending, declined, totalAdults: adults, totalKids: kids };
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
</style>

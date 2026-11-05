<template>
  <div class="container section">
    <h1 class="text-center mb-md">Admin RSVPs Dashboard</h1>
    
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
            <span class="stat-value">{{ mockData.nonRsvpUsers.length }}</span>
            <span class="stat-label">Not RSVP'd</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ mockData.summary.totalGuests }}</span>
            <span class="stat-label">Total Guests</span>
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

      <!-- Quick Name Tables with Toggle Switcher: RSVP'd vs Account Created Not RSVP'd -->
      <GlassCard class="names-overview full-width mt-md">
        <div class="names-overview-top">
          <h2 class="text-primary names-section-heading">Guest Name Lists</h2>

          <!-- Segmented Toggle Switcher (Desktop & Mobile) -->
          <div class="list-toggle-tabs" role="tablist" aria-label="Switch between RSVP'd and Not RSVP'd guest lists">
            <button
              type="button"
              role="tab"
              class="list-toggle-tab"
              :class="{ active: activeListTab === 'rsvp' }"
              :aria-selected="activeListTab === 'rsvp'"
              @click="activeListTab = 'rsvp'"
            >
              <span>RSVP'd Users</span>
              <span class="tab-count tab-count--success">{{ mockData.responses.length }}</span>
            </button>
            <button
              type="button"
              role="tab"
              class="list-toggle-tab"
              :class="{ active: activeListTab === 'nonRsvp' }"
              :aria-selected="activeListTab === 'nonRsvp'"
              @click="activeListTab = 'nonRsvp'"
            >
              <span>Not Yet RSVP'd</span>
              <span class="tab-count tab-count--pending">{{ mockData.nonRsvpUsers.length }}</span>
            </button>
          </div>
        </div>

        <div class="names-table-panel">
          <GuestNameListTable
            v-if="activeListTab === 'rsvp'"
            title="RSVP'd Users"
            badge-variant="success"
            :show-guest-count="true"
            :items="rsvpTableItems"
            :filters="rsvpFilterOptions"
            v-model:activeFilter="rsvpFilter"
            empty-text="No RSVP users match this filter."
          />

          <GuestNameListTable
            v-else
            title="Account Created — Not Yet RSVP'd"
            subtitle="Registered users who have created an account but have not submitted an RSVP yet"
            badge-variant="pending"
            :items="nonRsvpTableItems"
            empty-text="All registered users have submitted an RSVP!"
          />
        </div>
      </GlassCard>

      <!-- Individual RSVPs -->
      <GlassCard class="responses-list full-width mt-md">
        <h2 class="mb-sm text-primary">Individual RSVPs</h2>
        
        <div class="table-responsive custom-scrollbar">
          <table class="responses-table">
            <thead>
              <tr>
                <th>Guest Name</th>
                <th>Guest Email</th>
                <th>RSVP Status</th>
                <th>Total Guests</th>
                <th>Ceremony</th>
                <th>Dinner</th>
                <th>After Party</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="response in mockData.responses" :key="response.id">
                <td data-label="Guest Name" class="guest-name-cell">{{ response.name }}</td>
                <td data-label="Guest Email" class="guest-email-cell">{{ response.email }}</td>
                <td data-label="RSVP Status">
                  <span :class="response.attending ? 'status-yes' : 'status-no'">
                    {{ response.attending ? 'Attending' : 'Declined' }}
                  </span>
                </td>
                <td data-label="Total Guests">
                  <template v-if="response.attending">
                    <strong>{{ response.total_guests }}</strong>
                    <span class="guest-breakdown-muted"> ({{ response.adults_count }}A/{{ response.kids_count }}K)</span>
                  </template>
                  <template v-else>0</template>
                </td>
                <td data-label="Ceremony">{{ response.attending_ceremony ? `Yes (${response.ceremony_adults}A/${response.ceremony_kids}K)` : 'No' }}</td>
                <td data-label="Dinner">{{ response.attending_dinner ? `Yes (${response.dinner_adults}A/${response.dinner_kids}K)` : 'No' }}</td>
                <td data-label="After Party">{{ response.attending_afterparty ? `Yes (${response.afterparty_adults}A)` : 'No' }}</td>
              </tr>
            </tbody>
            <tfoot v-if="mockData.responses.length > 0">
              <tr class="responses-total-row">
                <td colspan="3" data-label="Summary" class="responses-total-label">Total RSVP'd Guests (incl. Children)</td>
                <td data-label="Total Guests" class="responses-total-val">
                  <strong>{{ mockData.summary.totalGuests }}</strong>
                  <span class="guest-breakdown-muted"> ({{ mockData.summary.totalAdults }}A/{{ mockData.summary.totalKids }}K)</span>
                </td>
                <td data-label="Ceremony">{{ mockData.eventTotals.ceremonyAdults + mockData.eventTotals.ceremonyKids }} ({{ mockData.eventTotals.ceremonyAdults }}A/{{ mockData.eventTotals.ceremonyKids }}K)</td>
                <td data-label="Dinner">{{ mockData.eventTotals.dinnerAdults + mockData.eventTotals.dinnerKids }} ({{ mockData.eventTotals.dinnerAdults }}A/{{ mockData.eventTotals.dinnerKids }}K)</td>
                <td data-label="After Party">{{ mockData.eventTotals.afterpartyAdults }} ({{ mockData.eventTotals.afterpartyAdults }}A)</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </GlassCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { isAdminUser } from '../../utils/admin';

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const isAdmin = ref(false);
const loading = ref(true);
const rsvpFilter = ref('all');
const activeListTab = ref('rsvp');

const mockData = ref({
  summary: {
    attending: 0,
    declined: 0,
    totalGuests: 0,
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
  responses: [],
  nonRsvpUsers: []
});

const rsvpFilterOptions = computed(() => [
  { value: 'all', label: 'All', count: mockData.value.responses.length },
  { value: 'attending', label: 'Attending', count: mockData.value.summary.attending },
  { value: 'declined', label: 'Declined', count: mockData.value.summary.declined }
]);

const rsvpTableItems = computed(() => {
  return mockData.value.responses
    .filter(r => {
      if (rsvpFilter.value === 'attending') return r.attending;
      if (rsvpFilter.value === 'declined') return !r.attending;
      return true;
    })
    .map(r => ({
      id: r.id,
      name: r.name,
      totalGuests: r.total_guests,
      adultsCount: r.adults_count,
      kidsCount: r.kids_count,
      statusText: r.attending ? 'Attending' : 'Declined',
      statusVariant: r.attending ? 'yes' : 'no'
    }));
});

const nonRsvpTableItems = computed(() => {
  return mockData.value.nonRsvpUsers.map(u => ({
    id: u.id,
    name: u.name,
    statusText: "Not RSVP'd",
    statusVariant: 'pending'
  }));
});

onMounted(async () => {
  if (user.value && (isAdminUser(user.value) || localStorage.getItem('wedding_admin') === 'true')) {
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
      throw new Error(res.error || 'Failed to fetch RSVPs');
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

    const formattedResponses = (res.data || []).map(r => {
      const partyAdults = r.attending
        ? Math.max(
            r.adults_count || 0,
            r.attending_ceremony ? (r.ceremony_adults || 0) : 0,
            r.attending_dinner ? (r.dinner_adults || 0) : 0,
            r.attending_afterparty ? (r.afterparty_adults || 0) : 0
          )
        : 0;
      const partyKids = r.attending
        ? Math.max(
            r.kids_count || 0,
            r.attending_ceremony ? (r.ceremony_kids || 0) : 0,
            r.attending_dinner ? (r.dinner_kids || 0) : 0
          )
        : 0;
      const partyTotal = partyAdults + partyKids;

      if (r.attending) {
        attending++;
        adults += partyAdults;
        kids += partyKids;
        
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
        adults_count: partyAdults,
        kids_count: partyKids,
        total_guests: partyTotal,
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

    mockData.value.summary = {
      attending,
      declined,
      totalGuests: adults + kids,
      totalAdults: adults,
      totalKids: kids
    };
    mockData.value.eventTotals = { ceremonyAdults, ceremonyKids, dinnerAdults, dinnerKids, afterpartyAdults };
    mockData.value.responses = formattedResponses;
    mockData.value.nonRsvpUsers = res.nonRsvpUsers || [];
  } catch (error) {
    console.error('Error fetching RSVPs:', error.message);
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
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
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
  text-align: center;
}

/* Guest Name Lists Header & Toggle Switcher */
.names-overview-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.1rem;
}

.names-section-heading {
  margin-bottom: 0;
}

.list-toggle-tabs {
  display: inline-grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.35rem;
  background: rgba(0, 0, 0, 0.4);
  padding: 0.3rem;
  border-radius: 8px;
  border: 1px solid rgba(197, 168, 128, 0.2);
}

.list-toggle-tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 0.55rem 1.1rem;
  color: rgba(255, 255, 255, 0.65);
  font-family: var(--font-heading);
  font-size: 0.82rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;
}

.list-toggle-tab:hover {
  color: var(--color-cream);
  background: rgba(255, 255, 255, 0.04);
}

.list-toggle-tab.active {
  background: rgba(197, 168, 128, 0.2);
  border-color: var(--color-primary);
  color: var(--color-primary);
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
}

.tab-count {
  font-family: var(--font-body);
  font-size: 0.74rem;
  padding: 0.08rem 0.5rem;
  border-radius: 999px;
  font-weight: 600;
}

.tab-count--success {
  background: rgba(76, 175, 80, 0.2);
  color: #81c784;
}

.tab-count--pending {
  background: rgba(255, 183, 77, 0.2);
  color: #ffb74d;
}

.names-table-panel {
  width: 100%;
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

.guest-breakdown-muted {
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.85rem;
}

.responses-total-row td {
  background: rgba(197, 168, 128, 0.08);
  border-top: 2px solid rgba(197, 168, 128, 0.3);
  border-bottom: none;
  font-weight: 600;
}

.responses-total-label {
  font-family: var(--font-heading);
  color: var(--color-primary);
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.06em;
}

.responses-total-val strong {
  color: var(--color-accent);
  font-size: 1.05rem;
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
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.count-badge {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.8rem;
  color: var(--color-cream-muted);
  white-space: nowrap;
}

@media (max-width: 768px) {
  .summary-card,
  .names-overview,
  .responses-list {
    padding: 1.25rem 1rem;
  }

  .names-overview-top {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .list-toggle-tabs {
    display: grid;
    width: 100%;
  }

  .list-toggle-tab {
    padding: 0.6rem 0.5rem;
    font-size: 0.78rem;
  }

  .responses-table, 
  .responses-table thead, 
  .responses-table tbody, 
  .responses-table tfoot,
  .responses-table th, 
  .responses-table td, 
  .responses-table tr {
    display: block;
  }
  
  .responses-table thead {
    display: none;
  }
  
  .responses-table tr {
    margin-bottom: var(--spacing-sm);
    background: rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: var(--border-radius);
    padding: 0.5rem 1rem;
  }

  .responses-table tr.responses-total-row {
    background: rgba(197, 168, 128, 0.1);
    border: 1px solid rgba(197, 168, 128, 0.35);
  }
  
  .responses-table td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.6rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    text-align: right;
    font-size: 0.95rem;
  }
  
  .responses-table td:last-child {
    border-bottom: none;
  }
  
  .responses-table td::before {
    content: attr(data-label);
    font-weight: 600;
    color: var(--color-primary);
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 0.5px;
    margin-right: 1rem;
    text-align: left;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .responses-table .guest-name-cell,
  .responses-table .guest-email-cell,
  .responses-table .responses-total-label {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }

  .responses-table .guest-name-cell::before,
  .responses-table .guest-email-cell::before,
  .responses-table .responses-total-label::before {
    margin-bottom: 0.2rem;
  }

  .responses-table .guest-email-cell {
    word-break: break-all;
  }
}

@media (max-width: 480px) {
  .summary-card,
  .names-overview,
  .responses-list {
    padding: 1rem 0.75rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-sm);
  }

  .stats-grid .stat-item:last-child:nth-child(odd) {
    grid-column: 1 / -1;
  }
  
  .stat-item {
    padding: 1rem;
  }

  .stat-value {
    font-size: 2rem;
  }

  .event-summary-item {
    flex: 1 1 calc(50% - 0.5rem);
    min-width: 120px;
    padding: 0.6rem 0.8rem;
  }

  .count-badge {
    font-size: 0.75rem;
    padding: 0.15rem 0.4rem;
  }

  .event-counts {
    gap: 0.3rem;
  }
}
</style>

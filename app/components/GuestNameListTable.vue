<template>
  <div class="names-column">
    <div class="names-column-header">
      <div class="names-column-title-row">
        <h3 class="names-column-title">
          <span>{{ title }}</span>
          <span
            class="names-count-badge"
            :class="{ 'names-count-badge--pending': badgeVariant === 'pending' }"
          >
            {{ items.length }}
          </span>
        </h3>
        <button
          v-if="items.length > 0"
          type="button"
          class="copy-names-btn"
          @click="copyNames"
        >
          {{ copied ? '✓ Copied!' : 'Copy Names' }}
        </button>
      </div>

      <div v-if="filters && filters.length > 0" class="rsvp-filter-pills">
        <button
          v-for="filter in filters"
          :key="filter.value"
          type="button"
          class="filter-pill"
          :class="{ active: activeFilter === filter.value }"
          @click="$emit('update:activeFilter', filter.value)"
        >
          {{ filter.label }} ({{ filter.count }})
        </button>
      </div>

      <p v-if="subtitle" class="names-column-subtitle">{{ subtitle }}</p>
    </div>

    <div v-if="items.length > 0" class="names-table-wrapper">
      <div class="names-table-container custom-scrollbar">
        <table class="names-table">
          <thead>
            <tr>
              <th class="col-index">#</th>
              <th>Guest Name</th>
              <th v-if="showGuestCount" class="col-guests">Party Total</th>
              <th class="col-status">{{ statusColumnLabel }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(guest, idx) in items" :key="guest.id || idx">
              <td class="col-index">{{ idx + 1 }}</td>
              <td class="col-name">
                <div class="mobile-name-wrap">
                  <span class="mobile-row-num">{{ idx + 1 }}.</span>
                  <span class="guest-name-text">{{ guest.name }}</span>
                </div>
                <div class="mobile-sub-meta">
                  <span
                    class="mini-status-badge"
                    :class="`mini-status-${guest.statusVariant || 'pending'}`"
                  >
                    {{ guest.statusText }}
                  </span>
                </div>
              </td>
              <td v-if="showGuestCount" class="col-guests">
                <div v-if="guest.totalGuests > 0" class="party-count-box">
                  <span class="guest-total-num">{{ guest.totalGuests }}</span>
                  <span class="guest-total-unit">{{ guest.totalGuests === 1 ? 'Guest' : 'Guests' }}</span>
                  <span class="guest-total-split">
                    {{ guest.adultsCount || 0 }}A<template v-if="guest.kidsCount > 0"> &bull; {{ guest.kidsCount }}K</template>
                  </span>
                </div>
                <span v-else class="guest-total-zero">&mdash;</span>
              </td>
              <td class="col-status desktop-status-cell">
                <span
                  class="mini-status-badge"
                  :class="`mini-status-${guest.statusVariant || 'pending'}`"
                >
                  {{ guest.statusText }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Integrated Total Summary Footer Bar -->
      <div v-if="showGuestCount" class="names-total-footer">
        <div class="names-total-label">
          <span>Total Guests</span>
          <span class="names-total-sublabel">(including children)</span>
        </div>
        <div class="names-total-metrics">
          <span class="names-total-number">{{ totalGuestsSum }}</span>
          <span class="total-split-badge">{{ totalAdultsSum }} Adults &bull; {{ totalKidsSum }} Kids</span>
        </div>
      </div>
    </div>
    <p v-else class="empty-names-text">{{ emptyText }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  badgeVariant: {
    type: String,
    default: 'success'
  },
  items: {
    type: Array,
    default: () => []
  },
  filters: {
    type: Array,
    default: () => []
  },
  activeFilter: {
    type: String,
    default: ''
  },
  showGuestCount: {
    type: Boolean,
    default: false
  },
  statusColumnLabel: {
    type: String,
    default: 'RSVP'
  },
  emptyText: {
    type: String,
    default: 'No guests found.'
  }
});

defineEmits(['update:activeFilter']);

const copied = ref(false);

const totalGuestsSum = computed(() =>
  props.items.reduce((sum, item) => sum + (Number(item.totalGuests) || 0), 0)
);

const totalAdultsSum = computed(() =>
  props.items.reduce((sum, item) => sum + (Number(item.adultsCount) || 0), 0)
);

const totalKidsSum = computed(() =>
  props.items.reduce((sum, item) => sum + (Number(item.kidsCount) || 0), 0)
);

const copyNames = async () => {
  if (!props.items.length) return;
  try {
    const namesText = props.items.map(item => item.name).join('\n');
    await navigator.clipboard.writeText(namesText);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy names:', err);
  }
};
</script>

<style scoped>
.names-column {
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(197, 168, 128, 0.12);
  border-radius: var(--border-radius);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.names-column-header {
  padding-bottom: 0.9rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.names-column-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.names-column-title {
  font-size: 1.05rem;
  color: var(--color-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.names-column-subtitle {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.58);
  margin: 0.55rem 0 0;
  line-height: 1.4;
}

.names-count-badge {
  background: rgba(76, 175, 80, 0.2);
  color: #81c784;
  border: 1px solid rgba(76, 175, 80, 0.35);
  border-radius: 999px;
  padding: 0.1rem 0.55rem;
  font-size: 0.78rem;
  font-family: var(--font-body);
  font-weight: 600;
}

.names-count-badge--pending {
  background: rgba(255, 183, 77, 0.18);
  color: #ffb74d;
  border-color: rgba(255, 183, 77, 0.35);
}

.copy-names-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(197, 168, 128, 0.28);
  color: var(--color-cream-muted);
  border-radius: var(--border-radius);
  padding: 0.35rem 0.75rem;
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;
}

.copy-names-btn:hover {
  background: rgba(197, 168, 128, 0.18);
  border-color: var(--color-primary);
  color: var(--color-cream);
}

.rsvp-filter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.65rem;
}

.filter-pill {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.65);
  border-radius: 999px;
  padding: 0.3rem 0.75rem;
  font-size: 0.76rem;
  cursor: pointer;
  transition: var(--transition);
}

.filter-pill:hover {
  border-color: rgba(197, 168, 128, 0.4);
  color: var(--color-cream-muted);
}

.filter-pill.active {
  background: rgba(197, 168, 128, 0.2);
  border-color: var(--color-primary);
  color: var(--color-primary);
  font-weight: 600;
}

.names-table-wrapper {
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: var(--border-radius);
  background: rgba(8, 6, 6, 0.35);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.names-table-container {
  max-height: 300px;
  overflow-y: auto;
}

.names-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.names-table thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #161218;
  color: var(--color-primary);
  font-family: var(--font-heading);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.65rem 0.75rem;
  border-bottom: 1px solid rgba(197, 168, 128, 0.2);
}

.names-table tbody tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background-color 0.15s ease;
}

.names-table tbody tr:nth-child(even) {
  background: rgba(255, 255, 255, 0.015);
}

.names-table tbody tr:hover {
  background: rgba(197, 168, 128, 0.08);
}

.names-table tbody tr:last-child {
  border-bottom: none;
}

.names-table td {
  padding: 0.65rem 0.75rem;
  font-size: 0.92rem;
  color: var(--color-cream-muted);
  vertical-align: middle;
}

.names-table .col-index {
  width: 38px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.8rem;
  text-align: center;
  padding-left: 0.45rem;
  padding-right: 0.45rem;
}

.names-table .col-name {
  font-weight: 500;
  color: var(--color-cream);
  word-break: break-word;
}

.mobile-row-num,
.mobile-sub-meta {
  display: none;
}

.names-table .col-guests {
  text-align: center;
  white-space: nowrap;
}

.party-count-box {
  display: inline-flex;
  align-items: baseline;
  gap: 0.3rem;
}

.guest-total-num {
  font-weight: 700;
  color: var(--color-cream);
  font-size: 0.95rem;
}

.guest-total-unit {
  display: none;
}

.guest-total-split {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.guest-total-zero {
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.85rem;
}

.names-table .col-status {
  text-align: right;
  white-space: nowrap;
  width: 1%;
}

/* Integrated Total Footer Bar */
.names-total-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.8rem 0.95rem;
  background: #161218;
  border-top: 1px solid rgba(197, 168, 128, 0.28);
  flex-wrap: wrap;
}

.names-total-label {
  display: flex;
  flex-direction: column;
  font-family: var(--font-heading);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-primary);
}

.names-total-sublabel {
  font-family: var(--font-body);
  font-size: 0.7rem;
  text-transform: none;
  letter-spacing: 0;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 400;
}

.names-total-metrics {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.names-total-number {
  font-family: var(--font-heading);
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--color-accent);
  line-height: 1;
}

.total-split-badge {
  display: inline-block;
  background: rgba(197, 168, 128, 0.14);
  color: var(--color-primary);
  border: 1px solid rgba(197, 168, 128, 0.3);
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 600;
  white-space: nowrap;
}

.mini-status-badge {
  display: inline-block;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.mini-status-yes {
  background: rgba(76, 175, 80, 0.15);
  color: #81c784;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.mini-status-no {
  background: rgba(244, 67, 54, 0.15);
  color: #e57373;
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.mini-status-pending {
  background: rgba(255, 183, 77, 0.14);
  color: #ffb74d;
  border: 1px solid rgba(255, 183, 77, 0.3);
}

.empty-names-text {
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.9rem;
  font-style: italic;
  margin: 0.5rem 0 0;
  text-align: center;
  padding: 1.25rem 0.5rem;
}

/* Mobile Experience Refinements */
@media (max-width: 640px) {
  .names-column {
    padding: 0.9rem;
    background: rgba(0, 0, 0, 0.28);
  }

  .names-column-header {
    padding-bottom: 0.75rem;
    margin-bottom: 0.65rem;
  }

  .names-column-title {
    font-size: 1rem;
  }

  .copy-names-btn {
    padding: 0.35rem 0.65rem;
    font-size: 0.76rem;
  }

  .rsvp-filter-pills {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.35rem;
  }

  .filter-pill {
    text-align: center;
    padding: 0.4rem 0.3rem;
    font-size: 0.75rem;
  }

  /* Streamlined mobile table: hide redundant index & desktop status columns, show clean 2-side rows */
  .names-table thead {
    display: none;
  }

  .names-table .col-index,
  .names-table .desktop-status-cell {
    display: none;
  }

  .names-table tbody tr {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.7rem 0.85rem;
  }

  .names-table td {
    padding: 0;
    border: none;
  }

  .names-table .col-name {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .mobile-name-wrap {
    display: flex;
    align-items: baseline;
    gap: 0.4rem;
  }

  .mobile-row-num {
    display: inline;
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.8rem;
    font-weight: 400;
    flex-shrink: 0;
  }

  .guest-name-text {
    font-size: 0.96rem;
    font-weight: 600;
    color: var(--color-cream);
    line-height: 1.3;
  }

  .mobile-sub-meta {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .mini-status-badge {
    font-size: 0.66rem;
    padding: 0.1rem 0.48rem;
  }

  .names-table .col-guests {
    flex-shrink: 0;
    text-align: right;
  }

  .party-count-box {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.1rem;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(197, 168, 128, 0.18);
    border-radius: 6px;
    padding: 0.35rem 0.6rem;
    min-width: 74px;
  }

  .guest-total-num {
    font-size: 1rem;
    color: var(--color-primary);
    line-height: 1.1;
  }

  .guest-total-unit {
    display: none;
  }

  .guest-total-split {
    font-size: 0.68rem;
    color: rgba(255, 255, 255, 0.6);
  }

  .names-table-container {
    max-height: 320px;
  }

  .names-total-footer {
    padding: 0.75rem 0.85rem;
  }

  .names-total-number {
    font-size: 1.25rem;
  }

  .total-split-badge {
    font-size: 0.7rem;
    padding: 0.18rem 0.5rem;
  }
}
</style>

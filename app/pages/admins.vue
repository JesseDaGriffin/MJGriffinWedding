<template>
  <div class="container section">
    <PageHeader title="Admin Management" />

    <div v-if="!isAdmin" class="text-center">
      <p>You do not have permission to view this page.</p>
    </div>

    <div v-else class="dashboard-grid">
      <!-- Current Admins Card -->
      <GlassCard class="admins-card full-width">
        <div class="card-header-row mb-sm">
          <h2 class="text-primary mb-0">Current Admins</h2>
          <span class="admins-count-badge">{{ adminUsers.length }}</span>
        </div>
        <p class="form-hint mb-md">
          Accounts with full administrative access. Admin accounts are excluded from all RSVP counts and lists.
        </p>

        <div v-if="loadingAdmins" class="admin-list-empty">
          Loading admins...
        </div>
        <ul v-else-if="adminUsers.length > 0" class="admin-list">
          <li v-for="admin in adminUsers" :key="admin.id" class="admin-list-item">
            <div class="admin-item-info">
              <span v-if="admin.name" class="admin-item-name">{{ admin.name }}</span>
              <span class="admin-item-email">{{ admin.email }}</span>
            </div>
            <button
              v-if="admin.email?.toLowerCase() !== 'dagriffinwedding@gmail.com'"
              type="button"
              class="admin-delete-btn"
              :disabled="removingAdminEmail === admin.email"
              title="Remove admin access"
              aria-label="Remove admin access"
              @click="removeAdminUser(admin.email)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                width="16"
                height="16"
              >
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                <path d="M10 11v6"></path>
                <path d="M14 11v6"></path>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
              </svg>
            </button>
          </li>
        </ul>
        <div v-else class="admin-list-empty">
          No admins found.
        </div>
      </GlassCard>

      <!-- Promote User to Admin Card -->
      <GlassCard class="admins-card full-width">
        <h2 class="text-primary mb-sm">Add New Admin</h2>
        <p class="form-hint mb-md">
          Search and select a registered user (who has not RSVP'd "not going") to promote to admin.
        </p>

        <form @submit.prevent="addAdminUser" class="form">
          <div class="user-typeahead" ref="typeaheadRef">
            <label class="form-label" for="admin-user-search">Find User</label>
            <input
              id="admin-user-search"
              v-model="userSearchQuery"
              type="text"
              class="form-input"
              :class="{ 'form-input--selected': !!newAdminEmail }"
              placeholder="Search by name or email..."
              autocomplete="off"
              required
              @focus="isTypeaheadOpen = true"
              @input="handleSearchInput"
              @keydown.down.prevent="moveHighlight(1)"
              @keydown.up.prevent="moveHighlight(-1)"
              @keydown.enter="handleEnterKey"
              @keydown.esc="isTypeaheadOpen = false"
            />

            <div
              v-if="isTypeaheadOpen"
              class="typeahead-dropdown custom-scrollbar"
            >
              <div v-if="loadingAdmins" class="typeahead-empty">
                Loading users...
              </div>
              <template v-else-if="filteredEligibleUsers.length > 0">
                <button
                  v-for="(candidate, idx) in filteredEligibleUsers"
                  :key="candidate.id"
                  type="button"
                  class="typeahead-option"
                  :class="{ active: idx === highlightedIndex }"
                  @mousedown.prevent="selectCandidate(candidate)"
                  @mouseenter="highlightedIndex = idx"
                >
                  <span v-if="candidate.name" class="option-name">{{ candidate.name }}</span>
                  <span class="option-email">{{ candidate.email }}</span>
                </button>
              </template>
              <div v-else class="typeahead-empty">
                No matching eligible users found.
              </div>
            </div>
          </div>

          <AlertMessage v-if="adminSuccessMsg" type="success" :message="adminSuccessMsg" />
          <AlertMessage v-if="adminErrorMsg" type="error" :message="adminErrorMsg" />

          <AppButton
            type="submit"
            block
            :loading="addingAdmin"
            :disabled="!resolvedAdminEmail"
            text="Add User as Admin"
          />
        </form>
      </GlassCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { isAdminUser } from '../../utils/admin';

const user = useSupabaseUser();
const isAdmin = ref(false);

const newAdminEmail = ref('');
const userSearchQuery = ref('');
const isTypeaheadOpen = ref(false);
const highlightedIndex = ref(0);
const typeaheadRef = ref(null);
const addingAdmin = ref(false);
const removingAdminEmail = ref('');
const adminSuccessMsg = ref('');
const adminErrorMsg = ref('');
const adminUsers = ref([]);
const eligibleUsers = ref([]);
const loadingAdmins = ref(false);

const filteredEligibleUsers = computed(() => {
  const q = userSearchQuery.value.trim().toLowerCase();
  if (!q) return eligibleUsers.value;
  return eligibleUsers.value.filter(
    u =>
      u.email.toLowerCase().includes(q) ||
      (u.name && u.name.toLowerCase().includes(q))
  );
});

const resolvedAdminEmail = computed(() => {
  if (newAdminEmail.value) return newAdminEmail.value;
  const q = userSearchQuery.value.trim().toLowerCase();
  if (!q) return '';
  const exactEmailMatch = eligibleUsers.value.find(
    u => u.email.toLowerCase() === q
  );
  return exactEmailMatch ? exactEmailMatch.email : '';
});

const handleSearchInput = () => {
  newAdminEmail.value = '';
  isTypeaheadOpen.value = true;
  highlightedIndex.value = 0;
};

const selectCandidate = (candidate) => {
  newAdminEmail.value = candidate.email;
  userSearchQuery.value = candidate.name
    ? `${candidate.name} (${candidate.email})`
    : candidate.email;
  isTypeaheadOpen.value = false;
};

const moveHighlight = (delta) => {
  if (!isTypeaheadOpen.value) {
    isTypeaheadOpen.value = true;
    return;
  }
  const len = filteredEligibleUsers.value.length;
  if (!len) return;
  highlightedIndex.value = (highlightedIndex.value + delta + len) % len;
};

const handleEnterKey = (event) => {
  if (isTypeaheadOpen.value && filteredEligibleUsers.value.length > 0) {
    const candidate = filteredEligibleUsers.value[highlightedIndex.value] || filteredEligibleUsers.value[0];
    if (candidate && !newAdminEmail.value) {
      event.preventDefault();
      selectCandidate(candidate);
    }
  }
};

const handleClickOutside = (event) => {
  if (typeaheadRef.value && !typeaheadRef.value.contains(event.target)) {
    isTypeaheadOpen.value = false;
  }
};

const fetchAdmins = async () => {
  loadingAdmins.value = true;
  try {
    const res = await $fetch('/api/admin/admins');
    if (res?.success) {
      adminUsers.value = res.admins || [];
      eligibleUsers.value = res.eligibleUsers || [];
    }
  } catch (err) {
    console.error('Error fetching admins:', err.message);
  } finally {
    loadingAdmins.value = false;
  }
};

onMounted(async () => {
  document.addEventListener('click', handleClickOutside);
  if (isAdminUser(user.value)) {
    isAdmin.value = true;
    await fetchAdmins();
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const addAdminUser = async () => {
  const targetEmail = resolvedAdminEmail.value;
  if (!targetEmail) return;
  addingAdmin.value = true;
  adminSuccessMsg.value = '';
  adminErrorMsg.value = '';

  try {
    const res = await $fetch('/api/admin/set-admin', {
      method: 'POST',
      body: {
        email: targetEmail,
        isAdmin: true
      }
    });

    if (!res.success) {
      throw new Error(res.error || 'Failed to add admin user.');
    }

    adminSuccessMsg.value = res.message || 'User added as admin!';
    newAdminEmail.value = '';
    userSearchQuery.value = '';
    isTypeaheadOpen.value = false;
    await fetchAdmins();
  } catch (err) {
    adminErrorMsg.value = err.message || 'Failed to add admin user.';
  } finally {
    addingAdmin.value = false;
  }
};

const removeAdminUser = async (email) => {
  if (!email || email.toLowerCase() === 'dagriffinwedding@gmail.com') return;
  removingAdminEmail.value = email;
  adminSuccessMsg.value = '';
  adminErrorMsg.value = '';

  try {
    const res = await $fetch('/api/admin/set-admin', {
      method: 'POST',
      body: {
        email,
        isAdmin: false
      }
    });

    if (!res.success) {
      throw new Error(res.error || 'Failed to remove admin access.');
    }

    adminSuccessMsg.value = res.message || `Removed admin access for ${email}.`;
    await fetchAdmins();
  } catch (err) {
    adminErrorMsg.value = err.message || 'Failed to remove admin access.';
  } finally {
    removingAdminEmail.value = '';
  }
};
</script>

<style scoped>
.text-center {
  text-align: center;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-sm {
  margin-bottom: var(--spacing-sm);
}

.mb-md {
  margin-bottom: var(--spacing-md);
}

.text-primary {
  color: var(--color-primary);
}

.full-width {
  grid-column: 1 / -1;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-md);
  max-width: 700px;
  margin: 0 auto;
}

.admins-card {
  padding: var(--spacing-md);
}

.card-header-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.admins-count-badge {
  background: rgba(197, 168, 128, 0.18);
  color: var(--color-primary);
  border: 1px solid rgba(197, 168, 128, 0.35);
  border-radius: 999px;
  padding: 0.1rem 0.6rem;
  font-size: 0.82rem;
  font-weight: 600;
}

.form-hint {
  color: var(--color-cream-muted);
  font-size: 0.9rem;
  display: block;
}

.admin-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.admin-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--border-radius);
  font-size: 0.92rem;
}

.admin-item-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.admin-item-name {
  font-weight: 600;
  color: var(--color-cream);
}

.admin-item-email {
  color: var(--color-cream-muted);
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.admin-delete-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid rgba(255, 107, 107, 0.25);
  color: #ff6b6b;
  border-radius: 6px;
  padding: 0.4rem;
  cursor: pointer;
  flex-shrink: 0;
  transition: var(--transition);
}

.admin-delete-btn:hover:not(:disabled) {
  background: rgba(255, 107, 107, 0.14);
  border-color: #ff6b6b;
}

.admin-delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.admin-list-empty {
  font-size: 0.9rem;
  color: var(--color-cream-muted);
  font-style: italic;
  text-align: center;
  padding: 1rem 0;
}

.user-typeahead {
  position: relative;
  margin-bottom: var(--spacing-md);
}

.user-typeahead .form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.user-typeahead .form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius);
  background-color: rgba(0, 0, 0, 0.2);
  color: var(--color-text);
  font-family: var(--font-body);
  transition: var(--transition);
}

.user-typeahead .form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  background-color: rgba(0, 0, 0, 0.4);
}

.typeahead-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 50;
  max-height: 220px;
  overflow-y: auto;
  background: #181414;
  border: 1px solid rgba(197, 168, 128, 0.35);
  border-radius: var(--border-radius);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.75);
}

.typeahead-option {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.65rem 0.85rem;
  background: none;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: var(--color-cream-muted);
  font-family: var(--font-body);
  font-size: 0.88rem;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease;
}

.typeahead-option:last-child {
  border-bottom: none;
}

.typeahead-option:hover,
.typeahead-option.active {
  background: rgba(197, 168, 128, 0.16);
}

.option-name {
  font-weight: 600;
  color: var(--color-cream);
}

.option-email {
  color: var(--color-cream-muted);
  font-size: 0.82rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.typeahead-empty {
  padding: 0.75rem 0.85rem;
  font-size: 0.85rem;
  color: var(--color-cream-muted);
  font-style: italic;
  text-align: center;
}

@media (max-width: 768px) {
  .admins-card {
    padding: 1.25rem 1rem;
  }

  .admin-list-item {
    padding: 0.65rem 0.75rem;
    gap: 0.5rem;
  }

  .admin-item-name,
  .option-name {
    font-size: 0.9rem;
  }

  .admin-item-email,
  .option-email {
    font-size: clamp(0.66rem, 3vw, 0.8rem);
  }

  .typeahead-option {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.15rem;
    padding: 0.6rem 0.75rem;
  }

  .user-typeahead .form-input--selected {
    font-size: clamp(0.72rem, 3.2vw, 0.88rem);
  }
}

@media (max-width: 480px) {
  .admins-card {
    padding: 1rem 0.75rem;
  }
}
</style>

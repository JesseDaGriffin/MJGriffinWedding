<template>
  <div class="container section">
    <PageHeader title="Admin Announcements" />
    
    <div v-if="!isAdmin" class="text-center">
      <p>You do not have permission to view this page.</p>
    </div>

    <div v-else class="dashboard-grid">
      <!-- Compose Announcement -->
      <GlassCard class="compose-card full-width">
        <h2 class="mb-sm text-primary">Compose Announcement</h2>
        <p class="mb-md">This email will be sent via BCC to all registered users in the database.</p>
        
        <form @submit.prevent="sendAnnouncement" class="form">
          <FormGroup 
            v-model="form.subject" 
            label="Subject" 
            placeholder="e.g., Update on the Wedding Schedule!" 
            required 
          />

          <FormGroup 
            v-model="form.message" 
            label="Message (HTML is supported)" 
            as="textarea" 
            rows="8" 
            placeholder="Write your announcement here..." 
            required 
          />

          <AlertMessage v-if="successMsg" type="success" :message="successMsg" />
          <AlertMessage v-if="errorMsg" type="error" :message="errorMsg" />

          <div class="recipients-section mb-md mt-sm">
            <div class="toggle-recipients" @click="showRecipients = !showRecipients">
              <span>{{ recipientEmails.length }} Recipients Found</span>
              <span class="toggle-icon">{{ showRecipients ? '▲' : '▼' }}</span>
            </div>
            
            <div v-if="showRecipients" class="recipients-list">
              <div v-if="loadingUsers" class="loading-text">Loading users...</div>
              <ul v-else-if="recipientEmails.length > 0">
                <li v-for="email in recipientEmails" :key="email">{{ email }}</li>
              </ul>
              <div v-else class="empty-text">No registered users found.</div>
            </div>
          </div>

          <AppButton 
            type="submit" 
            class="mt-sm" 
            :loading="sending" 
            :disabled="recipientEmails.length === 0 || loadingUsers"
            text="Send Announcement to All Users" 
            loading-text="Sending..." 
          />
        </form>
      </GlassCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const isAdmin = ref(false);

const loadingUsers = ref(true);
const sending = ref(false);
const errorMsg = ref('');
const successMsg = ref('');
const recipientEmails = ref([]);
const showRecipients = ref(false);

const form = ref({
  subject: '',
  message: ''
});

onMounted(async () => {
  if (user.value && (user.value.email?.toLowerCase() === 'dagriffinwedding@gmail.com' || localStorage.getItem('wedding_admin') === 'true')) {
    isAdmin.value = true;
    await fetchUsers();
  }
});

const fetchUsers = async () => {
  try {
    const response = await $fetch('/api/admin/users');
    if (response.success) {
      recipientEmails.value = response.emails;
    } else {
      console.error('Failed to load users:', response.error);
    }
  } catch (err) {
    console.error('Exception fetching users:', err.message);
  } finally {
    loadingUsers.value = false;
  }
};

const sendAnnouncement = async () => {
  errorMsg.value = '';
  successMsg.value = '';
  sending.value = true;

  try {
    const response = await $fetch('/api/send-announcement', {
      method: 'POST',
      body: {
        subject: form.value.subject,
        message: form.value.message.replace(/\n/g, '<br>') // Convert newlines to HTML breaks
      }
    });

    if (response.success) {
      successMsg.value = 'Announcement sent successfully!';
      form.value.subject = '';
      form.value.message = '';
    } else {
      throw new Error(response.error || 'Unknown error occurred');
    }
  } catch (error) {
    errorMsg.value = error.message || 'Failed to send announcement.';
  } finally {
    sending.value = false;
  }
};
</script>

<style scoped>
.text-center { text-align: center; }
.mb-sm { margin-bottom: var(--spacing-sm); }
.mb-md { margin-bottom: var(--spacing-md); }
.mt-sm { margin-top: var(--spacing-sm); }
.text-primary { color: var(--color-primary); }

.full-width {
  grid-column: 1 / -1;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-md);
  max-width: 800px;
  margin: 0 auto;
}

.textarea {
  resize: vertical;
  font-family: inherit;
}

.recipients-section {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: var(--border-radius);
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow: hidden;
}

.toggle-recipients {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-weight: 600;
  color: var(--color-primary);
  user-select: none;
  transition: background-color 0.2s ease;
}

.toggle-recipients:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.toggle-icon {
  font-size: 0.8rem;
}

.recipients-list {
  padding: 0 16px 16px;
  max-height: 200px;
  overflow-y: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: 8px;
  padding-top: 16px;
}

.recipients-list ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.recipients-list li {
  font-size: 0.9rem;
  color: #eaeaea;
  padding: 6px 10px;
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 4px;
}

.loading-text, .empty-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
  text-align: center;
  padding: 10px 0;
}
</style>

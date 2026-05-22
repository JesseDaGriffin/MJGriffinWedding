<template>
  <div class="container section">
    <h1 class="text-center mb-md">Admin Announcements</h1>
    
    <div v-if="!isAdmin" class="text-center">
      <p>You do not have permission to view this page.</p>
    </div>

    <div v-else class="dashboard-grid">
      <!-- Compose Announcement -->
      <GlassCard class="compose-card full-width">
        <h2 class="mb-sm text-primary">Compose Announcement</h2>
        <p class="mb-md">This email will be sent via BCC to all registered users in the database.</p>
        
        <form @submit.prevent="sendAnnouncement" class="form">
          <div class="form-group">
            <label class="form-label">Subject</label>
            <input 
              v-model="form.subject" 
              type="text" 
              class="form-input" 
              placeholder="e.g., Update on the Wedding Schedule!"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Message (HTML is supported)</label>
            <textarea 
              v-model="form.message" 
              class="form-input textarea" 
              rows="8"
              placeholder="Write your announcement here..."
              required
            ></textarea>
          </div>

          <p v-if="successMsg" class="success-msg">{{ successMsg }}</p>
          <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

          <button type="submit" class="btn mt-sm" :disabled="sending || loadingUsers">
            {{ sending ? 'Sending...' : `Send to ${userCount} Users` }}
          </button>
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
const userCount = ref(0);
const recipientEmails = ref([]);

const form = ref({
  subject: '',
  message: ''
});

onMounted(async () => {
  if (user.value && (user.value.email?.toLowerCase() === 'dagriffinwedding@gmail.com' || localStorage.getItem('wedding_admin') === 'true')) {
    isAdmin.value = true;
    await fetchUsers();
  } else {
    loadingUsers.value = false;
  }
});

const fetchUsers = async () => {
  try {
    // We fetch emails from the RSVP table or we can just fetch auth.users if we have access.
    // Assuming profiles doesn't store emails, but rsvps does via auth.users relation.
    // Let's use the same query as in responses.vue to get all users.
    const { data, error } = await supabase
      .from('rsvps')
      .select('auth.users(email)');

    if (error) throw error;
    
    // Filter out missing emails and create unique list
    const emails = [...new Set(
      data.map(r => r.users?.email).filter(Boolean)
    )];

    recipientEmails.value = emails;
    userCount.value = emails.length;
  } catch (error) {
    console.error('Error fetching users:', error.message);
    errorMsg.value = 'Failed to load user list.';
  } finally {
    loadingUsers.value = false;
  }
};

const sendAnnouncement = async () => {
  errorMsg.value = '';
  successMsg.value = '';
  sending.value = true;

  if (recipientEmails.value.length === 0) {
    errorMsg.value = 'No users found to send email to.';
    sending.value = false;
    return;
  }

  try {
    const response = await $fetch('/api/send-announcement', {
      method: 'POST',
      body: {
        emails: recipientEmails.value,
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

.error-msg {
  color: #ff6b6b;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.success-msg {
  color: #4CAF50;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}
</style>

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
            class="mb-sm"
          />

          <div class="link-buttons mb-md">
            <p class="text-sm text-primary mb-sm">Insert Link to Page:</p>
            <div class="button-group">
              <button 
                v-for="route in siteRoutes" 
                :key="route.path"
                type="button"
                class="route-btn"
                @click="insertLink(route)"
              >
                {{ route.name }}
              </button>
            </div>
          </div>

          <div class="preview-section mb-md" v-if="form.subject || form.message">
            <h3 class="mb-sm text-primary">Email Preview</h3>
            <div class="preview-subject-bar mb-sm"><strong>Subject:</strong> {{ form.subject || '(No subject)' }}</div>
            <EmailPreview :messageHtml="previewMessage" />
          </div>

          <AlertMessage v-if="successMsg" type="success" :message="successMsg" />
          <AlertMessage v-if="errorMsg" type="error" :message="errorMsg" />

          <AppButton 
            type="submit" 
            class="mt-sm mb-md" 
            :loading="sending" 
            :disabled="recipientEmails.length === 0 || loadingUsers"
            text="Send Announcement to All Users" 
            loading-text="Sending..." 
          />

          <div class="recipients-section">
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
        </form>
      </GlassCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();
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
  currentGreeting.value = greetings[Math.floor(Math.random() * greetings.length)];
  currentSignOff.value = signOffs[Math.floor(Math.random() * signOffs.length)];

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

const greetings = [
  "Hello friends and family!",
  "Hi everyone!",
  "Greetings everyone!",
  "Hey everyone!",
  "Dear loved ones,"
];

const signOffs = [
  "With love,\nMaddie & Jesse",
  "Warmly,\nMaddie & Jesse",
  "Can't wait to see you all!\nMaddie & Jesse",
  "Best,\nMaddie & Jesse",
  "Thanks,\nMaddie & Jesse"
];

const currentGreeting = ref('');
const currentSignOff = ref('');

const siteRoutes = computed(() => {
  return router.getRoutes().filter(route => 
    route.path && 
    !route.path.includes(':') && 
    route.name && 
    !route.path.startsWith('/api') &&
    !route.path.includes('admin') &&
    !route.path.includes('login') &&
    !route.path.includes('account') &&
    !route.path.includes('responses') &&
    !route.path.includes('announcements')
  ).map(route => {
    let name = String(route.name).replace(/-/g, ' ');
    // capitalize words
    name = name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    if (name.toLowerCase() === 'index') name = 'Home';
    return { name, path: route.path };
  });
});

const insertLink = async (route) => {
  const origin = window.location.origin;
  const linkHtml = `<a href="${origin}${route.path}" style="color: #6b8e23; text-decoration: none; font-weight: bold;">${route.name}</a>`;
  const msg = form.value.message;
  form.value.message += (msg && !msg.endsWith(' ') && !msg.endsWith('\n') ? ' ' : '') + linkHtml;
  
  await nextTick();
  const textarea = document.querySelector('textarea');
  if (textarea) {
    textarea.focus();
    // Optional: move cursor to the end of the newly inserted text
    textarea.selectionStart = textarea.value.length;
    textarea.selectionEnd = textarea.value.length;
  }
};

const previewMessage = computed(() => {
  const messageHtml = form.value.message.replace(/\n/g, '<br>');
  return `${currentGreeting.value}<br><br>${messageHtml}<br><br>${currentSignOff.value}`.replace(/\n/g, '<br>');
});

const sendAnnouncement = async () => {
  errorMsg.value = '';
  successMsg.value = '';
  sending.value = true;

  try {
    const response = await $fetch('/api/send-announcement', {
      method: 'POST',
      body: {
        subject: form.value.subject,
        message: previewMessage.value
      }
    });

    if (response.success) {
      successMsg.value = 'Announcement sent successfully!';
      form.value.subject = '';
      form.value.message = '';
      currentGreeting.value = greetings[Math.floor(Math.random() * greetings.length)];
      currentSignOff.value = signOffs[Math.floor(Math.random() * signOffs.length)];
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

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.route-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--color-text);
  padding: 6px 12px;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.route-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: var(--color-primary);
}

.text-sm {
  font-size: 0.85rem;
}

.preview-section {
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: var(--border-radius);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  padding: 24px;
}

.preview-subject-bar {
  background: rgba(255, 255, 255, 0.05);
  padding: 10px 16px;
  border-radius: 4px;
  border-left: 3px solid var(--color-primary);
  font-size: 0.95rem;
  color: var(--color-text);
  margin-bottom: 16px;
}
</style>

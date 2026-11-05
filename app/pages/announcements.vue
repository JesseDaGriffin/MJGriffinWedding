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
        <p class="mb-md">This email will be sent via BCC to subscribed users who have not declined their RSVP, or to a specific group below.</p>
        
        <form ref="formRef" @submit.prevent="sendAnnouncement('all')" class="form">
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

          <div class="send-actions mt-sm mb-md">
            <AppButton 
              type="submit" 
              block
              :loading="sendingTarget === 'all'" 
              :disabled="sending || recipientEmails.length === 0 || loadingUsers"
              :text="`Send to All Subscribed (${recipientEmails.length})`" 
              loading-text="Sending..." 
            />

            <div class="sub-send-buttons">
              <AppButton 
                type="button" 
                variant="secondary"
                class="sub-send-btn"
                :loading="sendingTarget === 'attending'" 
                :disabled="sending || attendingEmails.length === 0 || loadingUsers"
                :text="`Send Only to Attending (${attendingEmails.length})`" 
                loading-text="Sending..." 
                @click="handleSubSend('attending')"
              />
              <AppButton 
                type="button" 
                variant="secondary"
                class="sub-send-btn"
                :loading="sendingTarget === 'not_rsvpd'" 
                :disabled="sending || notRsvpdEmails.length === 0 || loadingUsers"
                :text="`Send Only to Not RSVP'd (${notRsvpdEmails.length})`" 
                loading-text="Sending..." 
                @click="handleSubSend('not_rsvpd')"
              />
            </div>
          </div>

          <div class="recipients-section">
            <div class="toggle-recipients" @click="showRecipients = !showRecipients">
              <span>
                {{ recipientEmails.length }} Eligible Subscribed Recipients
                <span v-if="optedOutCount > 0 || declinedCount > 0" class="opted-out-note">
                  ({{ [
                    optedOutCount > 0 ? `${optedOutCount} opted out` : '',
                    declinedCount > 0 ? `${declinedCount} declined` : ''
                  ].filter(Boolean).join(', ') }})
                </span>
              </span>
              <span class="toggle-icon">{{ showRecipients ? '▲' : '▼' }}</span>
            </div>
            
            <div v-if="showRecipients" class="recipients-list">
              <div class="recipient-filter-tabs mb-sm">
                <button
                  type="button"
                  class="recipient-tab-btn"
                  :class="{ active: recipientViewFilter === 'all' }"
                  @click="recipientViewFilter = 'all'"
                >
                  All Subscribed ({{ recipientEmails.length }})
                </button>
                <button
                  type="button"
                  class="recipient-tab-btn"
                  :class="{ active: recipientViewFilter === 'attending' }"
                  @click="recipientViewFilter = 'attending'"
                >
                  Attending ({{ attendingEmails.length }})
                </button>
                <button
                  type="button"
                  class="recipient-tab-btn"
                  :class="{ active: recipientViewFilter === 'not_rsvpd' }"
                  @click="recipientViewFilter = 'not_rsvpd'"
                >
                  Not RSVP'd ({{ notRsvpdEmails.length }})
                </button>
              </div>

              <div v-if="loadingUsers" class="loading-text">Loading users...</div>
              <ul v-else-if="displayedRecipientEmails.length > 0">
                <li v-for="email in displayedRecipientEmails" :key="email">{{ email }}</li>
              </ul>
              <div v-else class="empty-text">No matching subscribed users found.</div>
            </div>
          </div>
        </form>
      </GlassCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { isAdminUser } from '../../utils/admin';

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();
const isAdmin = ref(false);

const loadingUsers = ref(true);
const sendingTarget = ref(null);
const sending = computed(() => sendingTarget.value !== null);
const formRef = ref(null);
const errorMsg = ref('');
const successMsg = ref('');
const recipientEmails = ref([]);
const attendingEmails = ref([]);
const notRsvpdEmails = ref([]);
const optedOutCount = ref(0);
const declinedCount = ref(0);
const showRecipients = ref(false);
const recipientViewFilter = ref('all');

const displayedRecipientEmails = computed(() => {
  if (recipientViewFilter.value === 'attending') return attendingEmails.value;
  if (recipientViewFilter.value === 'not_rsvpd') return notRsvpdEmails.value;
  return recipientEmails.value;
});

const form = ref({
  subject: '',
  message: ''
});

onMounted(async () => {
  currentGreeting.value = greetings[Math.floor(Math.random() * greetings.length)];
  currentSignOff.value = signOffs[Math.floor(Math.random() * signOffs.length)];

  if (user.value && (isAdminUser(user.value) || localStorage.getItem('wedding_admin') === 'true')) {
    isAdmin.value = true;
    await fetchUsers();
  }
});

const fetchUsers = async () => {
  try {
    const response = await $fetch('/api/admin/users');
    if (response.success) {
      recipientEmails.value = response.emails || [];
      attendingEmails.value = response.attendingEmails || [];
      notRsvpdEmails.value = response.notRsvpdEmails || [];
      optedOutCount.value = response.optedOutCount || 0;
      declinedCount.value = response.declinedCount || 0;
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
    !route.path.includes('announcements') &&
    !route.path.includes('emails') &&
    !route.path.includes('questionnaires') &&
    !route.path.includes('unsubscribe') &&
    !route.path.includes('reset-password')
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

const handleSubSend = (target) => {
  if (formRef.value && !formRef.value.reportValidity()) {
    return;
  }
  sendAnnouncement(target);
};

const sendAnnouncement = async (target = 'all') => {
  errorMsg.value = '';
  successMsg.value = '';
  sendingTarget.value = target;

  const targetLabels = {
    all: 'all subscribed users',
    attending: 'attending guests',
    not_rsvpd: "users who haven't RSVP'd",
  };

  try {
    const response = await $fetch('/api/send-announcement', {
      method: 'POST',
      body: {
        subject: form.value.subject,
        message: previewMessage.value,
        target,
      }
    });

    if (response.success) {
      const label = targetLabels[target] || 'recipients';
      successMsg.value = `Announcement sent successfully to ${label}!`;
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
    sendingTarget.value = null;
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

.send-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sub-send-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.sub-send-btn {
  width: 100%;
  font-size: 0.8rem;
  padding: 0.7rem 1rem;
}

@media (max-width: 640px) {
  .sub-send-buttons {
    grid-template-columns: 1fr;
  }
}

.recipient-filter-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.recipient-tab-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--color-cream-muted);
  padding: 5px 10px;
  border-radius: var(--border-radius);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.recipient-tab-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: var(--color-cream);
}

.recipient-tab-btn.active {
  background: rgba(197, 168, 128, 0.2);
  border-color: var(--color-primary);
  color: var(--color-primary);
  font-weight: 600;
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

.opted-out-note {
  font-weight: 400;
  font-size: 0.85rem;
  color: var(--color-cream-muted);
  margin-left: 6px;
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
  color: var(--color-cream-muted);
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

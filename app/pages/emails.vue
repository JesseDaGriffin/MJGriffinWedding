<template>
  <div class="container section">
    <h1 class="text-center mb-md">Email Templates Dashboard</h1>

    <div v-if="!isAdmin" class="text-center">
      <p>You do not have permission to view this page.</p>
    </div>

    <div v-else class="dashboard-layout">
      <!-- Left sidebar: Selectors and live inputs -->
      <div class="sidebar">
        <!-- Template selector -->
        <GlassCard class="mb-md nav-card">
          <h2 class="card-title text-primary mb-sm">Select Email</h2>
          <div class="template-buttons">
            <button
              v-for="t in templates"
              :key="t.id"
              class="template-btn"
              :class="{ active: selectedTemplateId === t.id }"
              @click="selectTemplate(t.id)"
            >
              <span class="btn-name">{{ t.name }}</span>
              <span class="btn-desc">{{ t.description }}</span>
            </button>
          </div>
        </GlassCard>

        <!-- Live Parameters Editor -->
        <GlassCard class="editor-card">
          <h2 class="card-title text-primary mb-sm">Live Parameters</h2>
          <p class="mb-md text-muted text-sm">Edit parameters below to preview changes in the template.</p>
          
          <div class="form">
            <div v-for="field in currentTemplate.fields" :key="field.key" class="form-group">
              <!-- Render field if condition matches -->
              <div v-if="checkCondition(field)">
                <label class="form-label">{{ field.label }}</label>

                <!-- Text Input -->
                <input
                  v-if="field.type === 'text'"
                  v-model="formData[field.id]"
                  type="text"
                  class="form-input"
                />

                <!-- Textarea -->
                <textarea
                  v-else-if="field.type === 'textarea'"
                  v-model="formData[field.id]"
                  rows="5"
                  class="form-textarea"
                ></textarea>

                <!-- Checkbox -->
                <div v-else-if="field.type === 'checkbox'" class="checkbox-container">
                  <input
                    v-model="formData[field.id]"
                    type="checkbox"
                    :id="field.id"
                    class="form-checkbox"
                  />
                  <label :for="field.id" class="checkbox-label">Enabled</label>
                </div>

                <!-- Number -->
                <input
                  v-else-if="field.type === 'number'"
                  v-model.number="formData[field.id]"
                  type="number"
                  min="0"
                  class="form-input"
                  style="max-width: 100px; text-align: left;"
                />
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      <!-- Right main area: Live Visual Preview / HTML code -->
      <div class="main-preview">
        <GlassCard class="preview-card">
          <div class="preview-header">
            <!-- Tabs: Preview vs Source -->
            <div class="preview-tabs">
              <button
                class="tab-btn"
                :class="{ active: activeTab === 'preview' }"
                @click="activeTab = 'preview'"
              >
                Visual Preview
              </button>
              <button
                class="tab-btn"
                :class="{ active: activeTab === 'source' }"
                @click="activeTab = 'source'"
              >
                HTML Source
              </button>
            </div>

            <!-- Options (Viewport size toggles / Copy button) -->
            <div class="preview-actions">
              <!-- Viewport width toggle (only in visual preview tab) -->
              <div v-if="activeTab === 'preview'" class="viewport-toggle">
                <button
                  class="viewport-btn"
                  :class="{ active: viewportMode === 'desktop' }"
                  @click="viewportMode = 'desktop'"
                  title="Desktop View"
                >
                  Desktop
                </button>
                <button
                  class="viewport-btn"
                  :class="{ active: viewportMode === 'mobile' }"
                  @click="viewportMode = 'mobile'"
                  title="Mobile View"
                >
                  Mobile
                </button>
              </div>

              <!-- Copy to clipboard button -->
              <button
                class="btn-copy"
                @click="copyToClipboard"
                :class="{ copied: copied }"
              >
                {{ copied ? 'Copied!' : 'Copy Code' }}
              </button>
            </div>
          </div>

          <!-- Preview content area -->
          <div class="preview-content">
            <!-- Visual Viewport Iframe -->
            <div
              v-show="activeTab === 'preview'"
              class="iframe-wrapper"
              :class="viewportMode"
            >
              <iframe
                :srcdoc="compiledHtml"
                class="email-iframe"
                frameborder="0"
                sandbox="allow-same-origin"
              ></iframe>
            </div>

            <!-- HTML Source Code View -->
            <div v-show="activeTab === 'source'" class="code-view">
              <pre><code>{{ compiledHtml }}</code></pre>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import {
  getWelcomeEmailTemplate,
  getAnnouncementEmailTemplate,
  getContactEmailTemplate,
  getRsvpEmailTemplate,
  getQuestionnaireEmailTemplate,
  getSupabaseConfirmEmailTemplate
} from '../../utils/emailTemplates';

const user = useSupabaseUser();
const isAdmin = ref(false);

onMounted(() => {
  if (
    user.value &&
    (user.value.email?.toLowerCase() === 'dagriffinwedding@gmail.com' ||
      localStorage.getItem('wedding_admin') === 'true')
  ) {
    isAdmin.value = true;
  }
});

const selectedTemplateId = ref('welcome');
const activeTab = ref('preview');
const viewportMode = ref('desktop');
const copied = ref(false);

// Form editor input models
const formData = ref({
  // Welcome fields
  welcome_firstName: 'Maddie',

  // Announcement fields
  announcement_messageHtml: '<p>Hi everyone!</p>\n<p>We are thrilled to share that the wedding venue details have been updated. We have arranged discount rooms at the nearby hotels. Please visit the Travel page of our website to book your stay!</p>\n<p>With love,<br>Maddie & Jesse</p>',

  // Contact fields
  contact_name: 'John Doe',
  contact_email: 'johndoe@example.com',
  contact_subject: 'Allergy Question',
  contact_message: 'Hi Maddie and Jesse,\n\nI was reviewing the dinner selections and wanted to inquire if there are gluten-free alternatives for the main course? Let me know.\n\nBest,\nJohn',

  // RSVP fields
  rsvp_name: 'Jane Smith',
  rsvp_email: 'janesmith@example.com',
  rsvp_attending: true,
  rsvp_ceremonyAttending: true,
  rsvp_ceremonyAdults: 2,
  rsvp_ceremonyKids: 1,
  rsvp_dinnerAttending: true,
  rsvp_dinnerAdults: 2,
  rsvp_dinnerKids: 0,
  rsvp_afterpartyAttending: true,
  rsvp_afterpartyAdults: 2,

  // Questionnaire fields
  questionnaire_name: 'Robert Jones',
  questionnaire_email: 'robert@example.com',
  questionnaire_arrivalDate: '2027-03-12',
  questionnaire_departureDate: '2027-03-15',
  questionnaire_activities: 'Welcome Dinner, Wedding Ceremony, Sunday Brunch',
  questionnaire_suggestions: 'We would love to request some classic rock songs during the reception. Thank you!',

  // Supabase fields
  supabase_confirmationUrl: '{{ .ConfirmationURL }}'
});

// Definitions for each template config
const templates = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    description: 'Sent to guests automatically upon registration.',
    fields: [
      { id: 'welcome_firstName', label: 'Guest First Name', type: 'text' }
    ],
    getHtml: (data) => getWelcomeEmailTemplate(data.welcome_firstName)
  },
  {
    id: 'announcement',
    name: 'Announcements',
    description: 'Custom announcements broadcasted to all guests.',
    fields: [
      { id: 'announcement_messageHtml', label: 'Message Body (HTML support)', type: 'textarea' }
    ],
    getHtml: (data) => getAnnouncementEmailTemplate(data.announcement_messageHtml)
  },
  {
    id: 'contact',
    name: 'Contact Submission',
    description: 'Notification to admin on guest inquiries.',
    fields: [
      { id: 'contact_name', label: 'Sender Name', type: 'text' },
      { id: 'contact_email', label: 'Sender Email', type: 'text' },
      { id: 'contact_subject', label: 'Email Subject', type: 'text' },
      { id: 'contact_message', label: 'Message Body', type: 'textarea' }
    ],
    getHtml: (data) =>
      getContactEmailTemplate(
        data.contact_name,
        data.contact_email,
        data.contact_subject,
        data.contact_message
      )
  },
  {
    id: 'rsvp',
    name: 'RSVP Notification',
    description: 'Notification to admin on new guest RSVPs.',
    fields: [
      { id: 'rsvp_name', label: 'Guest Name', type: 'text' },
      { id: 'rsvp_email', label: 'Guest Email', type: 'text' },
      { id: 'rsvp_attending', label: 'Attending Status', type: 'checkbox' },
      {
        id: 'rsvp_ceremonyAttending',
        label: 'Attending Ceremony',
        type: 'checkbox',
        condition: 'rsvp_attending'
      },
      {
        id: 'rsvp_ceremonyAdults',
        label: 'Ceremony Adults count',
        type: 'number',
        condition: 'rsvp_attending && rsvp_ceremonyAttending'
      },
      {
        id: 'rsvp_ceremonyKids',
        label: 'Ceremony Kids count',
        type: 'number',
        condition: 'rsvp_attending && rsvp_ceremonyAttending'
      },
      {
        id: 'rsvp_dinnerAttending',
        label: 'Attending Dinner',
        type: 'checkbox',
        condition: 'rsvp_attending'
      },
      {
        id: 'rsvp_dinnerAdults',
        label: 'Dinner Adults count',
        type: 'number',
        condition: 'rsvp_attending && rsvp_dinnerAttending'
      },
      {
        id: 'rsvp_dinnerKids',
        label: 'Dinner Kids count',
        type: 'number',
        condition: 'rsvp_attending && rsvp_dinnerAttending'
      },
      {
        id: 'rsvp_afterpartyAttending',
        label: 'Attending Afterparty',
        type: 'checkbox',
        condition: 'rsvp_attending'
      },
      {
        id: 'rsvp_afterpartyAdults',
        label: 'Afterparty Guests count',
        type: 'number',
        condition: 'rsvp_attending && rsvp_afterpartyAttending'
      }
    ],
    getHtml: (data) =>
      getRsvpEmailTemplate(
        data.rsvp_name,
        data.rsvp_email,
        data.rsvp_attending,
        {
          attending: data.rsvp_ceremonyAttending,
          adults: data.rsvp_ceremonyAdults,
          kids: data.rsvp_ceremonyKids
        },
        {
          attending: data.rsvp_dinnerAttending,
          adults: data.rsvp_dinnerAdults,
          kids: data.rsvp_dinnerKids
        },
        {
          attending: data.rsvp_afterpartyAttending,
          adults: data.rsvp_afterpartyAdults
        }
      )
  },
  {
    id: 'questionnaire',
    name: 'Questionnaire Notification',
    description: 'Notification to admin on guest itinerary choices.',
    fields: [
      { id: 'questionnaire_name', label: 'Guest Name', type: 'text' },
      { id: 'questionnaire_email', label: 'Guest Email', type: 'text' },
      { id: 'questionnaire_arrivalDate', label: 'Arrival Date', type: 'text' },
      { id: 'questionnaire_departureDate', label: 'Departure Date', type: 'text' },
      { id: 'questionnaire_activities', label: 'Selected Activities (comma separated)', type: 'text' },
      { id: 'questionnaire_suggestions', label: 'Suggestions / Feedback', type: 'textarea' }
    ],
    getHtml: (data) =>
      getQuestionnaireEmailTemplate(
        data.questionnaire_name,
        data.questionnaire_email,
        data.questionnaire_arrivalDate,
        data.questionnaire_departureDate,
        data.questionnaire_activities.split(',').map((s) => s.trim()).filter(Boolean),
        data.questionnaire_suggestions
      )
  },
  {
    id: 'supabase',
    name: 'Supabase Confirmation Email',
    description: 'Email sent by Supabase authentication flow (raw HTML format).',
    fields: [
      { id: 'supabase_confirmationUrl', label: 'Confirmation Link URL', type: 'text' }
    ],
    getHtml: (data) => getSupabaseConfirmEmailTemplate(data.supabase_confirmationUrl)
  }
];

const currentTemplate = computed(() => {
  return templates.find((t) => t.id === selectedTemplateId.value) || templates[0];
});

const selectTemplate = (id) => {
  selectedTemplateId.value = id;
};

// Check if conditional fields should show
const checkCondition = (field) => {
  if (!field.condition) return true;
  
  // Quick evaluate for conditions like 'rsvp_attending' or 'rsvp_attending && rsvp_ceremonyAttending'
  const conditions = field.condition.split('&&').map((c) => c.trim());
  return conditions.every((cond) => {
    return !!formData.value[cond];
  });
};

const compiledHtml = computed(() => {
  try {
    return currentTemplate.value.getHtml(formData.value);
  } catch (err) {
    console.error('Error compiling template:', err);
    return `<div style="padding: 20px; color: #ff6b6b; font-family: monospace;">Error rendering template: ${err.message}</div>`;
  }
});

const copyToClipboard = () => {
  navigator.clipboard.writeText(compiledHtml.value);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
};
</script>

<style scoped>
.text-center {
  text-align: center;
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
.text-muted {
  opacity: 0.7;
}
.text-sm {
  font-size: 0.9rem;
}

.dashboard-layout {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: var(--spacing-md);
  max-width: 1200px;
  margin: 0 auto;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.nav-card {
  padding: 1.5rem;
}

.card-title {
  font-size: 1.3rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.template-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.template-btn {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--border-radius);
  color: var(--color-cream-muted);
  padding: 12px 16px;
  text-align: left;
  cursor: pointer;
  transition: var(--transition);
}

.template-btn:hover {
  background: rgba(197, 168, 128, 0.08);
  border-color: rgba(197, 168, 128, 0.25);
  color: var(--color-primary);
}

.template-btn.active {
  background: rgba(197, 168, 128, 0.15);
  border-color: var(--color-primary);
  color: var(--color-primary);
  box-shadow: 0 0 10px rgba(197, 168, 128, 0.1);
}

.btn-name {
  display: block;
  font-weight: 600;
  font-family: var(--font-heading);
  font-size: 0.95rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.btn-desc {
  display: block;
  font-size: 0.75rem;
  opacity: 0.65;
  margin-top: 3px;
  line-height: 1.3;
}

.editor-card {
  padding: 1.5rem;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 8px 0;
}

.form-checkbox {
  width: 18px;
  height: 18px;
  accent-color: var(--color-primary);
  cursor: pointer;
}

.checkbox-label {
  color: var(--color-cream-muted);
  font-size: 0.9rem;
  cursor: pointer;
}

/* Right main preview container */
.preview-card {
  display: flex;
  flex-direction: column;
  height: 800px;
  padding: 1.5rem;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: var(--gold-border);
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.preview-tabs {
  display: flex;
  gap: 5px;
  background: rgba(0, 0, 0, 0.3);
  padding: 4px;
  border-radius: var(--border-radius);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.tab-btn {
  background: none;
  border: none;
  color: var(--color-cream-muted);
  padding: 8px 16px;
  font-family: var(--font-heading);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
}

.tab-btn:hover {
  color: var(--color-primary);
}

.tab-btn.active {
  background: var(--color-primary);
  color: var(--color-black) !important;
}

.preview-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.viewport-toggle {
  display: flex;
  gap: 2px;
  background: rgba(0, 0, 0, 0.2);
  padding: 2px;
  border-radius: var(--border-radius);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.viewport-btn {
  background: none;
  border: none;
  color: var(--color-cream-muted);
  padding: 6px 12px;
  font-size: 0.75rem;
  cursor: pointer;
  border-radius: var(--border-radius);
  transition: var(--transition);
}

.viewport-btn:hover {
  color: var(--color-primary);
}

.viewport-btn.active {
  background: rgba(197, 168, 128, 0.15);
  color: var(--color-primary);
}

.btn-copy {
  background-color: transparent;
  border: 1px solid var(--color-primary);
  color: var(--color-primary) !important;
  padding: 6px 15px;
  border-radius: var(--border-radius);
  font-family: var(--font-heading);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: var(--transition);
}

.btn-copy:hover {
  background-color: var(--color-primary);
  color: var(--color-black) !important;
  box-shadow: 0 4px 12px rgba(197, 168, 128, 0.2);
}

.btn-copy.copied {
  background-color: var(--color-green-desaturated);
  border-color: var(--color-green-desaturated);
  color: var(--color-black) !important;
}

.preview-content {
  flex-grow: 1;
  overflow: hidden;
  background-color: #110d14;
  border-radius: var(--border-radius);
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
}

.iframe-wrapper {
  height: 100%;
  transition: width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid rgba(197, 168, 128, 0.15);
  display: flex;
}

.iframe-wrapper.desktop {
  width: 100%;
  max-width: 600px;
}

.iframe-wrapper.mobile {
  width: 360px;
}

.email-iframe {
  width: 100%;
  height: 100%;
  background-color: #110d14;
}

.code-view {
  width: 100%;
  height: 100%;
  overflow: auto;
  text-align: left;
  background: #080606;
  border-radius: var(--border-radius);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 20px;
}

.code-view pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.code-view code {
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.85rem;
  color: #c5a880;
}

@media (max-width: 900px) {
  .dashboard-layout {
    grid-template-columns: 1fr;
  }
  
  .preview-card {
    height: 600px;
  }
}
</style>

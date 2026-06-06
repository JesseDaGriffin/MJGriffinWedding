<template>
  <div class="container section">
    <div class="questionnaire-container">
      <PageHeader 
        title="Guest Questionnaire" 
        subtitle="If you would like to join in group activities, help us plan the best weekend possible by sharing your preferences!" 
      />

      <GlassCard v-if="submitted" class="text-center success-message">
        <h2 class="mb-sm">Thank You!</h2>
        <p>Your responses have been recorded.</p>
        <AppButton @click="submitted = false" class="mt-md" text="Edit Responses" />
      </GlassCard>

      <form v-else @submit.prevent="submitQuestionnaire" class="questionnaire-form">
        <GlassCard>
        <div class="form-group mb-md">
          <label class="form-label">Days of Attendance (Date Range)</label>
          <div class="grid-2">
            <FormGroup v-model="form.arrivalDate" label="Arrival Date" type="date" required />
            <FormGroup v-model="form.departureDate" label="Departure Date" type="date" required />
          </div>
        </div>

        <div class="form-group mb-md">
          <label class="form-label mb-sm">Activities you are interested in</label>
          
          <div class="checkbox-grid">
            <label class="checkbox-label" v-for="activity in availableActivities" :key="activity.id">
              <input type="checkbox" :value="activity.id" v-model="form.activities">
              <span class="custom-checkbox"></span>
              {{ activity.name }}
            </label>
          </div>
        </div>

        <FormGroup 
          v-model="form.suggestions" 
          label="Any other ideas or suggestions?" 
          as="textarea" 
          rows="4" 
          placeholder="Let us know..." 
        />

        <div class="form-actions mt-lg">
          <AppButton type="submit" block :loading="loading" text="Submit Questionnaire" />
        </div>
        </GlassCard>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const submitted = ref(false);
const loading = ref(false);

const availableActivities = [
  { id: 'gambling', name: 'Casino / Gambling' },
  { id: 'shows', name: 'Shows & Entertainment' },
  { id: 'dining', name: 'Fine Dining' },
  { id: 'sightseeing', name: 'Sightseeing' },
  { id: 'pool', name: 'Pool / Cabana Time' },
  { id: 'clubbing', name: 'Nightlife / Clubbing' }
];

const form = ref({
  arrivalDate: '',
  departureDate: '',
  activities: [],
  suggestions: ''
});

watchEffect(async () => {
  const userId = user.value?.id || user.value?.sub;
  if (user.value && userId) {
    const { data } = await supabase
      .from('questionnaires')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (data) {
      form.value = {
        arrivalDate: data.arrival_date,
        departureDate: data.departure_date,
        activities: data.activities || [],
        suggestions: data.suggestions || ''
      };
      submitted.value = true;
    }
  }
});

const submitQuestionnaire = async () => {
  const userId = user.value?.id || user.value?.sub;
  if (!userId) return;
  
  loading.value = true;
  try {
    const payload = {
      user_id: userId,
      arrival_date: form.value.arrivalDate,
      departure_date: form.value.departureDate,
      activities: form.value.activities,
      suggestions: form.value.suggestions
    };

    const { error } = await supabase
      .from('questionnaires')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) throw error;
    
    // Also send an email notification
    try {
      // Get the profile for name
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', userId)
        .single();
        
      const guestName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Unknown';
      const guestEmail = user.value.email || 'Unknown';
      
      const activityNames = form.value.activities.map(id => {
        const found = availableActivities.find(a => a.id === id);
        return found ? found.name : id;
      });

      await $fetch('/api/send-questionnaire', {
        method: 'POST',
        body: {
          name: guestName,
          email: guestEmail,
          arrivalDate: form.value.arrivalDate,
          departureDate: form.value.departureDate,
          activities: activityNames,
          suggestions: form.value.suggestions
        }
      });
    } catch (emailErr) {
      console.error('Error triggering questionnaire email:', emailErr.message);
    }

    submitted.value = true;
  } catch (error) {
    console.error('Error submitting questionnaire:', error.message);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.questionnaire-container {
  max-width: 600px;
  margin: 0 auto;
}

.text-center { text-align: center; }
.mb-sm { margin-bottom: var(--spacing-sm); }
.mb-md { margin-bottom: var(--spacing-md); }
.mb-lg { margin-bottom: var(--spacing-lg); }
.mt-md { margin-top: var(--spacing-md); }
.mt-lg { margin-top: var(--spacing-lg); }
.w-100 { width: 100%; }

.success-message {
  padding: var(--spacing-xl) var(--spacing-md);
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.sub-label {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  color: rgba(255, 255, 255, 0.7);
}

.checkbox-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input {
  display: none;
}

.custom-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-primary);
  border-radius: 4px;
  position: relative;
  transition: var(--transition);
  flex-shrink: 0;
}

.checkbox-label input:checked + .custom-checkbox {
  background-color: var(--color-primary);
}

.checkbox-label input:checked + .custom-checkbox::after {
  content: '✓';
  color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
}

@media (max-width: 600px) {
  .grid-2, .checkbox-grid {
    grid-template-columns: 1fr;
  }
}
</style>

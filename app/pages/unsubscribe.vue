<template>
  <div class="container section">
    <div class="unsubscribe-container">
      <GlassCard class="unsubscribe-card">
        <PageHeader
          title="Email Preferences"
          subtitle="Manage your wedding announcement email subscription"
          subtitle-class="subtitle"
        />

        <div v-if="completed" class="text-center">
          <AlertMessage type="success" :message="successMsg" />

          <div class="actions-stack mt-md">
            <AppButton
              v-if="isCurrentlyOptedOut"
              type="button"
              variant="secondary"
              block
              :loading="loading"
              text="Re-subscribe to Announcements"
              @click="handleUpdatePreference(true)"
            />
            <NuxtLink v-if="user" to="/account" class="back-link mt-sm">
              Return to Account Settings
            </NuxtLink>
            <NuxtLink v-else to="/login" class="back-link mt-sm">
              Go to Website Login
            </NuxtLink>
          </div>
        </div>

        <form v-else @submit.prevent="handleUpdatePreference(false)" class="form">
          <p class="mb-md text-muted">
            Enter the email address associated with your guest account below to opt out of future wedding announcement emails.
          </p>

          <FormGroup
            v-model="emailInput"
            label="Email Address"
            type="email"
            placeholder="your@email.com"
            required
          />

          <AlertMessage v-if="errorMsg" type="error" :message="errorMsg" />

          <AppButton
            type="submit"
            class="mt-md"
            block
            :loading="loading"
            text="Unsubscribe from Announcements"
            loading-text="Updating..."
          />

          <div v-if="user" class="text-center mt-md">
            <NuxtLink to="/account" class="back-link">
              Or manage preferences in Account Settings
            </NuxtLink>
          </div>
        </form>
      </GlassCard>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';

const user = useSupabaseUser();
const supabase = useSupabaseClient();
const route = useRoute();

const emailInput = ref('');
const loading = ref(false);
const completed = ref(false);
const isCurrentlyOptedOut = ref(false);
const successMsg = ref('');
const errorMsg = ref('');

watchEffect(() => {
  if (!emailInput.value) {
    if (typeof route.query.email === 'string' && route.query.email) {
      emailInput.value = route.query.email;
    } else if (user.value?.email) {
      emailInput.value = user.value.email;
    }
  }
});

const handleUpdatePreference = async (subscribe) => {
  errorMsg.value = '';
  successMsg.value = '';
  loading.value = true;

  try {
    const response = await $fetch('/api/unsubscribe', {
      method: 'POST',
      body: {
        email: emailInput.value,
        subscribe
      }
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to update email preferences.');
    }

    // If the currently logged-in user matches this email, sync their client session metadata too
    if (
      user.value?.email &&
      user.value.email.toLowerCase() === emailInput.value.trim().toLowerCase()
    ) {
      try {
        await supabase.auth.updateUser({
          data: {
            receive_announcements: subscribe
          }
        });
      } catch (e) {
        // Non-fatal; server already updated admin metadata and profile
      }
    }

    isCurrentlyOptedOut.value = !subscribe;
    successMsg.value = response.message;
    completed.value = true;
  } catch (err) {
    errorMsg.value = err.data?.error || err.message || 'Unable to update preferences.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.unsubscribe-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.unsubscribe-card {
  width: 100%;
  max-width: 500px;
  padding: var(--spacing-xl) var(--spacing-lg);
}

.subtitle {
  color: var(--color-cream-muted);
  margin-bottom: 1rem;
}

.text-center {
  text-align: center;
}

.text-muted {
  color: var(--color-cream-muted);
  font-size: 0.95rem;
  line-height: 1.6;
}

.mb-md {
  margin-bottom: var(--spacing-md);
}

.mt-md {
  margin-top: var(--spacing-md);
}

.mt-sm {
  margin-top: var(--spacing-sm);
}

.actions-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.back-link {
  color: var(--color-primary);
  font-size: 0.9rem;
  text-decoration: underline;
}
</style>

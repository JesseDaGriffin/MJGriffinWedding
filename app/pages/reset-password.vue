<template>
  <div class="reset-page">
    <GlassCard class="reset-container">
      <div class="reset-logo-wrapper">
        <div class="reset-logo">M &amp; J</div>
      </div>
      <PageHeader
        title="Set New Password"
        subtitle="The Griffin Wedding"
        subtitle-class="mb-md"
      />

      <div v-if="verifying" class="status-box text-center">
        <p class="text-muted">Verifying your password reset link...</p>
      </div>

      <div v-else-if="completed" class="status-box text-center">
        <AlertMessage type="success" :message="successMsg" />
        <AppButton
          type="button"
          class="mt-md"
          block
          text="Continue to Website"
          @click="goToHome"
        />
      </div>

      <div v-else-if="!hasValidSession" class="status-box text-center">
        <AlertMessage
          type="error"
          :message="errorMsg || 'This password reset link is invalid or has expired. Please request a new reset link.'"
        />
        <AppButton
          type="button"
          class="mt-md"
          block
          text="Return to Login"
          @click="goToLogin"
        />
      </div>

      <form v-else @submit.prevent="handleResetPassword" class="form">
        <p class="description text-center">
          Please enter and confirm your new password below.
        </p>

        <FormGroup
          v-model="password"
          label="New Password"
          type="password"
          placeholder="••••••••"
          required
        />

        <FormGroup
          v-model="confirmPassword"
          label="Confirm New Password"
          type="password"
          placeholder="••••••••"
          required
        />

        <AlertMessage v-if="errorMsg" type="error" :message="errorMsg" />

        <AppButton
          type="submit"
          class="mt-md"
          block
          :loading="loading"
          text="Update Password"
          loading-text="Updating..."
        />

        <div class="back-row">
          <NuxtLink to="/login" class="back-link">
            &larr; Return to Login
          </NuxtLink>
        </div>
      </form>
    </GlassCard>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

definePageMeta({
  layout: false
});

useHead({
  htmlAttrs: {
    class: 'html--login'
  },
  bodyAttrs: {
    class: 'body--login'
  }
});

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();
const route = useRoute();

const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const verifying = ref(true);
const sessionVerified = ref(false);
const completed = ref(false);
const errorMsg = ref('');
const successMsg = ref('');

const hasValidSession = computed(() => Boolean(sessionVerified.value || user.value));

let authSubscription = null;
let verifyTimeout = null;

onMounted(async () => {
  // Check if Supabase redirected back with an error in query or hash
  const queryError = route.query.error_description || route.query.error;
  const hashParams = new URLSearchParams(
    window.location.hash ? window.location.hash.substring(1) : ''
  );
  const hashError = hashParams.get('error_description') || hashParams.get('error');

  if (queryError || hashError) {
    errorMsg.value = String(queryError || hashError).replace(/\+/g, ' ');
    verifying.value = false;
    return;
  }

  // Listen for PASSWORD_RECOVERY or SIGNED_IN session state
  const { data: subData } = supabase.auth.onAuthStateChange((event, session) => {
    if (session && (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
      sessionVerified.value = true;
      verifying.value = false;
    }
  });
  authSubscription = subData?.subscription || null;

  try {
    // Support token_hash query format if configured in custom email template
    if (route.query.token_hash) {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: String(route.query.token_hash),
        type: 'recovery'
      });
      if (error) throw error;
      if (data?.session) {
        sessionVerified.value = true;
        verifying.value = false;
        return;
      }
    }

    // Check if session is already established (via PKCE code or implicit hash)
    const { data } = await supabase.auth.getSession();
    if (data?.session || user.value) {
      sessionVerified.value = true;
      verifying.value = false;
      return;
    }

    // Give browser client a brief moment if it is still exchanging a code in the URL
    verifyTimeout = setTimeout(async () => {
      const { data: retryData } = await supabase.auth.getSession();
      if (retryData?.session || user.value) {
        sessionVerified.value = true;
      }
      verifying.value = false;
    }, 1500);
  } catch (err) {
    errorMsg.value = err.message || 'Unable to verify password reset link.';
    verifying.value = false;
  }
});

onUnmounted(() => {
  authSubscription?.unsubscribe?.();
  if (verifyTimeout) clearTimeout(verifyTimeout);
});

const handleResetPassword = async () => {
  errorMsg.value = '';
  successMsg.value = '';

  if (password.value.length < 6) {
    errorMsg.value = 'Password must be at least 6 characters long.';
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Passwords do not match. Please try again.';
    return;
  }

  loading.value = true;
  try {
    const { error } = await supabase.auth.updateUser({
      password: password.value
    });

    if (error) throw error;

    password.value = '';
    confirmPassword.value = '';
    successMsg.value = 'Your password has been updated successfully!';
    completed.value = true;
  } catch (err) {
    errorMsg.value = err.message || 'Failed to update password. Please try again.';
  } finally {
    loading.value = false;
  }
};

const goToHome = () => {
  router.push('/');
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.reset-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 50% 30%, var(--color-purple-glow) 0%, var(--color-purple-dark) 70%);
  padding: var(--spacing-md);
}

.reset-container {
  width: 100%;
  max-width: 450px;
  padding: var(--spacing-xl) var(--spacing-md);
}

.reset-logo-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.reset-logo {
  font-family: var(--font-heading);
  font-size: 2.2rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  color: var(--color-primary);
  text-transform: uppercase;
  text-shadow: 0 0 10px rgba(197, 168, 128, 0.3);
}

.description {
  color: var(--color-cream-muted);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
}

.text-center {
  text-align: center;
}

.text-muted {
  color: var(--color-cream-muted);
}

.mb-md {
  margin-bottom: var(--spacing-md);
}

.mt-md {
  margin-top: var(--spacing-md);
}

.back-row {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-md);
}

.back-link {
  color: var(--color-cream-muted);
  font-size: 0.9rem;
  text-decoration: none;
  transition: var(--transition);
}

.back-link:hover {
  color: var(--color-primary);
}

:global(html.html--login),
:global(body.body--login) {
  overflow: auto !important;
  height: auto !important;
  min-height: 100vh;
}
</style>

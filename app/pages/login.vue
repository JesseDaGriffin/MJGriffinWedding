<template>
  <div class="login-page">
    <GlassCard class="login-container">
      <div class="login-logo-wrapper">
        <div class="login-logo">M &amp; J</div>
      </div>
      <PageHeader 
        title="Welcome" 
        subtitle="The Griffin Wedding" 
        subtitle-class="mb-md" 
      />
      <div class="tabs">
        <button 
          class="tab-btn" 
          :class="{ active: isLogin }" 
          @click="isLogin = true"
        >Login</button>
        <button 
          class="tab-btn" 
          :class="{ active: !isLogin }" 
          @click="isLogin = false"
        >Sign Up</button>
      </div>

      <form @submit.prevent="handleSubmit" class="form">
        <template v-if="!isLogin">
          <FormGroup v-model="form.code" label="Invitation Code" placeholder="Enter the code from your invite" required />
          <FormGroup v-model="form.firstName" label="First Name" placeholder="First Name" required />
          <FormGroup v-model="form.lastName" label="Last Name" placeholder="Last Name" required />
        </template>
        
        <FormGroup v-model="form.email" label="Email" type="email" placeholder="your@email.com" required />
        <FormGroup v-model="form.password" label="Password" type="password" placeholder="••••••••" required />

        <AlertMessage v-if="successMsg" type="success" :message="successMsg" />
        <AlertMessage v-if="errorMsg" type="error" :message="errorMsg" />

        <AppButton 
          type="submit" 
          class="mt-md" 
          block 
          :loading="loading" 
          :text="isLogin ? 'Login' : 'Create Account'" 
        />
      </form>
    </GlassCard>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

definePageMeta({
  layout: false // don't use default layout for login
});

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const isLogin = ref(true);
const router = useRouter();
const errorMsg = ref('');
const successMsg = ref('');
const loading = ref(false);

const form = ref({
  code: '',
  firstName: '',
  lastName: '',
  email: '',
  password: ''
});

// Watch for user login
watchEffect(() => {
  if (user.value) {
    if (user.value.email?.toLowerCase() === 'dagriffinwedding@gmail.com') {
      localStorage.setItem('wedding_admin', 'true');
    }
    router.push('/');
  }
});

const handleSubmit = async () => {
  errorMsg.value = '';
  successMsg.value = '';
  loading.value = true;
  
  try {
    if (!isLogin.value) {
      if (form.value.code !== '031327') {
        errorMsg.value = 'Invalid invitation code. Please check your invite.';
        loading.value = false;
        return;
      }
      
      const { error, data } = await supabase.auth.signUp({
        email: form.value.email,
        password: form.value.password,
        options: {
          data: {
            first_name: form.value.firstName,
            last_name: form.value.lastName
          }
        }
      });
      
      if (error) throw error;
      
      // Send welcome email
      try {
        await $fetch('/api/send-welcome', {
          method: 'POST',
          body: {
            email: form.value.email,
            firstName: form.value.firstName
          }
        });
      } catch (e) {
        console.error('Failed to send welcome email:', e);
      }

      // Reset form
      form.value = {
        code: '',
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      };
      
      // Show success message if email confirmation is required (user not immediately logged in)
      if (data?.user && data?.session === null) {
        successMsg.value = 'Account created! Please check your email to verify your account.';
      } else {
        successMsg.value = 'Account created successfully!';
      }
      
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.value.email,
        password: form.value.password,
      });
      
      if (error) throw error;
    }
  } catch (error) {
    errorMsg.value = error.message;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 50% 30%, var(--color-purple-glow) 0%, var(--color-purple-dark) 70%);
  padding: var(--spacing-md);
}

.login-container {
  width: 100%;
  max-width: 450px;
  padding: var(--spacing-xl) var(--spacing-md);
}

.login-logo-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.login-logo {
  font-family: var(--font-heading);
  font-size: 2.2rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  color: var(--color-primary);
  text-transform: uppercase;
  text-shadow: 0 0 10px rgba(197, 168, 128, 0.3);
}

.text-center {
  text-align: center;
}

.mb-md {
  margin-bottom: var(--spacing-md);
}

.mt-md {
  margin-top: var(--spacing-sm);
}

.w-100 {
  width: 100%;
}

.tabs {
  display: flex;
  margin-bottom: var(--spacing-md);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.tab-btn {
  flex: 1;
  background: none;
  border: none;
  padding: var(--spacing-sm);
  color: var(--color-cream-muted);
  font-family: var(--font-heading);
  font-size: 1.2rem;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
}

.tab-btn.active {
  color: var(--color-primary);
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--color-primary);
}

.error-msg {
  color: #ff6b6b;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: center;
}

.success-msg {
  color: #4CAF50;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: center;
}
</style>

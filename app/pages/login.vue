<template>
  <div class="login-page">
    <GlassCard class="login-container">
      <h1 class="text-center">Welcome</h1>
      <p class="text-center mb-md">The Griffin Wedding</p>
      
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
        <div v-if="!isLogin" class="form-group">
          <label class="form-label">Invitation Code</label>
          <input 
            v-model="form.code" 
            type="text" 
            class="form-input" 
            placeholder="Enter the code from your invite"
            required
          />
        </div>

        <div v-if="!isLogin" class="form-group">
          <label class="form-label">First Name</label>
          <input 
            v-model="form.firstName" 
            type="text" 
            class="form-input" 
            placeholder="First Name"
            required
          />
        </div>

        <div v-if="!isLogin" class="form-group">
          <label class="form-label">Last Name</label>
          <input 
            v-model="form.lastName" 
            type="text" 
            class="form-input" 
            placeholder="Last Name"
            required
          />
        </div>
        
        <div class="form-group">
          <label class="form-label">Email</label>
          <input 
            v-model="form.email" 
            type="email" 
            class="form-input" 
            placeholder="your@email.com"
            required
          />
        </div>
        
        <div class="form-group">
          <label class="form-label">Password</label>
          <input 
            v-model="form.password" 
            type="password" 
            class="form-input" 
            placeholder="••••••••"
            required
          />
        </div>

        <p v-if="successMsg" class="success-msg">{{ successMsg }}</p>
        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

        <button type="submit" class="btn w-100 mt-md">
          {{ isLogin ? 'Login' : 'Create Account' }}
        </button>
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
  background: linear-gradient(rgba(28, 28, 28, 0.7), rgba(28, 28, 28, 0.9)), url('/hero-bg.jpg') center/cover;
  padding: var(--spacing-md);
}

.login-container {
  width: 100%;
  max-width: 450px;
  padding: var(--spacing-xl) var(--spacing-md);
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
  color: rgba(255, 255, 255, 0.6);
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

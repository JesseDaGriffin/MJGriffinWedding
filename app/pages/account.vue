<template>
  <div class="container section">
    <div class="account-container">
      <GlassCard class="account-card">
        <h1 class="text-center mb-md text-primary">Account Settings</h1>
        
        <form @submit.prevent="updateProfile" class="form">
          <div class="form-group">
            <label class="form-label">First Name</label>
            <input 
              v-model="profile.first_name" 
              type="text" 
              class="form-input" 
              required
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Last Name</label>
            <input 
              v-model="profile.last_name" 
              type="text" 
              class="form-input" 
              required
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Email</label>
            <input 
              :value="user?.email" 
              type="email" 
              class="form-input" 
              disabled
            />
            <small class="text-muted">Email cannot be changed.</small>
          </div>

          <p v-if="successMsg" class="success-msg">{{ successMsg }}</p>
          <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

          <button type="submit" class="btn w-100 mt-md" :disabled="loading">
            {{ loading ? 'Saving...' : 'Update Name' }}
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

const loading = ref(false);
const successMsg = ref('');
const errorMsg = ref('');

const profile = ref({
  first_name: '',
  last_name: ''
});

onMounted(async () => {
  if (user.value) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.value.id)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is no rows returned
      
      if (data) {
        profile.value.first_name = data.first_name || '';
        profile.value.last_name = data.last_name || '';
      } else if (user.value.user_metadata) {
        // Fallback to metadata if profile doesn't exist yet
        profile.value.first_name = user.value.user_metadata.first_name || '';
        profile.value.last_name = user.value.user_metadata.last_name || '';
      }
    } catch (err) {
      console.error('Error fetching profile:', err.message);
    }
  }
});

const updateProfile = async () => {
  if (!user.value) return;
  
  loading.value = true;
  successMsg.value = '';
  errorMsg.value = '';
  
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.value.id,
        first_name: profile.value.first_name,
        last_name: profile.value.last_name
      });
      
    if (error) throw error;
    
    // Also update auth.users metadata to keep in sync
    await supabase.auth.updateUser({
      data: {
        first_name: profile.value.first_name,
        last_name: profile.value.last_name
      }
    });
    
    successMsg.value = 'Profile updated successfully!';
  } catch (err) {
    errorMsg.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.account-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.account-card {
  width: 100%;
  max-width: 500px;
  padding: var(--spacing-xl) var(--spacing-lg);
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

.text-primary {
  color: var(--color-primary);
}

.text-muted {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
  display: block;
  margin-top: 4px;
}

.success-msg {
  color: #4CAF50;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: center;
}

.error-msg {
  color: #F44336;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: center;
}
</style>

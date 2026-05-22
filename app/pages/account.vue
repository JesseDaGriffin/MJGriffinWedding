<template>
  <div class="container section">
    <div class="account-container">
      <GlassCard class="account-card">
        <PageHeader title="Account Settings" />
        
        <form @submit.prevent="updateProfile" class="form">
          <FormGroup 
            v-model="profile.first_name" 
            label="First Name" 
            required 
          />
          
          <FormGroup 
            v-model="profile.last_name" 
            label="Last Name" 
            required 
          />
          
          <FormGroup 
            :modelValue="user?.email" 
            label="Email" 
            type="email" 
            disabled 
            hint="Email cannot be changed." 
          />

          <AlertMessage v-if="successMsg" type="success" :message="successMsg" />
          <AlertMessage v-if="errorMsg" type="error" :message="errorMsg" />

          <AppButton 
            type="submit" 
            class="mt-md" 
            block 
            :loading="loading" 
            text="Update Name" 
          />
        </form>
      </GlassCard>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const loading = ref(false);
const successMsg = ref('');
const errorMsg = ref('');

const profile = ref({
  first_name: '',
  last_name: ''
});

watchEffect(async () => {
  const userId = user.value?.id || user.value?.sub;
  if (user.value && userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', userId)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is no rows returned
      
      if (data) {
        profile.value.first_name = data.first_name || (user.value.user_metadata && user.value.user_metadata.first_name) || '';
        profile.value.last_name = data.last_name || (user.value.user_metadata && user.value.user_metadata.last_name) || '';
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
  const userId = user.value?.id || user.value?.sub;
  if (!user.value || !userId) return;
  
  loading.value = true;
  successMsg.value = '';
  errorMsg.value = '';
  
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
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
</style>

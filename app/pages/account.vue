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

          <div class="preferences-section mb-md">
            <label class="section-label">Email Preferences</label>
            <label class="checkbox-label">
              <input
                type="checkbox"
                v-model="profile.receive_announcements"
              />
              <span class="custom-checkbox"></span>
              <span>Receive wedding announcement emails</span>
            </label>
            <small class="form-hint mt-xs">
              Uncheck to opt out of mass announcement updates from Maddie &amp; Jesse.
            </small>
          </div>

          <AlertMessage v-if="successMsg" type="success" :message="successMsg" />
          <AlertMessage v-if="errorMsg" type="error" :message="errorMsg" />

          <AppButton 
            type="submit" 
            class="mt-md" 
            block 
            :loading="loading" 
            text="Save Changes" 
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
  last_name: '',
  receive_announcements: true
});

watchEffect(async () => {
  const userId = user.value?.id || user.value?.sub;
  if (user.value && userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (error) throw error;
      
      const meta = user.value.user_metadata || {};
      if (data) {
        profile.value.first_name = data.first_name || meta.first_name || '';
        profile.value.last_name = data.last_name || meta.last_name || '';
        if (typeof data.receive_announcements === 'boolean') {
          profile.value.receive_announcements = data.receive_announcements;
        } else if (typeof meta.receive_announcements === 'boolean') {
          profile.value.receive_announcements = meta.receive_announcements;
        } else {
          profile.value.receive_announcements = true;
        }
      } else {
        profile.value.first_name = meta.first_name || '';
        profile.value.last_name = meta.last_name || '';
        profile.value.receive_announcements =
          typeof meta.receive_announcements === 'boolean'
            ? meta.receive_announcements
            : true;
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
        last_name: profile.value.last_name,
        receive_announcements: profile.value.receive_announcements
      });
      
    if (error) {
      // Fallback if receive_announcements column hasn't been migrated in Supabase yet
      if (error.message?.includes('receive_announcements')) {
        const { error: fallbackError } = await supabase
          .from('profiles')
          .upsert({
            id: userId,
            first_name: profile.value.first_name,
            last_name: profile.value.last_name
          });
        if (fallbackError) throw fallbackError;
      } else {
        throw error;
      }
    }
    
    // Also update auth.users metadata to keep in sync
    await supabase.auth.updateUser({
      data: {
        first_name: profile.value.first_name,
        last_name: profile.value.last_name,
        receive_announcements: profile.value.receive_announcements
      }
    });
    
    successMsg.value = 'Account settings updated successfully!';
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

.mt-xs {
  margin-top: 6px;
}

.w-100 {
  width: 100%;
}

.preferences-section {
  border-top: 1px solid rgba(197, 168, 128, 0.15);
  padding-top: var(--spacing-md);
}

.section-label {
  display: block;
  margin-bottom: 0.65rem;
  font-weight: 500;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  cursor: pointer;
  user-select: none;
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
  content: "✓";
  color: var(--color-black);
  font-weight: bold;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
}

.form-hint {
  color: var(--color-cream-muted);
  font-size: 0.85rem;
  display: block;
}
</style>

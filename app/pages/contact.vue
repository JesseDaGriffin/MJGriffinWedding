<template>
  <div class="container section">
    <div class="contact-container">
      <PageHeader 
        title="Contact Us" 
        subtitle="Have any questions? Send us a message and we'll get back to you!" 
      />

      <GlassCard v-if="submitted" class="text-center success-message">
        <h2 class="mb-sm">Message Sent!</h2>
        <p>Thank you for reaching out. We'll be in touch soon.</p>
        <AppButton @click="submitted = false; form.message = ''" class="mt-md" text="Send Another Message" />
      </GlassCard>

      <form v-else @submit.prevent="submitContact" class="contact-form">
        <GlassCard>
        
        <FormGroup 
          v-model="form.name" 
          label="Name" 
          placeholder="Your Name" 
          :disabled="!!user"
          required 
        />

        <FormGroup 
          v-model="form.email" 
          label="Email" 
          type="email" 
          placeholder="your.email@example.com" 
          :disabled="!!user"
          required 
        />

        <FormGroup 
          v-model="form.subject" 
          label="Subject" 
          placeholder="What is this regarding?" 
          required 
        />

        <FormGroup 
          v-model="form.message" 
          label="Message" 
          as="textarea" 
          rows="6" 
          placeholder="Your message..." 
          required 
        />

        <div class="form-actions mt-lg">
          <AppButton type="submit" block :loading="loading" loading-text="Sending..." text="Send Message" />
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

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

watchEffect(async () => {
  if (user.value) {
    form.value.email = user.value.email || '';
    
    if (user.value.user_metadata) {
      const { first_name, last_name } = user.value.user_metadata;
      if (first_name || last_name) {
        form.value.name = `${first_name || ''} ${last_name || ''}`.trim();
      }
    }
    
    const userId = user.value.id || user.value.sub;
    if (userId) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', userId)
          .single();
          
        if (!error && data && (data.first_name || data.last_name)) {
          form.value.name = `${data.first_name || ''} ${data.last_name || ''}`.trim();
        }
      } catch (err) {
        console.error('Error fetching profile for contact form:', err.message);
      }
    }
  }
});

const submitContact = async () => {
  loading.value = true;
  try {
    const payload = {
      name: form.value.name,
      email: form.value.email,
      subject: form.value.subject,
      message: form.value.message,
      user_id: user.value ? (user.value.id || user.value.sub) : null
    };

    const { error } = await supabase
      .from('contact_messages')
      .insert([payload]);

    if (error) throw error;
    
    // Send email notification to admin
    await $fetch('/api/send-contact', {
      method: 'POST',
      body: {
        name: form.value.name,
        email: form.value.email,
        subject: form.value.subject,
        message: form.value.message
      }
    });

    submitted.value = true;
  } catch (error) {
    console.error('Error sending message:', error.message);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.contact-container {
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
</style>

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
          required 
        />

        <FormGroup 
          v-model="form.email" 
          label="Email" 
          type="email" 
          placeholder="your.email@example.com" 
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
import { ref } from 'vue';

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

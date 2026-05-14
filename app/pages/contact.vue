<template>
  <div class="container section">
    <div class="contact-container">
      <h1 class="text-center mb-md">Contact Us</h1>
      <p class="text-center mb-lg">Have any questions? Send us a message and we'll get back to you!</p>

      <GlassCard v-if="submitted" class="text-center success-message">
        <h2 class="mb-sm">Message Sent!</h2>
        <p>Thank you for reaching out. We'll be in touch soon.</p>
        <button @click="submitted = false; form.message = ''" class="btn mt-md">Send Another Message</button>
      </GlassCard>

      <form v-else @submit.prevent="submitContact" class="contact-form">
        <GlassCard>
        <div class="form-group mb-md">
          <label class="form-label">Name</label>
          <input type="text" v-model="form.name" class="form-input" required placeholder="Your Name">
        </div>

        <div class="form-group mb-md">
          <label class="form-label">Email</label>
          <input type="email" v-model="form.email" class="form-input" required placeholder="your.email@example.com">
        </div>

        <div class="form-group mb-md">
          <label class="form-label">Subject</label>
          <input type="text" v-model="form.subject" class="form-input" required placeholder="What is this regarding?">
        </div>

        <div class="form-group mb-md">
          <label class="form-label">Message</label>
          <textarea v-model="form.message" rows="6" class="form-textarea" required placeholder="Your message..."></textarea>
        </div>

        <div class="form-actions mt-lg">
          <button type="submit" class="btn w-100">Send Message</button>
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
      user_id: user.value ? user.value.id : null
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

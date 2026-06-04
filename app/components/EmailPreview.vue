<template>
  <div class="email-preview-wrapper">
    <iframe 
      :srcdoc="fullHtml" 
      class="email-iframe" 
      frameborder="0"
      sandbox="allow-same-origin"
    ></iframe>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getAnnouncementEmailTemplate } from '../../utils/emailTemplates';

const props = defineProps({
  messageHtml: {
    type: String,
    required: true
  }
});

const fullHtml = computed(() => {
  return getAnnouncementEmailTemplate(props.messageHtml);
});
</script>

<style scoped>
.email-preview-wrapper {
  width: 100%;
  height: 600px;
  background-color: #1c1c1c; /* match the email outer background */
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.email-iframe {
  width: 100%;
  height: 100%;
  display: block;
}
</style>

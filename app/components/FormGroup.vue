<template>
  <div class="form-group">
    <label v-if="label" class="form-label" :for="id">{{ label }}</label>
    
    <textarea 
      v-if="as === 'textarea'"
      :id="id"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="form-textarea"
      :rows="rows"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
    ></textarea>
    
    <input 
      v-else
      :id="id"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="form-input"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :min="min"
      :max="max"
    />
    
    <small v-if="hint" class="form-hint">{{ hint }}</small>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  as: {
    type: String,
    default: 'input' // input or textarea
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  rows: {
    type: [Number, String],
    default: 4
  },
  min: {
    type: [Number, String],
    default: null
  },
  max: {
    type: [Number, String],
    default: null
  },
  hint: {
    type: String,
    default: ''
  }
});

defineEmits(['update:modelValue']);

// Generate a unique ID for the label/input association
const id = useId();
</script>

<style scoped>
.form-group {
  margin-bottom: var(--spacing-md);
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius);
  background-color: rgba(0, 0, 0, 0.2);
  color: var(--color-text);
  font-family: var(--font-body);
  transition: var(--transition);
}

.form-textarea {
  resize: vertical;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  background-color: rgba(0, 0, 0, 0.4);
}

.form-input:disabled, .form-textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-hint {
  color: var(--color-cream-muted);
  font-size: 0.85rem;
  display: block;
  margin-top: 4px;
}
</style>

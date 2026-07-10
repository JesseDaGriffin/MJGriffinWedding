<template>
  <div class="date-picker-container" ref="containerRef">
    <!-- Trigger input wrapper -->
    <div class="input-wrapper" @click="togglePicker">
      <input
        type="text"
        :id="id"
        :value="displayValue"
        class="form-input date-input"
        :placeholder="placeholder || 'Select Date'"
        :required="required"
        :disabled="disabled"
        readonly
      />
      <div class="calendar-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </div>
    </div>

    <!-- Dropdown Calendar panel -->
    <Transition name="fade-slide">
      <div v-if="isOpen && !disabled" class="calendar-panel glass-panel">
        <div class="calendar-header">
          <button type="button" class="nav-btn" @click.stop="prevMonth" aria-label="Previous month">
            &larr;
          </button>
          
          <div class="header-title">
            <span class="month-label">{{ monthNames[viewMonth] }}</span>
            <span class="year-label">{{ viewYear }}</span>
          </div>
          
          <button type="button" class="nav-btn" @click.stop="nextMonth" aria-label="Next month">
            &rarr;
          </button>
        </div>

        <!-- Weekdays -->
        <div class="weekdays-grid">
          <span v-for="day in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="day" class="weekday">
            {{ day }}
          </span>
        </div>

        <!-- Days -->
        <div class="days-grid">
          <button
            v-for="cell in daysInMonth"
            :key="cell.dateString"
            type="button"
            class="day-cell"
            :class="{
              'current-month': cell.isCurrentMonth,
              'other-month': !cell.isCurrentMonth,
              'selected': modelValue === cell.dateString,
              'today': isToday(cell.dateString),
              'disabled': isDateDisabled(cell.dateString)
            }"
            :disabled="isDateDisabled(cell.dateString)"
            @click.stop="selectDay(cell)"
          >
            {{ cell.day }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watchEffect } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: ''
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
  min: {
    type: String,
    default: null
  },
  max: {
    type: String,
    default: null
  },
  defaultDate: {
    type: String,
    default: '2027-03-13' // Default to the wedding date!
  }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const containerRef = ref(null);

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const selectedDate = computed(() => {
  if (!props.modelValue) return null;
  // Use T00:00:00 to avoid timezone offset conversion issues
  return new Date(props.modelValue + 'T00:00:00');
});

const displayValue = computed(() => {
  if (!selectedDate.value) return '';
  return selectedDate.value.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
});

const viewMonth = ref(new Date().getMonth());
const viewYear = ref(new Date().getFullYear());

// Set up default viewing month/year
const initializeViewDate = () => {
  let initDate = new Date();
  if (props.modelValue) {
    initDate = new Date(props.modelValue + 'T00:00:00');
  } else if (props.defaultDate) {
    initDate = new Date(props.defaultDate + 'T00:00:00');
  }
  
  if (!isNaN(initDate.getTime())) {
    viewMonth.value = initDate.getMonth();
    viewYear.value = initDate.getFullYear();
  }
};

watchEffect(() => {
  initializeViewDate();
});

const togglePicker = () => {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    initializeViewDate();
  }
};

const prevMonth = () => {
  if (viewMonth.value === 0) {
    viewMonth.value = 11;
    viewYear.value--;
  } else {
    viewMonth.value--;
  }
};

const nextMonth = () => {
  if (viewMonth.value === 11) {
    viewMonth.value = 0;
    viewYear.value++;
  } else {
    viewMonth.value++;
  }
};

const formatDateString = (year, month, day) => {
  const y = year;
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const daysInMonth = computed(() => {
  const year = viewYear.value;
  const month = viewMonth.value;
  
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevTotalDays = new Date(year, month, 0).getDate();
  
  const cells = [];
  
  // Previous month padding
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = prevTotalDays - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    cells.push({
      day: dayNum,
      month: prevMonth,
      year: prevYear,
      isCurrentMonth: false,
      dateString: formatDateString(prevYear, prevMonth, dayNum)
    });
  }
  
  // Current month
  for (let i = 1; i <= totalDays; i++) {
    cells.push({
      day: i,
      month: month,
      year: year,
      isCurrentMonth: true,
      dateString: formatDateString(year, month, i)
    });
  }
  
  // Next month padding to reach 42 cells (6 full weeks)
  const remainingCells = 42 - cells.length;
  for (let i = 1; i <= remainingCells; i++) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    cells.push({
      day: i,
      month: nextMonth,
      year: nextYear,
      isCurrentMonth: false,
      dateString: formatDateString(nextYear, nextMonth, i)
    });
  }
  
  return cells;
});

const isDateDisabled = (dateString) => {
  if (props.min && dateString < props.min) return true;
  if (props.max && dateString > props.max) return true;
  return false;
};

const isToday = (dateString) => {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  return dateString === `${y}-${m}-${d}`;
};

const selectDay = (cell) => {
  if (isDateDisabled(cell.dateString)) return;
  emit('update:modelValue', cell.dateString);
  isOpen.value = false;
};

const handleClickOutside = (event) => {
  if (containerRef.value && !containerRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.date-picker-container {
  position: relative;
  width: 100%;
}

.input-wrapper {
  position: relative;
  cursor: pointer;
}

.date-input {
  cursor: pointer;
  padding-right: 2.5rem !important; /* Make room for the icon */
}

/* Ensure the cursor is not allowed if disabled */
.date-input:disabled {
  cursor: not-allowed;
}

.calendar-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-primary);
  width: 18px;
  height: 18px;
  pointer-events: none;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.input-wrapper:hover .calendar-icon {
  opacity: 1;
}

/* Calendar panel styling */
.calendar-panel {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 100;
  width: 320px;
  padding: 1.25rem;
  border-radius: var(--border-radius);
  border: 1px solid rgba(197, 168, 128, 0.25);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  user-select: none;
  background: linear-gradient(135deg, rgba(20, 18, 18, 0.95), rgba(8, 6, 6, 0.98)) !important;
}

/* For small mobile devices, center or adjust the calendar width */
@media (max-width: 360px) {
  .calendar-panel {
    width: 280px;
    padding: 0.75rem;
  }
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.header-title {
  font-family: var(--font-heading);
  font-size: 1rem;
  letter-spacing: 0.1em;
  color: var(--color-primary);
  display: flex;
  gap: 0.5rem;
  text-transform: uppercase;
}

.nav-btn {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: var(--transition);
}

.nav-btn:hover {
  background-color: rgba(197, 168, 128, 0.1);
  color: var(--color-gold-hover);
}

.weekdays-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 0.5rem;
  font-family: var(--font-heading);
  font-size: 0.75rem;
  color: var(--color-cream-muted);
  opacity: 0.8;
  letter-spacing: 0.05em;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.day-cell {
  background: none;
  border: 1px solid transparent;
  color: var(--color-cream-muted);
  font-family: var(--font-body);
  font-size: 0.9rem;
  padding: 8px 0;
  text-align: center;
  cursor: pointer;
  border-radius: 2px;
  transition: var(--transition);
  outline: none;
}

.day-cell:hover:not(.disabled) {
  background-color: rgba(197, 168, 128, 0.15);
  color: var(--color-cream);
  border-color: rgba(197, 168, 128, 0.3);
}

.day-cell.other-month {
  opacity: 0.3;
}

.day-cell.today {
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
}

.day-cell.selected {
  background-color: var(--color-primary) !important;
  color: var(--color-black) !important;
  font-weight: 600;
  box-shadow: 0 0 10px rgba(197, 168, 128, 0.4);
}

.day-cell.disabled {
  opacity: 0.15;
  cursor: not-allowed;
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

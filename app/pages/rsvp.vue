<template>
    <div class="container section">
        <div class="rsvp-container">
            <h1 class="text-center mb-md">RSVP</h1>
            <p class="text-center mb-sm">
                Please let us know if you can make it by December 1st, 2026.
            </p>
            <div class="text-center mb-lg">
                <CountdownTimer targetDate="2026-12-01T00:00:00" label="RSVP Deadline" :compact="true" />
            </div>

            <GlassCard v-if="submitted" class="text-center success-message">
                <h2 class="mb-sm">Thank You!</h2>
                <p>Your RSVP has been received. We can't wait to see you!</p>
                <button @click="submitted = false" class="btn mt-md">
                    Update RSVP
                </button>
            </GlassCard>

            <form v-else @submit.prevent="submitRsvp" class="rsvp-form">
                <GlassCard>
                    <div class="form-group mb-md">
                        <label class="form-label">Will you be attending?</label>
                        <div class="radio-group">
                            <label class="radio-label">
                                <input
                                    type="radio"
                                    v-model="form.attending"
                                    :value="true"
                                    required
                                />
                                Joyfully Accept
                            </label>
                            <label class="radio-label">
                                <input
                                    type="radio"
                                    v-model="form.attending"
                                    :value="false"
                                />
                                Regretfully Decline
                            </label>
                        </div>
                    </div>

                    <div v-if="form.attending" class="attending-details">
                        <div class="grid-2">
                            <div class="form-group">
                                <label class="form-label"
                                    >Number of Adults</label
                                >
                                <input
                                    type="number"
                                    v-model="form.adults"
                                    min="1"
                                    max="10"
                                    class="form-input"
                                    required
                                />
                            </div>
                            <div class="form-group">
                                <label class="form-label"
                                    >Number of Children</label
                                >
                                <input
                                    type="number"
                                    v-model="form.kids"
                                    min="0"
                                    max="10"
                                    class="form-input"
                                    required
                                />
                            </div>
                        </div>

                        <h3 class="mt-md mb-sm">Events to Attend</h3>

                        <div class="form-group checkbox-group">
                            <label class="checkbox-label">
                                <input
                                    type="checkbox"
                                    v-model="form.events.ceremony"
                                />
                                <span class="custom-checkbox"></span>
                                Ceremony
                            </label>
                            <label class="checkbox-label">
                                <input
                                    type="checkbox"
                                    v-model="form.events.dinner"
                                />
                                <span class="custom-checkbox"></span>
                                Dinner on Sunday
                            </label>
                        </div>
                    </div>

                    <div class="form-actions mt-lg">
                        <button type="submit" class="btn w-100">
                            Send RSVP
                        </button>
                    </div>
                </GlassCard>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const submitted = ref(false);
const loading = ref(false);

const form = ref({
    attending: null,
    adults: 1,
    kids: 0,
    events: {
        ceremony: true,
        dinner: false,
    },
});

onMounted(async () => {
    if (user.value) {
        const { data } = await supabase
            .from("rsvps")
            .select("*")
            .eq("user_id", user.value.id)
            .single();

        if (data) {
            form.value = {
                attending: data.attending,
                adults: data.adults_count,
                kids: data.kids_count,
                events: {
                    ceremony: data.attending_ceremony,
                    dinner: data.attending_dinner,
                },
            };
            submitted.value = true;
        }
    }
});

const submitRsvp = async () => {
    loading.value = true;
    try {
        const payload = {
            user_id: user.value.id,
            attending: form.value.attending,
            adults_count: form.value.adults,
            kids_count: form.value.kids,
            attending_ceremony: form.value.events.ceremony,
            attending_dinner: form.value.events.dinner,
        };

        const { error } = await supabase
            .from("rsvps")
            .upsert(payload, { onConflict: "user_id" });

        if (error) throw error;
        submitted.value = true;
    } catch (error) {
        console.error("Error submitting RSVP:", error.message);
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.rsvp-container {
    max-width: 600px;
    margin: 0 auto;
}

.text-center {
    text-align: center;
}

.mb-sm {
    margin-bottom: var(--spacing-sm);
}
.mb-md {
    margin-bottom: var(--spacing-md);
}
.mb-lg {
    margin-bottom: var(--spacing-lg);
}
.mt-md {
    margin-top: var(--spacing-md);
}
.mt-lg {
    margin-top: var(--spacing-lg);
}

.w-100 {
    width: 100%;
}

.success-message {
    padding: var(--spacing-xl) var(--spacing-md);
}

.radio-group {
    display: flex;
    gap: var(--spacing-md);
}

.radio-label,
.checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
}

.grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
}

.checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

/* Custom Checkbox */
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
}

.checkbox-label input:checked + .custom-checkbox {
    background-color: var(--color-primary);
}

.checkbox-label input:checked + .custom-checkbox::after {
    content: "✓";
    color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
}
</style>

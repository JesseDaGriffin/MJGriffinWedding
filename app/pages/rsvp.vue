<template>
    <div class="container section">
        <div class="rsvp-container">
            <PageHeader 
                title="RSVP" 
                subtitle="Please let us know if you can make it by December 1st, 2026." 
                subtitle-class="subtitle"
            />
            <div class="deadline-countdown">
                <CountdownTimer targetDate="2026-12-01T00:00:00" :compact="true" />
            </div>

            <GlassCard v-if="submitted" class="text-center success-message">
                <h2 class="mb-sm">Thank You!</h2>
                <p>Your RSVP has been received. We can't wait to see you!</p>
                <AppButton @click="submitted = false" class="mt-md" text="Update RSVP" />
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
                        <h3 class="mt-md mb-sm">Events to Attend</h3>

                        <div class="form-group checkbox-group">
                            <div class="event-item">
                                <label class="checkbox-label">
                                    <input
                                        type="checkbox"
                                        v-model="form.events.ceremony.attending"
                                    />
                                    <span class="custom-checkbox"></span>
                                    Ceremony
                                </label>
                                <div v-if="form.events.ceremony.attending" class="grid-2 mt-sm pl-lg" style="padding-left: 2rem;">
                                    <FormGroup 
                                        v-model="form.events.ceremony.adults" 
                                        label="Adults" 
                                        type="number" 
                                        :min="1" 
                                        :max="10" 
                                        required 
                                    />
                                    <FormGroup 
                                        v-model="form.events.ceremony.kids" 
                                        label="Children" 
                                        type="number" 
                                        :min="0" 
                                        :max="10" 
                                        required 
                                    />
                                </div>
                            </div>

                            <div class="event-item mt-md">
                                <label class="checkbox-label">
                                    <input
                                        type="checkbox"
                                        v-model="form.events.afterparty.attending"
                                    />
                                    <span class="custom-checkbox"></span>
                                    21+ Ceremony After Party
                                </label>
                                <div v-if="form.events.afterparty.attending" class="grid-1 mt-sm pl-lg" style="padding-left: 2rem; max-width: 50%;">
                                    <FormGroup 
                                        v-model="form.events.afterparty.adults" 
                                        label="Adults (21+)" 
                                        type="number" 
                                        :min="1" 
                                        :max="10" 
                                        required 
                                    />
                                </div>
                            </div>

                            <div class="event-item mt-md">
                                <label class="checkbox-label">
                                    <input
                                        type="checkbox"
                                        v-model="form.events.dinner.attending"
                                    />
                                    <span class="custom-checkbox"></span>
                                    Reception Dinner on Sunday
                                </label>
                                <div v-if="form.events.dinner.attending" class="grid-2 mt-sm pl-lg" style="padding-left: 2rem;">
                                    <FormGroup 
                                        v-model="form.events.dinner.adults" 
                                        label="Adults" 
                                        type="number" 
                                        :min="1" 
                                        :max="10" 
                                        required 
                                    />
                                    <FormGroup 
                                        v-model="form.events.dinner.kids" 
                                        label="Children" 
                                        type="number" 
                                        :min="0" 
                                        :max="10" 
                                        required 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-actions mt-lg">
                        <AppButton type="submit" block :loading="loading" text="Send RSVP" />
                    </div>
                </GlassCard>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const submitted = ref(false);
const loading = ref(false);

const form = ref({
    attending: null,
    events: {
        ceremony: { attending: false, adults: 1, kids: 0 },
        dinner: { attending: false, adults: 1, kids: 0 },
        afterparty: { attending: false, adults: 1, kids: 0 },
    },
});

watchEffect(async () => {
    const userId = user.value?.id || user.value?.sub;
    if (user.value && userId) {
        const { data } = await supabase
            .from("rsvps")
            .select("*")
            .eq("user_id", userId)
            .single();

        if (data) {
            form.value = {
                attending: data.attending,
                events: {
                    ceremony: {
                        attending: data.attending_ceremony,
                        adults: data.ceremony_adults || 1,
                        kids: data.ceremony_kids || 0,
                    },
                    dinner: {
                        attending: data.attending_dinner,
                        adults: data.dinner_adults || 1,
                        kids: data.dinner_kids || 0,
                    },
                    afterparty: {
                        attending: data.attending_afterparty,
                        adults: data.afterparty_adults || 1,
                        kids: data.afterparty_kids || 0,
                    }
                },
            };
            submitted.value = true;
        }
    }
});

const submitRsvp = async () => {
    const userId = user.value?.id || user.value?.sub;
    if (!userId) return;
    
    loading.value = true;
    try {
        const payload = {
            user_id: userId,
            attending: form.value.attending,
            adults_count: Math.max(
                form.value.events.ceremony.attending ? form.value.events.ceremony.adults : 0, 
                form.value.events.dinner.attending ? form.value.events.dinner.adults : 0, 
                form.value.events.afterparty.attending ? form.value.events.afterparty.adults : 0
            ),
            kids_count: Math.max(
                form.value.events.ceremony.attending ? form.value.events.ceremony.kids : 0, 
                form.value.events.dinner.attending ? form.value.events.dinner.kids : 0
            ),
            attending_ceremony: form.value.events.ceremony.attending,
            ceremony_adults: form.value.events.ceremony.attending ? form.value.events.ceremony.adults : 0,
            ceremony_kids: form.value.events.ceremony.attending ? form.value.events.ceremony.kids : 0,
            attending_dinner: form.value.events.dinner.attending,
            dinner_adults: form.value.events.dinner.attending ? form.value.events.dinner.adults : 0,
            dinner_kids: form.value.events.dinner.attending ? form.value.events.dinner.kids : 0,
            attending_afterparty: form.value.events.afterparty.attending,
            afterparty_adults: form.value.events.afterparty.attending ? form.value.events.afterparty.adults : 0,
            afterparty_kids: 0,
        };

        const { error } = await supabase
            .from("rsvps")
            .upsert(payload, { onConflict: "user_id" });

        if (error) throw error;
        
        // Fetch user profile to get the name for the email
        let guestName = user.value?.user_metadata?.first_name 
            ? `${user.value.user_metadata.first_name} ${user.value.user_metadata.last_name || ''}`.trim() 
            : '';
            
        if (!guestName) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('first_name, last_name')
                .eq('id', userId)
                .single();
            if (profile && (profile.first_name || profile.last_name)) {
                guestName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
            }
        }

        // Send email notification to admin
        await $fetch('/api/send-rsvp', {
            method: 'POST',
            body: {
                name: guestName,
                email: user.value?.email || '',
                attending: form.value.attending,
                ceremony: form.value.events.ceremony,
                dinner: form.value.events.dinner,
                afterparty: form.value.events.afterparty
            }
        });

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

.subtitle {
    color: var(--color-cream-muted);
    margin-bottom: 0.5rem;
}

.deadline-countdown {
    display: flex;
    justify-content: center;
    margin-bottom: var(--spacing-md);
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
    color: var(--color-cream-muted);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
}
</style>

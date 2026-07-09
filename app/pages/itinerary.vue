<template>
    <div class="container section">
        <PageHeader
            title="Weekend Itinerary"
            subtitle="Here is a sneak peek of what we're thinking so far! Keep an eye on your inbox for updates as we lock in these plans!"
            subtitle-class="subtitle"
        />

        <div class="timeline">
            <ItineraryDay
                v-for="day in itineraryDays"
                :key="day.dayNumber"
                :day="day"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";

const itineraryDays = [
    {
        dayNumber: 1,
        dayOfWeek: "Friday",
        date: "March 12th, 2027",
        events: [
            {
                title: "Family Day",
                description:
                    "Our first day is going to be family centric. We will be doing activities that are kid friendly, but should be fun for all. Here are a few activities we know we want to do: ",
                activities: [
                    '<a href="https://meowwolf.com/visit/las-vegas" target="_blank" rel="noopener noreferrer" class="event-link">Omega Mart</a>',
                    '<a href="https://area15.com/" target="_blank" rel="noopener noreferrer" class="event-link">Area 15</a>',
                    '<a href="https://newyorknewyork.mgmresorts.com/en/entertainment/the-big-apple-coaster-and-arcade.html" target="_blank" rel="noopener noreferrer" class="event-link">New York roller coaster</a>',
                    'Dinner at Excalibur for the <a href="https://excalibur.mgmresorts.com/en/entertainment/tournament-of-kings.html" target="_blank" rel="noopener noreferrer" class="event-link">Tournament of Kings </a>',
                    "After the kids go to bed, casino time",
                ],
            },
        ],
    },
    {
        dayNumber: 2,
        dayOfWeek: "Saturday",
        date: "March 13th, 2027",
        events: [
            {
                title: "The Big Day",
                description:
                    "All of our wedding day festivities can be found on the following page. ",
                link: {
                    to: "/ceremony",
                    text: "View Ceremony Details",
                    class: "btn btn-secondary mb-sm inline-block",
                    isExternal: false,
                },
            },
            {
                title: "After Party",
                description:
                    'Join us at <a href="https://www.playplayground.com/" target="_blank" rel="noopener noreferrer" class="event-link">Play Playground</a> for a night of fun.',
            },
        ],
    },
    {
        dayNumber: 3,
        dayOfWeek: "Sunday",
        date: "March 14th, 2027",
        events: [
            {
                title: "The Day After",
                description:
                    "We are still putting together the plans for the afternoon. Stay tuned!",
            },
            {
                title: "Reception Dinner",
                description:
                    'For our reception dinner, we will be meeting at <a href="https://happycamper.pizza/las-vegas/" target="_blank" rel="noopener noreferrer" class="event-link">Happy Camper</a> from <strong>6:30pm to 8:30pm</strong>. We will be providing food and bottomless drinks. Yes, that includes alcohol!',
                subDescription:
                    "Later in the night, we'll be going out on the town! (Adults only)",
            },
        ],
    },
    {
        dayNumber: 4,
        dayOfWeek: "Monday",
        date: "March 15th, 2027",
        events: [
            {
                title: "Farewells",
                description:
                    "We anticipate that most people will be traveling back home today. <br/> Safe travels and we hope you had fun!",
            },
        ],
    },
];

let observer = null;

onMounted(async () => {
    // Wait for children components to mount and layout
    await nextTick();

    const items = document.querySelectorAll(".timeline-item");

    observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px",
        },
    );

    items.forEach((el, index) => {
        el.style.setProperty("--reveal-delay", `${index * 0.15}s`);
        observer.observe(el);
    });
});

onUnmounted(() => {
    if (observer) observer.disconnect();
});
</script>

<style scoped>
.subtitle {
    color: var(--color-cream-muted);
    font-size: 1.2rem;
}

.timeline {
    max-width: 1000px;
    margin: 0 auto;
    position: relative;
    padding: 3rem 0;
}

/* Vertical line with gradient fade at top and bottom */
.timeline::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 20px;
    width: 2px;
    background: linear-gradient(
        to bottom,
        rgba(121, 145, 84, 0) 0%,
        rgba(121, 145, 84, 0.3) 10%,
        rgba(121, 145, 84, 0.3) 90%,
        rgba(121, 145, 84, 0) 100%
    );
}

@media (max-width: 767px) {
    .timeline {
        padding: 1.5rem 0;
    }

    .timeline::before {
        left: 15px;
    }
}

/* ─── Desktop Alternating Layout ─── */
@media (min-width: 768px) {
    .timeline::before {
        left: 50%;
        transform: translateX(-50%);
    }

    /* Root element of ItineraryDay component */
    :deep(.timeline-item) {
        width: 50%;
        padding-left: 0;
        padding-right: 45px;
    }

    /* Even items sit on the right side */
    :deep(.timeline-item:nth-child(even)) {
        margin-left: 50%;
        padding-right: 0;
        padding-left: 45px;
    }

    /* Alternating markers centered on 50% line */
    :deep(.timeline-item .timeline-marker) {
        left: auto;
        right: -12px;
    }

    :deep(.timeline-item:nth-child(even) .timeline-marker) {
        left: -12px;
        right: auto;
    }

    /* Slide towards the center line on reveal */
    :deep(.timeline-item:nth-child(odd) .timeline-content) {
        transform: translateX(-50px) scale(0.96);
    }

    :deep(.timeline-item:nth-child(even) .timeline-content) {
        transform: translateX(50px) scale(0.96);
    }

    :deep(.timeline-item.revealed .timeline-content) {
        transform: translate(0, 0) scale(1);
    }
}
</style>

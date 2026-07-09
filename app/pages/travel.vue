<template>
    <div class="container section">
        <PageHeader title="Travel & Accommodations" />
        <div class="travel-grid">
            <!-- Flights -->
            <GlassCard class="text-center">
                <div class="icon-container">
                    <span class="icon">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            viewBox="-2 -2 28 28"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path
                                d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 5-4 4-3-1-2 2 5 2 2 5 2-2-1-3 4-4 5 6l1.2-.7c.4-.2.7-.6.6-1.1z"
                            />
                        </svg>
                    </span>
                </div>
                <h2 class="mb-sm">Flights</h2>
                <p class="mb-md">
                    We recommend flying into
                    <strong>Harry Reid International Airport (LAS)</strong>. It
                    is the closest and most convenient airport to the Las Vegas
                    Strip.
                </p>
                <p class="small-text">
                    Pro Tip: Book your flights 3-4 months in advance for the
                    best rates.
                </p>
            </GlassCard>

            <!-- Hotels -->
            <GlassCard class="text-center">
                <div class="icon-container">
                    <span class="icon">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <rect
                                x="4"
                                y="2"
                                width="16"
                                height="20"
                                rx="2"
                                ry="2"
                            ></rect>
                            <path d="M9 22v-4h6v4"></path>
                            <path d="M8 6h.01"></path>
                            <path d="M16 6h.01"></path>
                            <path d="M12 6h.01"></path>
                            <path d="M12 10h.01"></path>
                            <path d="M12 14h.01"></path>
                            <path d="M16 10h.01"></path>
                            <path d="M16 14h.01"></path>
                            <path d="M8 10h.01"></path>
                            <path d="M8 14h.01"></path>
                        </svg>
                    </span>
                </div>
                <h2 class="mb-sm">Accommodations</h2>
                <p class="mb-md">
                    We are currently looking at booking at the
                    <a
                        href="https://www.caesars.com/flamingo-las-vegas"
                        target="_blank"
                        rel="noopener noreferrer"
                        >Flamingo Hotel</a
                    >.
                </p>
                <div class="nearby-hotels">
                    <p class="mb-sm">
                        For other convenient options right in the Center Strip,
                        these nearby hotels are also excellent choices:
                    </p>
                    <ul class="hotel-list">
                        <li>
                            <a
                                href="https://www.caesars.com/linq"
                                target="_blank"
                                rel="noopener noreferrer"
                                >The LINQ</a
                            >
                        </li>
                        <li>
                            <a
                                href="https://www.caesars.com/planet-hollywood"
                                target="_blank"
                                rel="noopener noreferrer"
                                >Planet Hollywood</a
                            >
                        </li>
                        <li>
                            <a
                                href="https://www.caesars.com/paris-las-vegas"
                                target="_blank"
                                rel="noopener noreferrer"
                                >Paris Hotel</a
                            >
                        </li>
                    </ul>
                </div>
                <p class="small-text mt-md">
                    Check back for updates on where we'll be staying.
                </p>
            </GlassCard>
        </div>

        <!-- Vegas Tips & Tricks -->
        <GlassCard class="tips-card mt-lg text-center">
            <div class="icon-container">
                <span class="icon">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path
                            d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .4 2.5 1.5 3.5.7.8 1.3 1.5 1.5 2.5"
                        />
                        <path d="M9 18h6" />
                        <path d="M10 22h4" />
                    </svg>
                </span>
            </div>
            <h2 class="mb-sm">Las Vegas Tips</h2>
            <p
                class="mb-lg"
                style="max-width: 600px; margin-left: auto; margin-right: auto"
            >
                We have done some research on our trip to Vegas and thought
                these tips might be helpful to know.
            </p>

            <div class="tips-columns">
                <!-- Left Column -->
                <div class="tips-col tips-col--left">
                    <div class="tip-item">
                        <h3>Transportation</h3>
                        <p>
                            The Strip is much longer than it looks. What appears
                            to be next door can easily be a 15-20 minute walk.
                            In addition to standard Uber and Lyft options, you
                            can try
                            <a
                                href="https://zoox.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="event-link"
                                >Zoox</a
                            >, Vegas's autonomous robotaxi service (a bit more
                            expensive, but super cool to take). For getting up
                            and down the Strip quickly, there is also the paid
                            <a
                                href="https://www.lvmonorail.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="event-link"
                                >Monorail</a
                            >.
                        </p>
                    </div>
                </div>

                <!-- Right Column -->
                <div class="tips-col tips-col--right">
                    <div class="tip-item">
                        <h3>Dispensaries</h3>
                        <p>
                            Be advised, there are many places on the strip that
                            claim they sell smoke, but can only sell CBD
                            products. You will need to go off of the strip to
                            find actual dispensaries.
                            <a
                                href="https://www.planet13lasvegas.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="event-link"
                                >Planet 13</a
                            >
                            (the world's largest dispensary) is a popular
                            destination that many people recommend.
                        </p>
                    </div>
                    <div class="tip-item">
                        <h3>Cheaper Drinking</h3>
                        <p>
                            Drinks at the hotel bars are pricey. Buy your own
                            liquor or beer from a CVS or Walgreens and enjoy
                            drinks at the room!
                        </p>
                    </div>
                </div>
            </div>
        </GlassCard>
    </div>
</template>

<style scoped>
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

.travel-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
    max-width: 1000px;
    margin: 0 auto;
}

.icon-container {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.small-text {
    font-size: 0.9rem;
    color: var(--color-cream-muted);
    font-style: italic;
}

.nearby-hotels {
    margin-top: var(--spacing-md);
    padding-top: var(--spacing-md);
    border-top: 1px solid rgba(197, 168, 128, 0.15);
}

.nearby-hotels p {
    font-size: 0.95rem;
    color: var(--color-cream-muted);
    line-height: 1.5;
}

.hotel-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem 1rem;
    margin-top: var(--spacing-sm);
}

.hotel-list li a {
    font-size: 0.9rem;
    padding: 0.4rem 1rem;
    background: rgba(8, 6, 6, 0.5);
    border: 1px solid rgba(197, 168, 128, 0.2);
    border-radius: var(--border-radius);
    display: inline-block;
    transition: var(--transition);
    color: var(--color-cream-muted);
}

.hotel-list li a:hover {
    background: rgba(197, 168, 128, 0.1);
    border-color: var(--color-primary);
    color: var(--color-primary);
}

.mt-md {
    margin-top: var(--spacing-md);
}

@media (max-width: 768px) {
    .travel-grid {
        grid-template-columns: 1fr;
    }
}

.tips-card {
    max-width: 1000px;
    margin: var(--spacing-md) auto 0;
    padding: 2.25rem 2.5rem;
}

.tips-columns {
    display: flex;
    gap: var(--spacing-md);
    text-align: left;
    margin-top: var(--spacing-md);
}

.tips-col {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

.tips-col--left {
    flex: 4.2;
}

.tips-col--right {
    flex: 5.8;
}

.tip-item {
    width: 100%;
}

.tip-item h3 {
    font-size: 1.15rem;
    color: var(--color-primary);
    margin-bottom: 0.5rem;
    font-family: var(--font-heading);
}

.tip-item p {
    font-size: 0.95rem;
    color: var(--color-cream-muted);
    line-height: 1.6;
}

@media (max-width: 768px) {
    h2 {
        font-weight: bold;
    }
}

@media (max-width: 768px) {
    .tips-columns {
        flex-direction: column;
        gap: var(--spacing-md);
    }
    .tips-col--left,
    .tips-col--right {
        flex: none;
    }
    .tip-item {
        border-left: 2px solid rgba(197, 168, 128, 0.3);
        padding-left: 1.25rem;
        margin-bottom: 0.5rem;
    }
}
</style>

import { For, Show, createSignal, onCleanup, onMount } from "solid-js";
import "./StoriesTabs.css";

const EXIT_DURATION_MS = 620;
const EXIT_PAUSE_MS = 220;
const ENTER_DURATION_MS = 820;
const AUTO_ADVANCE_BASE_MS = 3000;
const AUTO_ADVANCE_PER_WORD_MS = 220;
const MIN_AUTO_ADVANCE_MS = 6500;
const MAX_AUTO_ADVANCE_MS = 10000;

type Story = {
    label: string;
    quote: string;
    author: string;
};

type StoriesTabsProps = {
    stories: Story[];
};

function autoAdvanceDelayMs(quote: string) {
    const wordCount = quote.trim().split(/\s+/).filter(Boolean).length;

    return Math.min(
        MAX_AUTO_ADVANCE_MS,
        Math.max(MIN_AUTO_ADVANCE_MS, AUTO_ADVANCE_BASE_MS + wordCount * AUTO_ADVANCE_PER_WORD_MS),
    );
}

export default function StoriesTabs(props: StoriesTabsProps) {
    const [activeIndex, setActiveIndex] = createSignal(0);
    const [visibleIndex, setVisibleIndex] = createSignal(0);
    const [phase, setPhase] = createSignal<"idle" | "exit" | "enter">("idle");
    const visibleStory = () => props.stories[visibleIndex()] ?? props.stories[0];

    let exitTimer: number | undefined;
    let enterTimer: number | undefined;
    let autoAdvanceTimer: number | undefined;

    const clearTransitionTimers = () => {
        if (exitTimer !== undefined) {
            window.clearTimeout(exitTimer);
            exitTimer = undefined;
        }

        if (enterTimer !== undefined) {
            window.clearTimeout(enterTimer);
            enterTimer = undefined;
        }
    };

    const clearAutoAdvanceTimer = () => {
        if (autoAdvanceTimer !== undefined) {
            window.clearTimeout(autoAdvanceTimer);
            autoAdvanceTimer = undefined;
        }
    };

    const clearTimers = () => {
        clearTransitionTimers();
        clearAutoAdvanceTimer();
    };

    const prefersReducedMotion = () =>
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scheduleAutoAdvance = (index: number) => {
        clearAutoAdvanceTimer();

        if (props.stories.length < 2 || prefersReducedMotion()) {
            return;
        }

        const story = props.stories[index];

        if (!story) {
            return;
        }

        autoAdvanceTimer = window.setTimeout(() => {
            autoAdvanceTimer = undefined;
            selectStory((activeIndex() + 1) % props.stories.length);
        }, autoAdvanceDelayMs(story.quote));
    };

    const finishEnter = (index: number) => {
        setPhase("enter");

        enterTimer = window.setTimeout(() => {
            setPhase("idle");
            enterTimer = undefined;
            scheduleAutoAdvance(index);
        }, ENTER_DURATION_MS);
    };

    const selectStory = (index: number) => {
        if (index === activeIndex()) {
            if (phase() === "idle") {
                scheduleAutoAdvance(index);
            }

            return;
        }

        clearTimers();
        setActiveIndex(index);

        if (prefersReducedMotion()) {
            setVisibleIndex(index);
            setPhase("idle");
            return;
        }

        if (index === visibleIndex()) {
            finishEnter(index);
            return;
        }

        setPhase("exit");

        exitTimer = window.setTimeout(() => {
            setVisibleIndex(index);
            exitTimer = undefined;
            finishEnter(index);
        }, EXIT_DURATION_MS + EXIT_PAUSE_MS);
    };

    onMount(() => {
        scheduleAutoAdvance(activeIndex());
    });

    onCleanup(() => {
        clearTimers();
    });

    return (
        <section class="stories" aria-labelledby="stories-title">
            <div class="stories__bar" aria-hidden="true" />

            <div class="stories__card">
                <div
                    class="stories__tabs"
                    role="tablist"
                    aria-label="SpaceScale stories"
                    style={{ "--active-tab": activeIndex() }}
                >
                    <For each={props.stories}>
                        {(story, index) => (
                            <button
                                id={`stories-tab-${index() + 1}`}
                                type="button"
                                role="tab"
                                aria-selected={activeIndex() === index() ? "true" : "false"}
                                aria-controls="stories-panel"
                                classList={{
                                    "stories__tab": true,
                                    "is-active": activeIndex() === index(),
                                }}
                                onClick={() => selectStory(index())}
                            >
                                {story.label}
                            </button>
                        )}
                    </For>
                    <span class="stories__indicator" aria-hidden="true" />
                </div>

                <div
                    id="stories-panel"
                    class="stories__content"
                    role="tabpanel"
                    aria-labelledby={`stories-tab-${activeIndex() + 1}`}
                    aria-live="polite"
                >
                    <div class="stories__stage">
                        <Show when={visibleStory()} keyed>
                            {(story) => (
                                <div
                                    classList={{
                                        "stories__copy": true,
                                        "is-exiting": phase() === "exit",
                                        "is-entering": phase() === "enter",
                                    }}
                                >
                                    <p id="stories-title" class="stories__text">
                                        {`“${story.quote}”`}
                                    </p>
                                    <p class="stories__author">{story.author}</p>
                                </div>
                            )}
                        </Show>
                    </div>
                </div>
            </div>
        </section>
    );
}

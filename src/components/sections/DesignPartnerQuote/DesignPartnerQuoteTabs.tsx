import { For, Show, createSignal, onCleanup, onMount } from "solid-js";
import "./DesignPartnerQuoteTabs.css";

const EXIT_DURATION_MS = 620;
const EXIT_PAUSE_MS = 220;
const ENTER_DURATION_MS = 820;
const AUTO_ADVANCE_BASE_MS = 3000;
const AUTO_ADVANCE_PER_WORD_MS = 220;
const MIN_AUTO_ADVANCE_MS = 6500;
const MAX_AUTO_ADVANCE_MS = 10000;

type DesignPartnerCase = {
    label: string;
    quote: string;
    author: string;
};

type DesignPartnerQuoteTabsProps = {
    cases: DesignPartnerCase[];
};

function autoAdvanceDelayMs(quote: string) {
    const wordCount = quote.trim().split(/\s+/).filter(Boolean).length;

    return Math.min(
        MAX_AUTO_ADVANCE_MS,
        Math.max(MIN_AUTO_ADVANCE_MS, AUTO_ADVANCE_BASE_MS + wordCount * AUTO_ADVANCE_PER_WORD_MS),
    );
}

export default function DesignPartnerQuoteTabs(props: DesignPartnerQuoteTabsProps) {
    const [activeIndex, setActiveIndex] = createSignal(0);
    const [visibleIndex, setVisibleIndex] = createSignal(0);
    const [phase, setPhase] = createSignal<"idle" | "exit" | "enter">("idle");
    const visibleCase = () => props.cases[visibleIndex()] ?? props.cases[0];

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

        if (props.cases.length < 2 || prefersReducedMotion()) {
            return;
        }

        const caseItem = props.cases[index];

        if (!caseItem) {
            return;
        }

        autoAdvanceTimer = window.setTimeout(() => {
            autoAdvanceTimer = undefined;
            selectCase((activeIndex() + 1) % props.cases.length);
        }, autoAdvanceDelayMs(caseItem.quote));
    };

    const finishEnter = (index: number) => {
        setPhase("enter");

        enterTimer = window.setTimeout(() => {
            setPhase("idle");
            enterTimer = undefined;
            scheduleAutoAdvance(index);
        }, ENTER_DURATION_MS);
    };

    const selectCase = (index: number) => {
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
        <section class="design-partner-quote" aria-labelledby="design-partner-quote-title">
            <div class="design-partner-quote__bar" aria-hidden="true" />

            <div class="design-partner-quote__card">
                <div
                    class="design-partner-quote__tabs"
                    role="tablist"
                    aria-label="Design partner cases"
                    style={{ "--active-tab": activeIndex() }}
                >
                    <For each={props.cases}>
                        {(caseItem, index) => (
                            <button
                                id={`design-partner-quote-tab-${index() + 1}`}
                                type="button"
                                role="tab"
                                aria-selected={activeIndex() === index() ? "true" : "false"}
                                aria-controls="design-partner-quote-panel"
                                classList={{
                                    "design-partner-quote__tab": true,
                                    "is-active": activeIndex() === index(),
                                }}
                                onClick={() => selectCase(index())}
                            >
                                {caseItem.label}
                            </button>
                        )}
                    </For>
                    <span class="design-partner-quote__indicator" aria-hidden="true" />
                </div>

                <div
                    id="design-partner-quote-panel"
                    class="design-partner-quote__content"
                    role="tabpanel"
                    aria-labelledby={`design-partner-quote-tab-${activeIndex() + 1}`}
                    aria-live="polite"
                >
                    <div class="design-partner-quote__stage">
                        <Show when={visibleCase()} keyed>
                            {(caseItem) => (
                                <div
                                    classList={{
                                        "design-partner-quote__copy": true,
                                        "is-exiting": phase() === "exit",
                                        "is-entering": phase() === "enter",
                                    }}
                                >
                                    <p id="design-partner-quote-title" class="design-partner-quote__text">
                                        {`“${caseItem.quote}”`}
                                    </p>
                                    <p class="design-partner-quote__author">{caseItem.author}</p>
                                </div>
                            )}
                        </Show>
                    </div>
                </div>
            </div>
        </section>
    );
}

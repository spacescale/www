import { createEffect, createSignal, onCleanup } from "solid-js";
import "./HeroWorkloadRotator.css";

// These complete sentences become the animated hero subcopy.
const phrases = [
    "Deploy containers onto high-performance infrastructure.",
    "Run latency-sensitive services close to the metal.",
    "Launch long-running AI agents without babysitting servers.",
    "Ship realtime APIs with predictable compute.",
    "Run fast AI inference on isolated microVMs.",
    "Run reliable high-traffic web apps.",
    "Run untrusted code inside blazingly fast isolated microVMs.",
    "Launch workloads with cold starts measured in milliseconds.",
    "Run large batch jobs at scale.",
];

// Keep timing constants named so the animation can be tuned without reading
// through the state machine below.
const typeDelayMs = 48;
const eraseDelayMs = 28;
const holdDelayMs = 2200;
const switchDelayMs = 220;

export default function HeroWorkloadRotator() {
    // Solid signals are small reactive values. Reading uses phraseIndex().
    // Writing uses setPhraseIndex(nextValue).
    const [phraseIndex, setPhraseIndex] = createSignal(0);
    const [characterIndex, setCharacterIndex] = createSignal(phrases[0].length);
    const [text, setText] = createSignal(phrases[0]);
    const [isErasing, setIsErasing] = createSignal(true);

    createEffect(() => {
        // Respect users who ask the OS/browser for less motion. They get the
        // first phrase as normal static text instead of a typing loop.
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        if (prefersReducedMotion) {
            setText(phrases[0]);
            return;
        }

        let timeoutId: number | undefined;
        const currentPhrase = phrases[phraseIndex()];

        // The animation is a tiny state machine:
        // erase current phrase -> switch phrase -> type next phrase -> hold.
        if (isErasing()) {
            if (characterIndex() > 0) {
                timeoutId = window.setTimeout(() => {
                    const nextCharacterIndex = characterIndex() - 1;

                    setCharacterIndex(nextCharacterIndex);
                    setText(currentPhrase.slice(0, nextCharacterIndex));
                }, eraseDelayMs);
            } else {
                // Once the phrase is fully erased, move to the next phrase and
                // start typing again.
                timeoutId = window.setTimeout(() => {
                    const nextPhraseIndex = (phraseIndex() + 1) % phrases.length;

                    setPhraseIndex(nextPhraseIndex);
                    setIsErasing(false);
                }, switchDelayMs);
            }
        } else if (characterIndex() < currentPhrase.length) {
            timeoutId = window.setTimeout(() => {
                const nextCharacterIndex = characterIndex() + 1;

                setCharacterIndex(nextCharacterIndex);
                setText(currentPhrase.slice(0, nextCharacterIndex));
            }, typeDelayMs);
        } else {
            // Full phrase is visible. Pause before erasing it.
            timeoutId = window.setTimeout(() => {
                setIsErasing(true);
            }, holdDelayMs);
        }

        // createEffect reruns after each signal update. Cleanup cancels the old
        // timer so we never have multiple timers racing each other.
        onCleanup(() => {
            if (timeoutId !== undefined) {
                window.clearTimeout(timeoutId);
            }
        });
    });

    return (
        <>
            <span class="hero-workload-rotator__text">{text()}</span>
            <span class="hero-workload-rotator__cursor" aria-hidden="true" />
        </>
    );
}

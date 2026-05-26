import { For, Show, createEffect, createMemo, createSignal, onCleanup } from "solid-js";
import "./HeroIgniteSurface.css";

const deployCommand = "spacescale ignite my-org/trading-api:latest --region ca-east";
const statusCommand = "spacescale ignite status trading-api";
const prompt = "scale@edge:~$";

const deployOutputLines = [
    "image pull complete: my-org/trading-api:latest",
    "placement auction complete",
    "microVM ignition complete: 118ms",
    "router detected port 8080/http",
    "endpoint mapped",
] as const;

const statusOutputLines = [
    "status: healthy",
    "replicas: 2",
    "route: 8080/http public",
    "region: ca-east",
] as const;

const finalEndpoint = "https://trading-api.spacescale.run";
const INITIAL_CURSOR_DELAY_MS = 3000;
const TYPE_INTERVAL_MS = 56;
const OUTPUT_DELAY_MS = 340;
const STATUS_PROMPT_DELAY_MS = 900;
const PROMPT_TRAIL_DELAY_MS = 360;
const PROMPT_TRAIL_COUNT = 2;
const STATUS_CURSOR_DELAY_MS = 1200;
const STATUS_OUTPUT_DELAY_MS = 220;

interface Props {
    active: boolean;
    onComplete?: () => void;
}

export default function HeroIgniteSurface(props: Props) {
    const [deployTypedLength, setDeployTypedLength] = createSignal(0);
    const [visibleDeployOutputCount, setVisibleDeployOutputCount] = createSignal(0);
    const [isEndpointVisible, setIsEndpointVisible] = createSignal(false);
    const [visiblePromptTrailCount, setVisiblePromptTrailCount] = createSignal(0);
    const [isStatusPromptVisible, setIsStatusPromptVisible] = createSignal(false);
    const [statusTypedLength, setStatusTypedLength] = createSignal(0);
    const [visibleStatusOutputCount, setVisibleStatusOutputCount] = createSignal(0);
    const typedDeployCommand = createMemo(() => deployCommand.slice(0, deployTypedLength()));
    const typedStatusCommand = createMemo(() => statusCommand.slice(0, statusTypedLength()));
    const visibleDeployOutput = createMemo(() => deployOutputLines.slice(0, visibleDeployOutputCount()));
    const visibleStatusOutput = createMemo(() => statusOutputLines.slice(0, visibleStatusOutputCount()));

    let activeInterval: number | undefined;
    const timers: number[] = [];

    const clearTimers = () => {
        if (activeInterval !== undefined) {
            window.clearInterval(activeInterval);
            activeInterval = undefined;
        }

        for (const timer of timers) {
            window.clearTimeout(timer);
        }

        timers.length = 0;
    };

    const queueTimer = (callback: () => void, delay: number) => {
        const timer = window.setTimeout(callback, delay);
        timers.push(timer);
    };

    const resetSequence = () => {
        clearTimers();
        setDeployTypedLength(0);
        setVisibleDeployOutputCount(0);
        setIsEndpointVisible(false);
        setVisiblePromptTrailCount(0);
        setIsStatusPromptVisible(false);
        setStatusTypedLength(0);
        setVisibleStatusOutputCount(0);
    };

    const revealStatusOutput = () => {
        statusOutputLines.forEach((_, index) => {
            queueTimer(() => {
                setVisibleStatusOutputCount(index + 1);
                if (index === statusOutputLines.length - 1) {
                    props.onComplete?.();
                }
            }, STATUS_OUTPUT_DELAY_MS * (index + 1));
        });
    };

    const typeStatusCommand = () => {
        activeInterval = window.setInterval(() => {
            setStatusTypedLength((length) => {
                if (length >= statusCommand.length) {
                    if (activeInterval !== undefined) {
                        window.clearInterval(activeInterval);
                        activeInterval = undefined;
                    }

                    revealStatusOutput();
                    return length;
                }

                return length + 1;
            });
        }, TYPE_INTERVAL_MS);
    };

    const showStatusPrompt = () => {
        setIsStatusPromptVisible(true);
        queueTimer(typeStatusCommand, STATUS_CURSOR_DELAY_MS);
    };

    const revealPromptTrail = () => {
        for (let index = 0; index < PROMPT_TRAIL_COUNT; index += 1) {
            queueTimer(() => {
                setVisiblePromptTrailCount(index + 1);
            }, PROMPT_TRAIL_DELAY_MS * (index + 1));
        }

        queueTimer(showStatusPrompt, PROMPT_TRAIL_DELAY_MS * (PROMPT_TRAIL_COUNT + 1));
    };

    const revealDeployOutput = () => {
        deployOutputLines.forEach((_, index) => {
            queueTimer(() => {
                setVisibleDeployOutputCount(index + 1);
            }, OUTPUT_DELAY_MS * (index + 1));
        });

        queueTimer(() => {
            setIsEndpointVisible(true);
            queueTimer(revealPromptTrail, STATUS_PROMPT_DELAY_MS);
        }, OUTPUT_DELAY_MS * (deployOutputLines.length + 2));
    };

    const typeDeployCommand = () => {
        activeInterval = window.setInterval(() => {
            setDeployTypedLength((length) => {
                if (length >= deployCommand.length) {
                    if (activeInterval !== undefined) {
                        window.clearInterval(activeInterval);
                        activeInterval = undefined;
                    }

                    revealDeployOutput();
                    return length;
                }

                return length + 1;
            });
        }, TYPE_INTERVAL_MS);
    };

    const startSequence = () => {
        resetSequence();

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setDeployTypedLength(deployCommand.length);
            setVisibleDeployOutputCount(deployOutputLines.length);
            setIsEndpointVisible(true);
            setVisiblePromptTrailCount(PROMPT_TRAIL_COUNT);
            setIsStatusPromptVisible(true);
            setStatusTypedLength(statusCommand.length);
            setVisibleStatusOutputCount(statusOutputLines.length);
            props.onComplete?.();
            return;
        }

        queueTimer(typeDeployCommand, INITIAL_CURSOR_DELAY_MS);
    };

    createEffect(() => {
        if (props.active) {
            startSequence();
            return;
        }

        resetSequence();
    });

    onCleanup(() => {
        clearTimers();
    });

    return (
        <div class="hero-ignite-surface">
            <div class="hero-ignite-surface__lines">
                <span class="hero-ignite-surface__line hero-ignite-surface__command">
                    <span class="hero-ignite-surface__prompt">{prompt}</span>{" "}
                    <span>{typedDeployCommand()}</span>
                    <Show when={deployTypedLength() < deployCommand.length}>
                        <span class="hero-ignite-surface__cursor" />
                    </Show>
                </span>

                <For each={visibleDeployOutput()}>
                    {(line) => (
                        <span class="hero-ignite-surface__line hero-ignite-surface__checkpoint">
                            <span class="hero-ignite-surface__mark">[+]</span>
                            <span>{line}</span>
                        </span>
                    )}
                </For>

                <Show when={isEndpointVisible()}>
                    <span class="hero-ignite-surface__line hero-ignite-surface__endpoint">
                        live at <span>{finalEndpoint}</span>
                    </span>
                </Show>

                <For each={Array.from({ length: visiblePromptTrailCount() })}>
                    {() => (
                        <span class="hero-ignite-surface__line hero-ignite-surface__prompt-trail">
                            <span class="hero-ignite-surface__prompt">{prompt}</span>
                        </span>
                    )}
                </For>

                <Show when={isStatusPromptVisible()}>
                    <span class="hero-ignite-surface__line hero-ignite-surface__command hero-ignite-surface__status-command">
                        <span class="hero-ignite-surface__prompt">{prompt}</span>{" "}
                        <span>{typedStatusCommand()}</span>
                        <Show when={statusTypedLength() < statusCommand.length}>
                            <span class="hero-ignite-surface__cursor" />
                        </Show>
                    </span>
                </Show>

                <For each={visibleStatusOutput()}>
                    {(line) => (
                        <span class="hero-ignite-surface__line hero-ignite-surface__status-output">
                            {line}
                        </span>
                    )}
                </For>
            </div>
        </div>
    );
}

import { For, Show, createEffect, createMemo, createSignal, onCleanup } from "solid-js";
import "./HeroMachinesSurface.css";

const userPrompt =
    "give 4 sub-agents isolated SpaceScale Machines to work in, integrate the result, and show me the app";

const machineReplies = [
    {
        thinking: "preparing a clean base workspace for the agent run",
        title: "preparing base workspace",
        commands: ["$ spacescale machine create --template dev --name checkout-base"],
        results: ["machine ready"],
    },
    {
        thinking: "moving the repository into the isolated Machine",
        title: "uploading repo",
        commands: ["$ spacescale machine upload checkout-base ./repo /workspace/app"],
        results: ["files uploaded"],
    },
    {
        thinking: "cloning the prepared Machine into separate workspaces",
        title: "launching parallel workspaces",
        commands: [
            "$ spacescale machine clone checkout-base --name {checkout-api,checkout-ui,checkout-tests,checkout-risk}",
        ],
        results: ["4 isolated Machines ready"],
    },
    {
        thinking: "coordinating sub-agents across isolated workspace state",
        title: "coordinating sub-agents",
        results: [
            "checkout-api: payment edge cases patched",
            "checkout-ui: checkout preview state fixed",
            "checkout-tests: regression coverage added",
            "checkout-risk: secrets and outbound access checked",
        ],
    },
    {
        thinking: "preparing one integration Machine for reviewed outputs",
        title: "creating integration workspace",
        commands: ["$ spacescale machine clone checkout-base --name checkout-integration"],
        results: ["integration Machine ready"],
    },
    {
        thinking: "collecting each workspace output into the integration Machine",
        title: "copying workspace outputs",
        commands: [
            "$ spacescale machine copy checkout-api:/workspace/output checkout-integration:/workspace/agents/api",
            "$ spacescale machine copy checkout-ui:/workspace/output checkout-integration:/workspace/agents/ui",
            "$ spacescale machine copy checkout-tests:/workspace/output checkout-integration:/workspace/agents/tests",
            "$ spacescale machine copy checkout-risk:/workspace/output checkout-integration:/workspace/agents/risk",
        ],
        results: ["outputs copied"],
    },
    {
        thinking: "opening a live preview from the integrated Machine state",
        title: "exposing preview",
        commands: ["$ spacescale machine expose checkout-integration --port 4321:http"],
        results: ["preview live at https://checkout-integration.spacescale.run"],
    },
] as const;

type MachineReply = {
    readonly thinking: string;
    readonly title: string;
    readonly commands?: readonly string[];
    readonly results?: readonly string[];
};

const TYPE_INTERVAL_MS = 42;
const INITIAL_TYPE_DELAY_MS = 900;
const SUBMIT_DELAY_MS = 520;
const AGENT_REPLY_DELAY_MS = 560;
const THINKING_DELAY_MS = 3600;
const NEXT_THINKING_DELAY_MS = 520;

interface Props {
    active: boolean;
    onComplete?: () => void;
}

export default function HeroMachinesSurface(props: Props) {
    const [typedLength, setTypedLength] = createSignal(0);
    const [isUserSubmitted, setIsUserSubmitted] = createSignal(false);
    const [visibleReplyCount, setVisibleReplyCount] = createSignal(0);
    const [thinkingReplyIndex, setThinkingReplyIndex] = createSignal<number | null>(null);
    const [isThreadShifting, setIsThreadShifting] = createSignal(false);
    const typedPrompt = createMemo(() => userPrompt.slice(0, typedLength()));
    const visibleReplies = createMemo(() => machineReplies.slice(0, visibleReplyCount()));
    const thinkingReply = createMemo(() => {
        const index = thinkingReplyIndex();
        return index === null ? null : machineReplies[index];
    });

    let activeInterval: number | undefined;
    let shiftTimer: number | undefined;
    const timers: number[] = [];

    const clearTimers = () => {
        if (activeInterval !== undefined) {
            window.clearInterval(activeInterval);
            activeInterval = undefined;
        }

        if (shiftTimer !== undefined) {
            window.clearTimeout(shiftTimer);
            shiftTimer = undefined;
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

    const pulseThreadShift = () => {
        setIsThreadShifting(false);
        window.requestAnimationFrame(() => {
            setIsThreadShifting(true);
            shiftTimer = window.setTimeout(() => {
                setIsThreadShifting(false);
            }, 900);
        });
    };

    const resetSequence = () => {
        clearTimers();
        setTypedLength(0);
        setIsUserSubmitted(false);
        setVisibleReplyCount(0);
        setThinkingReplyIndex(null);
        setIsThreadShifting(false);
    };

    const revealAgentReply = () => {
        const revealReply = (index: number) => {
            if (index >= machineReplies.length) {
                setThinkingReplyIndex(null);
                props.onComplete?.();
                return;
            }

            setThinkingReplyIndex(index);
            pulseThreadShift();
            queueTimer(() => {
                setThinkingReplyIndex(null);
                setVisibleReplyCount(index + 1);
                pulseThreadShift();
                queueTimer(() => revealReply(index + 1), NEXT_THINKING_DELAY_MS);
            }, THINKING_DELAY_MS);
        };

        revealReply(0);
    };

    const submitPrompt = () => {
        setIsUserSubmitted(true);
        setTypedLength(0);
        queueTimer(revealAgentReply, AGENT_REPLY_DELAY_MS);
    };

    const typePrompt = () => {
        activeInterval = window.setInterval(() => {
            setTypedLength((length) => {
                if (length >= userPrompt.length) {
                    if (activeInterval !== undefined) {
                        window.clearInterval(activeInterval);
                        activeInterval = undefined;
                    }

                    queueTimer(submitPrompt, SUBMIT_DELAY_MS);
                    return length;
                }

                return length + 1;
            });
        }, TYPE_INTERVAL_MS);
    };

    const startSequence = () => {
        resetSequence();

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setIsUserSubmitted(true);
            setVisibleReplyCount(machineReplies.length);
            setThinkingReplyIndex(null);
            props.onComplete?.();
            return;
        }

        queueTimer(typePrompt, INITIAL_TYPE_DELAY_MS);
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
        <div class="hero-machines-surface">
            <div class="hero-machines-surface__thread" aria-hidden="true">
                <div
                    class="hero-machines-surface__thread-inner"
                    classList={{
                        "hero-machines-surface__thread-inner--shifting": isThreadShifting(),
                    }}
                >
                    <Show when={isUserSubmitted()}>
                        <div class="hero-machines-surface__human-message">
                            <p>{userPrompt}</p>
                        </div>
                    </Show>

                    <For each={visibleReplies()}>
                        {(reply, index) => (
                            <MachineReplyBlock reply={reply} index={index()} />
                        )}
                    </For>

                    <Show when={thinkingReply()}>
                        {(reply) => <MachineThinkingRow text={reply().thinking} />}
                    </Show>
                </div>
            </div>

            <div class="hero-machines-surface__composer">
                <div class="hero-machines-surface__composer-box">
                    <p
                        classList={{
                            "hero-machines-surface__composer-placeholder": typedLength() === 0,
                            "hero-machines-surface__composer-text": typedLength() > 0,
                        }}
                    >
                        {typedLength() > 0 ? typedPrompt() : "Message Agent..."}
                        <Show when={typedLength() > 0 && !isUserSubmitted()}>
                            <span class="hero-machines-surface__cursor" />
                        </Show>
                    </p>
                    <div class="hero-machines-surface__composer-actions">
                        <span aria-hidden="true" />
                        <button type="button" aria-label="Send message">
                            ↗
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MachineThinkingRow(props: { text: string }) {
    return (
        <div class="hero-machines-surface__agent-row hero-machines-surface__agent-row--thinking">
            <div class="hero-machines-surface__agent-mark">
                <span>⬡</span>
            </div>
            <div class="hero-machines-surface__thinking">
                <span>{props.text}</span>
                <span class="hero-machines-surface__thinking-dots" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                </span>
            </div>
        </div>
    );
}

function MachineReplyBlock(props: { reply: MachineReply; index: number }) {
    return (
        <div
            class="hero-machines-surface__agent-row"
            style={{ "--reply-index": props.index }}
        >
            <div class="hero-machines-surface__agent-mark">
                <span>⬡</span>
            </div>
            <div class="hero-machines-surface__reply-block">
                <For each={props.reply.commands ?? []}>
                    {(command) => (
                        <p class="hero-machines-surface__reply-command">{command}</p>
                    )}
                </For>
                <For each={props.reply.results ?? []}>
                    {(result) => (
                        <p class="hero-machines-surface__reply-result">
                            <span>[+]</span>
                            {result}
                        </p>
                    )}
                </For>
            </div>
        </div>
    );
}

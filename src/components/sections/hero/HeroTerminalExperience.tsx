import { createSignal, onCleanup } from "solid-js";
import HeroIgniteSurface from "./HeroIgniteSurface";
import HeroMachinesSurface from "./HeroMachinesSurface";

type HeroTerminalTab = "ignite" | "machines";
const AUTO_SWITCH_DELAY_MS = 5000;

const tabs = [
    { id: "ignite", label: "IGNITE" },
    { id: "machines", label: "MACHINES" },
] as const satisfies ReadonlyArray<{ id: HeroTerminalTab; label: string }>;

export default function HeroTerminalExperience() {
    const [activeTab, setActiveTab] = createSignal<HeroTerminalTab>("ignite");
    const isMachinesTab = () => activeTab() === "machines";
    let autoSwitchTimer: number | undefined;

    const clearAutoSwitch = () => {
        if (autoSwitchTimer !== undefined) {
            window.clearTimeout(autoSwitchTimer);
            autoSwitchTimer = undefined;
        }
    };

    const selectTab = (tab: HeroTerminalTab) => {
        if (tab === activeTab()) {
            return;
        }

        clearAutoSwitch();
        setActiveTab(tab);
    };

    const queueAutoSwitch = (tab: HeroTerminalTab) => {
        clearAutoSwitch();
        autoSwitchTimer = window.setTimeout(() => {
            autoSwitchTimer = undefined;
            setActiveTab(tab);
        }, AUTO_SWITCH_DELAY_MS);
    };

    const handleIgniteComplete = () => {
        if (activeTab() === "ignite") {
            queueAutoSwitch("machines");
        }
    };

    const handleMachinesComplete = () => {
        if (activeTab() === "machines") {
            queueAutoSwitch("ignite");
        }
    };

    onCleanup(clearAutoSwitch);

    return (
        <>
            <div class="hero-terminal__topbar">
                <div class="hero-terminal__traffic-lights" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                </div>

                <div class="hero-terminal__tabs" role="tablist" aria-label="Execution surfaces">
                    {tabs.map((tab) => (
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab() === tab.id}
                            classList={{
                                "hero-terminal__tab": true,
                                "hero-terminal__tab--active": activeTab() === tab.id,
                            }}
                            onClick={() => selectTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                    <span
                        class="hero-terminal__tab-indicator"
                        data-active-tab={activeTab()}
                        aria-hidden="true"
                    />
                </div>
            </div>

            <div class="hero-terminal__toolbar">
                <div class="hero-terminal__new-shell">
                    <span>≡</span>
                    <span>{isMachinesTab() ? "+ New chat" : "+ New shell"}</span>
                </div>

                <div
                    classList={{
                        "hero-terminal__session": true,
                        "hero-terminal__session--machines": isMachinesTab(),
                    }}
                >
                    <span>{isMachinesTab() ? "Checkout Flow Fix Session" : "Linux shell"}</span>
                    <span>▾</span>
                </div>
            </div>

            <div class="hero-terminal__surface" data-active-tab={activeTab()}>
                <div
                    classList={{
                        "hero-terminal__pane": true,
                        "hero-terminal__pane--ignite": true,
                        "hero-terminal__pane--active": activeTab() === "ignite",
                    }}
                    aria-hidden={activeTab() !== "ignite"}
                >
                    <HeroIgniteSurface
                        active={activeTab() === "ignite"}
                        onComplete={handleIgniteComplete}
                    />
                </div>
                <div
                    classList={{
                        "hero-terminal__pane": true,
                        "hero-terminal__pane--machines": true,
                        "hero-terminal__pane--active": activeTab() === "machines",
                    }}
                    aria-hidden={activeTab() !== "machines"}
                >
                    <HeroMachinesSurface
                        active={activeTab() === "machines"}
                        onComplete={handleMachinesComplete}
                    />
                </div>
            </div>
        </>
    );
}

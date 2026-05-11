import { For, createSignal, onCleanup, onMount } from "solid-js";
import "./TelemetryMetrics.css";

type MetricSample = {
    value: string;
    width: number;
};

type TelemetryMetric = {
    label: string;
    emphasis: "normal" | "strong";
    samples: MetricSample[];
};

const telemetryRows: TelemetryMetric[] = [
    {
        label: "CPU",
        emphasis: "normal",
        samples: [
            { value: "23%", width: 72 },
            { value: "26%", width: 82 },
            { value: "31%", width: 96 },
            { value: "28%", width: 88 },
            { value: "24%", width: 76 },
            { value: "23%", width: 72 },
        ],
    },
    {
        label: "MEMORY",
        emphasis: "normal",
        samples: [
            { value: "4.2 / 16 GB", width: 82 },
            { value: "4.2 / 16 GB", width: 82 },
            { value: "4.2 / 16 GB", width: 82 },
            { value: "4.2 / 16 GB", width: 82 },
            { value: "4.3 / 16 GB", width: 84 },
            { value: "4.3 / 16 GB", width: 84 },
        ],
    },
    {
        label: "DISK I/O",
        emphasis: "normal",
        samples: [{ value: "120 MB/s read", width: 140 }],
    },
    {
        label: "NETWORK IN",
        emphasis: "strong",
        samples: [
            { value: "840 Mbps", width: 260 },
            { value: "910 Mbps", width: 282 },
            { value: "780 Mbps", width: 238 },
            { value: "1.1 Gbps", width: 300 },
            { value: "960 Mbps", width: 270 },
            { value: "840 Mbps", width: 260 },
        ],
    },
    {
        label: "NETWORK OUT",
        emphasis: "normal",
        samples: [
            { value: "320 Mbps", width: 100 },
            { value: "360 Mbps", width: 112 },
            { value: "410 Mbps", width: 128 },
            { value: "295 Mbps", width: 92 },
            { value: "340 Mbps", width: 106 },
            { value: "320 Mbps", width: 100 },
        ],
    },
];

export default function TelemetryMetrics() {
    const [sampleIndex, setSampleIndex] = createSignal(0);

    onMount(() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReducedMotion) {
            return;
        }

        const intervalId = window.setInterval(() => {
            setSampleIndex((index) => (index + 1) % telemetryRows[0].samples.length);
        }, 2800);

        onCleanup(() => window.clearInterval(intervalId));
    });

    return (
        <section class="telemetry-metrics" aria-labelledby="telemetry-metrics-title">
            <header class="telemetry-metrics__header">
                <h3 id="telemetry-metrics-title">VM TELEMETRY</h3>
            </header>
            <div class="telemetry-metrics__rule" aria-hidden="true" />

            <dl class="telemetry-metrics__list">
                <For each={telemetryRows}>
                    {(metric) => {
                        const sample = () =>
                            metric.samples.length === 1
                                ? metric.samples[0]
                                : metric.samples[sampleIndex()];

                        return (
                            <div class="telemetry-metrics__metric">
                                <div class="telemetry-metrics__label-row">
                                    <dt>{metric.label}</dt>
                                    <dd>{sample().value}</dd>
                                </div>
                                <div class="telemetry-metrics__meter" aria-hidden="true">
                                    <span
                                        class={`telemetry-metrics__meter-fill telemetry-metrics__meter-fill--${metric.emphasis}`}
                                        style={`width: ${sample().width}px`}
                                    />
                                </div>
                            </div>
                        );
                    }}
                </For>

                <div class="telemetry-metrics__metric telemetry-metrics__metric--uptime">
                    <div class="telemetry-metrics__label-row">
                        <dt>UPTIME</dt>
                        <dd>14d 6h 32m</dd>
                    </div>
                </div>
            </dl>
        </section>
    );
}

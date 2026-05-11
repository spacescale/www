import { For } from "solid-js";
import "./TelemetryLogStream.css";

const logTones = {
    info: {
        label: "INFO",
        badgeBackground: "rgba(102, 153, 229, 0.12)",
        badgeColor: "#6699e5",
        messageColor: "#8a8f99",
    },
    warn: {
        label: "WARN",
        badgeBackground: "rgba(217, 178, 77, 0.12)",
        badgeColor: "#d9b24d",
        messageColor: "#d9b24d",
    },
    event: {
        label: "EVENT",
        badgeBackground: "rgba(102, 217, 166, 0.12)",
        badgeColor: "#66d9a6",
        messageColor: "#8a8f99",
    },
} as const;

const logRows = [
    {
        time: "12:04:31.882",
        tone: "event",
        short: "node joined fabric: ca-east-04a",
        long: "node joined fabric node=ca-east-04a region=ca-east capacity=32vcpu hypervisor=kvm",
    },
    {
        time: "12:04:31.901",
        tone: "info",
        short: "ignite request accepted: trading-api",
        long: "ignite request accepted image=my-org/trading-api:latest target_regions=ca-east replicas=2",
    },
    {
        time: "12:04:32.004",
        tone: "info",
        short: "placement auction opened: 9 bidders",
        long: "placement auction opened auction=auc_7f21 region=ca-east bidders=9 workload=trading-api",
    },
    {
        time: "12:04:32.118",
        tone: "event",
        short: "placement auction complete: 12ms",
        long: "placement auction complete winner=ca-east-04a bid=12ms free_cpu=84% free_mem=71%",
    },
    {
        time: "12:04:32.340",
        tone: "info",
        short: "microVM ignition started: vm-fc-91b2",
        long: "microvm ignition started vm=vm-fc-91b2 jailer_uid=992 kernel=spacescale-kvm profile=ignite",
    },
    {
        time: "12:04:32.558",
        tone: "event",
        short: "microVM ready: 118ms",
        long: "microvm ready vm=vm-fc-91b2 boot_time=118ms workload=trading-api region=ca-east-04",
    },
    {
        time: "12:04:33.002",
        tone: "info",
        short: "stdout stream attached: scoutd",
        long: "runtime attached stdout stream vm=vm-fc-91b2 source=scoutd destination=control-plane",
    },
    {
        time: "12:04:33.214",
        tone: "event",
        short: "router detected port: 8080/http",
        long: "router detected exposed_port=8080 protocol=http workload=trading-api visibility=public",
    },
    {
        time: "12:04:33.440",
        tone: "info",
        short: "endpoint mapped: trading-api",
        long: "endpoint mapped domain=trading-api.spacescale.run target=vm-fc-91b2:8080 tls=managed",
    },
    {
        time: "12:04:33.802",
        tone: "warn",
        short: "capacity jitter delayed bidder",
        long: "capacity jitter delayed bidder node=ca-east-09c delay=50ms reason=mid_utilization",
    },
    {
        time: "12:04:34.001",
        tone: "info",
        short: "health probe registered: /healthz",
        long: "health probe registered path=/healthz interval=10s timeout=2s vm=vm-fc-91b2",
    },
    {
        time: "12:04:34.220",
        tone: "event",
        short: "replica launched: ca-east-09b",
        long: "replica launched vm=vm-fc-92a8 node=ca-east-09b router_weight=50 lifecycle=active",
    },
    {
        time: "12:04:34.558",
        tone: "info",
        short: "request routed: edge ca-east",
        long: "request routed edge=ca-east route=trading-api.spacescale.run latency=4ms upstream=vm-fc-91b2",
    },
    {
        time: "12:04:34.890",
        tone: "event",
        short: "workload live: healthy",
        long: "workload live url=https://trading-api.spacescale.run replicas=2 logs=streaming status=healthy",
    },
    {
        time: "12:04:35.004",
        tone: "info",
        short: "node heartbeat: ca-east-04a",
        long: "node heartbeat received node=ca-east-04a microvms=18 alloc_cpu=62% alloc_mem=49%",
    },
    {
        time: "12:04:35.221",
        tone: "event",
        short: "fabric route installed",
        long: "private fabric route installed workload=trading-api cidr=10.42.18.0/24 mesh=ca-east",
    },
    {
        time: "12:04:35.488",
        tone: "warn",
        short: "auction bidder skipped",
        long: "auction bidder skipped node=ca-east-02d reason=reserved_core_pressure available_cores=1",
    },
    {
        time: "12:04:35.782",
        tone: "info",
        short: "log checkpoint persisted",
        long: "log stream checkpoint persisted workload=trading-api cursor=log_19fd8 consumer=dashboard",
    },
    {
        time: "12:04:36.016",
        tone: "event",
        short: "lifecycle: starting -> running",
        long: "lifecycle state transition workload=trading-api previous=starting current=running source=scaled",
    },
    {
        time: "12:04:36.284",
        tone: "info",
        short: "control-plane ack: committed",
        long: "control-plane ack received auction=auc_7f21 placement=committed reservations=2 duration=134ms",
    },
] as const;

export default function TelemetryLogStream() {
    const rowsForTrack = [...logRows, ...logRows];

    return (
        <section class="telemetry-log-stream" aria-labelledby="telemetry-log-stream-title">
            <header class="telemetry-log-stream__header">
                <h3 id="telemetry-log-stream-title">LOG STREAM</h3>
                <span class="telemetry-log-stream__live" aria-label="live">
                    <span class="telemetry-log-stream__live-dot" aria-hidden="true" />
                    live
                </span>
            </header>
            <div class="telemetry-log-stream__rule" aria-hidden="true" />

            <div class="telemetry-log-stream__rows-window">
                <ol class="telemetry-log-stream__rows" aria-label="Log stream entries">
                    <For each={rowsForTrack}>
                        {(row) => {
                            const tone = logTones[row.tone];

                            return (
                                <li class="telemetry-log-stream__row">
                                    <time>{row.time}</time>
                                    <span
                                        class="telemetry-log-stream__badge"
                                        style={`--telemetry-log-badge-bg: ${tone.badgeBackground}; --telemetry-log-badge-color: ${tone.badgeColor};`}
                                    >
                                        {tone.label}
                                    </span>
                                    <span
                                        class="telemetry-log-stream__message"
                                        style={`--telemetry-log-message-color: ${tone.messageColor};`}
                                    >
                                        <span class="telemetry-log-stream__message-short">{row.short}</span>
                                        <span class="telemetry-log-stream__message-long">{row.long}</span>
                                    </span>
                                </li>
                            );
                        }}
                    </For>
                </ol>
            </div>
        </section>
    );
}

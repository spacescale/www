import { createSignal, For } from "solid-js";

const cases = [
  {
    label: "CASE 1",
    quote:
      "We are building SpaceScale around real workloads, not demo apps. Every design partner gives us sharper constraints around boot time, routing, isolation, and operational visibility.",
    author: "TOBILOBA OGUNDIYAN",
  },
  {
    label: "CASE 2",
    quote:
      "Running inference at the edge with dedicated silicon — no noisy neighbours, no cold-start surprises. SpaceScale made bare-metal feel like a managed service for the first time.",
    author: "DESIGN PARTNER",
  },
  {
    label: "CASE 3",
    quote:
      "We built an internal fleet-routing platform on top of the SpaceScale API in under a week. Zero-downtime rollouts and programmatic scaling work exactly the way the docs say they do.",
    author: "DESIGN PARTNER",
  },
];

export default function CaseTabs() {
  const [active, setActive] = createSignal(0);

  return (
    <div class="border border-[#1A1D24] rounded-xl overflow-hidden bg-[#040406]">
      {/* ── Tab bar ── */}
      <div class="grid grid-cols-3">
        <For each={cases}>
          {(c, i) => (
            <button
              onClick={() => setActive(i())}
              class={[
                "relative py-5 font-mono text-[12px] uppercase tracking-[0.15em] text-center transition-colors focus:outline-none",
                active() === i()
                  ? "text-[#F0F1F2]"
                  : "text-[#8C94A1] hover:text-[#F0F1F2]",
                // vertical divider between tabs (right border except last)
                i() < cases.length - 1 ? "border-r border-[#1A1D24]" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {c.label}

              {/* active underline — full-width, sits on the bottom border */}
              <span
                class={[
                  "absolute bottom-0 left-0 h-[1.5px] bg-[#F0F1F2] transition-all duration-300",
                  active() === i() ? "w-full" : "w-0",
                ].join(" ")}
              />
            </button>
          )}
        </For>
      </div>

      {/* ── Divider ── */}
      <div class="h-px bg-[#1A1D24]" />

      {/* ── Quote panel ── */}
      <div class="px-12 py-14 lg:px-16 lg:py-16 min-h-[300px] flex flex-col justify-start gap-8">
        <blockquote class="text-[26px] lg:text-[30px] font-400 text-[#F0F1F2] leading-[1.45] max-w-4xl transition-opacity duration-200">
          &ldquo;{cases[active()].quote}&rdquo;
        </blockquote>
        <cite class="font-mono text-[11px] tracking-[0.18em] text-[#8C94A1] not-italic uppercase">
          {cases[active()].author}
        </cite>
      </div>
    </div>
  );
}

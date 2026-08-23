import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { usePageMeta } from "@/hooks/usePageMeta";
import { ALL_MODELS } from "@/data/models";

const EASE = [0.16, 1, 0.3, 1];

const GROUPS = [
  ["laptops", "Laptops"],
  ["towers", "Towers & Workstations"],
  ["audio", "Audio"],
  ["video", "Video"],
];

export default function ComparePage() {
  usePageMeta(
    "Compare Machines | Latios",
    "Compare Latios laptops, towers, workstations, audio and video products side by side — every spec, every number."
  );
  const [slots, setSlots] = useState(["archer-ltg540z", "promax-t4-plus", "sff-b860-pro-ai"]);
  const models = slots.map((s) => ALL_MODELS.find((m) => m.slug === s)).filter(Boolean);

  const setSlot = (i, v) => setSlots((s) => s.map((x, j) => (j === i ? v : x)));

  const rows = [];
  models.forEach((m) =>
    m.specGroups.forEach((g) =>
      g.items.forEach(([k]) => {
        const key = `${g.group}||${k}`;
        if (!rows.find((r) => r.key === key)) rows.push({ key, group: g.group, label: k });
      })
    )
  );
  const cell = (m, row) => {
    for (const g of m.specGroups)
      for (const [k, v] of g.items) if (`${g.group}||${k}` === row.key) return v;
    return "—";
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="pt-28 md:pt-36 pb-24"
      data-testid="compare-page"
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <Reveal>
          <p className="kicker-sq text-xs uppercase tracking-[0.35em] text-zinc-500 mb-6">Compare</p>
          <h1 className="font-display text-4xl md:text-6xl font-black tracking-tighter text-white leading-[1.02] max-w-3xl">
            Side by side. Spec by spec.
          </h1>
          <p className="mt-5 text-zinc-400 max-w-xl">
            Pick up to three machines from the Latios range and see every number that matters.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4" data-testid="compare-selectors">
            {slots.map((slot, i) => (
              <select
                key={i}
                value={slot}
                onChange={(e) => setSlot(i, e.target.value)}
                data-testid={`compare-select-${i}`}
                className="bg-[#0A0A0A] border border-white/15 text-white text-sm px-4 py-3.5 focus:outline-none focus:border-[#1a56e8] transition-colors duration-300"
              >
                <option value="">— Choose a machine —</option>
                {GROUPS.map(([cat, label]) => (
                  <optgroup key={cat} label={label}>
                    {ALL_MODELS.filter((m) => m.category === cat).map((m) => (
                      <option key={m.slug} value={m.slug} disabled={slots.includes(m.slug) && slot !== m.slug}>
                        {m.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            ))}
          </div>
        </Reveal>

        {models.length >= 2 ? (
          <Reveal delay={0.15}>
            <div className="mt-14 overflow-x-auto" data-testid="compare-table-wrap">
              <div
                className="min-w-[720px]"
                style={{
                  display: "grid",
                  gridTemplateColumns: `200px repeat(${models.length}, minmax(230px, 1fr))`,
                }}
                data-testid="compare-table"
              >
                <div className="border-b border-white/10" />
                {models.map((m) => (
                  <div key={m.slug} className="border-b border-white/10 pb-6 px-4">
                    <div className="rounded-lg bg-[#f2f2f0] aspect-[16/10] flex items-center justify-center overflow-hidden mb-5">
                      <img src={m.image} alt={m.name} className="max-h-[80%] w-auto object-contain" />
                    </div>
                    <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">{m.tag}</span>
                    <h3 className="mt-2 font-display text-xl font-black tracking-tighter text-white leading-snug">
                      {m.name}
                    </h3>
                    <Link
                      to={`/${m.category}/${m.slug}`}
                      data-testid={`compare-view-${m.slug}`}
                      className="mt-3 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-[#6f93f2] hover:text-white transition-colors duration-300"
                    >
                      View product <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
                {rows.map((row, ri) => {
                  const firstInGroup = !rows[ri - 1] || rows[ri - 1].group !== row.group;
                  return [
                    firstInGroup && (
                      <div
                        key={`g-${row.key}`}
                        className="col-span-full mt-8 mb-1 text-[10px] uppercase tracking-[0.35em] text-[#6f93f2]"
                      >
                        {row.group}
                      </div>
                    ),
                    <div
                      key={`l-${row.key}`}
                      className="py-3.5 pr-4 border-b border-white/10 text-sm text-zinc-500"
                    >
                      {row.label}
                    </div>,
                    ...models.map((m) => (
                      <div
                        key={`${row.key}-${m.slug}`}
                        data-testid={ri === 0 ? `compare-cell-${m.slug}` : undefined}
                        className={`py-3.5 px-4 border-b border-white/10 text-sm ${
                          cell(m, row) === "—" ? "text-zinc-700" : "text-white"
                        }`}
                      >
                        {cell(m, row)}
                      </div>
                    )),
                  ];
                })}
              </div>
            </div>
          </Reveal>
        ) : (
          <div className="mt-14 border border-white/10 p-12 text-center text-zinc-500" data-testid="compare-empty">
            Select at least two machines to compare.
          </div>
        )}
      </div>
    </motion.main>
  );
}

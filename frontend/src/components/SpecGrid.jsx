import { Reveal } from "@/components/Reveal";

export const SpecGrid = ({ specs }) => (
  <Reveal>
    <div
      data-testid="spec-grid"
      className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-white/10"
    >
      {specs.map(([label, value], i) => (
        <div
          key={i}
          data-testid={`spec-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
          className="border-r border-b border-white/10 p-6 md:p-8 group hover:bg-white/[0.03] transition-colors duration-500"
        >
          <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
            {label}
          </div>
          <div className="mt-4 font-display text-lg md:text-xl font-light text-white leading-snug">
            {value}
          </div>
        </div>
      ))}
    </div>
  </Reveal>
);

/**
 * One product tile, shared by every grid on the site.
 *
 * There were six of these, inline and independent — the category grid, the
 * "more from the range" strip, the applications page, two in the header and one
 * on the compare page — all rendering the same three or four fields and drifting
 * apart. This is the one.
 *
 * It is COMPACT on purpose. The listing was `grid-cols-1 xl:grid-cols-2`, which
 * is one card per row below 1280px, and at 630x792 each that made the 33
 * desktop models about 26,000px of scrolling. The reference listing puts three
 * across at 326x588 and gets a range you can take in. Everything here is sized
 * for that: a 4:3 plate instead of 16:9, the name at text-xl instead of
 * text-3xl, and the specification as ruled rows.
 *
 * The three `highlights` bullets are gone. They were most of the height, and
 * they were the one part of the card a reader could not compare across products
 * — free prose in a tile whose whole job is to line up against its neighbours.
 * They are still on the product page itself.
 *
 * A `variant` prop used to gate the spec list. Both call sites are listings and
 * neither passed it, so it was a switch with one position.
 *
 * The layout follows the reference storefront's card, with one substitution
 * that decides the whole design: where that card puts a price, an MRP and a
 * discount badge, this one puts the SPECIFICATION. Latios has no price, stock
 * or SKU field anywhere — the backend routes a pricing question to a lead form
 * — so a card built around money would be inventing data. A card built around
 * processor, graphics, memory and storage is built on what this catalogue
 * actually knows, and it is the same information a reader is comparing on.
 *
 * Specs are derived, never authored twice: getProcessorFamily and
 * getMaxMemoryGB in data/models.js already read the model's own spec rows, so
 * a card cannot drift away from the spec table on the page it links to.
 */
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, Cpu, MemoryStick, HardDrive, MonitorCheck } from "lucide-react";
import { getMaxMemoryGB, getProcessorFamily } from "@/data/models";

/** First spec row whose label matches, across all groups. */
const row = (m, re) => {
  const hit = (m.specGroups || [])
    .flatMap((g) => g.items || [])
    .find(([label]) => re.test(String(label).trim()));
  return hit ? String(hit[1]) : "";
};

/**
 * The four lines the reference card shows, in its order.
 *
 * Trimmed at the first separator because a spec row is written for a table —
 * "1x M.2 NVMe SSD · 1x 2.5in HDD/SSD · 1x 3.5in HDD" is correct there and
 * three lines too long here. Rows that do not exist are dropped rather than
 * rendered empty: an AV camera has no memory row and should not show one.
 */
export const summarise = (m) => {
  const short = (s) => String(s).split(/\s*[·•]\s*/)[0].trim();
  const mem = getMaxMemoryGB(m);
  const out = [];
  const cpu = row(m, /^processors?$|^cpu options?$/i);
  if (cpu) out.push({ icon: Cpu, label: short(cpu) });
  const gpu = row(m, /^graphics$/i);
  if (gpu) out.push({ icon: MonitorCheck, label: short(gpu) });
  if (mem) out.push({ icon: MemoryStick, label: `Up to ${mem}GB` });
  const sto = row(m, /^storage$/i);
  if (sto) out.push({ icon: HardDrive, label: short(sto) });
  return out;
};

/**
 * The processor badge, in each vendor's own colour.
 *
 * Set as TYPE on a coloured chip, never the vendor's logo -- the same rule the
 * partner strip and the platform bands follow. "Intel Core" in Outfit on Intel
 * blue is a description; a drawn Intel mark would be a trademark this project
 * has no artwork for and must not invent.
 *
 * Keyed on getProcessorFamily, which reads the model's own Processor row, so a
 * badge cannot disagree with the spec table it sits above.
 */
const VENDOR_BADGE = {
  amd: { label: "AMD Ryzen™", color: "#ed1c24" },
  epyc: { label: "AMD EPYC™", color: "#ed1c24" },
  intel: { label: "Intel® Core™", color: "#0068b5" },
  xeon: { label: "Intel® Xeon®", color: "#1f4e79" },
};

export const ProductCard = ({
  m,
  category,
  testid,
  compare = null,
}) => {
  const to = `/${category || m.category}/${m.slug}`;
  const specs = summarise(m);
  const badge = VENDOR_BADGE[getProcessorFamily(m)];

  return (
    <div
      className="group relative border border-white/10 bg-[#0A0A0A] hover:border-white/25 transition-colors duration-500 flex flex-col h-full"
      data-testid={testid}
    >
      {/* The checkbox sits OUTSIDE the Link. Nested interactive elements are
          not valid, and a reader ticking Compare must not be navigated away. */}
      {compare && (
        <label
          className="absolute top-4 right-4 z-10 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-400 cursor-pointer select-none"
          data-testid={`compare-${m.slug}`}
        >
          <input
            type="checkbox"
            checked={compare.checked}
            onChange={() => compare.onToggle(m.slug)}
            className="accent-[#1a56e8] w-3.5 h-3.5"
            aria-label={`Compare ${m.name}`}
          />
          Compare
        </label>
      )}

      <Link
        to={to}
        className="p-5 md:p-6 flex flex-col h-full focus:ring-2 focus:ring-white/50 focus:outline-none"
        data-testid={testid ? `${testid}-link` : undefined}
      >
        {m.image && (
          <div className="mb-5 rounded-lg bg-[#f2f2f0] px-6 py-5 flex items-center justify-center aspect-[4/3] overflow-hidden">
            <img
              src={m.image}
              alt={m.name}
              loading="lazy"
              className="max-h-full w-auto object-contain transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          {badge && (
            <span
              data-testid={`vendor-badge-${m.slug}`}
              className="text-[10px] font-semibold uppercase tracking-[0.12em] rounded px-2 py-1"
              style={{ background: badge.color, color: "#fff" }}
            >
              {badge.label}
            </span>
          )}
          {m.aiReady && (
            <span
              data-testid={`ai-badge-${m.slug}`}
              title="Dedicated neural processing unit"
              className="text-[9px] uppercase tracking-[0.2em] text-[#6f93f2] border border-[#6f93f2]/40 rounded-full px-2 py-0.5"
            >
              AI ready
            </span>
          )}
        </div>

        <h3 className="mt-2.5 font-display text-lg md:text-xl font-bold tracking-tight text-white leading-snug">
          {m.name}
        </h3>

        {/* The specification as a CHECKLIST, which is the reference listing's
            own shape -- a tick per fact rather than a table rule. Four of them,
            not five: at three cards across a fifth pushes the pricing line off
            the bottom of the card. */}
        {!!specs.length && (
          <ul className="mt-4 space-y-2" data-testid={testid ? `${testid}-specs` : undefined}>
            {specs.slice(0, 4).map(({ label }) => (
              <li key={label} className="flex gap-2.5 text-[13px] leading-snug text-zinc-400">
                <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#1a56e8]" strokeWidth={2.5} aria-hidden="true" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex-1" />

        {/* Where the reference puts a price. Latios has no price, stock or SKU
            field anywhere -- the backend routes a pricing question to a lead
            form -- so this says what is true instead of inventing a number, and
            GeM is the procurement route most of these buyers are actually on. */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">
            Enterprise &amp; GeM pricing
          </p>
          <p className="mt-0.5 text-[13px] font-semibold text-white">
            On request &middot; volume &amp; public-sector rates
          </p>
        </div>

        {/* The footer pair from the reference listing: a filled primary and a
            quiet secondary. Both are plain spans, because the whole card is
            already one <Link> and nesting an anchor inside an anchor is invalid
            -- the Compare span is made a real control by the checkbox above,
            which sits outside the Link for the same reason. */}
        <span className="mt-4 flex items-center gap-3">
          <span
            data-testid={`model-explore-${m.slug}`}
            className="flex-1 inline-flex items-center justify-center gap-2 btn-blue px-5 py-3 text-[10px] uppercase tracking-[0.22em] transition-colors duration-300"
          >
            Explore model
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
          <span className="inline-flex items-center justify-center rounded-md border border-white/15 px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-zinc-300 group-hover:border-white/40 transition-colors duration-300">
            Compare
          </span>
        </span>
      </Link>
    </div>
  );
};

export default ProductCard;

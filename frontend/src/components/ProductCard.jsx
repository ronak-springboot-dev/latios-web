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
import { ArrowUpRight, Cpu, MemoryStick, HardDrive, MonitorCheck } from "lucide-react";
import { getMaxMemoryGB } from "@/data/models";

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

export const ProductCard = ({
  m,
  category,
  testid,
  compare = null,
}) => {
  const to = `/${category || m.category}/${m.slug}`;
  const specs = summarise(m);

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
          <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">{m.tag}</span>
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

        {/* The specification as RULED ROWS, which is the reference's own shape:
            one fact per line with a hairline between, so four of them scan as a
            block rather than as a paragraph. It replaced an icon list that read
            as prose at this width, and it is the reason the card fits a
            three-across grid at all. */}
        {!!specs.length && (
          <dl
            className="mt-4 border-t border-white/10"
            data-testid={testid ? `${testid}-specs` : undefined}
          >
            {specs.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 border-b border-white/10 py-2">
                <Icon className="w-3 h-3 shrink-0 text-zinc-600" aria-hidden="true" />
                <dd className="text-xs leading-snug text-zinc-300 truncate" title={label}>
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <div className="flex-1" />

        <span
          data-testid={`model-explore-${m.slug}`}
          className="mt-5 inline-flex items-center gap-1.5 self-start text-[10px] uppercase tracking-[0.25em] text-white border-b border-white/30 pb-1 group-hover:border-white transition-colors duration-300"
        >
          Explore model
          <ArrowUpRight className="w-3 h-3" />
        </span>
      </Link>
    </div>
  );
};

export default ProductCard;

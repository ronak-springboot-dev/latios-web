/**
 * The bento grid: feature cards of different sizes in three columns.
 *
 * Modelled on the grid near the top of the Minisforum 790S7 page. That one is a
 * single baked JPG; this is live cards, so each one reflows on its own and every
 * word is real text.
 *
 * Like the reference there is no shared row grid -- each of the three columns
 * stacks its own cards and the columns only have to end near the same place.
 * That is what lets a tall product card sit beside a stack of small ones without
 * the small ones stretching to match. Below `md` it is one column in card order.
 *
 * A card is any of: an image, a line-art glyph, a big number, and dimension
 * callouts. None of those keys is called `type` -- verify_pages.mjs reads
 * section order with a depth-blind regex for `type`, and a nested one would be
 * counted as a section.
 */
import { ACCENT, ACCENT_SOFT, Band, Reveal, SectionHead } from "./primitives";

// Heights are floors, not fixed sizes, so a card with more text grows rather
// than clipping. They are chosen so the three columns land within a few pixels
// of each other with the reference's card mix.
const MIN_H = {
  tall: "md:min-h-[560px]",
  half: "md:min-h-[430px]",
  short: "md:min-h-[300px]",
  small: "md:min-h-[200px]",
  text: "md:min-h-[140px]",
};

/** Line-art in the accent colour, drawn rather than rendered. */
const Glyph = ({ name }) => {
  const common = { fill: "none", stroke: ACCENT, strokeWidth: 3, strokeLinejoin: "round" };
  if (name === "dimm")
    return (
      <svg viewBox="0 0 200 64" className="w-40 md:w-48" aria-hidden="true">
        <path d="M6 10h188v36h-8l-4 8H18l-4-8H6z" {...common} />
        {[30, 70, 110, 150].map((x) => (
          <rect key={x} x={x} y="20" width="22" height="16" rx="2" {...common} />
        ))}
        <path d="M18 54h164" {...common} strokeDasharray="2 6" />
      </svg>
    );
  if (name === "drive")
    return (
      <svg viewBox="0 0 200 64" className="w-40 md:w-48" aria-hidden="true">
        <rect x="6" y="10" width="188" height="44" rx="4" {...common} />
        <rect x="22" y="20" width="56" height="24" rx="2" {...common} />
        <rect x="88" y="20" width="28" height="24" rx="2" {...common} />
        <rect x="126" y="20" width="28" height="24" rx="2" {...common} />
        <path d="M168 20v24M180 20v24" {...common} />
      </svg>
    );
  return null;
};

/**
 * Leader lines and measurements over a product image.
 *
 * Coordinates are fractions of the image box (the same convention as ioMap
 * pins), and the box carries the image's own aspect ratio so the image fills it
 * exactly -- with object-contain letterboxing, a fraction of the box would not be
 * a fraction of the product. The measurements are live text, not pixels.
 */
const Dimensions = ({ dims }) => {
  const line = { stroke: ACCENT_SOFT, strokeWidth: 0.4, vectorEffect: "non-scaling-stroke" };
  const tick = 1.6;
  const { h, d } = dims;
  return (
    <>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden="true">
        {h && (
          <g {...line}>
            <line x1={h.x} y1={h.y1} x2={h.x} y2={h.y2} />
            <line x1={h.x - tick} y1={h.y1} x2={h.x + tick} y2={h.y1} />
            <line x1={h.x - tick} y1={h.y2} x2={h.x + tick} y2={h.y2} />
          </g>
        )}
        {d && (
          <g {...line}>
            <line x1={d.x1} y1={d.y} x2={d.x2} y2={d.y} />
            <line x1={d.x1} y1={d.y - tick} x2={d.x1} y2={d.y + tick} />
            <line x1={d.x2} y1={d.y - tick} x2={d.x2} y2={d.y + tick} />
          </g>
        )}
      </svg>
      {/* Set vertically, reading upward along its line, as a drawing would. Laid
          horizontally it was ~54px wide beside a line only 6.6% into the box,
          and at 375 and 1024px it ran out past the card's edge. */}
      {h && (
        <span
          className="absolute -translate-x-full -translate-y-1/2 rotate-180 [writing-mode:vertical-rl] text-[11px] tracking-[0.1em] whitespace-nowrap"
          style={{ left: `calc(${h.x}% - 6px)`, top: `${(h.y1 + h.y2) / 2}%`, color: ACCENT_SOFT }}
        >
          {h.label}
        </span>
      )}
      {d && (
        <span
          className="absolute -translate-x-1/2 pt-2 text-[11px] tracking-[0.1em] whitespace-nowrap"
          style={{ left: `${(d.x1 + d.x2) / 2}%`, top: `${d.y}%`, color: ACCENT_SOFT }}
        >
          {d.label}
        </span>
      )}
    </>
  );
};

const Card = ({ card, n }) => {
  const { size = "small", title, subtitle, image, alt, glyph, stat, dims, fit = "contain" } = card;
  const side = image && stat;     // a number beside a picture, as on the reference's cooling card
  return (
    <Reveal delay={Math.min(n, 6) * 0.04}>
      <div
        className={`pdp-card flex flex-col rounded-[28px] [corner-shape:squircle] border border-white/10 overflow-hidden p-6 md:p-8 ${MIN_H[size] ?? ""}`}
        data-testid={`pdp-bento-card-${n}`}
      >
        <div className={side ? "text-left" : "text-center"}>
          <h3 className="font-display text-xl md:text-2xl font-semibold tracking-tight text-white">{title}</h3>
          {subtitle && <p className="mt-1.5 text-sm text-zinc-400">{subtitle}</p>}
        </div>

        {side ? (
          <div className="mt-4 flex-1 flex items-end justify-between gap-4">
            <p className="font-display font-semibold leading-none">
              <span className="text-5xl md:text-6xl" style={{ color: ACCENT }}>{stat[0]}</span>
              {stat[1] && <span className="text-xl ml-1" style={{ color: ACCENT_SOFT }}>{stat[1]}</span>}
              {stat[2] && <span className="block mt-2 text-sm font-normal text-zinc-400">{stat[2]}</span>}
            </p>
            <img src={image} alt={alt ?? title} loading="lazy" className="w-1/2 max-h-[200px] object-contain rounded-2xl" />
          </div>
        ) : image ? (
          <div className="mt-5 flex-1 flex items-center justify-center min-h-[180px]">
            {dims ? (
              <div className="relative w-full max-w-[420px]" style={{ aspectRatio: dims.aspect }}>
                <img src={image} alt={alt ?? title} loading="lazy" className="absolute inset-0 w-full h-full rounded-2xl" />
                <Dimensions dims={dims} />
              </div>
            ) : (
              <img
                src={image}
                alt={alt ?? title}
                loading="lazy"
                // Rounded either way: the renders sit on their own black ground,
                // and in the light theme's white card an unrounded one read as
                // a black rectangle pasted in, not a picture of the part.
                className={`w-full h-full max-h-[340px] rounded-2xl ${fit === "cover" ? "object-cover" : "object-contain"}`}
              />
            )}
          </div>
        ) : glyph ? (
          <div className="mt-5 flex-1 flex items-center justify-center">
            <Glyph name={glyph} />
          </div>
        ) : stat ? (
          <p className="mt-4 text-center font-display font-semibold leading-none">
            <span className="text-5xl" style={{ color: ACCENT }}>{stat[0]}</span>
            {stat[1] && <span className="text-xl ml-1" style={{ color: ACCENT_SOFT }}>{stat[1]}</span>}
          </p>
        ) : null}

        {dims?.note && <p className="mt-3 text-center text-[11px] tracking-[0.1em] text-zinc-500">{dims.note}</p>}
      </div>
    </Reveal>
  );
};

export const PdpBento = ({ theme, kicker, heading, body, cards = [] }) => {
  if (!cards.length) return null;
  const cols = [1, 2, 3].map((c) => cards.map((card, n) => ({ card, n })).filter((x) => (x.card.col ?? 1) === c));
  return (
    <Band theme={theme} data-testid="pdp-bento">
      <SectionHead theme={theme} kicker={kicker} heading={heading} body={body} align="center" />
      <div className={`${heading || body ? "mt-12 md:mt-16" : ""} grid grid-cols-1 md:grid-cols-3 gap-4`}>
        {cols.map((col, c) => (
          <div key={c} className="flex flex-col gap-4">
            {col.map(({ card, n }) => (
              <Card key={n} card={card} n={n} />
            ))}
          </div>
        ))}
      </div>
    </Band>
  );
};

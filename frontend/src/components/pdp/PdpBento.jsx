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
 *
 * Two flags carry the reference's actual look, and both are opt-in so that a
 * page which has not had its art staged for it keeps the inset cards it was
 * designed with:
 *
 *   stage   the block becomes a dark panel in both themes (see PdpBento).
 *   bleed   the card's image fills it edge to edge, title over the picture,
 *           instead of sitting inset with a margin around it.
 */
import { ACCENT, ACCENT_SOFT, Band, Reveal, SectionHead } from "./primitives";

// Heights are floors, not fixed sizes, so a card with more text grows rather
// than clipping. They are chosen so the three columns land within a few pixels
// of each other with the reference's card mix.
//
// A staged grid needs its own table for two reasons. Its cards are pictures
// rather than pictures-inside-padding, so they want more height; and below `md`
// the grid is one column, where a full-bleed image has nothing but the card box
// to take its height from and would otherwise collapse to the title. An inset
// card needs no base floor because its content is already taller.
const MIN_H = {
  tall: "md:min-h-[560px]",
  half: "md:min-h-[430px]",
  short: "md:min-h-[300px]",
  small: "md:min-h-[200px]",
  text: "md:min-h-[140px]",
};

// 620+300, 224+224+144+300 and 460+460 all come to 940 with a 16px gap.
const STAGE_H = {
  tall: "min-h-[440px] md:min-h-[620px]",
  half: "min-h-[340px] md:min-h-[460px]",
  short: "min-h-[260px] md:min-h-[300px]",
  small: "md:min-h-[224px]",
  text: "md:min-h-[144px]",
};

/** Line-art in the accent colour, drawn rather than rendered. */
const Glyph = ({ name, big }) => {
  const common = { fill: "none", stroke: ACCENT, strokeWidth: 3, strokeLinejoin: "round" };
  const size = big ? "w-48 md:w-64" : "w-40 md:w-48";
  if (name === "dimm")
    return (
      <svg viewBox="0 0 200 64" className={size} aria-hidden="true">
        <path d="M6 10h188v36h-8l-4 8H18l-4-8H6z" {...common} />
        {[30, 70, 110, 150].map((x) => (
          <rect key={x} x={x} y="20" width="22" height="16" rx="2" {...common} />
        ))}
        <path d="M18 54h164" {...common} strokeDasharray="2 6" />
      </svg>
    );
  if (name === "drive")
    return (
      <svg viewBox="0 0 200 64" className={size} aria-hidden="true">
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
 * Coordinates are percentages of the staged image (the same convention as ioMap
 * pins). They are also percentages of the CARD, because a dimensioned card is
 * given that image's own aspect ratio and so never crops it -- see `aspect` in
 * Card. That is not a nicety: the three columns run from about 210px wide at
 * `md` to 490 on a wide desktop, and with a fixed card height object-cover ate a
 * different slice off the sides at every breakpoint. At 1024 the "354 mm" label
 * was cropped clean off the card.
 *
 * White rather than the accent: over a product standing on the accent's own
 * floor glow, an accent-coloured rule reads as part of the lighting.
 */
const Dimensions = ({ dims }) => {
  const line = { stroke: "rgba(255,255,255,0.75)", strokeWidth: 1, vectorEffect: "non-scaling-stroke" };
  const tick = 1.6;
  const label = "absolute text-[12px] tracking-[0.08em] whitespace-nowrap text-white/85";
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
          horizontally it was ~54px wide beside a line only a tenth into the box,
          and at 375 and 1024px it ran out past the card's edge. */}
      {h && (
        <span
          className={`${label} -translate-x-full -translate-y-1/2 rotate-180 [writing-mode:vertical-rl]`}
          style={{ left: `calc(${h.x}% - 7px)`, top: `${(h.y1 + h.y2) / 2}%` }}
        >
          {h.label}
        </span>
      )}
      {d && (
        <span
          className={`${label} -translate-x-1/2 pt-2`}
          style={{ left: `${(d.x1 + d.x2) / 2}%`, top: `${d.y}%` }}
        >
          {d.label}
        </span>
      )}
    </>
  );
};

// A staged card is set larger and brighter than an inset one. The reference
// bakes its card titles into the artwork, which buys it a heavier setting than a
// page normally carries; this matches that weight while the words stay real text
// -- selectable, translatable, and correct at any pixel density.
const Heading = ({ title, subtitle, align = "center", big }) => (
  <div className={align === "left" ? "text-left" : "text-center"}>
    <h3 className={`font-display font-semibold tracking-tight text-white ${
      big ? "text-[22px] md:text-[28px] leading-tight" : "text-xl md:text-2xl"}`}>{title}</h3>
    {subtitle && (
      <p className={`mt-1.5 ${big ? "text-[15px] text-zinc-300" : "text-sm text-zinc-400"}`}>{subtitle}</p>
    )}
  </div>
);

const Stat = ([big, unit, note], align = "center", scale = "text-5xl md:text-6xl") => (
  <p className={`font-display font-semibold leading-none ${align === "left" ? "" : "text-center"}`}>
    <span className={scale} style={{ color: ACCENT }}>{big}</span>
    {unit && <span className="text-xl ml-1" style={{ color: ACCENT_SOFT }}>{unit}</span>}
    {note && <span className="block mt-2 text-sm font-normal text-zinc-400">{note}</span>}
  </p>
);

/**
 * A card whose image IS the card.
 *
 * The reference's grid has no inset pictures at all: every image runs to the
 * card's own corners and the title sits over its dark top. That is what the
 * `-card` renders are staged for -- each one is composed at the card's aspect
 * with a dark band above the product, so the scrim here is insurance for the
 * narrow column rather than the thing making the type readable.
 */
const BleedCard = ({ card, stage }) => {
  const { title, subtitle, image, alt, stat, dims, foot } = card;
  if (foot) {
    // A picture too bright to put a title on. It takes the bottom of the card
    // and the title sits on the card's own ground above it, which is what the
    // reference does with its one photograph; the file's top edge is ramped to
    // transparent, so there is no line where the two meet.
    return (
      <>
        <img
          src={image} alt={alt ?? title} loading="lazy"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] w-full object-cover"
        />
        <div className="relative p-6 md:p-8">
          <Heading title={title} subtitle={subtitle} big={stage} />
        </div>
      </>
    );
  }
  if (stat) {
    // The cooling card: a number at the foot, the part bleeding off the corner.
    // Its top and left edges are ramped to transparent in the file, so it meets
    // the card's ground without an edge.
    return (
      <>
        <img
          src={image} alt={alt ?? title} loading="lazy"
          className="pointer-events-none absolute -right-[9%] -bottom-[12%] w-[82%] max-w-none"
        />
        <div className="relative flex-1 flex flex-col p-6 md:p-8">
          <Heading title={title} subtitle={subtitle} align="left" big={stage} />
          <div className="mt-auto pt-8">{Stat(stat, "left")}</div>
        </div>
      </>
    );
  }
  return (
    <>
      <img
        src={image} alt={alt ?? title} loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {!dims && <div className="pdp-scrim pointer-events-none absolute inset-x-0 top-0 h-1/2" />}
      {dims && <Dimensions dims={dims} />}
      <div className="relative p-6 md:p-8">
        <Heading title={title} subtitle={subtitle} big={stage} />
      </div>
      {dims?.note && (
        <p className="absolute inset-x-0 bottom-6 text-center text-[11px] tracking-[0.1em] text-white/70">
          {dims.note}
        </p>
      )}
    </>
  );
};

const Card = ({ card, n, stage }) => {
  const { size = "small", title, subtitle, image, alt, glyph, stat, dims, fit = "contain", bleed, grow } = card;
  const side = image && stat;     // a number beside a picture, as on the reference's cooling card
  // A full-bleed card carrying callouts takes its height from the picture, so
  // the picture is never cropped and the callouts stay on the product at every
  // column width. `grow` then lets the other columns take up the slack: the grid
  // already stretches all three columns to the tallest, so one flexible card per
  // column is what keeps them ending level without a height tuned per breakpoint.
  const aspect = bleed && dims?.box ? { aspectRatio: `${dims.box[0]} / ${dims.box[1]}` } : null;
  const shell = `${stage ? "pdp-stage-card" : "pdp-card"} relative flex flex-col rounded-[28px] ` +
    `[corner-shape:squircle] border border-white/10 overflow-hidden ` +
    `${grow ? "flex-1 " : ""}${aspect ? "" : (stage ? STAGE_H : MIN_H)[size] ?? ""}`;

  if (bleed && image) {
    return (
      <Reveal delay={Math.min(n, 6) * 0.04} className={grow ? "flex flex-col flex-1" : ""}>
        <div className={shell} style={aspect} data-testid={`pdp-bento-card-${n}`}>
          <BleedCard card={card} stage={stage} />
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal delay={Math.min(n, 6) * 0.04} className={grow ? "flex flex-col flex-1" : ""}>
      <div className={`${shell} p-6 md:p-8`} data-testid={`pdp-bento-card-${n}`}>
        <Heading title={title} subtitle={subtitle} align={side ? "left" : "center"} big={stage} />

        {side ? (
          <div className="mt-4 flex-1 flex items-end justify-between gap-4">
            {Stat(stat, "left")}
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
          <div className="relative mt-5 flex-1 flex items-center justify-center">
            {/* A bloom under the line art, so a card with no photograph still has
                depth. A blurred div rather than an SVG filter: a filter on a
                stroke repaints the whole glyph on every scroll frame. */}
            {stage && (
              <div
                className="pointer-events-none absolute w-52 h-52 rounded-full blur-[64px] opacity-30"
                style={{ background: ACCENT }}
              />
            )}
            <Glyph name={glyph} big={stage} />
          </div>
        ) : stat ? (
          <div className="mt-4">{Stat([stat[0], stat[1]], "center", "text-5xl")}</div>
        ) : null}

        {dims?.note && <p className="mt-3 text-center text-[11px] tracking-[0.1em] text-zinc-500">{dims.note}</p>}
      </div>
    </Reveal>
  );
};

/**
 * `stage` makes the whole block a dark panel, heading included, in BOTH themes.
 *
 * It is not a style preference. Every product render in this grid is lit for a
 * dark ground -- rim light on the edges, the shadow side falling into black --
 * so on the light theme's white card each one read as a black rectangle pasted
 * into the page. Re-lighting the range for a white ground is the alternative,
 * and it would cost the separation those renders get their shape from. A dark
 * gallery inset into a light page is what the reference does, and what the
 * pictures were made for.
 */
export const PdpBento = ({ theme, kicker, heading, body, cards = [], stage = false }) => {
  if (!cards.length) return null;
  const cols = [1, 2, 3].map((c) => cards.map((card, n) => ({ card, n })).filter((x) => (x.card.col ?? 1) === c));
  const grid = (
    <>
      <SectionHead theme={theme} kicker={kicker} heading={heading} body={body} align="center" />
      <div className={`${heading || body ? "mt-12 md:mt-16" : ""} grid grid-cols-1 md:grid-cols-3 gap-4`}>
        {cols.map((col, c) => (
          <div key={c} className="flex flex-col gap-4">
            {col.map(({ card, n }) => (
              <Card key={n} card={card} n={n} stage={stage} />
            ))}
          </div>
        ))}
      </div>
    </>
  );
  return (
    <Band theme={theme} data-testid="pdp-bento">
      {stage ? (
        <div className="pdp-stage-band rounded-[36px] px-4 py-12 md:px-10 md:py-16">{grid}</div>
      ) : (
        grid
      )}
    </Band>
  );
};

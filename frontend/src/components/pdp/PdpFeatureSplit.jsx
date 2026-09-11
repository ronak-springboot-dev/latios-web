/**
 * Copy in one column, a picture in the other, and the numbers under the copy.
 *
 * The Minisforum 790S7 page is built almost entirely from this one shape: the
 * CPU, the graphics card, the memory and the storage are each a pill label, a
 * two-tone heading, a paragraph and a short grid of big numbers beside a single
 * render. Nothing in this vocabulary did that -- `bleed` has the split but no
 * numbers, `spotlight` has numbers but under a full-width image -- so it is its
 * own section rather than a third mode bolted onto either.
 *
 * The reference bakes all of this into JPGs, with a separate portrait image for
 * mobile and empty alt text. Here every word is live: it reflows, it translates,
 * a screen reader gets it, and it cannot come back garbled from a renderer.
 *
 * `glow="horizon"` paints the reference's recurring backdrop -- dark at the top,
 * warming to a glow at the horizon -- in CSS rather than into an image, in this
 * product's own accent via color-mix, so it follows the theme and costs nothing.
 */
import { ACCENT, ACCENT_SOFT, Band, BandHeading, Reveal } from "./primitives";


const Stat = ({ value, unit, label, prefix }) => (
  <div>
    {prefix && <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 mb-1">{prefix}</p>}
    <p className="font-display font-semibold tracking-tight leading-none">
      <span className="text-4xl md:text-5xl" style={{ color: ACCENT }}>{value}</span>
      {unit && <span className="ml-1 text-lg md:text-xl" style={{ color: ACCENT_SOFT }}>{unit}</span>}
    </p>
    {label && <p className="mt-2 text-sm text-zinc-400">{label}</p>}
  </div>
);

export const PdpFeatureSplit = ({
  theme,
  model,
  pill,
  heading,
  headingAccent,
  body,
  image,
  alt,
  flip = false,
  frame = "rounded",
  aspect = "aspect-[4/3]",
  stats = [],
  statCols = 2,
  footnote,
  caption,
  glow,
  index = 0,
}) => {
  if (!heading && !image) return null;
  const framed = frame === "rounded";

  return (
    // The glow is a class, not an inline style: the light theme is a sheet of
    // html.light overrides, and an inline background cannot be overridden by it
    // -- in light mode the navy fade painted a dark band across a light page.
    <Band theme={theme} data-testid={`pdp-feature-split-${index}`} className={glow === "horizon" ? "pdp-horizon" : ""}>
      <div className={`grid grid-cols-1 md:grid-cols-2 items-center ${theme?.gap ?? "gap-10 md:gap-16"}`}>
        <div className={flip ? "md:order-2" : ""}>
          <Reveal>
            {pill && (
              <span
                className="inline-block rounded-full border px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] mb-6"
                style={{ borderColor: ACCENT_SOFT, color: ACCENT_SOFT }}
              >
                {pill}
              </span>
            )}
            <BandHeading>
              {heading}
              {headingAccent && <> <span style={{ color: ACCENT_SOFT }}>{headingAccent}</span></>}
            </BandHeading>
          </Reveal>

          {body && (
            <Reveal delay={0.06}>
              <p className={`mt-5 text-base text-zinc-400 leading-relaxed ${theme?.measure ?? "max-w-[600px]"}`}>
                {body}
              </p>
            </Reveal>
          )}

          {!!stats.length && (
            <Reveal delay={0.12}>
              <div
                className={`mt-10 grid gap-x-8 gap-y-8 ${statCols === 3 ? "grid-cols-3" : statCols === 1 ? "grid-cols-1" : "grid-cols-2"}`}
                data-testid={`pdp-feature-split-${index}-stats`}
              >
                {stats.map(([value, unit, label, prefix]) => (
                  <Stat key={`${value}${unit}${label}`} value={value} unit={unit} label={label} prefix={prefix} />
                ))}
              </div>
            </Reveal>
          )}

          {footnote && <p className="mt-8 text-[11px] text-zinc-600 leading-relaxed">{footnote}</p>}
        </div>

        {image && (
          <Reveal delay={0.1} className={flip ? "md:order-1" : ""}>
            <figure
              className={
                framed
                  ? `relative overflow-hidden rounded-[28px] [corner-shape:squircle] border border-white/10 bg-black ${aspect}`
                  : `relative ${aspect}`
              }
            >
              <img
                src={image}
                alt={alt ?? heading ?? model?.name ?? ""}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </figure>
            {caption && <p className="mt-3 text-[10px] text-zinc-600 leading-relaxed">{caption}</p>}
          </Reveal>
        )}
      </div>
    </Band>
  );
};

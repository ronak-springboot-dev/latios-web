/**
 * Shared bits every PDP section leans on.
 *
 * The accent comes from a CSS custom property rather than a prop so that a
 * section never has to know which product it is on — the PDP root sets
 * --pdp-accent once and every button, rule and bullet below it is correct.
 * `.btn-blue` in index.css is hard-wired to the brand blue, so PDP buttons use
 * AccentButton instead of that class.
 */
import { Reveal } from "@/components/Reveal";

export const ACCENT = "var(--pdp-accent, #1a56e8)";
export const ACCENT_SOFT = "var(--pdp-accent-soft, #6f93f2)";

export const AccentButton = ({ as: As = "button", children, className = "", ...rest }) => (
  <As
    {...rest}
    style={{
      background: ACCENT,
      borderRadius: "var(--pdp-pill, 9999px)",
      textTransform: "var(--pdp-label-case, uppercase)",
      letterSpacing: "var(--pdp-label-track, 0.25em)",
      ...(rest.style || {}),
    }}
    className={`group inline-flex items-center gap-3 text-white px-8 py-4 text-xs font-semibold transition-opacity duration-300 hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-white/40 ${className}`}
  >
    {children}
  </As>
);

export const GhostButton = ({ as: As = "button", children, className = "", ...rest }) => (
  <As
    {...rest}
    style={{
      borderRadius: "var(--pdp-pill, 9999px)",
      textTransform: "var(--pdp-label-case, uppercase)",
      letterSpacing: "var(--pdp-label-track, 0.25em)",
      ...(rest.style || {}),
    }}
    className={`inline-flex items-center gap-3 border border-white/20 text-white px-8 py-4 text-xs hover:border-white/60 transition-colors duration-300 focus:outline-none ${className}`}
  >
    {children}
  </As>
);

export const Kicker = ({ children, className = "" }) => (
  <p
    style={{ letterSpacing: "var(--pdp-kicker-track, 0.35em)" }}
    className={`kicker-sq text-[10px] uppercase text-zinc-500 mb-5 ${className}`}
  >
    {children}
  </p>
);

/**
 * Section heading at the scale the marketing bands use.
 *
 * Weight and tracking are set against the reference page, measured at the same
 * 1440px: its section heads run 36-54px at weight 500-520 with normal tracking,
 * where ours were 48px at 900 with -2.4px of tracking. The sizes already
 * agreed, so the heavy condensed setting was the entire difference in feel.
 *
 * 600 rather than their 500: on a dark ground a 500 goes soft at this size, and
 * the display face is the piece of Latios the restyle is meant to keep.
 */
export const BandHeading = ({ children, className = "" }) => (
  <h2
    style={{
      fontSize: "var(--pdp-head-size, clamp(1.875rem, 2.2vw + 1rem, 3rem))",
      fontWeight: "var(--pdp-head-weight, 600)",
      letterSpacing: "var(--pdp-track, -0.025em)",
    }}
    className={`font-display text-white leading-[1.15] md:leading-[1.15] ${className}`}
  >
    {children}
  </h2>
);

/**
 * Centred kicker, heading and body — the reference's basic unit.
 *
 * Its identity is a centred heading over wide imagery with the body copy held
 * to a readable measure. That pattern was hand-rolled in eight sections with
 * four different max-widths (`max-w-3xl`, `max-w-2xl`, `max-w-xl`, `max-w-md`),
 * so the pages drifted apart at the one place a reader notices most. With it in
 * one component the type scale is a single edit.
 *
 * `align="left"` exists because a few sections genuinely read better ranged
 * left — a stat wall beside its own numbers, a split with copy in one column.
 * Alignment belongs to the heading block rather than to `Band`, because half
 * the bands have no heading at all.
 */
export const SectionHead = ({
  kicker,
  heading,
  body,
  align = "center",
  theme,
  className = "",
  children,
}) => {
  if (!kicker && !heading && !body && !children) return null;
  const centred = align === "center";
  return (
    <div className={`${centred ? "text-center" : ""} ${className}`}>
      <Reveal>
        {kicker && <Kicker className={centred ? "justify-center" : ""}>{kicker}</Kicker>}
        {heading && <BandHeading>{heading}</BandHeading>}
      </Reveal>
      {body && (
        <Reveal delay={0.08}>
          <p
            style={{ fontSize: "var(--pdp-body-size, 1rem)" }}
            className={`mt-5 text-zinc-400 leading-relaxed ${
              theme?.measure ?? "max-w-[600px]"
            } ${centred ? "mx-auto" : ""}`}
          >
            {body}
          </p>
        </Reveal>
      )}
      {children}
    </div>
  );
};

/**
 * Wrapper giving every band the page's own vertical rhythm.
 *
 * `contain` and `flush` are separate on purpose. They used to be one `bleed`
 * prop that dropped the max-width container AND the vertical padding together,
 * which is why full-bleed sections could not participate in the density scale
 * at all — going edge-to-edge silently cost you the page's rhythm. Now
 * `contain={false}` widens a section without changing its rhythm, and `flush`
 * is the rarer case of a section that paints its own padding (a banner with
 * text over the image, a sticky canvas).
 *
 * Two sections deliberately do NOT use this: PdpReveal and PdpWalkthrough
 * measure scroll progress from their own section box, so any padding here
 * inflates the denominator and the sequence never reaches its last frame.
 */
export const Band = ({
  theme,
  children,
  contain = true,
  flush = false,
  border = true,
  className = "",
  ...rest
}) => (
  <section
    {...rest}
    className={`${border ? "border-t border-white/10" : ""} ${className}`}
  >
    <div
      className={[
        contain ? "max-w-[1600px] mx-auto px-6 md:px-12" : "",
        flush ? "" : theme?.band ?? "py-20 md:py-28",
      ].join(" ").trim()}
    >
      {children}
    </div>
  </section>
);

export { Reveal };

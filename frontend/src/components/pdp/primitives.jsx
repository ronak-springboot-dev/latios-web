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
    style={{ background: ACCENT, ...(rest.style || {}) }}
    className={`group inline-flex items-center gap-3 text-white px-8 py-4 text-xs uppercase tracking-[0.25em] font-semibold transition-opacity duration-300 hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-white/40 ${className}`}
  >
    {children}
  </As>
);

export const GhostButton = ({ as: As = "button", children, className = "", ...rest }) => (
  <As
    {...rest}
    className={`inline-flex items-center gap-3 border border-white/20 text-white rounded-full px-8 py-4 text-xs uppercase tracking-[0.25em] hover:border-white/60 transition-colors duration-300 focus:outline-none ${className}`}
  >
    {children}
  </As>
);

export const Kicker = ({ children, className = "" }) => (
  <p className={`kicker-sq text-[10px] uppercase tracking-[0.4em] text-zinc-400 mb-5 ${className}`}>
    {children}
  </p>
);

/** Section heading at the scale the marketing bands use. */
export const BandHeading = ({ children, className = "" }) => (
  <h2 className={`pdp-display text-4xl md:text-[3.4rem] font-extrabold tracking-tight text-white leading-[1.04] ${className}`}>
    {children}
  </h2>
);

/**
 * Wrapper giving every band the page's own vertical rhythm.
 * `bleed` opts out of the max-width container for full-width sections.
 */
export const Band = ({ theme, children, bleed = false, border = true, className = "", ...rest }) => (
  <section
    {...rest}
    className={`${border ? "border-t border-white/10" : ""} ${className}`}
  >
    <div className={bleed ? "" : `max-w-[1600px] mx-auto px-6 md:px-12 ${theme?.band ?? "py-20 md:py-28"}`}>
      {children}
    </div>
  </section>
);

export { Reveal };

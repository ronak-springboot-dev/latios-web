import { useState } from "react";
import { ACCENT } from "./primitives";
import { Band, Kicker, BandHeading } from "./primitives";

/**
 * "It opens by hand" — static version.
 *
 * This was a tall, sticky, scroll-scrubbed frame sequence: the reader scrolled
 * and the case animated open frame by frame. Scroll animation has been removed
 * from the product pages, so it is now an ordinary two-column band — the same
 * copy and the same numbered service steps, beside a single still of the open
 * chassis. No sticky section, no canvas, no rAF loop, nothing tied to scroll.
 *
 * The still is one frame of the original sequence (a mostly-open state). If that
 * frame is unreachable it falls back to the real interior photograph, so the
 * band never renders an empty stage.
 */
export const PdpReveal = ({ manifest, theme, kicker, heading, body, steps = [] }) => {
  const total = manifest?.frames ?? 0;
  const openFrame =
    total > 0
      ? manifest.pattern.replace("{i}", String(Math.round((total - 1) * 0.86)).padStart(3, "0"))
      : "/images/details/mt-interior.webp";
  const [src, setSrc] = useState(openFrame);

  if (!manifest && total === 0) return null;

  return (
    <Band theme={theme} data-testid="pdp-reveal">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          {kicker && <Kicker>{kicker}</Kicker>}
          <BandHeading>{heading}</BandHeading>
          {body && <p className="pdp-lead mt-5 text-zinc-300 max-w-md">{body}</p>}

          <ul className="mt-9 space-y-6 border-t border-white/10 pt-9" data-testid="pdp-reveal-steps">
            {steps.map((s) => (
              <li key={s.label} className="border-l-2 pl-5" style={{ borderColor: ACCENT }}>
                <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: ACCENT }}>
                  {s.label}
                </p>
                <p className="mt-2 text-sm text-zinc-300 leading-relaxed max-w-md">{s.text}</p>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-[10px] text-zinc-600">
            Interior components shown are illustrative.
          </p>
        </div>

        <div className="keep-dark rounded-xl overflow-hidden border border-white/10 bg-[#050505]">
          <img
            src={src}
            onError={() => setSrc("/images/details/mt-interior.webp")}
            alt={heading}
            loading="lazy"
            data-testid="pdp-reveal-image"
            className="w-full aspect-[5/4] object-contain bg-[#050505]"
          />
        </div>
      </div>
    </Band>
  );
};

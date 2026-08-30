import { useEffect, useRef, useState } from "react";
import { ACCENT } from "./primitives";

/**
 * Scroll-scrubbed callout walkthrough.
 *
 * The counterpart to PdpReveal, for products where a frame sequence would be
 * dishonest. The audio and video units have only small vendor catalogue images —
 * 14 to 71 KB — so there is nothing to render an "open it up" sequence from, and
 * generating one would mean inventing the product rather than an interior for a
 * chassis we photographed.
 *
 * So this gives the same progressive-scroll feel from what genuinely exists: the
 * product still, with annotation pins and specification callouts revealing in
 * sequence as you scroll.
 *
 * Built from DOM rather than canvas on purpose. Text stays crisp at any zoom,
 * it is selectable and reachable by a screen reader, and there are no frame
 * assets to ship — which matters most precisely where the source imagery is
 * weakest.
 */
export const PdpWalkthrough = ({
  image,
  kicker,
  heading,
  body,
  points = [],       // [{ at, x, y, label, text }] — x/y are fractions of the frame
  height = 240,      // scroll length in vh
}) => {
  const wrapRef = useRef(null);
  const rafRef = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!points.length) return;

    const read = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      if (rect.bottom < -vh || rect.top > vh * 2) return;
      const span = Math.max(1, rect.height - vh);
      const p = Math.min(1, Math.max(0, -rect.top / span));
      setProgress((prev) => (Math.abs(prev - p) < 0.005 ? prev : p));
    };

    // Same drive as PdpReveal, for the same two reasons: this site's Lenis
    // smooth scroll emits no native scroll events, and rAF is suspended
    // outright while the document is hidden, so a timer backs it up.
    let running = true;
    let ticks = 0;
    let timer = 0;
    const tick = () => {
      if (!running) return;
      ticks += 1;
      read();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    const check = setTimeout(() => {
      if (running && ticks === 0) timer = setInterval(read, 33);
    }, 400);

    return () => {
      running = false;
      clearTimeout(check);
      if (timer) clearInterval(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [points.length]);

  if (!image || !points.length) return null;

  const activeIndex = points.reduce((acc, p, i) => (progress >= p.at ? i : acc), -1);
  const active = points[activeIndex];

  return (
    <section
      ref={wrapRef}
      style={{ height: `${height}vh` }}
      className="relative"
      data-testid="pdp-walkthrough"
    >
      <div className="keep-dark sticky top-0 h-screen w-full overflow-hidden bg-[#050505]">
        <div className="relative h-full max-w-[1600px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-[1.25fr_1fr] gap-8 md:gap-14 items-center">
          <div className="relative">
            <img
              src={image}
              alt={heading}
              className="w-full max-h-[62vh] object-contain"
              data-testid="pdp-walkthrough-image"
            />
            {points.map((p, i) => {
              const on = i <= activeIndex;
              return (
                <div
                  key={p.label}
                  className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                  style={{
                    left: `${p.x * 100}%`,
                    top: `${p.y * 100}%`,
                    opacity: on ? 1 : 0,
                    transform: `translate(-50%, -50%) scale(${on ? 1 : 0.6})`,
                  }}
                  data-testid={`walkthrough-pin-${i}`}
                >
                  <span
                    className="block w-3 h-3 rounded-full ring-4 ring-black/40"
                    style={{ background: i === activeIndex ? ACCENT : "rgba(255,255,255,0.55)" }}
                  />
                  {i === activeIndex && (
                    <span
                      className="absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px]
                                 uppercase tracking-[0.2em] px-2 py-1 bg-black/70 rounded"
                      style={{ color: ACCENT }}
                    >
                      {p.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div>
            {kicker && (
              <p className="kicker-sq text-[10px] uppercase tracking-[0.35em] text-zinc-400 mb-5">
                {kicker}
              </p>
            )}
            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tighter text-white leading-[1.04]">
              {heading}
            </h2>
            {body && <p className="mt-5 text-zinc-300 leading-relaxed max-w-md">{body}</p>}

            {active && (
              <div className="mt-9 border-l-2 pl-5 min-h-[110px]" style={{ borderColor: ACCENT }}>
                <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: ACCENT }}>
                  {active.label}
                </p>
                <p className="mt-2.5 text-sm text-zinc-200 leading-relaxed max-w-md">
                  {active.text}
                </p>
              </div>
            )}

            <div className="mt-7 h-px w-40 bg-white/15 relative">
              <div
                className="absolute inset-y-0 left-0"
                style={{ width: `${progress * 100}%`, background: ACCENT }}
              />
            </div>
            <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-zinc-500">
              Scroll to explore
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

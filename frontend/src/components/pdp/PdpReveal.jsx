import { useEffect, useRef, useState } from "react";
import { ACCENT } from "./primitives";

/**
 * Scroll-scrubbed "open the case" sequence.
 *
 * A frame sequence drawn to a canvas, indexed by how far the reader has scrolled
 * through a tall section — not a video. Browsers cannot seek compressed video
 * accurately enough to scrub against scroll: every seek snaps to a keyframe and
 * the motion stutters. Indexing stills is exact and each frame stays at full
 * resolution.
 *
 * Loading is progressive on purpose. Every 8th frame is fetched first so the
 * sequence is scrubbable almost immediately (the nearest loaded frame is drawn
 * meanwhile), then the gaps fill in. Fetching 64 frames before showing anything
 * would stall the section for seconds on a slow connection.
 */
export const PdpReveal = ({
  manifest,          // { frames, width, height, pattern }
  kicker,
  heading,
  body,
  steps = [],        // [{ at: 0..1, label, text }] captions revealed as it opens
  height = 320,      // scroll length, in vh — how far you scroll to open it fully
}) => {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const rafRef = useRef(0);
  const stepsRef = useRef(steps);
  stepsRef.current = steps;
  const [ready, setReady] = useState(0);
  const [step, setStep] = useState(0);

  const total = manifest?.frames ?? 0;

  // ---- load -----------------------------------------------------------------
  useEffect(() => {
    if (!total) return;
    let cancelled = false;
    imagesRef.current = new Array(total).fill(null);
    let done = 0;

    const load = (i) =>
      new Promise((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (!cancelled) {
            imagesRef.current[i] = img;
            done += 1;
            setReady(done);
          }
          resolve();
        };
        img.onerror = resolve;
        img.src = manifest.pattern.replace("{i}", String(i).padStart(3, "0"));
      });

    (async () => {
      const coarse = [];
      for (let i = 0; i < total; i += 8) coarse.push(i);
      await Promise.all(coarse.map(load));
      if (cancelled) return;
      const rest = [];
      for (let i = 0; i < total; i += 1) if (i % 8 !== 0) rest.push(i);
      // Sequentially, so filling in the detail never competes with the rest of
      // the page for bandwidth.
      for (const i of rest) {
        if (cancelled) return;
        await load(i);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [manifest, total]);

  // ---- scrub ----------------------------------------------------------------
  //
  // Set up ONCE. An earlier version listed `ready` in the deps, which tore the
  // loop down and rebuilt it on every one of the 64 load increments — the
  // teardown raced the setup and left no live loop at all, so the canvas never
  // even resized off its 300x150 default. Everything that changes during the
  // component's life is read through a ref instead.
  useEffect(() => {
    if (!total) return;

    let lastIdx = -1;

    const draw = () => {
      const wrap = wrapRef.current;
      const canvas = canvasRef.current;
      if (!wrap || !canvas) return;

      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Off-screen: nothing to do. Keeps the frame loop essentially free for
      // the rest of the page.
      if (rect.bottom < -vh || rect.top > vh * 2) return;

      const span = Math.max(1, rect.height - vh);
      const p = Math.min(1, Math.max(0, -rect.top / span));

      const want = Math.round(p * (total - 1));
      // Nearest loaded frame, so scrubbing works before every frame has landed.
      let idx = want;
      if (!imagesRef.current[idx]) {
        for (let d = 1; d < total; d += 1) {
          if (imagesRef.current[want - d]) { idx = want - d; break; }
          if (imagesRef.current[want + d]) { idx = want + d; break; }
        }
      }
      const img = imagesRef.current[idx];
      if (!img) return;

      const sizeChanged =
        canvas.width !== Math.round(canvas.clientWidth * Math.min(window.devicePixelRatio || 1, 2));
      if (idx === lastIdx && !sizeChanged) return;   // nothing moved
      lastIdx = idx;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      if (canvas.width !== Math.round(cw * dpr) || canvas.height !== Math.round(ch * dpr)) {
        canvas.width = Math.round(cw * dpr);
        canvas.height = Math.round(ch * dpr);
      }
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // contain, so the case is never cropped at any aspect ratio
      const s = Math.min(canvas.width / img.width, canvas.height / img.height);
      const w = img.width * s;
      const h = img.height * s;
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);

      const st = stepsRef.current;
      if (st.length) {
        let next = 0;
        st.forEach((s2, i) => { if (p >= s2.at) next = i; });
        setStep((prev) => (prev === next ? prev : next));
      }
    };

    // Driven by rAF, deliberately NOT by scroll events.
    //
    // The site runs Lenis smooth scroll, which animates the scroll position
    // itself and emits no native scroll event — measured: scrollY moved from
    // 2869 to 3463 with exactly zero 'scroll' events fired. Anything listening
    // for them here simply never updates. A frame loop is independent of who
    // owns scrolling, and the work is one getBoundingClientRect plus an early
    // return whenever the section is off-screen or the index has not changed.
    let running = true;
    let ticks = 0;
    let timer = 0;

    const tick = () => {
      if (!running) return;
      ticks += 1;
      draw();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    // Backstop, for the same reason ProductVideo has one: some embedded and
    // preview webviews expose an API but never deliver its callbacks. rAF is
    // also suspended outright whenever the document is hidden. If no frame has
    // run shortly after setup, fall back to a timer so the sequence still
    // scrubs rather than sitting frozen on frame zero.
    const check = setTimeout(() => {
      if (running && ticks === 0) timer = setInterval(draw, 33);
    }, 400);

    return () => {
      running = false;
      clearTimeout(check);
      if (timer) clearInterval(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [total]);

  if (!manifest) return null;
  const active = steps[step];

  return (
    <section
      ref={wrapRef}
      style={{ height: `${height}vh` }}
      className="relative border-t border-white/10"
      data-testid="pdp-reveal"
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 w-full grid grid-cols-1 md:grid-cols-[1.35fr_1fr] gap-8 md:gap-14 items-center">
          <canvas
            ref={canvasRef}
            className="w-full h-[46vh] md:h-[76vh]"
            data-testid="pdp-reveal-canvas"
            aria-label={heading}
          />
          <div>
            {kicker && (
              <p className="kicker-sq text-[10px] uppercase tracking-[0.35em] text-zinc-500 mb-5">
                {kicker}
              </p>
            )}
            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tighter text-white leading-[1.05]">
              {heading}
            </h2>
            {body && <p className="mt-5 text-zinc-400 leading-relaxed max-w-md">{body}</p>}

            {active && (
              <div className="mt-9 border-t border-white/10 pt-6 min-h-[120px]">
                <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: ACCENT }}>
                  {active.label}
                </p>
                <p className="mt-2.5 text-sm text-zinc-300 leading-relaxed max-w-md">
                  {active.text}
                </p>
              </div>
            )}

            {ready < total && (
              <p className="mt-6 text-[10px] uppercase tracking-[0.25em] text-zinc-600">
                Loading detail · {Math.round((ready / total) * 100)}%
              </p>
            )}
            <p className="mt-4 text-[10px] text-zinc-600">
              Scroll to open. Interior components shown are illustrative.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

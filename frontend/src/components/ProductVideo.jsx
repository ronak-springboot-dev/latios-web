import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/Reveal";

/**
 * Autoplay product loop, Minisforum cooling-section style.
 *
 * Extracted out of ModelShowcase so ANY product page can carry a video without
 * having to author a full ~50-field showcase entry.
 *
 * The video is only mounted once it scrolls near the viewport — these clips are
 * multi-megabyte and a bare <video> starts fetching on page load even far below
 * the fold. `poster` keeps the frame from flashing empty black before the first
 * frame decodes.
 */
export const ProductVideo = ({ src, poster, modelName, heading, subline }) => {
  const wrapRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true); // no observer support: just load it
      return;
    }

    // Already on screen at mount? Don't wait for the observer to tell us.
    const near = () => {
      const r = el.getBoundingClientRect();
      const h = window.innerHeight || document.documentElement.clientHeight || 0;
      return r.top < h + 300 && r.bottom > -300;
    };
    if (near()) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" } // start fetching just before it comes into view
    );
    io.observe(el);

    // Safety net. The observer existing is not the same as the observer firing:
    // some embedded/preview webviews expose IntersectionObserver but never
    // deliver callbacks, and there the clip would simply never appear. Poll
    // cheaply as a backstop so the video is never permanently stuck behind its
    // poster — this costs one rect read per second and stops as soon as it hits.
    const poll = setInterval(() => {
      if (near()) {
        setVisible(true);
        clearInterval(poll);
        io.disconnect();
      }
    }, 1000);

    return () => {
      clearInterval(poll);
      io.disconnect();
    };
  }, []);

  if (!src) return null;

  return (
    <section className="border-t border-white/10" data-testid="showcase-video">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-20 md:py-28">
        <Reveal>
          <h2 className="font-display text-3xl md:text-5xl font-black tracking-tighter text-white text-center mb-4 leading-[1.05]">
            {heading || "See it in motion."}
          </h2>
          <p className="text-center text-sm text-zinc-500 mb-14 max-w-xl mx-auto">
            {subline || "Every panel, port and edge — engineered, assembled and finished in Ahmedabad."}
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <div ref={wrapRef} className="relative overflow-hidden border border-white/10">
            {visible ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster={poster}
                data-testid="showcase-video-player"
                className="w-full aspect-video object-cover"
              >
                <source src={src} type="video/mp4" />
              </video>
            ) : (
              // Same box before load so the section doesn't jump when it mounts
              <div
                className="w-full aspect-video bg-[#0b0b0b] bg-cover bg-center"
                style={poster ? { backgroundImage: `url(${poster})` } : undefined}
                aria-hidden="true"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <div className="keep-dark absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4 pointer-events-none">
              <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-300">
                {modelName}
              </p>
              <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-300">
                Designed · Manufactured · Supported in India
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

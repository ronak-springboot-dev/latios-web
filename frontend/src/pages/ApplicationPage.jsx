import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ArrowRight } from "lucide-react";
import { KineticText } from "@/components/KineticText";
import { Reveal } from "@/components/Reveal";
import { getApplication } from "@/data/applications";
import { getModel } from "@/data/models";

const EASE = [0.16, 1, 0.3, 1];

export default function ApplicationPage() {
  const { slug } = useParams();
  const app = getApplication(slug);
  if (!app) return <Navigate to="/" replace />;
  const products = app.products.map(getModel).filter(Boolean);

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: EASE }}
      data-testid={`application-page-${app.slug}`}
    >
      <section className="keep-dark relative h-[64vh] min-h-[420px] overflow-hidden flex items-end">
        <img
          src={app.image}
          alt={app.title}
          className="absolute inset-0 w-full h-full object-cover"
          data-testid="application-hero-image"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/30" />
        <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 pb-14 w-full">
          <Link
            to="/"
            data-testid="application-back-link"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-zinc-400 hover:text-white transition-colors duration-300 mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Applications
          </Link>
          <KineticText
            testId="application-title"
            lines={[app.title.toUpperCase() + "."]}
            className="font-display font-black tracking-tighter text-white leading-[0.95] text-[13vw] md:text-[7vw]"
            delay={0.15}
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.9, ease: EASE }}
            className="mt-6 max-w-xl text-base md:text-lg text-zinc-300"
            data-testid="application-blurb"
          >
            {app.blurb}
          </motion.p>
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-2 gap-14">
        <Reveal>
          <p className="kicker-sq text-xs uppercase tracking-[0.35em] text-zinc-500 mb-6">The Sector</p>
          <p className="font-display text-2xl md:text-3xl font-light tracking-tight text-white leading-snug" data-testid="application-intro">
            {app.intro}
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <ul className="space-y-5 border-l border-white/10 pl-8" data-testid="application-points">
            {app.points.map((pt) => (
              <li key={pt} className="text-sm md:text-base text-zinc-400 leading-relaxed flex gap-3">
                <span className="mt-2 w-2 h-2 bg-[#1a56e8] shrink-0" />
                {pt}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="border-t border-white/10" data-testid="recommended-products">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-20 md:py-28">
          <Reveal>
            <p className="kicker-sq text-xs uppercase tracking-[0.35em] text-zinc-500 mb-6">Recommended</p>
            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tighter text-white mb-14">
              Latios for {app.title.toLowerCase()}.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((m, i) => (
              <Reveal key={m.slug} delay={i * 0.06}>
                <Link
                  to={`/${m.category}/${m.slug}`}
                  data-testid={`recommended-${m.slug}`}
                  className="group block border border-white/10 bg-[#0A0A0A] hover:border-[#1a56e8]/60 transition-colors duration-500 p-7 focus:ring-2 focus:ring-[#1a56e8]/50 focus:outline-none h-full"
                >
                  <div className="rounded-lg bg-[#f2f2f0] aspect-[16/10] flex items-center justify-center overflow-hidden mb-6">
                    <img
                      src={m.image}
                      alt={m.name}
                      loading="lazy"
                      className="max-h-[80%] w-auto object-contain transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">{m.tag}</span>
                  <h3 className="mt-3 font-display text-xl font-black tracking-tighter text-white leading-snug">
                    {m.name}
                  </h3>
                  <span className="mt-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#6f93f2]">
                    View product
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-20 flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl font-black tracking-tighter text-white leading-[1.05] max-w-xl">
              Planning a {app.title.toLowerCase()} deployment?
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              data-testid="application-enquire-button"
              className="group inline-flex items-center gap-3 btn-blue px-8 py-4 text-xs uppercase tracking-[0.25em] font-semibold transition-colors duration-300 focus:ring-2 focus:ring-[#1a56e8]/50 focus:outline-none"
            >
              Talk to our team
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </Reveal>
        </div>
      </section>
    </motion.main>
  );
}

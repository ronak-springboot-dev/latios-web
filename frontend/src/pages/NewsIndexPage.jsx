import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { KineticText } from "@/components/KineticText";
import { NEWS } from "@/data/news";
import { usePageMeta } from "@/hooks/usePageMeta";

const EASE = [0.16, 1, 0.3, 1];

export default function NewsIndexPage() {
  usePageMeta(
    "News & Updates | Latios",
    "Product launches, exhibitions and stories from Latios — enterprise hardware made in India."
  );

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: EASE }}
      data-testid="news-index-page"
    >
      <section className="relative pt-32 md:pt-44 pb-14" data-testid="news-index-hero">
        <div className="grid-bg absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-[1600px] mx-auto px-6 md:px-12">
          <p className="kicker-sq text-xs uppercase tracking-[0.35em] text-zinc-500 mb-6">News & Updates</p>
          <KineticText
            testId="news-index-title"
            lines={["From the", "Latios newsroom."]}
            className="font-display font-black tracking-tighter text-white leading-[1.02] text-4xl md:text-6xl"
            delay={0.1}
          />
        </div>
      </section>

      <section className="border-t border-white/10" data-testid="news-index-list">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {NEWS.map((n, i) => (
            <Reveal key={n.slug} delay={i * 0.05}>
              <Link
                to={`/news/${n.slug}`}
                data-testid={`news-card-${n.slug}`}
                className="group flex flex-col bg-[#0A0A0A] h-full hover:bg-white/5 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#1a56e8]/50"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={n.image}
                    alt={n.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col flex-1 p-7">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                    {n.tag} · {n.date}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-white leading-snug flex-1">
                    {n.title}
                  </h3>
                  <span className="mt-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#6f93f2] group-hover:text-white transition-colors duration-300">
                    Read story
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </motion.main>
  );
}

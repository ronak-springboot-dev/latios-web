import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { KineticText } from "@/components/KineticText";
import { Reveal } from "@/components/Reveal";
import { getNews, NEWS } from "@/data/news";
import { usePageMeta } from "@/hooks/usePageMeta";

const EASE = [0.16, 1, 0.3, 1];

export default function NewsPage() {
  const { slug } = useParams();
  const item = getNews(slug);
  usePageMeta(
    item ? `${item.title} | Latios News` : "Latios News",
    item ? item.body[0].slice(0, 155) : "News and updates from Latios."
  );
  if (!item) return <Navigate to="/" replace />;
  const others = NEWS.filter((n) => n.slug !== item.slug).slice(0, 3);

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: EASE }}
      data-testid={`news-page-${item.slug}`}
    >
      <section className="keep-dark relative h-[64vh] min-h-[420px] overflow-hidden flex items-end">
        <img
          src={item.image}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover"
          data-testid="news-hero-image"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/30" />
        <div className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-12 pb-14 w-full">
          <Link
            to="/"
            data-testid="news-back-link"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-zinc-400 hover:text-white transition-colors duration-300 mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </Link>
          <p className="kicker-sq text-[10px] uppercase tracking-[0.3em] text-zinc-300 mb-5" data-testid="news-meta">
            {item.tag} · {item.date}
          </p>
          <KineticText
            testId="news-title"
            lines={[item.title]}
            className="font-display font-black tracking-tighter text-white leading-[1.08] text-3xl md:text-5xl"
            delay={0.15}
          />
        </div>
      </section>

      <section className="max-w-[800px] mx-auto px-6 md:px-12 py-20 md:py-28" data-testid="news-body">
        {item.body.map((p, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <p className="text-base md:text-lg text-zinc-300 leading-relaxed mb-8">{p}</p>
          </Reveal>
        ))}
        <Reveal delay={0.1}>
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            data-testid="news-enquire-button"
            className="group mt-4 inline-flex items-center gap-3 btn-blue px-8 py-4 text-xs uppercase tracking-[0.25em] font-semibold transition-colors duration-300 focus:ring-2 focus:ring-[#1a56e8]/50 focus:outline-none"
          >
            Talk to our team
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </Reveal>
      </section>

      <section className="border-t border-white/10" data-testid="more-news">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-20 md:py-28">
          <Reveal>
            <p className="kicker-sq text-xs uppercase tracking-[0.35em] text-zinc-500 mb-10">More news</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {others.map((n) => (
              <Reveal key={n.slug} delay={0.05}>
                <Link
                  to={`/news/${n.slug}`}
                  data-testid={`more-news-${n.slug}`}
                  className="group block border border-white/10 bg-[#0A0A0A] hover:border-[#1a56e8]/60 transition-colors duration-500 overflow-hidden"
                >
                  <div className="h-44 overflow-hidden">
                    <img src={n.image} alt={n.title} loading="lazy" className="spotlight-img w-full h-full object-cover" />
                  </div>
                  <div className="p-6">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-[#6f93f2]">{n.tag}</span>
                    <h3 className="mt-3 font-display text-lg font-bold tracking-tight text-white leading-snug">
                      {n.title}
                    </h3>
                    <span className="mt-4 block text-xs text-zinc-500">{n.date}</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </motion.main>
  );
}

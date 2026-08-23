import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { MessageSquare, Users, TrendingUp } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function AdminPage() {
  usePageMeta("LATI Analytics | Latios", "");
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/chat-analytics`)
      .then((r) => setData(r.data))
      .catch(() => setError(true));
  }, []);

  const maxCount = data?.top_keywords?.[0]?.count || 1;

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="pt-28 md:pt-40 pb-24 min-h-screen"
      data-testid="admin-page"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <Reveal>
          <p className="kicker-sq text-xs uppercase tracking-[0.35em] text-zinc-500 mb-6">Team View</p>
          <h1 className="font-display text-4xl md:text-6xl font-black tracking-tighter text-white leading-[1.02]">
            What buyers ask LATI.
          </h1>
          <p className="mt-4 text-zinc-400 max-w-xl">
            Live questions from the website assistant — see what visitors care about most.
          </p>
        </Reveal>

        {error && (
          <div className="mt-14 border border-white/10 p-12 text-center text-zinc-500" data-testid="analytics-error">
            Could not load analytics right now.
          </div>
        )}

        {data && (
          <>
            <Reveal delay={0.08}>
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-5" data-testid="analytics-stats">
                {[
                  [<MessageSquare key="i" className="w-5 h-5" />, data.total_questions, "Questions asked"],
                  [<Users key="i" className="w-5 h-5" />, data.total_sessions, "Visitor sessions"],
                  [<TrendingUp key="i" className="w-5 h-5" />, data.top_keywords[0]?.word || "—", "Hottest topic"],
                ].map(([icon, value, label], i) => (
                  <div key={label} className="border border-white/10 bg-[#0A0A0A] p-7" data-testid={`analytics-stat-${i}`}>
                    <span className="text-[#6f93f2]">{icon}</span>
                    <div className="mt-4 font-display text-3xl md:text-4xl font-black tracking-tighter text-white">
                      {value}
                    </div>
                    <div className="mt-2 text-[10px] uppercase tracking-[0.25em] text-zinc-500">{label}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-10">
              <Reveal delay={0.12}>
                <h2 className="font-display text-xl font-bold tracking-tight text-white mb-6">Top topics</h2>
                <div className="space-y-3" data-testid="keyword-bars">
                  {data.top_keywords.map((k) => (
                    <div key={k.word} className="flex items-center gap-4">
                      <span className="w-28 shrink-0 text-sm text-zinc-300 capitalize">{k.word}</span>
                      <div className="flex-1 h-6 bg-white/5 relative overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(k.count / maxCount) * 100}%` }}
                          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute inset-y-0 left-0 bg-[#1a56e8]"
                        />
                      </div>
                      <span className="w-8 text-right text-xs text-zinc-500">{k.count}</span>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={0.16}>
                <h2 className="font-display text-xl font-bold tracking-tight text-white mb-6">Recent questions</h2>
                <div className="border-t border-white/10" data-testid="recent-questions">
                  {data.recent.map((m, i) => (
                    <div key={i} className="py-4 border-b border-white/10 flex items-start justify-between gap-6">
                      <span className="text-sm text-zinc-300 leading-relaxed">{m.content}</span>
                      <span className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                        {String(m.ts).slice(0, 10)}
                      </span>
                    </div>
                  ))}
                  {data.recent.length === 0 && (
                    <p className="py-8 text-sm text-zinc-500">No questions yet — they'll appear here as visitors chat.</p>
                  )}
                </div>
              </Reveal>
            </div>
          </>
        )}
      </div>
    </motion.main>
  );
}

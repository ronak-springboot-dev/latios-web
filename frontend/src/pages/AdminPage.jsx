import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { MessageSquare, Users, TrendingUp, Lock, LogOut, Inbox } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { usePageMeta } from "@/hooks/usePageMeta";

const API = process.env.REACT_APP_BACKEND_URL;

export default function AdminPage() {
  usePageMeta("Team Dashboard | Latios", "");
  const [key, setKey] = useState(() => sessionStorage.getItem("latios-admin-key") || "");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [data, setData] = useState(null);
  const [enquiries, setEnquiries] = useState(null);

  const load = useCallback(
    (k) => {
      const headers = { "X-Admin-Key": k };
      axios
        .get(`${API}/api/chat-analytics`, { headers })
        .then((r) => setData(r.data))
        .catch(() => setData(null));
      axios
        .get(`${API}/api/enquiries`, { headers })
        .then((r) => setEnquiries([...r.data].reverse()))
        .catch(() => setEnquiries(null));
    },
    []
  );

  useEffect(() => {
    if (key) load(key);
  }, [key, load]);

  const login = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/admin/login`, { password });
      sessionStorage.setItem("latios-admin-key", password);
      setKey(password);
      setLoginError("");
    } catch {
      setLoginError("Wrong password — try again.");
    }
  };

  const logout = () => {
    sessionStorage.removeItem("latios-admin-key");
    setKey("");
    setData(null);
    setEnquiries(null);
    setPassword("");
  };

  const maxCount = data?.top_keywords?.[0]?.count || 1;

  if (!key)
    return (
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="pt-40 pb-24 min-h-screen flex items-start justify-center"
        data-testid="admin-login-page"
      >
        <div className="w-full max-w-sm border border-white/10 bg-[#0A0A0A] p-10">
          <span className="w-12 h-12 btn-blue flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </span>
          <h1 className="mt-6 font-display text-3xl font-black tracking-tighter text-white">Team access</h1>
          <p className="mt-2 text-sm text-zinc-500">This dashboard is for the Latios sales team.</p>
          <form onSubmit={login} className="mt-8 space-y-4" data-testid="admin-login-form">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Team password"
              data-testid="admin-password-input"
              className="w-full bg-white/5 border border-white/10 px-5 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#1a56e8] transition-colors duration-300"
            />
            {loginError && (
              <p className="text-xs text-red-400" data-testid="admin-login-error">{loginError}</p>
            )}
            <button
              type="submit"
              data-testid="admin-login-submit"
              className="w-full btn-blue px-5 py-3.5 text-xs uppercase tracking-[0.25em] font-semibold transition-colors duration-300 focus:ring-2 focus:ring-[#1a56e8]/50 focus:outline-none"
            >
              Sign in
            </button>
          </form>
        </div>
      </motion.main>
    );

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
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="kicker-sq text-xs uppercase tracking-[0.35em] text-zinc-500 mb-6">Team View</p>
              <h1 className="font-display text-4xl md:text-6xl font-black tracking-tighter text-white leading-[1.02]">
                Sales command center.
              </h1>
              <p className="mt-4 text-zinc-400 max-w-xl">
                Enquiries, LATI leads and the questions buyers ask — all in one place.
              </p>
            </div>
            <button
              onClick={logout}
              data-testid="admin-logout"
              className="shrink-0 flex items-center gap-2 border border-white/15 px-5 py-2.5 text-[10px] uppercase tracking-[0.25em] text-zinc-400 hover:text-white hover:border-white/40 transition-colors duration-300"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
        </Reveal>

        {data && (
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
        )}

        {/* ENQUIRY INBOX */}
        <Reveal delay={0.1}>
          <div className="mt-16" data-testid="enquiry-inbox">
            <div className="flex items-center gap-3 mb-6">
              <Inbox className="w-5 h-5 text-[#6f93f2]" />
              <h2 className="font-display text-xl font-bold tracking-tight text-white">Enquiry inbox</h2>
              {enquiries && (
                <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                  {enquiries.length} total
                </span>
              )}
            </div>
            <div className="border-t border-white/10">
              {enquiries === null && (
                <p className="py-8 text-sm text-zinc-500">Loading enquiries…</p>
              )}
              {enquiries && enquiries.length === 0 && (
                <p className="py-8 text-sm text-zinc-500">No enquiries yet — new ones email sales@latios.in and appear here.</p>
              )}
              {enquiries &&
                enquiries.map((q) => (
                  <div
                    key={q.id}
                    data-testid={`inbox-item-${q.id}`}
                    className="py-5 border-b border-white/10 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6"
                  >
                    <div className="md:col-span-3">
                      <div className="text-sm font-semibold text-white">{q.name}</div>
                      <a href={`mailto:${q.email}`} className="text-xs text-[#6f93f2] hover:text-white transition-colors duration-300">
                        {q.email}
                      </a>
                      {q.company && <div className="text-xs text-zinc-500 mt-0.5">{q.company}</div>}
                    </div>
                    <div className="md:col-span-7 text-sm text-zinc-400 leading-relaxed">{q.message}</div>
                    <div className="md:col-span-2 flex md:flex-col items-center md:items-end gap-2">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                        {String(q.created_at).slice(0, 10)}
                      </span>
                      {q.message.startsWith("LATI chat lead") && (
                        <span className="text-[9px] uppercase tracking-[0.2em] border border-[#1a56e8]/50 text-[#6f93f2] rounded-full px-2.5 py-1">
                          via LATI
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </Reveal>

        {data && (
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10">
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
        )}
      </div>
    </motion.main>
  );
}

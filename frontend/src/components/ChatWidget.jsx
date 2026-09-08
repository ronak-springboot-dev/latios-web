import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Bot, SendHorizonal, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { TurnstileWidget } from "@/components/TurnstileWidget";

const FAQS = [
  "Which laptop is best for gaming?",
  "Do you have rugged, IP65-rated laptops?",
  "What's the biggest display you make?",
  "Which workstation supports 2TB of memory?",
  "How do I buy Latios products?",
];

const WELCOME = {
  role: "assistant",
  content:
    "Hi, I'm LATI — the Latios AI assistant. Ask me anything about our laptops, towers, audio or video products, or tap a question below.",
};

const renderText = (t) =>
  t
    .replace(/\*\*(\[[^\]]+\]\([^)]+\))\*\*/g, "$1")
    .replace(/(^|\n)\s*[*-]\s+/g, "$1• ")
    .split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link)
      return (
        <a
          key={i}
          href={link[2]}
          className="text-[#6f93f2] underline underline-offset-2 hover:text-white transition-colors duration-200"
        >
          {link[1]}
        </a>
      );
    return part.split(/(\*\*[^*]+\*\*)/g).map((p2, j) =>
      p2.startsWith("**") && p2.endsWith("**") ? (
        <strong key={`${i}-${j}`} className="font-semibold text-white">
          {p2.slice(2, -2)}
        </strong>
      ) : (
        p2
      )
    );
  });

const getSessionId = () => {
  let s = localStorage.getItem("lati-session");
  if (!s) {
    s = crypto.randomUUID();
    localStorage.setItem("lati-session", s);
  }
  return s;
};

export const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [showLead, setShowLead] = useState(false);
  const [leadDone, setLeadDone] = useState(() => localStorage.getItem("lati-lead-done") === "1");
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadToken, setLeadToken] = useState(null);
  const [leadReset, setLeadReset] = useState(0);
  const onLeadToken = useCallback((t) => setLeadToken(t), []);
  const [verified, setVerified] = useState(() => localStorage.getItem("lati-verified") === "1");
  const [chatToken, setChatToken] = useState(null);
  const [chatReset, setChatReset] = useState(0);
  // Set when Turnstile cannot serve this hostname at all. The check is then not
  // something the visitor can complete, so blocking on it just makes the chat
  // permanently dead -- the backend meters unverified callers instead.
  const [checkUnavailable, setCheckUnavailable] = useState(false);
  const onChatToken = useCallback((t) => setChatToken(t), []);
  const lastQuery = useRef("");
  const [sessionId] = useState(getSessionId);
  const scrollRef = useRef(null);

  useEffect(() => {
    const openChat = () => setOpen(true);
    window.addEventListener("lati:open", openChat);
    return () => window.removeEventListener("lati:open", openChat);
  }, []);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  const appendLast = (delta) =>
    setMessages((m) => {
      const c = [...m];
      c[c.length - 1] = { role: "assistant", content: c[c.length - 1].content + delta };
      return c;
    });

  const failLast = (text) =>
    setMessages((m) => {
      const c = [...m];
      c[c.length - 1] = { role: "assistant", content: text };
      return c;
    });

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || busy) return;
    if (!verified && !chatToken && !checkUnavailable) {
      toast.error("Please complete the security check first.");
      return;
    }
    setInput("");
    setBusy(true);
    lastQuery.current = msg;
    setMessages((m) => [...m, { role: "user", content: msg }, { role: "assistant", content: "" }]);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          message: msg,
          ...(verified ? {} : { turnstile_token: chatToken }),
        }),
      });
      if (!res.ok) {
        if (res.status === 429) {
          failLast("That is a lot of questions at once — please pause a moment, or email sales@latios.in.");
          return;
        }
        if (res.status === 403 || res.status === 400) {
          setCheckUnavailable(false);
          setVerified(false);
          localStorage.removeItem("lati-verified");
          setChatToken(null);
          setChatReset((r) => r + 1);
          failLast("Please complete the security check below, then send again.");
        } else {
          failLast("LATI is momentarily unavailable — please try again, or email sales@latios.in.");
        }
        return;
      }
      if (!verified) {
        setVerified(true);
        localStorage.setItem("lati-verified", "1");
        setChatToken(null);
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const parts = buf.split("\n\n");
        buf = parts.pop();
        for (const part of parts) {
          if (!part.startsWith("data:")) continue;
          const payload = part.slice(5).trim();
          if (payload === "[DONE]") continue;
          try {
            const j = JSON.parse(payload);
            if (j.delta) appendLast(j.delta);
            if (j.error)
              failLast("LATI is momentarily unavailable — please try again, or email sales@latios.in.");
            if (j.lead && !leadDone) setShowLead(true);
          } catch {}
        }
      }
      setMessages((m) => {
        const last = m[m.length - 1];
        if (last && last.role === "assistant" && !last.content) {
          const c = [...m];
          c[c.length - 1] = { role: "assistant", content: "No response — please try again." };
          return c;
        }
        return m;
      });
    } catch {
      failLast("Connection issue — please check your network and try again.");
    } finally {
      setBusy(false);
    }
  };

  const submitLead = async (e) => {
    e.preventDefault();
    if (!leadToken) {
      toast.error("Please complete the security check first.");
      return;
    }
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadName,
          email: leadEmail,
          company: "",
          message: `LATI chat lead — asked about: "${lastQuery.current}"`,
          turnstile_token: leadToken,
        }),
      });
      localStorage.setItem("lati-lead-done", "1");
      setLeadDone(true);
      setShowLead(false);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `Thanks ${leadName.split(" ")[0]} — our sales team will reach out at ${leadEmail} shortly. Anything else about the range meanwhile?`,
        },
      ]);
      toast.success("Details received — our sales team will contact you.");
    } catch {
      toast.error("Could not save your details — please email sales@latios.in directly.");
    } finally {
      setLeadToken(null);
      setLeadReset((r) => r + 1);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen(!open)}
        data-testid="chat-toggle"
        aria-label="Open LATI assistant"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.8, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="chat-fab fixed bottom-6 right-6 z-[80] w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-2xl shadow-black/50 hover:bg-zinc-300 transition-colors duration-300 focus:ring-2 focus:ring-white/50 focus:outline-none"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="keep-dark fixed bottom-24 right-6 z-[80] w-[92vw] max-w-sm rounded-2xl border border-white/15 bg-[#0A0A0A] shadow-2xl shadow-black/60 overflow-hidden flex flex-col"
            data-testid="chat-panel"
          >
            <div className="p-4 border-b border-white/10 flex items-center gap-3 shrink-0">
              <span className="chat-fab w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-black" />
              </span>
              <div>
                <div className="font-display font-black tracking-tight text-white leading-none">LATI</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                  Latios AI Assistant
                </div>
              </div>
              <span className="ml-auto flex items-center gap-1.5 text-[9px] uppercase tracking-[0.25em] text-zinc-400 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Online
              </span>
            </div>

            <div
              ref={scrollRef}
              data-lenis-prevent
              className="p-4 space-y-3 overflow-y-auto max-h-[46vh] min-h-[180px]"
              data-testid="chat-messages"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  data-testid={`chat-msg-${i}`}
                  className={`text-sm leading-relaxed rounded-xl px-4 py-3 max-w-[88%] whitespace-pre-wrap ${
                    m.role === "user"
                      ? "ml-auto bg-white text-black"
                      : "bg-white/5 border border-white/10 text-zinc-300"
                  }`}
                >
                  {m.content ? (
                    renderText(m.content)
                  ) : (
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
                  )}
                </div>
              ))}
            </div>

            {showLead && !leadDone && (
              <form
                onSubmit={submitLead}
                data-testid="lati-lead-form"
                className="px-4 pb-3 pt-4 space-y-2.5 shrink-0 border-t border-white/10"
              >
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Want pricing or a quote? Leave your details and our sales team will reach out.
                </p>
                <input
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="Your name"
                  data-testid="lati-lead-name"
                  className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#1a56e8] transition-colors duration-300"
                />
                <input
                  required
                  type="email"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  placeholder="Work email"
                  data-testid="lati-lead-email"
                  className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#1a56e8] transition-colors duration-300"
                />
                <TurnstileWidget onToken={onLeadToken} resetSignal={leadReset} testid="turnstile-chat" />
                <button
                  type="submit"
                  disabled={!leadToken}
                  data-testid="lati-lead-submit"
                  className="w-full btn-blue rounded-full px-4 py-2.5 text-xs uppercase tracking-[0.2em] font-semibold disabled:opacity-40 transition-colors duration-300 focus:ring-2 focus:ring-[#1a56e8]/50 focus:outline-none"
                >
                  Get pricing
                </button>
              </form>
            )}

            {messages.length <= 1 && (
              <div className="px-4 pb-3 flex flex-wrap gap-2 shrink-0" data-testid="chat-faqs">
                {FAQS.map((q, i) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    data-testid={`chat-faq-${i}`}
                    className="text-left text-xs text-zinc-400 border border-white/10 rounded-full px-3.5 py-2 hover:border-white/40 hover:text-white transition-colors duration-300 focus:ring-2 focus:ring-white/40 focus:outline-none"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {!verified && !checkUnavailable && (
              <div className="px-3 pt-3 border-t border-white/10 shrink-0" data-testid="chat-verify">
                <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                  Quick security check to start chatting
                </p>
                <TurnstileWidget
                  onToken={onChatToken}
                  resetSignal={chatReset}
                  testid="turnstile-chat-verify"
                  action="chat"
                  theme="dark"
                  onUnavailable={() => setCheckUnavailable(true)}
                />
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="p-3 border-t border-white/10 flex items-center gap-2 shrink-0"
              data-testid="chat-form"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Latios products…"
                data-testid="chat-input"
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/40 transition-colors duration-300"
              />
              <button
                type="submit"
                disabled={busy || !input.trim() || (!verified && !chatToken)}
                data-testid="chat-send"
                aria-label="Send message"
                className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center hover:bg-zinc-300 disabled:opacity-40 transition-colors duration-300 focus:ring-2 focus:ring-white/50 focus:outline-none shrink-0"
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <SendHorizonal className="w-4 h-4" />}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};


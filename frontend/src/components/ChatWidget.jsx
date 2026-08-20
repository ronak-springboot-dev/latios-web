import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Bot, SendHorizonal, Loader2 } from "lucide-react";

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
  t.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-white">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );

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
  const [sessionId] = useState(getSessionId);
  const scrollRef = useRef(null);

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
    setInput("");
    setBusy(true);
    setMessages((m) => [...m, { role: "user", content: msg }, { role: "assistant", content: "" }]);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, message: msg }),
      });
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
        className="fixed bottom-6 right-6 z-[80] w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-2xl shadow-black/50 hover:bg-zinc-300 transition-colors duration-300 focus:ring-2 focus:ring-white/50 focus:outline-none"
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
            className="fixed bottom-24 right-6 z-[80] w-[92vw] max-w-sm rounded-2xl border border-white/15 bg-[#0A0A0A] shadow-2xl shadow-black/60 overflow-hidden flex flex-col"
            data-testid="chat-panel"
          >
            <div className="p-4 border-b border-white/10 flex items-center gap-3 shrink-0">
              <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
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
                disabled={busy || !input.trim()}
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


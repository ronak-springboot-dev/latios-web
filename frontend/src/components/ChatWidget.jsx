import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Clock3, Bot } from "lucide-react";

const FAQS = [
  "Which Latios tower fits a 50-seat office?",
  "What's the difference between MT, SFF and MFF?",
  "Do PROMAX workstations support ECC memory?",
  "Can I order custom configurations in bulk?",
  "Where can I buy Latios products?",
];

export const ChatWidget = () => {
  const [open, setOpen] = useState(false);

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
            className="fixed bottom-24 right-6 z-[80] w-[92vw] max-w-sm rounded-2xl border border-white/15 bg-[#0A0A0A] shadow-2xl shadow-black/60 overflow-hidden"
            data-testid="chat-panel"
          >
            <div className="p-5 border-b border-white/10 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-black" />
              </span>
              <div>
                <div className="font-display font-black tracking-tight text-white leading-none">
                  LATI
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                  Latios AI Assistant
                </div>
              </div>
              <span className="ml-auto text-[9px] uppercase tracking-[0.25em] border border-white/20 rounded-full px-3 py-1.5 text-zinc-400 shrink-0">
                Coming soon
              </span>
            </div>

            <div className="p-5 space-y-3">
              <p className="text-sm text-zinc-400 leading-relaxed">
                Hi, I'm LATI — soon I'll answer anything about Latios machines.
                Here's what people usually ask:
              </p>
              {FAQS.map((q, i) => (
                <div
                  key={q}
                  data-testid={`chat-faq-${i}`}
                  className="flex items-center justify-between gap-3 text-sm text-zinc-500 border border-white/10 rounded-xl px-4 py-3 opacity-60 select-none"
                >
                  <span>{q}</span>
                  <Clock3 className="w-3.5 h-3.5 shrink-0" />
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/10">
              <input
                disabled
                placeholder="Chat coming soon…"
                data-testid="chat-input"
                className="w-full bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm text-zinc-500 placeholder:text-zinc-600 cursor-not-allowed"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

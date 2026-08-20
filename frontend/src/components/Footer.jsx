import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/data/products";

const EMPTY = { name: "", email: "", company: "", message: "" };

const inputCls =
  "w-full bg-transparent border-b border-white/15 focus:border-white/70 transition-colors duration-300 py-3 text-white placeholder:text-zinc-600 text-sm focus:outline-none";

export const Footer = () => {
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/enquiries`, form);
      toast.success("Enquiry received — our team replies within one business day.");
      setForm(EMPTY);
    } catch {
      toast.error("Could not send your enquiry. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <footer id="contact" data-testid="site-footer" className="border-t border-white/10 bg-[#050505]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h2 className="font-display text-4xl md:text-6xl font-black tracking-tighter text-white leading-[1.02]">
            Let's build your fleet.
          </h2>
          <p className="mt-6 text-zinc-400 max-w-md leading-relaxed">
            Volume pricing, custom imaging, and white-glove deployment for teams of
            ten to ten thousand.
          </p>
          <p className="mt-8 text-[10px] uppercase tracking-[0.35em] text-zinc-500">
            Proudly Indian. Boldly Innovative.
          </p>
          <div className="mt-8 flex flex-col gap-3 text-sm">
            <a
              href="mailto:sales@latios.in"
              data-testid="footer-email-link"
              className="group inline-flex items-center gap-2 text-white hover:text-zinc-300 transition-colors duration-300"
            >
              sales@latios.in
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="tel:+918238140787"
              data-testid="footer-phone-link"
              className="text-white hover:text-zinc-300 transition-colors duration-300"
            >
              +91 82381 40787
            </a>
            <span className="text-zinc-500">Ahmedabad, Gujarat, India</span>
          </div>
        </div>

        <form onSubmit={submit} data-testid="enquiry-form" className="flex flex-col gap-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
            <input
              required
              value={form.name}
              onChange={set("name")}
              placeholder="Full name"
              data-testid="enquiry-name-input"
              className={inputCls}
            />
            <input
              required
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="Work email"
              data-testid="enquiry-email-input"
              className={inputCls}
            />
          </div>
          <input
            value={form.company}
            onChange={set("company")}
            placeholder="Company (optional)"
            data-testid="enquiry-company-input"
            className={inputCls}
          />
          <textarea
            required
            value={form.message}
            onChange={set("message")}
            placeholder="What does your team need?"
            rows={4}
            data-testid="enquiry-message-input"
            className={`${inputCls} resize-none`}
          />
          <button
            type="submit"
            disabled={sending}
            data-testid="enquiry-submit-button"
            className="self-start bg-white text-black rounded-full px-10 py-4 text-xs uppercase tracking-[0.25em] font-semibold hover:bg-zinc-300 disabled:opacity-50 transition-colors duration-300 focus:ring-2 focus:ring-white/50 focus:outline-none"
          >
            {sending ? "Sending…" : "Send enquiry"}
          </button>
        </form>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <span className="logo-chip bg-white rounded-md px-3 py-1.5 inline-flex items-center">
            <img src="/images/latios-logo.png" alt="Latios" className="h-6 w-auto" data-testid="footer-logo" />
          </span>
          <nav className="flex flex-wrap gap-6" data-testid="footer-nav">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                to={`/${c.slug}`}
                data-testid={`footer-link-${c.slug}`}
                className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors duration-300"
              >
                {c.name}
              </Link>
            ))}
          </nav>
          <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">
            © 2026 Latios Infosystem Pvt. Ltd.
          </span>
        </div>
      </div>
    </footer>
  );
};

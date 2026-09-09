import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/data/products";
import { Wordmark } from "@/components/Wordmark";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { useEnquiryDraft, clearEnquiryDraft } from "@/lib/enquiryDraft";

/**
 * Certifications Latios actually holds, in one place.
 *
 * Single source of truth on purpose: these were previously scattered as loose
 * strings across Home.jsx, applications.js, news.js and the PDP copy, in
 * unversioned form, and had drifted — Home claimed ISO 45001, which is not on
 * the company's list.
 */
export const CERTIFICATIONS = [
  "ISO 9001:2015",
  "ISO 14001:2015",
  "ISO 20000-1:2018",
  "ISO 27001:2022",
  "BIS",
  "EPR",
  "REACH",
  "RoHS",
  "UL Solutions",
  "CE",
  "GeM Registered",
];

const EMPTY = { name: "", email: "", company: "", message: "" };

const inputCls =
  "w-full bg-transparent border-b border-white/15 focus:border-white/70 transition-colors duration-300 py-3 text-white placeholder:text-zinc-600 text-sm focus:outline-none";

export const Footer = () => {
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);

  // A configuration chosen on a product page arrives here as the message body.
  // Seeded rather than controlled: once someone edits the box it is theirs, so
  // the draft only fills an untouched field and never overwrites typing.
  const draft = useEnquiryDraft();
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    if (draft && !touched) setForm((f) => ({ ...f, message: draft }));
  }, [draft, touched]);
  const [token, setToken] = useState(null);
  const [resetSignal, setResetSignal] = useState(0);
  const onToken = useCallback((t) => setToken(t), []);

  const submit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please complete the security check first.");
      return;
    }
    setSending(true);
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/enquiries`, {
        ...form,
        turnstile_token: token,
      });
      toast.success("Enquiry received — our team replies within one business day.");
      setForm(EMPTY);
      setTouched(false);
      clearEnquiryDraft();
    } catch (err) {
      toast.error(
        err.response?.status === 422
          ? "Please enter a valid work email."
          : err.response?.status === 400
          ? "Security check failed — please verify again."
          : "Could not send your enquiry. Please try again."
      );
    } finally {
      setToken(null);
      setResetSignal((s) => s + 1);
      setSending(false);
    }
  };

  const set = (k) => (e) => {
    if (k === "message") setTouched(true);
    setForm({ ...form, [k]: e.target.value });
  };

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
            <span className="text-zinc-500">
              208, Palak Prime, Opp. Hotel Double Tree by Hilton, ISCON–Ambali Road,
              Ahmedabad 380058, Gujarat, India
            </span>
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
          <TurnstileWidget onToken={onToken} resetSignal={resetSignal} testid="turnstile-footer" />
          <button
            type="submit"
            disabled={sending || !token}
            data-testid="enquiry-submit-button"
            className="self-start bg-white text-black rounded-full px-10 py-4 text-xs uppercase tracking-[0.25em] font-semibold hover:bg-zinc-300 disabled:opacity-50 transition-colors duration-300 focus:ring-2 focus:ring-white/50 focus:outline-none"
          >
            {sending ? "Sending…" : "Send enquiry"}
          </button>
        </form>
      </div>

      <div className="border-t border-white/10" data-testid="footer-links">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <Wordmark className="h-8 md:h-9 w-auto" testid="footer-brand-logo" />
            <p className="mt-5 text-xs text-zinc-500 leading-relaxed max-w-[220px]">
              Proudly Indian. Boldly Innovative. Designed and manufactured in Ahmedabad, India.
            </p>
            <span className="mt-4 inline-block text-[9px] uppercase tracking-[0.25em] border border-white/15 rounded-full px-3 py-1.5 text-zinc-500">
              GeM Registered OEM
            </span>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-5">Products</p>
            <div className="flex flex-col gap-3">
              {CATEGORIES.map((c) => (
                <Link key={c.slug} to={`/${c.slug}`} className="text-sm text-zinc-400 hover:text-white transition-colors duration-300">
                  {c.name}
                </Link>
              ))}
              <Link to="/compare" className="text-sm text-zinc-400 hover:text-white transition-colors duration-300">
                Compare Machines
              </Link>
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-5">Company</p>
            <div className="flex flex-col gap-3">
              <Link to="/about" data-testid="footer-about" className="text-sm text-zinc-400 hover:text-white transition-colors duration-300">
                About Latios
              </Link>
              {[
                ["Applications", "applications-section"],
              ].map(([label, id]) => (
                <button
                  key={id}
                  onClick={() => {
                    const el = document.getElementById(id);
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                    else window.location.href = "/";
                  }}
                  data-testid={`footer-${id}`}
                  className="text-left text-sm text-zinc-400 hover:text-white transition-colors duration-300"
                >
                  {label}
                </button>
              ))}
              <Link to="/news" data-testid="footer-news" className="text-sm text-zinc-400 hover:text-white transition-colors duration-300">
                News & Updates
              </Link>
              <Link to="/admin" className="text-sm text-zinc-400 hover:text-white transition-colors duration-300">
                Team Login
              </Link>
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-5">Support</p>
            <div className="flex flex-col gap-3 text-sm text-zinc-400">
              <a href="mailto:sales@latios.in" className="hover:text-white transition-colors duration-300">sales@latios.in</a>
              <a href="mailto:support@latios.in" className="hover:text-white transition-colors duration-300">support@latios.in</a>
              <a href="mailto:partnerships@latios.in" className="hover:text-white transition-colors duration-300">partnerships@latios.in</a>
              <a href="tel:+918238140787" className="hover:text-white transition-colors duration-300">+91 82381 40787</a>
              <Link to="/support" data-testid="footer-support-center" className="text-white hover:text-zinc-300 transition-colors duration-300">Support Center</Link>
              <span className="text-zinc-500 text-xs">Support: Mon–Sat · 10:00 AM – 6:30 PM IST</span>
              <span className="text-zinc-500 text-xs leading-relaxed">208, Palak Prime, ISCON–Ambali Road, Ahmedabad 380058</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
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
            © 2026 Latios Infosystem Pvt. Ltd. All rights reserved.
          </span>
        </div>

        {/* Certifications and compliance. Text marks, not logos: reproducing the
            ISO, UL, CE or BIS marks as artwork carries its own licensing rules,
            and a plain wordmark makes no claim about the mark itself. */}
        <div
          className="mt-8 pt-8 border-t border-white/5 flex flex-wrap items-center gap-x-3 gap-y-2"
          data-testid="compliance-strip"
          aria-label="Certifications and compliance"
        >
          {CERTIFICATIONS.map((c) => (
            <span
              key={c}
              data-testid={`cert-${c.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              className="text-[9px] uppercase tracking-[0.18em] text-zinc-500 border border-white/10 rounded px-2.5 py-1"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
};

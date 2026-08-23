import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search, Laptop, PcCase, Speaker, Monitor, Download, ShieldCheck,
  ClipboardList, Wrench, MapPin, PackageSearch, Mail, Phone,
  MessageCircle, FileText, ArrowUpRight,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { KineticText } from "@/components/KineticText";
import { ALL_MODELS, DATASHEETS } from "@/data/models";
import { usePageMeta } from "@/hooks/usePageMeta";

const EASE = [0.16, 1, 0.3, 1];

const PRODUCT_TILES = [
  { icon: Laptop, label: "Laptops", to: "/laptops" },
  { icon: PcCase, label: "Desktops & Workstations", to: "/towers" },
  { icon: Speaker, label: "Audio", to: "/audio" },
  { icon: Monitor, label: "Video & Displays", to: "/video" },
];

const mailto = (subject, body) =>
  `mailto:support@latios.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export default function SupportPage() {
  usePageMeta(
    "Support | Latios",
    "Latios service and support — datasheets, warranty, product registration, service location and contact channels."
  );
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const results = query.trim()
    ? ALL_MODELS.filter((m) =>
        `${m.name} ${m.tag}`.toLowerCase().includes(query.trim().toLowerCase())
      ).slice(0, 6)
    : [];

  const downloads = ALL_MODELS.filter((m) => DATASHEETS[m.slug]);

  const goContact = () => {
    navigate("/");
    setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 450);
  };

  const SERVICE_TILES = [
    {
      icon: Download,
      title: "Downloads",
      desc: "Datasheets for every desktop and workstation — full specifications in PDF.",
      action: () => document.getElementById("support-downloads")?.scrollIntoView({ behavior: "smooth" }),
      testid: "service-downloads",
    },
    {
      icon: ShieldCheck,
      title: "Warranty Check",
      desc: "Check your warranty status — email us your product serial number.",
      href: mailto("Warranty status check", "Product model:\nSerial number:\nPurchase date:\n"),
      testid: "service-warranty",
    },
    {
      icon: ClipboardList,
      title: "Product Registration",
      desc: "Register your Latios product for faster support and updates.",
      href: mailto("Product registration", "Product model:\nSerial number:\nPurchase date:\nDealer / source:\n"),
      testid: "service-registration",
    },
    {
      icon: Wrench,
      title: "Technical Support",
      desc: "Driver, setup and troubleshooting help from our engineers.",
      href: mailto("Technical support request", "Product model:\nIssue description:\n"),
      testid: "service-technical",
    },
    {
      icon: MapPin,
      title: "Find Service Location",
      desc: "Visit our Ahmedabad service and support center.",
      action: () => document.getElementById("support-location")?.scrollIntoView({ behavior: "smooth" }),
      testid: "service-location",
    },
    {
      icon: PackageSearch,
      title: "Check Repair Status",
      desc: "Track an ongoing repair — email us your RMA / ticket number.",
      href: mailto("Repair status inquiry", "RMA / ticket number:\nProduct model:\n"),
      testid: "service-repair",
    },
  ];

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: EASE }}
      data-testid="support-page"
    >
      {/* HERO + SEARCH */}
      <section className="relative pt-32 md:pt-44 pb-16 md:pb-24" data-testid="support-hero">
        <div className="grid-bg absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-[1100px] mx-auto px-6 md:px-12 text-center">
          <p className="kicker-sq justify-center text-xs uppercase tracking-[0.35em] text-zinc-500 mb-6">
            Support
          </p>
          <KineticText
            testId="support-title"
            lines={["Welcome to Latios", "Service and Support"]}
            className="font-display font-black tracking-tighter text-white leading-[1.05] text-4xl md:text-6xl"
            delay={0.1}
          />
          <p className="mt-6 text-zinc-400 max-w-xl mx-auto" data-testid="support-subtitle">
            Customized services especially for you — datasheets, warranty, registration and a
            team that answers within one business day.
          </p>
          <div className="relative mt-10 max-w-xl mx-auto" data-testid="support-search">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your product — e.g. PROMAX, Archer, SFF…"
              data-testid="support-search-input"
              className="w-full bg-white/5 border border-white/15 rounded-full pl-12 pr-5 py-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#1a56e8] transition-colors duration-300"
            />
            {results.length > 0 && (
              <div className="absolute top-full mt-2 left-0 right-0 border border-white/10 bg-[#0A0A0A] rounded-xl overflow-hidden z-20 text-left" data-testid="support-search-results">
                {results.map((m) => (
                  <Link
                    key={m.slug}
                    to={`/${m.category}/${m.slug}`}
                    onClick={() => setQuery("")}
                    data-testid={`support-result-${m.slug}`}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/5 transition-colors duration-200"
                  >
                    <img src={m.image} alt="" className="w-10 h-10 object-contain rounded bg-[#f2f2f0]" />
                    <div>
                      <div className="text-sm text-white">{m.name}</div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{m.tag}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SELECT YOUR PRODUCT */}
      <section className="border-t border-white/10" data-testid="support-products">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 py-20 md:py-24">
          <Reveal>
            <h2 className="font-display text-2xl md:text-4xl font-black tracking-tighter text-white mb-3">
              Select your product
            </h2>
            <p className="text-zinc-500 text-sm mb-12">Find the exclusive page and services for your product.</p>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10">
            {PRODUCT_TILES.map((t, i) => (
              <Reveal key={t.label} delay={i * 0.06}>
                <Link
                  to={t.to}
                  data-testid={`support-product-${i}`}
                  className="group flex flex-col items-center gap-4 bg-[#0A0A0A] p-8 md:p-10 h-full hover:bg-white/5 transition-colors duration-300"
                >
                  <t.icon className="w-8 h-8 text-zinc-400 group-hover:text-[#6f93f2] transition-colors duration-300" />
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-300 text-center">{t.label}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE & SUPPORT TILES */}
      <section className="border-t border-white/10" data-testid="support-services">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 py-20 md:py-24">
          <Reveal>
            <h2 className="font-display text-2xl md:text-4xl font-black tracking-tighter text-white mb-3">
              Service and support
            </h2>
            <p className="text-zinc-500 text-sm mb-12">Common service items.</p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICE_TILES.map((t, i) => {
              const inner = (
                <>
                  <t.icon className="w-6 h-6 text-[#6f93f2]" />
                  <span className="mt-5 font-display text-lg font-bold tracking-tight text-white flex items-center gap-2">
                    {t.title}
                    <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                  </span>
                  <span className="mt-2 text-sm text-zinc-500 leading-relaxed">{t.desc}</span>
                </>
              );
              const cls =
                "group flex flex-col border border-white/10 bg-[#0A0A0A] p-7 h-full text-left hover:border-[#1a56e8]/60 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#1a56e8]/50";
              return (
                <Reveal key={t.title} delay={i * 0.05}>
                  {t.href ? (
                    <a href={t.href} data-testid={t.testid} className={cls}>{inner}</a>
                  ) : (
                    <button onClick={t.action} data-testid={t.testid} className={cls}>{inner}</button>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* DOWNLOADS */}
      <section className="border-t border-white/10" id="support-downloads" data-testid="support-downloads">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 py-20 md:py-24">
          <Reveal>
            <h2 className="font-display text-2xl md:text-4xl font-black tracking-tighter text-white mb-3">
              Datasheet downloads
            </h2>
            <p className="text-zinc-500 text-sm mb-12">
              Official Latios datasheets — full specifications, dimensions and configurations.
            </p>
          </Reveal>
          <div className="border-t border-white/10">
            {downloads.map((m) => (
              <div
                key={m.slug}
                data-testid={`download-row-${m.slug}`}
                className="flex items-center justify-between gap-6 py-4 border-b border-white/10"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <FileText className="w-4 h-4 shrink-0 text-zinc-500" />
                  <div className="min-w-0">
                    <div className="text-sm text-white truncate">{m.name}</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">{m.tag}</div>
                  </div>
                </div>
                <a
                  href={DATASHEETS[m.slug]}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`download-btn-${m.slug}`}
                  className="group shrink-0 inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-zinc-300 hover:border-[#1a56e8] hover:text-white transition-colors duration-300"
                >
                  <Download className="w-3.5 h-3.5" /> PDF
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE LOCATION */}
      <section className="border-t border-white/10" id="support-location" data-testid="support-location">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 py-20 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <Reveal>
            <p className="kicker-sq text-[10px] uppercase tracking-[0.35em] text-zinc-500 mb-5">
              Service Location
            </p>
            <h2 className="font-display text-2xl md:text-4xl font-black tracking-tighter text-white leading-[1.1]">
              Latios service & support center
            </h2>
            <p className="mt-6 text-zinc-400 leading-relaxed">
              208, Palak Prime, Opp. Hotel Double Tree by Hilton, ISCON–Ambali Road,
              Ahmedabad 380058, Gujarat, India
            </p>
            <p className="mt-3 text-sm text-zinc-500">Mon–Sat · 10:00 AM – 6:30 PM IST</p>
          </Reveal>
          <Reveal delay={0.1}>
            <a
              href="https://maps.google.com/?q=Palak+Prime+ISCON+Ambali+Road+Ahmedabad+380058"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="support-map-link"
              className="group flex items-center justify-between border border-white/10 bg-[#0A0A0A] p-8 hover:border-[#1a56e8]/60 transition-colors duration-300"
            >
              <div className="flex items-center gap-4">
                <MapPin className="w-6 h-6 text-[#6f93f2]" />
                <span className="text-sm text-zinc-300">Open in Google Maps</span>
              </div>
              <ArrowUpRight className="w-5 h-5 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
            </a>
          </Reveal>
        </div>
      </section>

      {/* CONTACT SUPPORT */}
      <section className="border-t border-white/10" data-testid="support-contact">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 py-20 md:py-24">
          <Reveal>
            <h2 className="font-display text-2xl md:text-4xl font-black tracking-tighter text-white mb-3">
              Contact support
            </h2>
            <p className="text-zinc-500 text-sm mb-12">
              Thank you for choosing Latios — we're happy to help.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: FileText, title: "Web Ticket", desc: "Ask a question via our enquiry form", action: goContact, testid: "contact-ticket" },
              { icon: Phone, title: "Hotline", desc: "+91 82381 40787", href: "tel:+918238140787", testid: "contact-hotline" },
              { icon: Mail, title: "Email", desc: "support@latios.in", href: "mailto:support@latios.in", testid: "contact-email" },
              { icon: MessageCircle, title: "Ask LATI", desc: "Instant answers from our AI assistant", action: () => window.dispatchEvent(new Event("lati:open")), testid: "contact-lati" },
            ].map((c, i) => {
              const inner = (
                <>
                  <c.icon className="w-6 h-6 text-[#6f93f2]" />
                  <span className="mt-5 font-display text-lg font-bold tracking-tight text-white">{c.title}</span>
                  <span className="mt-2 text-sm text-zinc-500 leading-relaxed">{c.desc}</span>
                </>
              );
              const cls =
                "flex flex-col border border-white/10 bg-[#0A0A0A] p-7 h-full text-left hover:border-[#1a56e8]/60 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#1a56e8]/50";
              return (
                <Reveal key={c.title} delay={i * 0.05}>
                  {c.href ? (
                    <a href={c.href} data-testid={c.testid} className={cls}>{inner}</a>
                  ) : (
                    <button onClick={c.action} data-testid={c.testid} className={cls}>{inner}</button>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </motion.main>
  );
}

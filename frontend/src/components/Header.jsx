import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, ArrowUpRight, ArrowRight, Mail, Phone } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ALL_MODELS } from "@/data/models";
import { CATEGORIES, SUBCATS } from "@/data/products";
import { APPLICATIONS } from "@/data/applications";

const EASE = [0.16, 1, 0.3, 1];

const NAV = [
  { label: "Products", mega: true },
  { label: "Applications", section: "applications-section" },
  { label: "About Latios", to: "/about" },
  { label: "Design & Manufacturing", to: "/about", anchor: "design-manufacturing" },
  { label: "Support", to: "/support" },
  { label: "News", to: "/news" },
  { label: "Contact Us", section: "contact" },
];

const navId = (label) => `nav-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

const POPULAR = ["Archer", "RTX 5080", "2TB ECC", "Speakerphone", "PTZ", "Interactive Panel"];

const POPULAR_MODELS = ["archer-ltg540z", "promax-t4-plus", "sp50-speakerphone", "pro-ifp"]
  .map((s) => ALL_MODELS.find((m) => m.slug === s))
  .filter(Boolean);

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuQuery, setMenuQuery] = useState("");
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 140 && y > lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const results = query.trim()
    ? ALL_MODELS.filter((m) =>
        `${m.name} ${m.tag}`.toLowerCase().includes(query.trim().toLowerCase())
      ).slice(0, 8)
    : [];

  const menuResults = menuQuery.trim()
    ? ALL_MODELS.filter((m) =>
        `${m.name} ${m.tag}`.toLowerCase().includes(menuQuery.trim().toLowerCase())
      ).slice(0, 6)
    : [];

  const goSection = (id) => {
    setMenuOpen(false);
    setSearchOpen(false);
    navigate("/");
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 450);
  };

  const goPage = (to, anchor) => {
    setMenuOpen(false);
    setSearchOpen(false);
    navigate(to);
    if (anchor) {
      setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" }), 1000);
    }
  };

  const openModel = (m) => {
    setMenuOpen(false);
    setMenuQuery("");
    navigate(`/${m.category}/${m.slug}`);
  };

  return (
    <>
      <header
        data-testid="site-header"
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ${
          hidden && !menuOpen && !searchOpen ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="utility-bar hidden md:flex items-center justify-between h-9 px-6 md:px-12 text-[11px] text-zinc-400">
          <div className="flex items-center gap-6">
            <a
              href="mailto:sales@latios.in"
              data-testid="topbar-email"
              className="flex items-center gap-2 hover:text-white transition-colors duration-300"
            >
              <Mail className="w-3 h-3" /> sales@latios.in
            </a>
            <a
              href="tel:+918238140787"
              data-testid="topbar-phone"
              className="flex items-center gap-2 hover:text-white transition-colors duration-300"
            >
              <Phone className="w-3 h-3" /> +91 82381 40787
            </a>
          </div>
          <div className="flex items-center gap-5">
            <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">
              Proudly Indian · Boldly Innovative
            </span>
            <ThemeToggle />
          </div>
        </div>

        <div className="backdrop-blur-xl bg-black/70 border-b border-white/10">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-16 md:h-[72px] flex items-center justify-between">
            <Link
              to="/"
              data-testid="header-logo"
              className="flex items-center"
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(false);
              }}
            >
              <span className="logo-chip bg-white rounded-md px-3 py-1.5 inline-flex items-center">
                <img src="/images/latios-wordmark.png" alt="Latios" className="h-6 md:h-7 w-auto" />
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-7" data-testid="desktop-nav">
              {NAV.map((item) => {
                const testid = navId(item.label);
                if (item.mega) {
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        setMenuOpen(!menuOpen);
                        setSearchOpen(false);
                      }}
                      data-testid={testid}
                      className={`nav-link text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                        menuOpen ? "text-white nav-link-active" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                }
                if (item.section) {
                  return (
                    <button
                      key={item.label}
                      onClick={() => goSection(item.section)}
                      data-testid={testid}
                      className="nav-link text-[11px] uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors duration-300"
                    >
                      {item.label}
                    </button>
                  );
                }
                return (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    data-testid={testid}
                    onClick={
                      item.anchor
                        ? (e) => {
                            e.preventDefault();
                            goPage(item.to, item.anchor);
                          }
                        : undefined
                    }
                    className={({ isActive }) =>
                      `nav-link text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                        isActive && !item.anchor ? "text-white nav-link-active" : "text-zinc-400 hover:text-white"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>

            <div className="flex items-center gap-2.5">
              <div className="md:hidden">
                <ThemeToggle />
              </div>
              <button
                onClick={() => {
                  setSearchOpen(!searchOpen);
                  setMenuOpen(false);
                  setQuery("");
                }}
                data-testid="search-toggle"
                aria-label="Search products"
                className="w-11 h-11 border border-white/20 flex items-center justify-center text-white hover:border-white/60 transition-colors duration-300 focus:ring-2 focus:ring-white/50 focus:outline-none"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setMenuOpen(!menuOpen);
                  setSearchOpen(false);
                }}
                data-testid="menu-toggle"
                aria-label="Open menu"
                className="w-11 h-11 btn-blue flex items-center justify-center transition-colors duration-300 focus:ring-2 focus:ring-[#1a56e8]/50 focus:outline-none"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MEGA MENU — JWIPC style: search + product tree + featured applications */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overlay-panel fixed inset-0 z-40 backdrop-blur-xl pt-24 md:pt-32 overflow-y-auto"
            data-lenis-prevent
            data-testid="mega-menu"
          >
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 pb-16">
              {/* search row */}
              <div className="relative max-w-xl mb-12" data-testid="mega-search">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  value={menuQuery}
                  onChange={(e) => setMenuQuery(e.target.value)}
                  placeholder="Search for product name"
                  data-testid="mega-search-input"
                  className="w-full bg-transparent border-b border-white/20 focus:border-[#1a56e8] transition-colors duration-300 pl-8 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none"
                />
                {menuResults.length > 0 && (
                  <div
                    className="absolute top-full left-0 right-0 mt-2 border border-white/10 bg-[#0A0A0A] z-10"
                    data-testid="mega-search-results"
                  >
                    {menuResults.map((m) => (
                      <button
                        key={m.slug}
                        onClick={() => openModel(m)}
                        data-testid={`mega-search-result-${m.slug}`}
                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-white/5 text-left transition-colors duration-200"
                      >
                        <span className="w-12 h-9 rounded bg-[#f2f2f0] flex items-center justify-center shrink-0 overflow-hidden">
                          <img src={m.image} alt="" loading="lazy" className="max-h-[80%] w-auto object-contain" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm text-white truncate">{m.name}</span>
                          <span className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500">{m.tag}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* product tree + featured applications */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-10">
                {CATEGORIES.map((cat, i) => (
                  <motion.div
                    key={cat.slug}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 + i * 0.05, duration: 0.5, ease: EASE }}
                    data-testid={`mega-col-${cat.slug}`}
                  >
                    <button
                      onClick={() => goPage(`/${cat.slug}`)}
                      data-testid={`mega-cat-${cat.slug}`}
                      className="group flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white hover:text-[#6f93f2] transition-colors duration-300"
                    >
                      {cat.name}
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-[#6f93f2] group-hover:translate-x-1 transition-all duration-300" />
                    </button>
                    <div className="mt-5 flex flex-col gap-3">
                      {(SUBCATS[cat.slug] || []).map((s, si) => (
                        <button
                          key={s}
                          onClick={() => goPage(`/${cat.slug}`)}
                          data-testid={`mega-sub-${cat.slug}-${si}`}
                          className="text-left text-sm text-zinc-400 hover:text-white transition-colors duration-300"
                        >
                          {s}
                        </button>
                      ))}
                      <button
                        onClick={() => goPage(`/${cat.slug}`)}
                        data-testid={`mega-viewall-${cat.slug}`}
                        className="text-left text-[10px] uppercase tracking-[0.2em] text-[#6f93f2] hover:text-white transition-colors duration-300 mt-1"
                      >
                        View all →
                      </button>
                    </div>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
                  className="col-span-2 md:col-span-4 lg:col-span-2 lg:border-l lg:border-white/10 lg:pl-10"
                  data-testid="mega-featured-apps"
                >
                  <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-4">
                    Featured Applications
                  </p>
                  {APPLICATIONS.map((a) => (
                    <button
                      key={a.slug}
                      onClick={() => goPage(`/applications/${a.slug}`)}
                      data-testid={`mega-app-${a.slug}`}
                      className="group w-full text-left py-4 border-b border-white/10 last:border-b-0"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold text-white uppercase tracking-[0.2em]">
                          {a.title}
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-[#6f93f2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                      </div>
                      <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed">{a.blurb}</p>
                    </button>
                  ))}
                </motion.div>
              </div>

              {/* bottom quick links */}
              <div
                className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center gap-2.5"
                data-testid="mega-quick-links"
              >
                {[
                  ["Compare Models", "/compare"],
                  ["Support Center", "/support"],
                  ["About Latios", "/about"],
                  ["News", "/news"],
                ].map(([label, to]) => (
                  <button
                    key={to}
                    onClick={() => goPage(to)}
                    data-testid={`mega-quick-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="text-[10px] uppercase tracking-[0.2em] border border-white/15 rounded-full px-4 py-2 text-zinc-400 hover:border-[#1a56e8] hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#1a56e8]/50"
                  >
                    {label}
                  </button>
                ))}
                <button
                  onClick={() => goSection("contact")}
                  data-testid="mega-quick-contact"
                  className="text-[10px] uppercase tracking-[0.2em] border border-white/15 rounded-full px-4 py-2 text-zinc-400 hover:border-[#1a56e8] hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#1a56e8]/50"
                >
                  Contact Us
                </button>
                <div className="ml-auto flex items-center gap-6">
                  <a href="mailto:sales@latios.in" className="hidden sm:block text-sm text-white hover:text-zinc-300 transition-colors duration-300">
                    sales@latios.in
                  </a>
                  <a href="tel:+918238140787" className="hidden sm:block text-sm text-white hover:text-zinc-300 transition-colors duration-300">
                    +91 82381 40787
                  </a>
                  <div className="hidden md:block">
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overlay-panel fixed inset-0 z-40 backdrop-blur-xl pt-28 md:pt-40 overflow-y-auto"
            data-lenis-prevent
            data-testid="search-overlay"
          >
            <div className="max-w-[900px] mx-auto px-6 md:px-12 pb-16">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search 28 machines…"
                data-testid="search-input"
                className="w-full bg-transparent border-b border-white/20 focus:border-[#1a56e8] transition-colors duration-300 py-5 font-display text-2xl md:text-4xl font-light tracking-tight text-white placeholder:text-zinc-600 focus:outline-none"
              />
              <div className="mt-8" data-testid="search-results">
                {results.map((m) => (
                  <button
                    key={m.slug}
                    onClick={() => {
                      setSearchOpen(false);
                      navigate(`/${m.category}/${m.slug}`);
                    }}
                    data-testid={`search-result-${m.slug}`}
                    className="w-full flex items-center justify-between gap-6 py-4 border-b border-white/10 text-left group focus:outline-none focus:ring-2 focus:ring-[#1a56e8]/50"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="w-16 h-11 rounded bg-[#f2f2f0] flex items-center justify-center shrink-0 overflow-hidden">
                        <img src={m.image} alt="" loading="lazy" className="max-h-[80%] w-auto object-contain" />
                      </span>
                    <div>
                      <div className="font-display text-lg font-bold tracking-tight text-white group-hover:text-[#6f93f2] transition-colors duration-300">
                        {m.name}
                      </div>
                      <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 mt-1">
                        {m.tag}
                      </div>
                    </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-[#6f93f2] shrink-0 transition-colors duration-300" />
                  </button>
                ))}
                {query.trim() && results.length === 0 && (
                  <p className="py-10 text-zinc-500 text-sm" data-testid="search-empty">
                    No machines match "{query}".
                  </p>
                )}
                {!query.trim() && (
                  <div className="pt-8">
                    <div className="flex flex-wrap gap-2" data-testid="popular-searches">
                      {POPULAR.map((p) => (
                        <button
                          key={p}
                          onClick={() => setQuery(p)}
                          data-testid={`popular-${p.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                          className="text-xs text-zinc-400 border border-white/15 rounded-full px-4 py-2 hover:border-[#1a56e8] hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#1a56e8]/50"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    <p className="mt-10 mb-5 text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                      Popular machines
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="popular-machines">
                      {POPULAR_MODELS.map((m) => (
                        <button
                          key={m.slug}
                          onClick={() => {
                            setSearchOpen(false);
                            navigate(`/${m.category}/${m.slug}`);
                          }}
                          data-testid={`popular-model-${m.slug}`}
                          className="group border border-white/10 bg-[#0A0A0A] hover:border-[#1a56e8]/60 transition-colors duration-300 p-3 text-left focus:outline-none focus:ring-2 focus:ring-[#1a56e8]/50"
                        >
                          <div className="rounded-md bg-[#f2f2f0] aspect-[4/3] flex items-center justify-center overflow-hidden mb-3">
                            <img
                              src={m.image}
                              alt={m.name}
                              loading="lazy"
                              className="max-h-[78%] w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <div className="text-sm font-semibold text-white leading-snug">{m.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

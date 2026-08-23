import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, ArrowUpRight, ArrowRight, Mail, Phone } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ALL_MODELS } from "@/data/models";

const LINKS = [
  { to: "/laptops", label: "Laptops" },
  { to: "/towers", label: "Towers" },
  { to: "/audio", label: "Audio" },
  { to: "/video", label: "Video" },
  { to: "/compare", label: "Compare" },
];

const EASE = [0.16, 1, 0.3, 1];

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
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

  const goContact = () => {
    setMenuOpen(false);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        data-testid="site-header"
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ${
          hidden && !menuOpen && !searchOpen ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="hidden md:flex items-center justify-between bg-[#0b1226] h-9 px-6 md:px-12 text-[11px] text-zinc-400">
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
                <img src="/images/latios-logo.png" alt="Latios" className="h-6 md:h-7 w-auto" />
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-9" data-testid="desktop-nav">
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  data-testid={`nav-${l.label.toLowerCase()}`}
                  className={({ isActive }) =>
                    `nav-link text-xs uppercase tracking-[0.25em] transition-colors duration-300 ${
                      isActive ? "text-white nav-link-active" : "text-zinc-400 hover:text-white"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
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

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 z-40 bg-[#050505]/[0.98] backdrop-blur-xl pt-28 md:pt-40 overflow-y-auto"
            data-testid="mega-menu"
          >
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-14">
              <nav className="flex flex-col" data-testid="mega-nav">
                {LINKS.map((l, i) => (
                  <motion.div
                    key={l.to}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.06, duration: 0.5, ease: EASE }}
                  >
                    <Link
                      to={l.to}
                      onClick={() => setMenuOpen(false)}
                      data-testid={`mega-link-${l.label.toLowerCase()}`}
                      className="group flex items-center justify-between py-5 border-b border-white/10 font-display text-3xl md:text-5xl font-black tracking-tighter text-white hover:text-[#6f93f2] transition-colors duration-300"
                    >
                      {l.label}
                      <ArrowRight className="w-6 h-6 md:w-8 md:h-8 text-zinc-600 group-hover:text-[#6f93f2] group-hover:translate-x-2 transition-all duration-300" />
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6, ease: EASE }}
                className="lg:pt-2"
              >
                <p className="kicker-sq text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-6">
                  Get in touch
                </p>
                <p className="text-zinc-400 leading-relaxed max-w-sm">
                  Volume pricing, custom imaging and white-glove deployment for teams of
                  ten to ten thousand.
                </p>
                <button
                  onClick={goContact}
                  data-testid="mega-enquire-button"
                  className="group mt-7 inline-flex items-center gap-3 btn-blue px-8 py-4 text-xs uppercase tracking-[0.25em] font-semibold transition-colors duration-300 focus:ring-2 focus:ring-[#1a56e8]/50 focus:outline-none"
                >
                  Enquire now
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
                <div className="mt-10 space-y-2.5 text-sm">
                  <a href="mailto:sales@latios.in" className="block text-white hover:text-zinc-300 transition-colors duration-300">
                    sales@latios.in
                  </a>
                  <a href="tel:+918238140787" className="block text-white hover:text-zinc-300 transition-colors duration-300">
                    +91 82381 40787
                  </a>
                  <span className="block text-zinc-500">Ahmedabad, Gujarat, India</span>
                </div>
                <div className="mt-10 hidden md:block">
                  <ThemeToggle />
                </div>
              </motion.div>
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
            className="fixed inset-0 z-40 bg-[#050505]/[0.98] backdrop-blur-xl pt-28 md:pt-40 overflow-y-auto"
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
                    <div>
                      <div className="font-display text-lg font-bold tracking-tight text-white group-hover:text-[#6f93f2] transition-colors duration-300">
                        {m.name}
                      </div>
                      <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 mt-1">
                        {m.tag}
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
                  <p className="py-10 text-zinc-600 text-sm">
                    Try "Archer", "PTZ", "2TB", "speakerphone"…
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};


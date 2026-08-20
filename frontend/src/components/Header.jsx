import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

const LINKS = [
  { to: "/laptops", label: "Laptops" },
  { to: "/towers", label: "Towers" },
  { to: "/audio", label: "Audio" },
  { to: "/video", label: "Video" },
];

const goContact = () =>
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

export const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header
      data-testid="site-header"
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/70 border-b border-white/10"
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-16 md:h-20 flex items-center justify-between">
        <Link
          to="/"
          data-testid="header-logo"
          className="font-display font-black tracking-tighter text-xl md:text-2xl text-white"
        >
          VANTA<span className="text-zinc-500">/</span>SYSTEMS
        </Link>

        <nav className="hidden md:flex items-center gap-10" data-testid="desktop-nav">
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
          <button
            onClick={goContact}
            data-testid="nav-enquire-button"
            className="group flex items-center gap-2 text-xs uppercase tracking-[0.25em] border border-white/20 rounded-full px-5 py-2.5 text-white hover:bg-white hover:text-black transition-colors duration-300 focus:ring-2 focus:ring-white/50 focus:outline-none"
          >
            Enquire
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </nav>

        <button
          className="md:hidden text-white p-2 focus:ring-2 focus:ring-white/50 focus:outline-none"
          onClick={() => setOpen(!open)}
          data-testid="mobile-menu-toggle"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden border-t border-white/10 bg-black/90"
            data-testid="mobile-nav"
          >
            <div className="flex flex-col px-6 py-6 gap-5">
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  data-testid={`mobile-nav-${l.label.toLowerCase()}`}
                  className="font-display text-2xl font-light tracking-tight text-zinc-300 hover:text-white transition-colors duration-300"
                >
                  {l.label}
                </NavLink>
              ))}
              <button
                onClick={() => {
                  setOpen(false);
                  goContact();
                }}
                data-testid="mobile-nav-enquire"
                className="text-left text-xs uppercase tracking-[0.25em] text-zinc-500 pt-2"
              >
                Enquire →
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, ArrowUpRight, ArrowRight, Cpu, Sparkles, Mail, Phone } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Wordmark } from "@/components/Wordmark";
import { ALL_MODELS, VENDOR_LABELS, getProcessorFamily } from "@/data/models";
import { MEGA_CATEGORIES, TAXONOMY } from "@/data/products";
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

/**
 * Flatten one category's tree for the mega-menu column.
 *
 * Grouping levels (Commercial / Enterprise / Cameras) are emitted as labels and
 * their leaves follow, so a three-level branch reads as a heading with items
 * under it rather than losing a level. Leaves link to the category page with
 * ?b=<key>, which pre-selects that facet — the sub-levels are filters, not
 * separate routes, so no existing model URL changes.
 */
const megaNodes = (slug) => {
  const top = TAXONOMY.find((t) => t.slug === slug);
  const out = [];
  (top?.children || []).forEach((c) => {
    if (c.children) {
      out.push({ ...c, group: true });
      c.children.forEach((g) => out.push(g));
    } else {
      out.push(c);
    }
  });
  return out;
};

/**
 * The two shortcuts the mega menu leads with: what has an NPU in it, and what
 * silicon is inside.
 *
 * Both are counted from the catalogue rather than written down, so a number
 * here can never disagree with the listing it opens -- the link carries the
 * same facet the panel would set, so the count IS what the page will show.
 *
 * Scoped per category on purpose. Facets live on a category page, so a link has
 * to name one; and it is honest about the split, rather than quoting a total of
 * seven AI machines and then landing on a page showing six.
 */
const countIn = (slug, pred) =>
  ALL_MODELS.filter((m) => m.category === slug && pred(m)).length;

const AI_LINKS = [
  { slug: "desktops", label: "Desktops", n: countIn("desktops", (m) => m.aiReady) },
  { slug: "workstation", label: "Workstations", n: countIn("workstation", (m) => m.aiReady) },
  { slug: "laptops", label: "Laptops", n: countIn("laptops", (m) => m.aiReady) },
].filter((x) => x.n > 0);

const AI_TOTAL = AI_LINKS.reduce((n, x) => n + x.n, 0);

// Processor families, counted across the two desktop-class categories: that is
// where the choice exists at all -- every Latios laptop is Intel.
//
// Each vendor links to whichever of the two actually holds it, rather than to a
// fixed listing. Xeon lives only in PROMAX, so a fixed /desktops link would send
// that chip to a page with nothing on it.
const CPU_LINKS = ["amd", "intel", "xeon"]
  .map((id) => {
    const pred = (m) => getProcessorFamily(m) === id;
    const desktops = countIn("desktops", pred);
    const workstation = countIn("workstation", pred);
    return {
      id,
      label: VENDOR_LABELS[id],
      n: desktops + workstation,
      slug: workstation > desktops ? "workstation" : "desktops",
    };
  })
  .filter((x) => x.n > 0);

const BY_SLUG = new Map(ALL_MODELS.map((m) => [m.slug, m]));

/**
 * The machines behind one node of the tree.
 *
 * A leaf carries its own slugs; a grouping level (Commercial, Cameras) carries
 * none and has to gather its children's, so that hovering "Commercial" previews
 * the whole of it rather than nothing.
 */
const modelsFor = (node) => {
  const slugs = node.models
    ? node.models
    : (node.children || []).flatMap((c) => c.models || []);
  return slugs.map((x) => BY_SLUG.get(x)).filter(Boolean);
};

const navId = (label) => `nav-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

const POPULAR = ["Archer", "RTX 5080", "2TB ECC", "Speakerphone", "PTZ", "Interactive Panel"];

const POPULAR_MODELS = ["archer-ltg540z", "promax-t4-plus", "sp50-speakerphone", "pro-ifp"]
  .map((s) => ALL_MODELS.find((m) => m.slug === s))
  .filter(Boolean);

/**
 * Product preview, in the right-hand rail.
 *
 * It lives beside the tree rather than under it. Below the tree it measured out
 * at y=1291 in a 720px viewport -- so hovering a branch changed something the
 * reader could not see, which is worse than not reacting at all. In the rail it
 * is level with the thing being hovered.
 *
 * It takes the Featured Applications slot while a branch is hovered, because
 * those are the least urgent thing in the rail and swapping keeps the panel the
 * same height. The AI and processor blocks above it never move.
 *
 * A row per machine rather than a grid of cards: the rail is two columns wide,
 * and this is the shape the search results in this same menu already use.
 */
const MegaPreview = ({ preview, onPick, onSeeAll }) => {
  const models = modelsFor(preview.node);
  const shown = models.slice(0, 4);

  return (
    <div data-testid="mega-preview" aria-live="polite">
      <div className="flex items-baseline justify-between gap-3 mb-4">
        <p
          className="text-[10px] uppercase tracking-[0.3em] text-zinc-500"
          data-testid="mega-preview-heading"
        >
          {preview.node.name}
          {models.length > 0 && <span className="ml-2 text-zinc-600">{models.length}</span>}
        </p>
        {!preview.node.group && (
          <button
            onClick={() => onSeeAll(`/${preview.cat.slug}?b=${preview.node.key}`)}
            data-testid="mega-preview-all"
            className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-[#6f93f2] hover:text-white transition-colors duration-300"
          >
            See all →
          </button>
        )}
      </div>

      {shown.length === 0 ? (
        <p className="text-sm text-zinc-500" data-testid="mega-preview-empty">
          Nothing shipping in this line yet — talk to us about what you need.
        </p>
      ) : (
        <div className="flex flex-col">
          {shown.map((m) => (
            <button
              key={m.slug}
              onClick={() => onPick(m)}
              data-testid={`mega-preview-${m.slug}`}
              className="group flex items-center gap-4 py-3 border-b border-white/10 last:border-b-0 text-left focus:outline-none focus:ring-2 focus:ring-[#1a56e8]/50 rounded"
            >
              <span className="w-16 h-11 shrink-0 rounded bg-[#f2f2f0] flex items-center justify-center overflow-hidden">
                <img
                  src={m.image}
                  alt=""
                  loading="lazy"
                  className="max-h-[82%] w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-2">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 truncate">
                    {m.tag}
                  </span>
                  {m.aiReady && (
                    <span className="shrink-0 text-[8px] uppercase tracking-[0.18em] text-[#6f93f2] border border-[#6f93f2]/40 rounded-full px-1.5">
                      AI
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block text-sm text-white group-hover:text-[#6f93f2] transition-colors duration-300 truncate">
                  {m.name}
                </span>
              </span>
            </button>
          ))}
          {models.length > shown.length && (
            <p className="pt-3 text-[10px] uppercase tracking-[0.2em] text-zinc-600">
              +{models.length - shown.length} more
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuQuery, setMenuQuery] = useState("");
  // What the preview strip is showing. Sticky rather than cleared on mouseout:
  // the pointer has to cross empty space to reach the preview, and blanking it
  // on the way there would make the products impossible to click.
  const [preview, setPreview] = useState(null);
  useEffect(() => {
    if (!menuOpen) setPreview(null);
  }, [menuOpen]);
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
          {/* gap-5 is a floor, not decoration: with the logo at h-11 the mark and the
              nav sit flush at exactly 1024px, where justify-between has no slack
              left to give. */}
          <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-16 md:h-[72px] flex items-center justify-between gap-5">
            <Link
              to="/"
              data-testid="header-logo"
              className="flex items-center"
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(false);
              }}
            >
              <Wordmark className="h-9 md:h-11 w-auto" testid="header-logo" />
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
              {/* The column count is (top-level categories) + 2 for the rail,
                  which spans lg:col-span-2 below. Get it wrong and the rail
                  silently wraps under the columns instead of sitting beside
                  them -- which is what happened when Towers split into Desktops
                  and Workstation and took the count from 5 to 6. */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-x-8 gap-y-10">
                {MEGA_CATEGORIES.map((cat, i) => (
                  <motion.div
                    key={cat.slug}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 + i * 0.05, duration: 0.5, ease: EASE }}
                    data-testid={`mega-col-${cat.slug}`}
                  >
                    {cat.soon ? (
                      // A whole level that exists in the taxonomy but has
                      // nothing shipping in it. Shown so the range reads
                      // complete, never linked — there is no page behind it.
                      <span
                        data-testid={`mega-cat-${cat.slug}`}
                        className="block lg:min-h-[2.6em] text-xs uppercase tracking-[0.25em] text-zinc-600 cursor-default"
                      >
                        {cat.name}
                        {/* inline, not a flex sibling: as a sibling the chip was
                            pushed to the far right of the column whenever the
                            name wrapped to two lines. */}
                        <span className="ml-2 inline-block align-middle text-[9px] tracking-[0.18em] border border-zinc-800 rounded px-1.5 py-0.5">
                          Soon
                        </span>
                      </span>
                    ) : (
                      <button
                        onClick={() => goPage(`/${cat.slug}`)}
                        data-testid={`mega-cat-${cat.slug}`}
                        className="group flex items-start gap-2 lg:min-h-[2.6em] text-left text-xs uppercase tracking-[0.25em] text-white hover:text-[#6f93f2] transition-colors duration-300"
                      >
                        {cat.name}
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-[#6f93f2] group-hover:translate-x-1 transition-all duration-300" />
                      </button>
                    )}
                    <div className="mt-5 flex flex-col gap-3">
                      {cat.soon && (
                        <p className="text-sm text-zinc-600 leading-relaxed">
                          Rooms built from the AV and display ranges. Talk to us about a
                          fit-out while the packaged range is in development.
                        </p>
                      )}
                      {megaNodes(cat.slug).map((n) =>
                        n.group ? (
                          // A grouping level (Commercial / Enterprise / Cameras)
                          // — a label, not a destination.
                          <span
                            key={n.key}
                            onMouseEnter={() => setPreview({ cat, node: n })}
                            data-testid={`mega-group-${cat.slug}-${n.key}`}
                            className="mt-2 first:mt-0 text-[10px] uppercase tracking-[0.2em] text-zinc-600 cursor-default"
                          >
                            {n.name}
                          </span>
                        ) : n.soon ? (
                          // Defined in the taxonomy, nothing shipping in it
                          // yet -- but now reachable: the listing answers with a
                          // coming-soon panel for the range rather than an empty
                          // grid, so this is no longer a dead end.
                          <button
                            key={n.key}
                            onClick={() => goPage(`/${cat.slug}?b=${n.key}`)}
                            data-testid={`mega-soon-${cat.slug}-${n.key}`}
                            className="flex items-center gap-2 text-sm text-zinc-500 text-left hover:text-zinc-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#1a56e8]/50 rounded"
                          >
                            {n.name}
                            <span className="text-[9px] uppercase tracking-[0.18em] text-zinc-600 border border-zinc-800 rounded px-1.5 py-0.5">
                              Soon
                            </span>
                          </button>
                        ) : (
                          <button
                            key={n.key}
                            onClick={() => goPage(`/${cat.slug}?b=${n.key}`)}
                            onMouseEnter={() => setPreview({ cat, node: n })}
                            onFocus={() => setPreview({ cat, node: n })}
                            data-testid={`mega-sub-${cat.slug}-${n.key}`}
                            aria-describedby="mega-preview"
                            className={`text-left text-sm transition-colors duration-300 ${
                              preview?.node?.key === n.key && preview?.cat?.slug === cat.slug
                                ? "text-white"
                                : "text-zinc-400 hover:text-white"
                            }`}
                          >
                            {n.name}
                          </button>
                        )
                      )}
                      {!cat.soon && (
                        <button
                          onClick={() => goPage(`/${cat.slug}`)}
                          data-testid={`mega-viewall-${cat.slug}`}
                          className="text-left text-[10px] uppercase tracking-[0.2em] text-[#6f93f2] hover:text-white transition-colors duration-300 mt-1"
                        >
                          View all →
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
                  className="col-span-2 md:col-span-4 lg:col-span-2 lg:border-l lg:border-white/10 lg:pl-10"
                  data-testid="mega-rail"
                >
                  {/* AI first, because it is the thing a buyer is scanning for
                      and it is otherwise buried as one checkbox on one page. */}
                  {AI_TOTAL > 0 && (
                    <div
                      className="mb-8 rounded-lg border border-[#6f93f2]/30 bg-[#1a56e8]/[0.07] p-5"
                      data-testid="mega-ai"
                    >
                      <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#6f93f2]">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI ready
                      </p>
                      <p className="mt-2.5 text-sm text-zinc-300 leading-relaxed">
                        <span className="text-white font-semibold">{AI_TOTAL} machines</span> with a
                        dedicated neural processing unit, ready for on-device AI.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {AI_LINKS.map((a) => (
                          <button
                            key={a.slug}
                            onClick={() => goPage(`/${a.slug}?ai=yes`)}
                            data-testid={`mega-ai-${a.slug}`}
                            className="group inline-flex items-center gap-2 rounded-full bg-[#1a56e8] px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-white hover:bg-[#1747c0] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#1a56e8]/50"
                          >
                            {a.label}
                            <span className="opacity-70">{a.n}</span>
                            <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Processors. Word marks rather than the AMD and Intel
                      logos: reproducing a partner's artwork is governed by
                      their brand guidelines and needs files from their partner
                      kit, and the same reasoning already applies to the
                      certification marks in the footer. */}
                  {CPU_LINKS.length > 0 && (
                    <div className="mb-8" data-testid="mega-cpu">
                      <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-4">
                        <Cpu className="w-3.5 h-3.5" />
                        Shop by processor
                      </p>
                      <div className="flex flex-col">
                        {CPU_LINKS.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => goPage(`/${c.slug}?cpu=${c.id}`)}
                            data-testid={`mega-cpu-${c.id}`}
                            className="group flex items-center justify-between gap-3 border-b border-white/10 py-3 text-left transition-colors duration-300 hover:border-white/25 focus:outline-none focus:ring-2 focus:ring-[#1a56e8]/50 rounded"
                          >
                            <span className="font-display text-base font-black tracking-tight text-white group-hover:text-[#6f93f2] transition-colors duration-300">
                              {c.label}
                            </span>
                            <span className="flex items-center gap-2 text-xs text-zinc-500 tabular-nums">
                              {c.n}
                              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-[#6f93f2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {preview ? (
                    <MegaPreview preview={preview} onPick={openModel} onSeeAll={goPage} />
                  ) : (
                    <>
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
                    </>
                  )}
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

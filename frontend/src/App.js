import { useEffect, useRef } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ReactLenis, useLenis } from "lenis/react";
import { Toaster } from "@/components/ui/sonner";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ChatWidget } from "@/components/ChatWidget";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Home from "@/pages/Home";
import ProductPage from "@/pages/ProductPage";
import ModelPage from "@/pages/ModelPage";
import NewsPage from "@/pages/NewsPage";
import NewsIndexPage from "@/pages/NewsIndexPage";
import ApplicationPage from "@/pages/ApplicationPage";
import ComparePage from "@/pages/ComparePage";
import AdminPage from "@/pages/AdminPage";
import AboutPage from "@/pages/AboutPage";
import SupportPage from "@/pages/SupportPage";
import ProcessorPage from "@/pages/ProcessorPage";

/**
 * Top of the page on a new navigation, back where you were on Back.
 *
 * This used to scroll to 0 on every pathname change, which threw the reader to
 * the top of the site when they pressed Back out of a product page — so coming
 * back from a tower meant scrolling the whole listing again to find their place.
 *
 * `useNavigationType` separates the two cases: PUSH/REPLACE is a new
 * destination and belongs at the top, POP is Back or Forward and belongs where
 * that entry was left. Offsets are keyed by `location.key`, which react-router
 * gives each history entry, so two visits to the same URL keep their own
 * positions.
 *
 * Positions are read from Lenis, not `window.scrollY`: Lenis animates the
 * scroll position itself on this site, and the two disagree mid-animation.
 */
const ScrollReset = () => {
  const location = useLocation();
  const navType = useNavigationType();
  const lenis = useLenis();
  const offsets = useRef(new Map());

  // The browser restores scroll on POP by itself when this is "auto", and its
  // idea of the position is the native one — which on a Lenis site is wherever
  // the smooth animation happened to be. Two restores fighting produces a jump.
  useEffect(() => {
    if (!("scrollRestoration" in window.history)) return undefined;
    const prev = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => { window.history.scrollRestoration = prev; };
  }, []);

  // Record where each entry was left, before the next render moves us.
  // `window.scrollY` rather than `lenis.scroll`: Lenis's value is the animated
  // one and lags mid-flick, and it is stale entirely if its rAF loop is not
  // running. The native position is always what the reader is actually looking
  // at, and Lenis scrolls the window, so the two agree once it settles.
  useEffect(() => {
    const key = location.key;
    return () => { offsets.current.set(key, window.scrollY); };
  }, [location.key]);

  useEffect(() => {
    const saved = offsets.current.get(location.key);
    const target = navType === "POP" && typeof saved === "number" ? saved : 0;

    // Both, deliberately. Lenis owns the position when it is running, so it has
    // to be told or it animates straight back; the native call is what actually
    // moves the page if Lenis's loop is not ticking. `force` gets past a stopped
    // or locked instance.
    const go = () => {
      window.scrollTo(0, target);
      if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
    };
    go();

    // The incoming page's sections mount and grow (AnimatePresence, lazy media),
    // so a restore on this tick lands short. Two frames is enough for layout to
    // settle without the reader seeing the top of the page first.
    if (target === 0) return undefined;
    const raf = requestAnimationFrame(() => requestAnimationFrame(go));
    return () => cancelAnimationFrame(raf);
  }, [location.key, navType, lenis]);

  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/news" element={<NewsIndexPage />} />
        <Route path="/news/:slug" element={<NewsPage />} />
        <Route path="/applications/:slug" element={<ApplicationPage />} />
        <Route path="/processors/:vendor" element={<ProcessorPage />} />
        <Route path="/:category/:modelSlug" element={<ModelPage />} />
        <Route path="/:category" element={<ProductPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <div className="App min-h-screen">
      <BrowserRouter>
        <ReactLenis root options={{ lerp: 0.09, smoothWheel: true }}>
          <ScrollReset />
          <div className="noise-overlay" aria-hidden="true" />
          <ScrollProgress />
          <ChatWidget />
          <Header />
          <AnimatedRoutes />
          <Footer />
          <Toaster theme="dark" position="bottom-right" />
        </ReactLenis>
      </BrowserRouter>
    </div>
  );
}

export default App;

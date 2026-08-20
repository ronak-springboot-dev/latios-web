import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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

const ScrollReset = () => {
  const { pathname } = useLocation();
  const lenis = useLenis();
  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname, lenis]);
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/towers/:modelSlug" element={<ModelPage />} />
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

import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { PartnerStrip } from "@/components/PartnerStrip";
import { KineticText } from "@/components/KineticText";
import { usePageMeta } from "@/hooks/usePageMeta";

const EASE = [0.16, 1, 0.3, 1];

const MISSION = [
  "Design and manufacture high-quality, reliable, and secure IT products that meet global standards while being proudly Made in India.",
  "Support the Atmanirbhar Bharat vision by building indigenous technology capabilities across laptops, desktops, servers, storage, and enterprise IT solutions.",
  "Deliver cost-effective and innovative products tailored to the needs of government, education, enterprise, and emerging markets.",
  "Continuously invest in R&D, product engineering, and local manufacturing ecosystems.",
  "Ensure customer satisfaction, long-term value, and sustainable growth through ethical business practices and operational excellence.",
];

const DIFFERENT = [
  [
    "100% Indian Roots, Global Vision",
    "Every solution we offer is built with pride and purpose in India — aligned with the Make in India initiative and Class-I Local Supplier compliance.",
  ],
  [
    "End-to-End Capabilities",
    "From research and development to prototyping, PCB assembly, molding, testing, and packaging — all done in-house with high precision and certified processes.",
  ],
  [
    "Human-Centered Approach",
    "We don't just deliver products. We listen, we adapt, and we solve problems — with a team that believes in long-term value over short-term hype.",
  ],
];

export default function AboutPage() {
  const navigate = useNavigate();
  const goContact = () => {
    navigate("/");
    setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 450);
  };
  usePageMeta(
    "About Us | Latios",
    "Founded in 2023, Latios designs and manufactures fully indigenous ICT solutions — developed, manufactured, and supported in India."
  );

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: EASE }}
      data-testid="about-page"
    >
      {/* HERO */}
      <section className="relative pt-32 md:pt-44 pb-16 md:pb-24" data-testid="about-hero">
        <div className="grid-bg absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-[1200px] mx-auto px-6 md:px-12">
          <Link
            to="/"
            data-testid="about-back-link"
            className="flex w-fit items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors duration-300 mb-10"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </Link>
          <p className="kicker-sq text-xs uppercase tracking-[0.35em] text-zinc-500 mb-6" data-testid="about-kicker">
            About Us
          </p>
          <KineticText
            testId="about-title"
            lines={["Proudly Indian.", "Boldly Innovative."]}
            className="font-display font-black tracking-tighter text-white leading-[1.05] text-4xl md:text-6xl"
            delay={0.1}
          />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            <p className="text-zinc-400 leading-relaxed" data-testid="about-intro-1">
              Founded in 2023, Latios is more than just a technology brand — we're a movement
              shaped by innovation, integrity, and India's growing self-reliance. We specialise in
              designing and delivering fully indigenous Information and Communication Technology
              (ICT) solutions — developed, manufactured, and supported right here in India.
            </p>
            <p className="text-zinc-400 leading-relaxed" data-testid="about-intro-2">
              From the first concept to end-of-life management, every Latios solution is
              thoughtfully built with Indian engineering excellence, global quality benchmarks, and
              real-world reliability. We're here to prove that world-class tech doesn't need to come
              from somewhere else. It can start and scale from India.
            </p>
          </div>
        </div>
      </section>

      {/* VISION + MISSION */}
      <section className="border-t border-white/10" data-testid="about-vision-mission">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-28 space-y-20">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              <div className="overflow-hidden border border-white/10" data-testid="about-vision-image">
                <img src="/images/our-vision.jpg" alt="Latios vision" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="kicker-sq text-[10px] uppercase tracking-[0.35em] text-zinc-500 mb-5">Our Vision</p>
                <h2 className="font-display text-2xl md:text-4xl font-black tracking-tighter text-white leading-[1.1]">
                  A globally trusted Indian electronic manufacturing brand.
                </h2>
                <p className="mt-6 text-zinc-400 leading-relaxed">
                  To become a globally trusted Indian electronic manufacturing brand, delivering
                  world-class laptops, desktops, servers, storage, and IT solutions that are
                  designed, developed, and manufactured in India — empowering digital transformation
                  and strengthening India's self-reliance in technology.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              <div className="md:order-2 overflow-hidden border border-white/10" data-testid="about-mission-image">
                <img src="/images/our-mission.jpg" alt="Latios mission" className="w-full h-full object-cover" />
              </div>
              <div className="md:order-1">
                <p className="kicker-sq text-[10px] uppercase tracking-[0.35em] text-zinc-500 mb-5">Our Mission</p>
                <ul className="space-y-4" data-testid="about-mission-list">
                  {MISSION.map((m, i) => (
                    <li key={i} className="flex gap-4 text-sm text-zinc-400 leading-relaxed">
                      <span className="mt-1.5 w-2 h-2 shrink-0 bg-[#1a56e8]" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHAT MAKES US DIFFERENT */}
      <section className="border-t border-white/10" id="design-manufacturing" data-testid="about-different">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-28">
          <Reveal>
            <p className="kicker-sq text-xs uppercase tracking-[0.35em] text-zinc-500 mb-6">What Makes Us Different</p>
            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tighter text-white mb-14 max-w-2xl leading-[1.05]">
              Not here to follow trends — here to set them.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
            {DIFFERENT.map(([title, desc], i) => (
              <Reveal key={title} delay={i * 0.08}>
                <div className="bg-[#0A0A0A] p-8 md:p-10 h-full" data-testid={`about-different-${i}`}>
                  <span className="font-display text-4xl font-black tracking-tighter text-[#1a56e8]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-white">{title}</h3>
                  <p className="mt-4 text-sm text-zinc-400 leading-relaxed">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS STRIP */}
      <section className="border-t border-white/10" data-testid="about-partners">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-16 md:py-20 text-center">
          <Reveal>
            <p className="kicker-sq justify-center text-[10px] uppercase tracking-[0.35em] text-zinc-500 mb-10">
              Technology Partners
            </p>
            {/* `size`, not a height class: the strip is two marks at two
                scales now, so one height cannot set both. */}
            <PartnerStrip size="lg" testid="partners-strip" />
            <p className="mt-6 text-[10px] text-zinc-600 max-w-md mx-auto leading-relaxed">
              All third-party trademarks, logos, and brand names displayed are the property of
              their respective owners.
            </p>
          </Reveal>
        </div>
      </section>

      {/* CLOSING + CTA */}
      <section className="border-t border-white/10" data-testid="about-cta">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-28 flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <Reveal>
            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tighter text-white leading-[1.05] max-w-2xl">
              Rooted in India, ready for the world. Welcome to Latios.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <button
              onClick={goContact}
              data-testid="about-contact-cta"
              className="group inline-flex items-center gap-3 btn-blue px-8 py-4 text-xs uppercase tracking-[0.25em] font-semibold transition-colors duration-300"
            >
              Contact Us
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </Reveal>
        </div>
      </section>
    </motion.main>
  );
}

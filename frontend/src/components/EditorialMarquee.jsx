import Marquee from "react-fast-marquee";
import { Asterisk } from "lucide-react";

export const EditorialMarquee = ({ items }) => (
  <section
    data-testid="editorial-marquee"
    className="border-y border-white/10 py-8 md:py-14 overflow-hidden bg-[#050505]"
  >
    <Marquee speed={26} gradient={false} pauseOnHover>
      {items.map((item, i) => (
        <span key={i} className="flex items-center shrink-0">
          <span className="text-outline font-display font-black tracking-tighter text-6xl md:text-8xl px-8 md:px-12 select-none">
            {item}
          </span>
          <Asterisk className="w-8 h-8 md:w-12 md:h-12 text-zinc-700 shrink-0" strokeWidth={1.5} />
        </span>
      ))}
    </Marquee>
  </section>
);

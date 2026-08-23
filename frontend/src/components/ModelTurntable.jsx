import { useRef, useState } from "react";

export const ModelTurntable = ({ frames, name }) => {
  const [idx, setIdx] = useState(0);
  const drag = useRef({ active: false, x: 0 });
  const n = frames.length;

  const advance = (dir) => setIdx((i) => (i + dir + n) % n);

  const onPointerDown = (e) => {
    drag.current = { active: true, x: e.clientX };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 48) {
      advance(dx > 0 ? 1 : -1);
      drag.current.x = e.clientX;
    }
  };
  const end = () => (drag.current.active = false);

  return (
    <div data-testid="model-turntable" className="select-none">
      <div
        className="relative rounded-xl bg-[#f2f2f0] aspect-[16/10] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={end}
        onPointerCancel={end}
        data-testid="turntable-stage"
      >
        {frames.map((f, i) => (
          <img
            key={f}
            src={f}
            alt={`${name} — view ${i + 1}`}
            draggable={false}
            className={`absolute max-h-[82%] w-auto object-contain transition-opacity duration-300 ${
              i === idx ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <span className="absolute bottom-4 left-5 text-[10px] uppercase tracking-[0.3em] text-zinc-500">
          Drag to rotate
        </span>
      </div>
      <div className="mt-5 flex items-center justify-center gap-2.5" data-testid="turntable-dots">
        {frames.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`View ${i + 1}`}
            data-testid={`turntable-dot-${i}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === idx ? "w-8 bg-[#1a56e8]" : "w-1.5 bg-zinc-600 hover:bg-zinc-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

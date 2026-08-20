import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle = () => {
  const [light, setLight] = useState(
    () => localStorage.getItem("latios-theme") === "light"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("light", light);
    localStorage.setItem("latios-theme", light ? "light" : "dark");
  }, [light]);

  return (
    <button
      onClick={() => setLight(!light)}
      data-testid="theme-toggle"
      aria-label="Toggle light and dark mode"
      className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-white/60 transition-colors duration-300 focus:ring-2 focus:ring-white/50 focus:outline-none"
    >
      {light ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </button>
  );
};

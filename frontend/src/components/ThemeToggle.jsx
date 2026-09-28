import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

/**
 * Light is the default; dark is the opt-in.
 *
 * It reads `!== "dark"` rather than `=== "light"`, so an unset key means light
 * and only an explicit choice of dark turns it off. Anyone who had already
 * chosen a theme keeps it — the key is unchanged and so is its meaning.
 *
 * The class is ALSO set by a blocking script in public/index.html, which must
 * stay in step with this: the effect below runs after the first paint, so on a
 * cold load the inline script is what stops the page flashing the wrong theme.
 * This component remains the only thing that WRITES the key.
 *
 * localStorage is read defensively for the same reason the inline script is —
 * it throws rather than returning null in a private window with site data
 * blocked, and an unguarded read here would take the header down with it.
 */
const prefersLight = () => {
  try {
    return localStorage.getItem("latios-theme") !== "dark";
  } catch {
    return true;
  }
};

export const ThemeToggle = () => {
  const [light, setLight] = useState(prefersLight);

  useEffect(() => {
    document.documentElement.classList.toggle("light", light);
    try {
      localStorage.setItem("latios-theme", light ? "light" : "dark");
    } catch {
      /* private window with storage blocked: the class is still applied */
    }
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

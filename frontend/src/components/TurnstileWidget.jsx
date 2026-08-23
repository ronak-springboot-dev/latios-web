import { useEffect, useRef, useState } from "react";

const SCRIPT_ID = "cf-turnstile-script";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptPromise;
const loadTurnstile = () => {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.id = SCRIPT_ID;
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve(window.turnstile);
    s.onerror = () => reject(new Error("turnstile load failed"));
    document.head.appendChild(s);
  });
  return scriptPromise;
};

export const TurnstileWidget = ({ onToken, resetSignal = 0, testid = "turnstile-widget", action = "enquiry", theme }) => {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [errorCode, setErrorCode] = useState(null);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  useEffect(() => {
    let cancelled = false;
    loadTurnstile()
      .then((t) => {
        if (cancelled || !containerRef.current || widgetIdRef.current !== null) return;
        const widgetTheme = theme || (document.documentElement.classList.contains("light") ? "light" : "dark");
        widgetIdRef.current = t.render(containerRef.current, {
          sitekey: process.env.REACT_APP_TURNSTILE_SITE_KEY,
          theme: widgetTheme,
          action,
          callback: (token) => {
            setErrorCode(null);
            onTokenRef.current(token);
          },
          "expired-callback": () => onTokenRef.current(null),
          "timeout-callback": () => onTokenRef.current(null),
          "error-callback": (code) => {
            onTokenRef.current(null);
            setErrorCode(String(code || "unknown"));
          },
        });
      })
      .catch(() => {
        onTokenRef.current(null);
        setErrorCode("load");
      });
    return () => {
      cancelled = true;
      if (window.turnstile && widgetIdRef.current !== null) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {}
      }
      widgetIdRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (resetSignal > 0 && window.turnstile && widgetIdRef.current !== null) {
      window.turnstile.reset(widgetIdRef.current);
      setErrorCode(null);
      onTokenRef.current(null);
    }
  }, [resetSignal]);

  const retry = () => {
    setErrorCode(null);
    if (window.turnstile && widgetIdRef.current !== null) {
      window.turnstile.reset(widgetIdRef.current);
    }
  };

  const isConfigError = errorCode && /^[14]/.test(errorCode);

  return (
    <div>
      <div ref={containerRef} data-testid={testid} aria-label="Security verification" />
      {errorCode && (
        <p data-testid={`${testid}-error`} className="mt-2 text-xs text-red-400">
          {isConfigError || errorCode === "load" ? (
            "Security check could not load on this domain — please email sales@latios.in directly."
          ) : (
            <>
              Verification failed —{" "}
              <button
                type="button"
                onClick={retry}
                data-testid={`${testid}-retry`}
                className="underline underline-offset-2 hover:text-red-300 transition-colors duration-200"
              >
                try again
              </button>
              .
            </>
          )}
        </p>
      )}
    </div>
  );
};

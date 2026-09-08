import { useEffect, useRef, useState } from "react";

const SCRIPT_ID = "cf-turnstile-script";

/**
 * How long to wait for the challenge to appear before calling it broken.
 *
 * Turnstile has a failure mode with no callback at all: given a sitekey that
 * will not issue a challenge for the current hostname, render() returns a
 * widget id, injects its hidden input, and then simply never draws the iframe.
 * No callback, no error-callback, no console message. The form or the chat is
 * then permanently unusable and says nothing about why -- which is how the
 * deployed chat sat broken while the backend was healthy and logging nothing,
 * because the request never left the browser.
 *
 * Confirmed with a side-by-side render on the live page: Cloudflare's
 * always-passes test sitekey issued a token, the production sitekey timed out.
 */
const RENDER_DEADLINE_MS = 12000;
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

export const TurnstileWidget = ({
  onToken,
  resetSignal = 0,
  testid = "turnstile-widget",
  action = "enquiry",
  theme,
  // Called once when the check is not something the visitor can complete --
  // the widget cannot serve this hostname, or the script never loaded. Lets a
  // caller stop blocking on a gate that will never open.
  onUnavailable,
}) => {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const deadlineRef = useRef(null);
  const [errorCode, setErrorCode] = useState(null);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;
  const onUnavailableRef = useRef(onUnavailable);
  onUnavailableRef.current = onUnavailable;

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
            clearTimeout(deadlineRef.current);
            setErrorCode(null);
            onTokenRef.current(token);
          },
          "expired-callback": () => onTokenRef.current(null),
          "timeout-callback": () => onTokenRef.current(null),
          "error-callback": (code) => {
            clearTimeout(deadlineRef.current);
            onTokenRef.current(null);
            const c = String(code || "unknown");
            setErrorCode(c);
            if (/^[14]/.test(c)) onUnavailableRef.current?.();
          },
        });
        // Nothing above fires in the silent case, so the only way to notice is
        // to look for the iframe Turnstile should have drawn by now.
        deadlineRef.current = setTimeout(() => {
          if (cancelled || !containerRef.current) return;
          if (!containerRef.current.querySelector("iframe")) {
            onTokenRef.current(null);
            setErrorCode("no-challenge");
            onUnavailableRef.current?.();
          }
        }, RENDER_DEADLINE_MS);
      })
      .catch(() => {
        onTokenRef.current(null);
        setErrorCode("load");
        onUnavailableRef.current?.();
      });
    return () => {
      cancelled = true;
      clearTimeout(deadlineRef.current);
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

  // 1xxxxx and 4xxxxx are Turnstile's own configuration and domain errors;
  // "load" and "no-challenge" are ours. None of them are retryable by the
  // visitor, so all of them get the route to a human rather than a retry link.
  const isConfigError =
    errorCode && (/^[14]/.test(errorCode) || errorCode === "load" || errorCode === "no-challenge");

  return (
    <div>
      <div ref={containerRef} data-testid={testid} aria-label="Security verification" />
      {errorCode && (
        <p data-testid={`${testid}-error`} className="mt-2 text-xs text-red-400">
          {isConfigError ? (
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

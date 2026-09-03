/**
 * Same-origin proxy: /api/** on the Pages domain -> the Cloud Run service.
 *
 * Why a Function rather than a redirect
 * ------------------------------------
 * frontend/.env sets REACT_APP_BACKEND_URL empty on purpose, so the app calls
 * /api/* as relative paths (ChatWidget.jsx, Footer.jsx, AdminPage.jsx). Keeping
 * those same-origin means no CORS to configure and no backend hostname baked
 * into the build - exactly what deploy/nginx.conf does on the VM path.
 *
 * Cloudflare Pages `_redirects` cannot do this: status 200 there only rewrites
 * to paths inside the same project, never to an external origin.
 *
 * The incoming pathname is forwarded UNCHANGED, including the /api prefix,
 * because backend/server.py mounts its routes as APIRouter(prefix="/api").
 * Stripping the prefix here would 404 every endpoint.
 *
 * API_ORIGIN is set on the Pages project as a plain variable (it is a public
 * hostname, not a secret).
 */

const HOP_BY_HOP = [
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
];

export const onRequest = async ({ request, env }) => {
  if (!env.API_ORIGIN) {
    // Fail loudly rather than falling through to the SPA shell. An HTML body
    // returned for an API call is very hard to diagnose from the browser, and
    // is the exact failure mode already live on the Emergent deployment.
    return new Response(
      JSON.stringify({ detail: "API_ORIGIN is not set on this Pages project" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }

  const incoming = new URL(request.url);
  const target = new URL(env.API_ORIGIN);
  target.pathname = incoming.pathname;
  target.search = incoming.search;

  const headers = new Headers(request.headers);
  HOP_BY_HOP.forEach((h) => headers.delete(h));
  // Cloud Run routes on Host; leaving the Pages host here misroutes the request.
  headers.delete("host");

  // /api/enquiries verifies a Turnstile token server-side and needs the real
  // client address, which after proxying only exists in CF-Connecting-IP.
  const clientIp = request.headers.get("CF-Connecting-IP");
  if (clientIp) headers.set("X-Forwarded-For", clientIp);
  headers.set("X-Forwarded-Host", incoming.host);
  headers.set("X-Forwarded-Proto", "https");

  const hasBody = !["GET", "HEAD"].includes(request.method);

  let upstream;
  try {
    upstream = await fetch(target.toString(), {
      method: request.method,
      headers,
      body: hasBody ? request.body : undefined,
      redirect: "manual",
    });
  } catch (err) {
    // Cloud Run runs at min-instances 0, so the first request after an idle
    // period pays a cold start (~3s measured).
    return new Response(
      JSON.stringify({ detail: "Upstream unavailable", error: String(err) }),
      { status: 502, headers: { "content-type": "application/json" } }
    );
  }

  // Streamed through rather than buffered, so the LATI chat's SSE response is
  // not held until it completes.
  const out = new Headers(upstream.headers);
  HOP_BY_HOP.forEach((h) => out.delete(h));
  out.set("cache-control", "no-store");

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: out,
  });
};

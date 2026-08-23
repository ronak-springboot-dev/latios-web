# PRD — Latios Enterprise Hardware Showcase

## Original Problem Statement
User wants an online enterprise web app for laptop/towers/audio/video and other devices. New product line; separate intuitive, animated pages per product. Reference: MSI PRO DP80 product page. User confirmed: all four categories, marketing/showcase site, built-in content (no admin), dark premium tech aesthetic. Art-direction mandate: Awwwards-level — kinetic hero with masked line reveal, spotlighted product photography, numbered manifesto chapters, slow editorial marquee, framer-motion reveals, lenis smooth scrolling, subtle 3D hero moment.

## Architecture
- Frontend: React 19 (CRA/craco), react-router-dom 7, framer-motion, lenis (smooth scroll), react-fast-marquee, three + @react-three/fiber + @react-three/drei (3D hero), lucide-react, sonner, Tailwind (Outfit/Manrope fonts).
- Backend: FastAPI + MongoDB (motor). Public enquiry endpoint only; no auth.
- Routes: / (Home), /laptops, /towers, /audio, /video (shared ProductPage template driven by /src/data/products.js).

## User Personas
- IT procurement lead evaluating fleet hardware
- Creative/engineering team lead checking specs
- Exec browsing brand/story

## Core Requirements (static)
- Dark monochrome premium aesthetic, generous asymmetric spacing
- One animated page per category with parallax hero, 3 numbered chapters, spec grid
- Home: 3D hero, kinetic headline, lineup bento, marquee, manifesto, CTA
- Enquiry form in footer persisting to MongoDB
- All interactive elements carry data-testid

## Implemented (2026-08-23, update 24 — Turnstile e2e verified with real keys)
- Applications carousel cards now keep-dark — titles/blurbs white and readable over photos in light mode (user-reported; verified rgb(255,255,255) both themes)
- CRITICAL FIX: testing agent had swapped in Cloudflare DUMMY always-pass keys; restored user's real keys in both .env files — forged tokens now rejected 400 (proved via curl), widget renders on preview hostname with no "For testing only" banner
- Hardening: EnquiryCreate.email now EmailStr (422 on invalid, Footer shows "Please enter a valid work email"); chat session verification expires after 24h; TurnstileWidget error-callback now distinguishes retryable challenge failures (6xxxxx → "Verification failed — try again" with working retry) from config/load failures (domain message), error state clears on success/reset
- iteration_4: backend 22/22 pytest, chat gate + streaming + lead-form gating + admin all pass with real keys. NOTE: footer/lead happy-path submit not automatable — Cloudflare 600010 blocks headless browsers (protection working as intended); needs one manual human submission to confirm

## Implemented (2026-08-23, update 23 — Turnstile chat protection)
- /api/chat now gated by Turnstile: first message per session requires turnstile_token (403 without, 400 fake — both verified); verified sessions recorded in db.chat_sessions so subsequent messages skip the check
- ChatWidget: security-check block above input when unverified (action "chat", forced dark theme), send button + FAQ chips gated until token, 403/400 responses re-show the widget; verified flag persisted in localStorage (backend DB is source of truth)
- TurnstileWidget gained action + theme props
- STILL BLOCKED (user action): Cloudflare widget still shows "Unable to connect to website" — hostnames not yet added in user's Cloudflare dashboard; full e2e submission test (footer/lead/chat) pending until then. Note: chat is now also intentionally locked until hostnames are added

## Implemented (2026-08-23, update 22 — read receipts + Cloudflare Turnstile)
- Read receipts: enquiries now carry replied flag; PATCH /api/enquiries/{id}/replied (admin-key protected, 401/404 verified); admin inbox shows emerald "Replied" badge + Mark replied/Unmark toggle, replied rows dimmed (UI verified end-to-end)
- Cloudflare Turnstile: TurnstileWidget.jsx (explicit render, dark/light theme aware, token reset after every submit, error fallback message); footer enquiry form + LATI lead form both require a valid token; backend verifies via siteverify (TURNSTILE_SECRET_KEY in backend/.env, site key in frontend/.env REACT_APP_TURNSTILE_SITE_KEY); 422 without token, 400 bad token, tokens single-use
- BLOCKER (user action): widget shows "Unable to connect to website" on preview — user's Cloudflare widget hostnames must include tech-gallery-14.preview.emergentagent.com AND the production hostname (Cloudflare Dashboard → Turnstile → widget → Hostnames). Secret key verified valid via siteverify. Until hostnames are added, enquiry forms stay disabled by design
- Reply mailto body now truncates quoted message at 500 chars (mailto URL limit)

## Implemented (2026-08-24, update 21 — verified fixes + admin Reply)
- TESTING AGENT VERIFIED (iteration_2, 8/8 pass): all iteration_1 light-mode failures fixed — LATI FAB icon (dark-on-white via higher-specificity chat-fab rule), chat panel stays dark in light mode (keep-dark bg/border/hover protection rules), search overlay popular-machine cards readable, theme toggle icon visible (utility bar now keep-dark), hero accordion text contrast (panels now keep-dark), LATI markdown bullets render as •
- NEW: one-click Reply button in admin enquiry inbox — mailto link pre-filled with "Re: Your Latios enquiry" subject + body quoting the enquirer's message (truncated at 500 chars to stay within mailto URL limits)
- Added data-testid to sub-category pills (subcat-pill-{slug}-{i})
- test_credentials.md confirmed accurate (admin password Latios@2026 works)

## Implemented (2026-08-23, update 20 — bug fixes + JWIPC content parity)
- BUG FIX: mega menu + search overlay text was invisible in light mode (light overrides recolored white text on dark overlays) — overlays now marked keep-dark with extended zinc/bg coverage
- BUG FIX: LATI chat button icon went black-on-black in light mode (bg-white override) — chat-fab exemption class keeps it white with dark icon in both themes
- BUG FIX: LATI message area couldn't scroll (lenis hijacked wheel) — data-lenis-prevent added to chat messages + both overlays
- JWIPC parity: sub-category pills inside expanded accordion panels; "What makes Latios unique" stat blocks with descriptions; mega menu quick links (Applications/News/About); footer link columns (Products/Company/Support) with GeM badge

## Implemented (2026-08-23, update 19)
- Search overlay: popular-search chips + "Popular machines" thumbnail grid when empty; results now show product thumbnails
- /admin locked behind team password (ADMIN_PASSWORD=Latios@2026 in backend/.env; POST /api/admin/login; X-Admin-Key header protects /api/chat-analytics + /api/enquiries; 401 without). Frontend gate with sessionStorage + sign out
- /admin is now "Sales command center": enquiry inbox (name/email/company/message/date, "via LATI" badge on chatbot leads) + analytics stats, top-topic bars, recent questions

## Implemented (2026-08-23, update 18)
- Email alerts: every enquiry + LATI lead triggers a transactional email to sales@latios.in via Emergent-managed Resend (emailer.py with guardrail gate; from_name "Latios", reply-to sales@latios.in; verified — email id 793e695a logged on test send)
- Chat analytics: GET /api/chat-analytics (totals, sessions, top keywords, recent questions) + /admin team page "What buyers ask LATI" with stat cards, animated topic bars, recent questions list (no auth — public URL)
- JWIPC-style header: dark navy utility bar (email/phone/tagline/theme toggle), center nav, square search button + blue square hamburger; full-screen mega menu with staggered big links + contact card; full-text product search overlay across all 28 models; header hides on scroll down, returns on scroll up; light + dark both verified

## Implemented (2026-08-23, update 17)
- LATI lead capture: pricing-intent questions (price/quote/buy/bulk/demo etc.) trigger an in-chat name+email form; submissions save to enquiries DB tagged "LATI chat lead — asked about: ..." with confirmation message + toast; once-per-visitor
- /compare page: pick up to 3 machines (grouped selectors, all 28 models), side-by-side grid with images, links, and union of grouped spec rows; added "Compare" to header nav
- SEO: usePageMeta hook sets per-page document.title + meta description on Home/Product/Model/News/Application/Compare pages; index.html now has Latios title, description, OG tags

## Implemented (2026-08-23, update 16)
- News detail pages: /news/:slug — full article pages with hero photo, kinetic title, body, more-news rail (5 articles in src/data/news.js); home news cards are now links with image thumbs
- Application sector pages: /applications/:slug — hero, sector intro, capability points, recommended Latios products grid (real model links) for education/government/enterprise/healthcare/manufacturing/boardrooms
- LATI product links: knowledge base now lists every product URL and instructs markdown links; chat renders them as tappable blue links (bold-wrapped links normalized)

## Implemented (2026-08-23, update 15)
- Towers page: JWIPC-style family accordion (Business Desktops vs PROMAX AI Workstations) with hover expansion, vertical collapsed titles, blue View Models button, smooth-scrolls to the family grid
- Blue accent pass: nav underlines, all section kickers (blue square), Explore-model and Enquire buttons now Latios blue, spec-cell hover blue inset, model-card blue hover ring, turntable active dot blue
- Homepage: Applications carousel (Education/Government/Enterprise/Healthcare/Manufacturing/Boardrooms, square arrow buttons) + News & Updates carousel (5 sample items — MOCKED content)
- Custom images: /public/custom-images/ directory with README.txt + src/data/customImages.js reference map of every image slot for manual swaps

## Implemented (2026-08-23, update 14 — JWIPC-style redesign)
- Homepage redesigned after jwipc.com: centered corporate headline + horizontal hover-accordion of the 4 categories (collapsed panels show vertical titles; expanded panel shows image, kicker, tagline, blue Explore button); mobile gets stacked cards
- Corporate accent system: Latios blue (#1a56e8) — square-accent section kickers, blue sharp-edged Enquire/Explore buttons
- 3D torus hero removed from home (replaced by accordion); theme toggle (dark default + light) and LATI assistant retained and verified in both modes

## Implemented (2026-08-20, update 13)
- REVERTED homepage 3D hero per user feedback: hardware scene (chip/RAM/fan) removed, original wireframe torus-knot sculpture restored

## Implemented (2026-08-20, update 12 — Gemini + tech hero)
- LATI chatbot is LIVE: Gemini streaming via /api/chat (SSE), user's own GEMINI_API_KEY in backend/.env, product knowledge base in backend/knowledge.py (all 28 products + company), chat history persisted in MongoDB chat_messages
- NOTE: user asked for gemini-2.5-flash-lite; Google API returned "no longer available to new users" — using gemini-3.5-flash-lite (API-recommended successor) instead
- Chat UI: welcome message, clickable FAQ chips, streaming responses, bold markdown rendering, per-visitor session in localStorage
- Homepage 3D hero replaced: torus knot → hardware scene (CPU chip with gold pins, 2 RAM sticks, spinning fan, port hub block) + particle dust, mouse parallax

## Implemented (2026-08-20, update 11 — company profile integration)
- Extracted all 20 pages of the Latios company profile PDF; cropped 20 real product/facility images from it
- Laptops, Audio, Video categories now REAL: 13 new model pages (PRO AI 14 LTB244X, Rugged 14 MIL-STD-810H/IP65, Archer LTG540Z gaming; SP-50 speakerphone, 2 video soundbars, HPS conference system; web camera, PTZ camera, PRO monitors, IN-Series LFD 43-110", interactive panels 55-110", Active LED) — all spec'd from profile
- Category heroes now use real profile scenes (rugged lineup, AV family, display wall); chapters rewritten to real product stories
- Home: real stats (2023/15+ families/12+ certs/GeM), new "The Company" section with SMT factory photo + certification chips; footer now has full Palak Prime Ahmedabad address + latios.in
- ModelPage generalized to all categories (/:category/:modelSlug)
- Scroll: removed background-attachment:fixed (mobile jank source); lenis momentum intact

## Implemented (2026-08-20, update 10)
- Rich enterprise backgrounds: layered fixed ambient radial gradients on body, diagonal gradient on cards, vertical gradient on marquee/footer, and a masked blueprint grid texture (.grid-bg) on the home hero + all spec sections; light theme verified compatible

## Implemented (2026-08-20, update 9)
- Laptops page now uses real logo-free laptop photos (laptop-real-1/2/3.jpg) — verified no brand logos visible
- latios-web.vercel.app is behind Cloudflare bot protection (crawler, browser and reader-proxy all blocked) — audio/visual product data could NOT be extracted; awaiting user to share data directly or whitelist

## Implemented (2026-08-20, update 8)
- Laptops page de-Apple'd: all MacBook photos replaced with Latios-branded SVG artwork (laptop-1/2/3.svg)
- Scroll animations upgraded site-wide: fixed scroll-progress bar (ScrollProgress) + scroll-linked ParallaxImage on all ProductPage chapters and ModelPage feature sections (techy parallax drift while scrolling)
- LATI chatbot widget (Latios AI Assistant): floating button on all pages; opens panel with 5 greyed-out product FAQs, "Coming soon" badge, disabled input. MOCKED UI only, no LLM backend yet

## Implemented (2026-08-20, update 7 — user-directed revert)
- REVERTED the MSI→real-photo swap per user: MSI imagery restored everywhere on Towers (cards, turntables, heroes, features) and original laptop/video photos restored
- KEPT brand-free custom SVG artwork ONLY on the Audio page (user requirement: no JBL/other brands in audio)
- Removed the floating Latios tower from the homepage hero (added then removed at user request)
- Real Latios photo crops remain in /public/images (unused, available on request)

## Implemented (2026-08-20, update 6 — brand cleanup)
- Replaced ALL third-party-branded imagery: MSI renders/photos swapped for the user's real Latios product photo (cropped into latios-mt.jpg / latios-sff.jpg / latios-pair.jpg) across model cards, 360° turntables, heroes and feature chapters
- Laptops/Audio/Video pages: removed all third-party stock photos (Apple/JBL/Marshall/Canon etc.) and replaced with custom brand-neutral dark SVG artwork (waveform, EQ bars, speaker rings, keyboard grid, chip, play frame, pixel mosaic) bearing the LATIOS wordmark
- Deleted 16 unused MSI/pexels image files from public/images

## Implemented (2026-08-20, update 5)
- Individual rich model pages at /towers/:slug for all 15 desktop+workstation SKUs: parallax hero w/ kinetic name + spec chips, key-stats grid, drag-to-rotate 360° turntable (gallery frames), 3-4 animated feature chapters, full grouped spec tables (from datasheets), "more from the range" rail, enquire CTA
- Model data centralized in src/data/models.js (TOWERS_FAMILIES); ProductPage cards are now links (datasheet download buttons removed per user request)
- Added 5 new SKUs from latest datasheets: Pro MT H610 DDR5, Pro AI SFF AM5, Pro AI SFF B860 (128GB/TB4), Pro AI SFF H810, plus refreshed AM4 MT
- Downloaded 16 more MSI feature images (perf, I/O, upgrade, chassis, speaker, RTX, DDR5, display, versatile, KVs, triple-display, cable organizer) used in model heroes/features
- Family 1 now: 11 business desktops (MT/SFF/MFF); Family 2: 4 PROMAX workstations

## Implemented (2026-08-20, update 4)
- Real product imagery: downloaded 13 assets from the xlsx MSI source pages (DP180/DP80/DP10 gallery renders + office/home/ops lifestyle shots) into /public/images; every model card now shows the real Latios unit on a light panel; towers chapters use real lifestyle photos
- Added 7th desktop model: Latios Pro MFF DP10 A14MG (1.1L mini PC) from xlsx data
- Latios logo chip (white pill) in header + footer; real contact block: sales@latios.in, +91 82381 40787, Ahmedabad Gujarat India, "Proudly Indian. Boldly Innovative."
- Light/dark theme toggle (sun/moon in header, desktop + mobile): dark default, persists via localStorage, full light-theme CSS override layer in index.css; product heroes stay cinematic dark in both themes

## Implemented (2026-08-20, update 3)
- Towers page restructured into two real families rendered from datasheet data: Business Desktops (6 models: 5 MT + Latios Pro SFF 9.3L) and PROMAX AI Workstations (4 models: Q870 128GB, T2 W880 256GB ECC, T2 W680 256GB, T4 Plus W780 Xeon W 2TB ECC)
- All 10 model cards have datasheet PDF download buttons — every link verified 200 OK
- ProductPage now renders data.families (kicker/title/blurb + model card grids) instead of flat models list
- Towers intro and spec grid updated to span the full desktop+workstation range

## Implemented (2026-08-20, update 2)
- Rebranded entire site from placeholder "VANTA/SYSTEMS" to LATIOS (header, footer, kicker, model names, copyright Latios Infosystem Pvt. Ltd.)
- Replaced fictional towers content with real Latios MT family: 5 datasheet-derived models (AMD AM4 DDR4, Intel H610 DDR4, Intel H610 DDR5, Intel Q670 DDR5, Pro AI AMD AM5) with verified PDF datasheet download buttons (all 200 OK)
- Towers chapters/specs rewritten from real datasheet data (Core i9-14900 / Ryzen 7 8700G, H610/Q670/Pro 500/600, DDR4/DDR5 64GB, RTX A4000, Wi-Fi 6E, TPM 2.0, Latios Center / Cloud Center)
- Laptops/Audio/Video pages remain MOCKED sample content awaiting real Latios datasheets

## Implemented (2026-08-20)
- Home: R3F wireframe torus-knot hero w/ mouse parallax, masked line-by-line kinetic H1, stats strip, asymmetric bento lineup, editorial outline-text marquee, 3-chapter manifesto w/ giant ghost numerals, CTA band
- ProductPage: parallax hero (useScroll/useTransform), kinetic titles, intro statement, 3 alternating numbered chapters w/ spotlight images, marquee, 8-cell grid-border spec table, next-category CTA
- Header: glass fixed nav, mobile menu, enquire CTA; Footer: working enquiry form (POST /api/enquiries) + toast
- Backend: /api/enquiries POST+GET; kept status endpoints
- Image curation: replaced 2 off-brand stock heroes (laptops, video)

## Backlog / Priorities
- P0: none blocking
- P1: real brand/product photography assets; downloadable spec-sheet PDFs; SEO meta per route
- P2: compare page, region/language switcher, CMS or simple admin (user mentioned as possibility), live-chat, case studies section

## Next Tasks
- Replace remaining stock imagery with client product renders
- Add /compare or configurator if user wants e-commerce later
- Wire enquiry notifications to email (Resend) if requested

## Credentials
None — fully public site. See /app/memory/test_credentials.md.

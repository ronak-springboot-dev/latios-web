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

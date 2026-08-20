# PRD — Vanta Systems Enterprise Hardware Showcase

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

# HZA — Alhadf Alzaki Accounting & Bookkeeping

Premium bilingual (EN/AR) landing site for an Emirati accounting firm. Same scroll-driven, GSAP-powered, story-telling structure as the3key, retuned for HZA's brand: deep navy + gold + cream, target-and-arrow visual language, tax/accounting copy for the UAE market.

## Stack

- **Next.js 14** App Router
- **next-intl** for EN/AR with full RTL flip
- **GSAP** + ScrollTrigger for choreographed reveals (split-text, fanned cards, pinned horizontal scroll, parallax)
- **Lenis** for buttery smooth scroll
- **WebGL2** custom shader for the hero gradient mesh (no three.js, ~150 lines)
- **Tailwind CSS** for tokens + utility classes
- **TypeScript**
- Fonts via `next/font`: **Big Shoulders Display** (chunky condensed display), **Plus Jakarta Sans** (body), **Tajawal** (Arabic)

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000 → auto-redirects to `/en`. For Arabic: http://localhost:3000/ar (auto-flips to RTL, swaps fonts, mirrors layout, reverses marquee direction).

Build:
```bash
npm run build && npm start
```

## Sections

1. **Hero** — WebGL gradient mesh background (navy + gold flowing noise), split-line headline reveal, brand checks float in.
2. **Marquee** — infinite scrolling service tags on navy strip.
3. **Who it's for** — four pastel/brand cards fan out and rotate as the section scrolls in (GSAP `scrub` ScrollTrigger). Hover lifts the card.
4. **Services** — horizontal pinned scroll showcasing six services with brand icons. Each card reveals as it passes.
5. **Why us** — 2×2 feature grid with hover state.
6. **Process** — four full-bleed step sections alternating sides, with original SVG illustrations using brand palette (speech bubble, shield, growth chart, target hit by arrow).
7. **CTA** — final dark navy section with rotating gold ring decoration, "Let's hit the target" with GSAP scrub rotation.
8. **Footer** — three columns, social pills, copyright.

## How the GSAP effects work

- **Split-text reveal**: every mega headline is wrapped in `.split-line > span` so GSAP can animate the inner `span` from `yPercent: 110` upward, with the parent clipping overflow.
- **Fanned cards (WhoItsFor)**: cards start stacked + scale 0.92, then `ScrollTrigger` with `scrub: 1` tweens their `x`, `y`, `rotate` based on the section's scroll progress (0→1).
- **Horizontal pin (Services)**: the section is pinned for its full height, and the inner track translates `x` to `-(scrollWidth - viewportWidth)`. RTL reverses the direction sign.
- **Hero parallax**: ScrollTrigger applies subtle `y` and `scale` transforms to backgrounds across the section's visible range.
- **WebGL hero**: custom WebGL2 shader using fractal Brownian motion + domain warping to produce a slowly-flowing navy/gold/cream mesh. Lightweight (no library), DPR-aware, paused on tab blur.

## Bilingual / RTL

- All text in `/messages/en.json` and `/messages/ar.json`.
- `html[dir=rtl]` switches the active font to Tajawal and flips layout (`reverse-on-rtl` utility plus tailwind's logical properties).
- Marquee reverses direction in RTL.
- Horizontal services scroll inverts direction in RTL.
- Language toggle button in the header sits in the same position both ways.

## Brand tokens (edit in `app/globals.css` and `tailwind.config.ts`)

| Token | Value | Use |
|---|---|---|
| `--navy` | `#0B2150` | Primary brand color |
| `--blue` | `#1A4F9E` | Secondary highlights |
| `--gold` | `#D4A017` | Accent / CTAs |
| `--gold-light` | `#F4D580` | Soft fill |
| `--cream` | `#FAF6EC` | Background base |
| `--ink` | `#0A1530` | Body text |

## File map

```
app/
  [locale]/
    layout.tsx        — fonts, dir, NextIntlClientProvider, Lenis wrapper
    page.tsx          — composes all sections
  page.tsx            — redirects "/" → "/en"
  globals.css         — Tailwind layers + brand tokens + utility classes (.h-mega, .pill, .btn-*)
components/
  Header.tsx          — fixed nav with scroll-aware glass effect, lang switch
  Hero.tsx            — GSAP timeline + split-text + checks
  HeroCanvas.tsx      — WebGL2 shader (mounted client-only via next/dynamic)
  Marquee.tsx         — infinite scrolling strip
  WhoItsFor.tsx       — fanned floating cards (scrub ScrollTrigger)
  Services.tsx        — horizontal pinned scroll
  WhyUs.tsx           — 4-card grid
  Process.tsx         — alternating 4-step layout with SVG illustrations
  CTA.tsx             — final pitch with rotating rings
  Footer.tsx          — 3 columns
  Lenis.tsx           — smooth-scroll provider
  LanguageSwitch.tsx  — toggle EN ↔ AR preserving path
  ui/Logo.tsx         — logo mark + wordmark (placeholder SVG; swap with real brand SVG)
i18n/
  routing.ts          — locale config
  request.ts          — message loader
messages/
  en.json
  ar.json
middleware.ts         — locale detection / redirect
tailwind.config.ts    — brand palette tokens
```

## Swap the logo

`components/ui/Logo.tsx` has a placeholder mark. Drop the real brand SVG into `public/svg/logo.svg` and inline-import it, or replace the contents of `Logo` directly. The wordmark text uses the JSON-translatable brand name so it changes in Arabic automatically.

## Notes

- `next-intl` v3.20 was used; if you upgrade, the App Router APIs changed a couple of times — pin to a known-good major.
- For the WebGL shader, mobile Safari throttles WebGL2 shaders pretty hard — the noise loop is set to 5 octaves which is OK on iPhones, drop to 3 if you see frame drops.
- GSAP is the standard agency choice but is not free for paid commercial use under the Club GreenSock plugins (the bits used here — `ScrollTrigger` — are MIT and free for any use).

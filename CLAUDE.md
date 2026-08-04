# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The marketing site for **Awesome Labs, LLC** — an Astro static site deployed on Netlify at **isjustawesome.com**.

It replaced a hand-edited 2017 Dazzle-template static site in August 2026. That version is gone from the working tree but is in git history; if you need to see how something used to read, `git log` before the rewrite rather than assuming the old markup is still around.

Four pages, all in the sitemap: `/`, `/team/`, `/privacy/`, `/terms/`. Plus a `404`.

## Commands

Bun is the package manager and script runner; Astro itself needs Node ≥ 22.12.

```sh
bun install
bun run dev      # astro dev — http://localhost:4321
bun run build    # static build into dist/
bun run preview  # serve the production build
bun run check    # astro check — TypeScript + Astro diagnostics (the only "lint")
```

There is **no test runner configured** and no test files.

## Architecture

Astro 6, static output, TypeScript strict, Tailwind v4. **Path alias:** `@/*` → `src/*`.

**Styling — Tailwind v4, CSS-first.** There is no `tailwind.config`. The design system is the `@theme` block in `src/styles/global.css`, and it is the whole styling contract. Every handoff token is declared there with an `al-` prefix so it stays greppable against the spec: `--color-al-accent` → `bg-al-accent`, `--radius-al-card` → `rounded-al-card`, `--text-al-h1` → `text-al-h1`, `--spacing-al-gutter` → `px-al-gutter`.

**No component should contain a raw hex or a raw `clamp()`.** Both are tokenized, including the per-band vertical rhythm (`--spacing-al-work-y`, `--spacing-al-signup-y`, …) and every fluid type size. Each token name maps 1:1 to a figure in the handoff, which is what makes a drift from the design one grep away instead of a visual diff.

Ink opacity steps are the one thing deliberately *not* tokenized. `--color-al-ink` is `#16211f` = `rgb(22,33,31)`, which is exactly the `rgba()` the handoff writes secondary text in — so `text-al-ink/62` **is** `rgba(22,33,31,.62)`. Adding `--color-al-ink-62` would create a second way to say the same colour.

**`src/layouts/BaseLayout.astro` is the single head/SEO owner.** Every page renders through it: title/description/canonical/noindex, OG + Twitter cards, favicons, font preloads, JSON-LD (always Organization + WebSite; pages add more via the `schema` prop), and both analytics tags. Never add head tags in a page — extend the props.

**`src/layouts/PageLayout.astro`** is the shell for everything that is *not* the homepage: header, capped 72ch measure, title block, footer, and the `.al-prose` styles that make the legal pages readable. The homepage does not use it — its bands are full-bleed and own their own rhythm, so `index.astro` composes `BaseLayout` directly.

**`src/config.ts`** is the copy/URL source of truth: site name, canonical URL, the search-vs-social copy pair, contact mailto, and the two analytics IDs. **`src/data/`** holds anything repeated or likely to change — `products.ts`, `team.ts`, `nav.ts`.

**Fonts are self-hosted** via Fontsource (Bricolage Grotesque variable-weight + Space Grotesk 400/500), not loaded from Google Fonts as the prototype does. That is what keeps `font-src 'self'` in the CSP. IBM Plex Mono from the handoff is deliberately absent — its only use was labelling striped image placeholders this build does not ship.

## The mailing-list signup

The one piece of real behavior on the site. `src/components/MailingList.astro` posts to **`netlify/functions/subscribe.mts`**, which calls the Mailchimp Marketing API with a server-side key.

- The function declares its own route (`export const config = { path: '/api/subscribe' }`), so there is **no rewrite in `netlify.toml`** to keep in sync. The form's `action` and the `fetch` both point there.
- **Requires two Netlify env vars.** `MAILCHIMP_API_KEY` (its `-usN` suffix names the data centre, which is why the API host is derived from the key rather than configured separately) and `MAILCHIMP_AUDIENCE_ID` (the same value as the `id` param in the legacy list-manage embed URL, so subscribers land in the audience that already exists). Neither has a fallback: a missing key should fail loudly in the logs, not quietly subscribe people to nothing.
- Subscribes at status **`pending`** — double opt-in, matching what the legacy embed form did. Changing it to `subscribed` would silently change how consent is collected.
- **It works without JavaScript.** The `<form>` has a real action and method, and the function content-negotiates on `Accept`: a fetch gets JSON, a native form post gets a plain HTML confirmation page. The client script is an enhancement that keeps the visitor on the page.
- The handoff explicitly did not spec the loading/success/error states. They are built from tokens already on that band rather than inventing a visual language — if a designer specs them later, that is the place to look.
- `Member Exists` is reported as success, not an error: the visitor is already subscribed, which is what they wanted. Note this leaks list membership to anyone who guesses an address — acceptable for a newsletter, not for a list whose membership is sensitive.

## The hero gradient

`Hero.astro` carries the page's **only animation**: the statement's payoff clause is painted with a gradient clipped to the glyphs, sweeping left to right on a 5s loop through the four `--color-al-spark-*` tokens. It has a scoped `<style>` rather than utilities because three of its properties are load-bearing and non-obvious — the gradient lists *two* full cycles so the loop is seamless, the position animates `100% → 0%` because increasing a percentage background-position sweeps the wrong way, and `box-decoration-break: clone` stops the last wrapped line rendering flat. All three are commented in place; read them before editing.

The stops are darker than "bright" implies, deliberately: the statement starts at 21px regular, below WCAG's large-text threshold, so every stop must clear 4.5:1 on paper. Bright teal and the logo's orange both fail. Swapping the mood is four token values in `global.css` — re-measure first.

This also means the two-tone ink/accent split the handoff drew inside that clause no longer exists; the gradient spans the whole sentence.

## Netlify (`netlify.toml`)

Owns redirects, CSP, security headers, and caching.

- **Two legacy product routes are permanently redirected** — `/awesome-breathing*` → `awesomebreathing.com`, `/pepcalc-peptide-calculator*` → `pepcalc.app`. Both bare and splat forms, 301. These replace the old meta-refresh stubs and the `.htaccess` rule.
- **Plausible is proxied first-party**: `/js/pa.js` → `plausible.io/js/pa-<siteId>.js` and `/api/e` → `plausible.io/api/event`, both at `status = 200`, and `BaseLayout` calls `plausible.init({ endpoint: '/api/e' })`. The tracker identifies the site by the **ID in the script filename**, so there is no `data-domain` and `netlify.toml` is the only place the site is named. The proxy paths, the script `src`, and the `endpoint` are one unit — change any alone and events stop arriving silently.
- **GA4 (`G-5W672ZTGX1`) is carried over from the legacy site** so its history stays continuous. It cannot be proxied the same way (gtag hardcodes its collect endpoints), which is why the CSP has explicit exceptions for `googletagmanager.com` (script-src) and `*.google-analytics.com` / `*.analytics.google.com` (connect-src). **Forgetting `connect-src` fails silently** — the script loads, the page looks fine, no data arrives. Remove the tag and those exceptions should go with it.
- Mailchimp needs no CSP exception: the browser only ever talks to `/api/subscribe` on this domain.
- Both analytics tags are gated to the production host in `BaseLayout`, and `context.dev` / `context.deploy-preview` build with `AL_SITE_URL` set plus a blanket-noindex `_headers` file, so preview traffic stays out of the stats and out of search.

## Design handoff

`design_handoff_awesome_labs_homepage/README.md` is the authoritative spec — the "mist + teal" palette, the full type ramp, per-band layout, and final copy. `Awesome Labs Homepage.dc.html` is a **design reference, not production code**: it is inline-styled and carries a custom preview runtime. Read it for intent, structure, and copy; never copy its markup or styles.

Two things about it that are easy to forget:

1. **The responsive strategy is fluid, not breakpoint-based.** Every display size is a `clamp()` and every band self-wraps (`auto-fit, minmax()` grids, `flex-wrap` with `flex-basis`). This build has essentially **no media queries**, and that is deliberate — the handoff documents the breakpoint equivalences only as an alternative. Do not add breakpoints to solve something a clamp or a `minmax` already handles.
2. **Touch targets are a spec requirement, not a default.** Nav links are 44px minimum height; buttons and the email input are 52–56px. The nav links in particular are small text that would otherwise land around 20px.

**The mobile nav diverges from the handoff's original, at the client's request.** Below 720px the header collapses into a full-screen panel behind a hamburger; the handoff's first version had no hamburger and simply wrapped the nav under the logo. That wrapping behaviour survives as the no-JavaScript fallback — the collapse is gated on an `html.js` class set by a blocking inline script in `BaseLayout`, so a visitor without JS gets a working wrapped nav rather than a dead button. The panel spec (720px breakpoint, bar-to-X toggle, full-screen panel with its own footer block) is in the handoff README under **Mobile navigation**.

**The header is sticky above 720px only**, also a client request against the handoff's static header. On phones it stays in flow, and only pins while the menu panel is open. Sticky brought two consequences that are easy to undo by accident: the header needs its own background and bottom inset (or the page scrolls visibly through it and content touches the wordmark), and `:target` needs `scroll-margin-top` or in-page anchors land behind the header.

## Open items

- **The logo is a raster stopgap.** `src/assets/logo-ink.png` came from the old site. It has been cleaned (the original carried a near-transparent dark plate at alpha 5 that rendered as a faint box, and ~25px of dead padding) and trimmed to 264×54, which is why `--spacing-al-logo` is numerically *lower* than the handoff's figure while rendering *larger*. The handoff still asks for the vector original before shipping.
- **Favicons are the legacy set** carried over from the old site. Only 16/32/180 are referenced and there is no maskable Android icon; worth regenerating.
- **Mailchimp env vars are unset.** `/api/subscribe` returns 500 until `MAILCHIMP_API_KEY` and `MAILCHIMP_AUDIENCE_ID` exist in Netlify.
- **No responsive verification has been run** against a real browser at 390 / 834 / 1440. Headless Chrome renders correctly here but does not exit, so it cannot be scripted end to end in this environment.

## Social cards

`public/og/home.png` is the single shared 1200×630 card for every page: wordmark, the studio statement, and a 2×2 collage of the four product shots on the site's paper background. Per-page titles and descriptions still differ — only the image is shared.

It is **generated, not hand-made**, and the generator is not in this repo. It is an HTML file rendered in headless Chrome at 2× and downscaled with Lanczos. Chrome rather than `sharp` for a specific reason worth knowing before trying to regenerate it: the brand faces ship only as `woff2`, and this machine has no fontconfig config file, so neither Pango (`sharp.text`) nor librsvg can set the real type. A browser can, via an inlined `@font-face`. If the card needs to change, rebuild it the same way — the alternative is a card in the wrong typeface.
- **The terms of service is from May 2018** and describes accounts and auto-renewing subscriptions that most current apps do not have. It was ported verbatim — rewriting legal copy is not a developer decision, but it should be flagged to the client.
- **Favicons are the legacy set** carried over from the old site, which has no 16px-optimized or maskable icon. Worth regenerating.

# Handoff: Awesome Labs marketing homepage (direction 3a, mist + teal)

## Overview
A single-page marketing homepage for **Awesome Labs**, a health, wellness + emerging technology studio. The page has five stacked bands: header/nav, a text-forward hero statement, a four-up featured product grid, a "Work with us" consulting pitch, and a mailing-list signup, followed by a footer. It is intentionally text-forward and light-toned. There is no other page in scope.

## About the design files
The files in this bundle are **design references created in HTML** — a prototype showing intended look, copy, and behavior. They are **not production code to copy directly**.

The task is to **recreate this design in the target codebase's existing environment** (React/Next, Vue, Astro, SwiftUI, native, etc.) using its established component patterns, styling solution, and asset pipeline. If no environment exists yet, pick the framework best suited to a marketing page (a static-first framework such as Next.js or Astro is a good default) and implement there.

`Awesome Labs Homepage.dc.html` uses a small custom runtime for live-preview authoring. Ignore the runtime; read it as markup + inline styles. `{{ products }}` is a loop over the product array documented under **Content**.

## Fidelity
**High fidelity.** Colors, typography, spacing, radii, and copy below are final and should be matched. Recreate pixel-accurately using the codebase's own libraries; do not re-style with a different design system.

The one exception: the four product **featured images** are placeholders (striped boxes labeled with what belongs there). Real screenshots will be supplied; build the slots at the documented aspect ratio and treat them as images.

## Responsive strategy (required)
The design must work on desktop, tablet, and mobile. The prototype achieves this **without media queries**, using fluid type and self-wrapping grids. Either keep that approach or convert to breakpoints using the equivalences below.

**Fluid type.** Every display size uses `clamp(min, preferred-vw, max)`. Exact values are in **Typography**. If you prefer breakpoints, use the clamp min at ≤480px, the max at ≥1440px, and interpolate.

**Self-wrapping layout.**

| Band | Rule | Result |
|---|---|---|
| Product grid | `grid-template-columns: repeat(auto-fit, minmax(248px, 1fr))` | 4-up ≥1180px, 3-up ~900–1180px, 2-up ~560–900px, 1-up <560px |
| Work with us | `repeat(auto-fit, minmax(340px, 1fr))` | 2 columns ≥ ~760px, stacked below |
| Mailing list | `flex-wrap` with `flex: 1 1 320px` (copy) and `flex: 1 1 360px` (form) | side by side ≥ ~740px, stacked below |
| Email form | `flex-wrap` with `flex: 1 1 200px` on the input | input + button inline; button drops below the input on narrow phones |
| Header nav | swaps to a hamburger below 720px (see **Mobile navigation**) | inline links ≥721px, hamburger + full-screen panel below |
| Footer | `flex-wrap`, `justify-content: space-between` | link group wraps under the copyright |

**Fluid section padding.** Horizontal: `clamp(20px, 5vw, 56px)`. Vertical padding per band is in **Layout**.

**Touch targets.** Nav links are 44px minimum height; buttons and the email input are 52–56px tall. Preserve these on mobile.

**Max width.** The prototype is full-bleed with no container cap. If the codebase standard is a capped container, cap content at 1440px and keep the colored bands full-bleed.

## Layout

Page background `#f2f7f6`. Bands stack in this order; each spans 100% width.

1. **Header** — flex row, space-between, wraps. Padding `clamp(20px,3.2vw,34px) clamp(20px,5vw,56px) 0`. Logo height `clamp(26px,3.4vw,30px)`, auto width. Nav: 3 text links, gap `clamp(16px,2.4vw,28px)`.
2. **Hero** — centered text. Padding `clamp(52px,9vw,100px) H clamp(56px,7vw,72px)`. H1 `max-width:19ch`, `text-wrap:balance`. Statement paragraph `max-width:32ch`, top margin `clamp(20px,3vw,30px)`.
3. **Products** — padding `0 H clamp(48px,7vw,64px)`. Centered heading block, `max-width:62ch`, bottom margin `clamp(28px,4.5vw,40px)`; paragraph top margin 12px. Grid gap `clamp(16px,2.4vw,24px)`.
4. **Work with us** — background `#1e3f3b`, padding `clamp(52px,8vw,72px) H`, gap `clamp(28px,5vw,56px)`, `align-items:center`. Headline `max-width:18ch`; paragraph `max-width:46ch`; button top margin 28px.
5. **Mailing list** — background `#7fbdb4`, padding `clamp(48px,7vw,64px) H`, gap `clamp(24px,4vw,56px)`. Copy `max-width:40ch`; form `max-width:520px`, internal gap 10px.
6. **Footer** — background `#f2f7f6`, 1px top border `rgba(22,33,31,.12)`, padding `clamp(20px,3vw,26px) H clamp(28px,4vw,40px)`, gap `12px 24px`, link group gap 22px.

## Components

### Product card (×4)
- Anchor, `display:flex; flex-direction:column; gap:14px`.
- Background `#ffffff`; border `1px solid rgba(22,33,31,.1)`; `border-radius:22px`; `overflow:hidden`; padding `0 24px 26px`.
- **Featured image**: first child, `margin:0 -24px` (bleeds to the card edge), `aspect-ratio:4/3`, `object-fit:cover`. Placeholder in the prototype: `repeating-linear-gradient(135deg, rgba(22,33,31,.06) 0 10px, rgba(22,33,31,.02) 10px 20px)` with centered 11px IBM Plex Mono label `rgba(22,33,31,.42)`.
- **App icon**: 60×60, `border-radius:18px`, `margin-top:-46px` (overlaps the image by 46px), `box-shadow:0 6px 20px rgba(0,0,0,.18)`.
- **Name**: Bricolage Grotesque 600, 22px, `letter-spacing:-.02em`.
- **Tag**: 13px Space Grotesk, `#2e6f68`.
- **Blurb**: 15px/1.6, `rgba(22,33,31,.62)`.
- **Hover**: `transform: translateY(-4px)`, `transition: transform .2s`. Whole card is the link target.

### Buttons
- **Start a project →** (on `#1e3f3b`): background `#e8f4f1`, text `#1e3f3b`, 15px Space Grotesk, `min-height:52px`, padding `16px 32px`, `border-radius:999px`, no border. Hover background `#a6d3cb`, `transition: background .2s`.
- **Notify me** (on `#7fbdb4`): background `#0f2320`, text `#f2fbf9`, 15px, `min-height:56px`, padding `16px 28px`, `border-radius:999px`. Hover background `#2e6f68`.

### Email input
`flex:1 1 200px`, `min-height:56px`, background `#f2fbf9`, border `1px solid rgba(15,35,32,.18)`, `border-radius:999px`, padding `16px 22px`, 16px Space Grotesk, text `#0f2320`, placeholder `your@email.com` at `rgba(15,35,32,.45)`, `outline:none`. Needs a visible focus ring in production — use a 2px `#0f2320` outline with 2px offset (the prototype omits it).

### Mobile navigation (≤720px)
Driven by `matchMedia('(max-width: 720px)')`, not CSS, in the prototype — implement with whatever the codebase uses (media query, container query, or a hook), same 720px threshold.

**Toggle button** — 48×48 hit area, right-aligned in the header, `margin-right:-8px` so the bars optically align with the content edge. Three 24×2px bars, `#16211f`, `border-radius:2px`, 5px gap. Open state: top bar `translateY(6px) rotate(45deg)`, middle `opacity:0`, bottom `translateY(-6px) rotate(-45deg)`. Bars transition `transform .28s cubic-bezier(.4,0,.2,1)`; the middle fades `opacity .18s ease`. Button sits at `z-index:60`, above the panel, so it becomes the close affordance. `aria-label="Menu"` + `aria-expanded`.

**Panel** — `position:fixed; inset:0; z-index:50`, opaque `#f2f7f6` (no scrim; it fully replaces the page). Padding `96px 24px 32px`. The header sits at `z-index:60`, so the logo and toggle stay visible above the panel. Column layout, `justify-content:space-between`, with the link list `margin:auto 0` so it centers in the space between header and footer block.
- Links: full-width rows, `padding:22px 4px`, 1px `rgba(22,33,31,.1)` rules top and between, Bricolage 600 at 32px `-.03em`, with a 18px `→` in `#2e6f68` right-aligned. Active/pressed color `#2e6f68`. Rows are ~68px tall, well over the 44px minimum.
- Footer block: the studio line (Bricolage 400, 19px, 60% ink, "+" in accent), a full-width **Start a project →** pill (`min-height:56px`, `#1e3f3b` on `#e8f4f1`), and the copyright at 13px 50% ink.

**Behavior** — animates in with `opacity 0→1` and `translateY(-12px)→0` (`.28s`/`.32s`); closed state keeps it mounted with `pointer-events:none`. Body scroll locks while open. Escape closes. Tapping any link closes the panel and lets the in-page anchor scroll. Crossing the 720px breakpoint force-closes it. In production also trap focus inside the panel and return focus to the toggle on close; respect `prefers-reduced-motion` by dropping the translate.

### Nav links
15px Space Grotesk, `rgba(22,33,31,.7)`, no underline, hover `#2e6f68`, 44px min height. Targets: Products → `#products`, Work with us → `#work`, Say hello → `#contact`.

## Interactions & behavior
- Nav links are in-page anchors; use smooth scroll if the codebase does elsewhere.
- Product cards link to each product's page or App Store listing (URLs TBD from the client).
- Signup form: client-side email validation, then POST to the mailing-list provider. Needs three states not designed yet — **loading** (disable the button, keep its width), **success** (replace the form with a confirmation line in the same 16px body style), **error** (inline message below the field in `#0f2320`). Ask the designer if you want these specced rather than inventing a new visual language.
- Only two motion effects exist: the card hover lift and button background fades, both `.2s`. Respect `prefers-reduced-motion` by dropping the transform.
- No scroll-triggered animation.

## State management
Trivial. One controlled email field plus a submit status enum (`idle | submitting | success | error`). No routing, no data fetching, no global state.

## Design tokens

**Colors** (mist + teal)

| Token | Hex | Use |
|---|---|---|
| paper | `#f2f7f6` | page + footer background |
| card | `#ffffff` | product card background |
| ink | `#16211f` | primary text |
| ink 65% | `rgba(22,33,31,.65)` | nav, secondary body (`.7`/`.62`/`.6` used contextually) |
| ink 55% | `rgba(22,33,31,.55)` | statement lead-in, footer text |
| ink 42% | `rgba(22,33,31,.42)` | image placeholder label |
| ink line | `rgba(22,33,31,.1)` – `.12` | card borders, footer rule |
| accent | `#2e6f68` | "+", product tags, link + nav hover |
| deep | `#1e3f3b` | Work with us background |
| deep ink | `#e8f4f1` | text on deep |
| deep accent | `#a6d3cb` | emphasis on deep, button hover |
| band | `#7fbdb4` | mailing-list background |
| band ink | `#0f2320` | text + button on band |
| band field | `#f2fbf9` | input background, button text |

**Typography** — Bricolage Grotesque (display, Google Fonts, weights 400/600/700) and Space Grotesk (body, 400/500). IBM Plex Mono 400 is only used for the placeholder labels and can be dropped once real images land.

| Element | Family / weight | Size | Line height | Tracking |
|---|---|---|---|---|
| H1 hero | Bricolage 600 | `clamp(38px,6.6vw,76px)` | 1.02 | -.03em |
| Statement | Bricolage 400 | `clamp(21px,3.3vw,38px)` | 1.3 | normal |
| H2 section | Bricolage 600 | `clamp(28px,4vw,42px)` | 1.1 | -.03em / -.02em on the signup H2 |
| H2 work with us | Bricolage 600 | `clamp(32px,4.6vw,52px)` | 1.05 | -.03em |
| Card name | Bricolage 600 | 22px | 1.2 | -.02em |
| Lead paragraph | Space Grotesk 400 | `clamp(16px,2.1vw,19px)` | 1.6 | normal |
| Body / support | Space Grotesk 400 | `clamp(15px,1.9vw,17px)` | 1.6 | normal |
| Card blurb | Space Grotesk 400 | 15px | 1.6 | normal |
| Card tag | Space Grotesk 400 | 13px | 1.2 | normal |
| Footer | Space Grotesk 400 | 13px | 1.2 | normal |

`text-wrap: balance` on the H1 and signup H2; `text-wrap: pretty` on the Work with us H2.

**Spacing** — 10, 12, 14, 22, 26, 28 fixed; section rhythm is fluid via the clamps above.
**Radii** — 999px (buttons, input), 22px (card), 18px (app icon).
**Shadows** — only `0 6px 20px rgba(0,0,0,.18)` on the app icon.

## Content

Hero H1: "Hi, we're Awesome Labs. A health, wellness + emerging technology studio."
Statement: "From data-driven wellness to blockchain technologies, we conceive, build, and launch things that make people healthier and happier." (lead-in at 55% ink; "we conceive…" at full ink; "healthier and happier." in `#2e6f68`)
Products heading: "Some of our products" / "Four apps we conceived, designed, built, and shipped ourselves. Together they have been used by hundreds of thousands of people."
Work with us: "Work with us. Our apps reach hundreds of thousands of people, and yours could be next." ("yours could be next." in `#a6d3cb`) / "We take on a small number of client engagements each year: mobile, AI, and onchain projects, taken from first sketch to launch by the same team that builds our own." / CTA "Start a project →"
Mailing list: "Something new is coming." / "Subscribe and be the first to get early access." / CTA "Notify me"
Footer: "© 2026 Awesome Labs, LLC" · Team · Contact · Privacy

Products, in order:

1. **SuppTrack** — Smart supplement tracking — "A better way to manage your supplement routine. Organize, track, and optimize your intake, powered by AI and the world's largest supplement database."
2. **Awesome Breathing** — Guided breath pacer — "A simple, elegant tool to guide and visualize your breathing. For meditation, relaxation, or a few moments of calm in your day."
3. **PepCalc** — Peptide calculator app — "Determines how many IUs or tick marks to measure in an insulin syringe of any size after reconstitution of research peptides."
4. **token.art** — Multi-chain NFT viewer — "Aggregate, browse, and showcase your blockchain-based NFTs and digital collectibles. Made for collectors, by collectors, and 100% free."

Copy note: the client explicitly does not want em dashes in body copy. Keep colons and periods as written.

## Assets
In `assets/`, all extracted from the existing Awesome Labs homepage:

- `logo-ink.png` — wordmark recolored dark for light backgrounds, with the multicolor star preserved. Used in the header at 30px tall. **Request the vector original** before shipping; this raster is a stopgap.
- `logo-white.png` — same wordmark for dark backgrounds. Not used in this design; included for convenience.
- `supptrack.png`, `breathing.png`, `pepcalc.png`, `tokenart.png` — app icons, ~162×162, rendered at 60×60.
- Product featured images do not exist yet. Four are needed at 4:3, minimum 800×600, cropped safely (the app icon overlaps the bottom-left 60px).

## Screenshots
`screenshots/` holds reference captures of the live design at three widths. They are viewport crops, not full pages — open the HTML for the complete scroll.

- `desktop-1440-top.png`, `desktop-1440-work-signup.png` — 4-up product grid, two-column Work with us, side-by-side signup.
- `tablet-834-top.png`, `tablet-834-work-signup.png` — 3-up grid, Work with us still two columns at this width.
- `mobile-390-top.png`, `mobile-390-menu-open.png`, `mobile-390-products.png`, `mobile-390-work-signup.png` — hamburger header, the expanded menu panel, single-column cards, stacked Work with us and signup.

## Files
- `Awesome Labs Homepage.dc.html` — the design reference (this direction, mist + teal palette, Bricolage + Space Grotesk).
- `assets/` — logo and app icons listed above.
- `screenshots/` — reference captures at 1440 / 834 / 390 px.

Open the HTML in a browser and resize the window to see the responsive behavior described above.

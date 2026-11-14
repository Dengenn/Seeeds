# seeeds — brand identity (v11)

seeeds is a clothing and lifestyle brand. It exists so people remember the freedom fighters who ended racism and gave Black people a place to call home and feel accepted. Purpose: everyone can wear their freedom.

- Motto: "they buried us, but little did they know we were seeeds"
- Tagline: "wear your freedom"
- Name is always lowercase with three e's: **seeeds**

## Non-negotiable rules

1. **No green. Anywhere.** Not in the palette, backgrounds, gradients, shadows, hover states or icons. This includes the ☘️ emoji, which renders green on every platform; write "shamrock" instead.
2. Everything must feel rich, luxurious, clean and expensive. Benchmarks: Apple, Nike, Adidas, Puma, Crocs and luxury car marques. Generous spacing, restraint, no clutter.
3. Verify before calling anything done: render it, check every color, check mobile widths, and fix what you find.
4. Use only the approved assets in `assets/`. Do not redraw, restyle or add effects to the mark or wordmark.

## Palette (v9 — complete, nothing else)

Monochrome first. Pink is the splash. Rose gold is the broken chain. Each colour carries part of the story.

| Name | Hex | Meaning / use |
|---|---|---|
| Soil | `#0A0A0A` | Where they buried us. Primary ground. |
| Graphite | `#1C1B19` | Secondary dark. |
| Iron | `#3B3A38` | The chain before it broke. Iron-grey prints. |
| Bone | `#F7F5F0` | The record, printed plainly. Primary light. |
| Bloom pink | `#E8357E` | What breaks through. Splashes, accents, joy. Large text only on Bone (3.4:1). |
| Blush | `#F3BFD2` | Soft pink garments and hover states. |
| Rose gold | `#B8957C` | Iron chains recast. Mark face, chains, foil. Sampled from `../Images/inspo.jpg`. |
| Polished rose gold | `#C9A68C` | Logo rim only. |

Rose-gold ramp used in gradients: `#FBEFE4 #F3DFCB #E6CBB4 #D4B396 #C29F86 #B8957C #B38C72 #9E7B65 #8C6C59 #7D6050 #7A5D4D`.
Warm-black glow: `radial-gradient(#2A201C, #0A0A0A)`. The v8 yellow-gold files are kept in `assets/_v8-yellow-gold/`.

## Design rules for the site (v11 — client feedback, 14 Nov 2026)

- Light mode, simple, Nike/Adidas-style structure. Pink is the only loud colour.
- **Navbar is gold** (rose-gold gradient). Shamrock mark sits at the far left before the nav links; no wordmark in the main nav. Cart shows "Harvest" plus a cart icon with a count badge.
- Bars: utility bar on top is **white**; main nav is gold; the promo bar under it is **black**.
- Navigation: utility bar (Our Story, Help dropdown, Join Us, Sign In) + mega menus for New & Featured, Men, Women, Kids, Collections (data in `SEEEDS.nav`). Search overlay, favourites (heart) and sign-in/join modal (front-end only).
- All dropdowns are custom-styled (`.dd`). Never use native `<select>`.
- Hero (Nike-style): full-bleed `assets/photos/hero-trio.jpg` below the header, evenly darkened. Two balanced columns, both vertically centred on the same line: left (centred in its half) = large white Anton uppercase "They buried us." ("us." pink), then "But little did they know we were" in Pacifico (the wordmark's script); right (centred in its half, `.hero-shift`) = the large ivory wordmark, the line "Never forget your race… seeeds, wear your freedom." (pink rule, "wear your freedom." bold pink), then the Shop Now (white pill) and Our Story (outline) buttons.
- Campaign/ad block (Nike "Featured" style) after New in: `assets/video/hero-video.mp4` contained to the page width, square corners (muted, autoplay, loop, no play/pause control), with Explore (outline) and Shop the Bloom (white) buttons overlaid bottom-right; then centred label, big Anton headline and text.
- Collections on home: hang on a black rail with hangers; flat photos (no convex effect, the client rejected it); on hover the tile tilts and the pink splash-01 shows behind.
- Product images: background-free cut-outs in `assets/products/*.webp`, shown on a very light grey panel (#F5F5F5). Product page gallery is compact (max 520px) with rounded-square thumbnails that swap the main image on hover/click.
- Footer: black top section, white bottom bar.
- Font: Poppins (400/500/600) for all body, UI and section headings; Anton (uppercase) for the hero and campaign headlines; Pacifico for the hero sub-line only. No "our colours" section anywhere.
- No sliding or marquee animations; fades and hover states only.
- Favicon: `mark-gold.svg`.
- Cart is **the harvest**; add-to-cart is **plant**; checkout is **hold to break the chain**.
- Every product honours a named freedom fighter or event with a date (`honours` in `js/data.js`). Keep these facts accurate.
- Avoid demo photos that show other brands' logos.

## The mark

Shamrock: three heart-shaped leaves meeting at the center, short curved stem. No inner lines, no sparkle, no highlights inside the shape. The only detail is a thin polished gold rim on the outer edge.

| File | Use |
|---|---|
| `assets/mark-gold.svg` | Hero. Satin gold face, polished rim. Dark grounds. |
| `assets/mark-black-gold-rim.svg` | Black enamel in gold rim. Light grounds. |
| `assets/mark-ivory-gold-rim.svg` | Ivory in gold rim. Dark grounds, softer option. |
| `assets/mark-foil-flat.svg` | Flat gold, no rim. Foil stamping, embroidery, debossing. |
| `assets/mark-black.svg` / `mark-white.svg` | One-color, no rim. Single-ink printing. |

## Wordmark and type

- Wordmark: Pacifico, converted to outlines (`assets/wordmark-black.svg`, `-ivory.svg`, `-gold.svg`). Never set "seeeds" in live text as a logo.
- Site type: Poppins (see design rules).

## Lockups

Stacked (mark, wordmark, tagline), horizontal (mark left of wordmark), mark only, and the circular motto emblem. All shown in `brand.html`.

## Files

- `index.html` home · `shop.html` (params `g=men|women|kids`, `t=tops|jackets|pants|shoes|hats|bags|jewellery|clothing|accessories`, `c=<collection>`, `a=big|little|baby`, `new=1`) · `product.html?id=…` · `favourites.html` · `story.html` (about) · `harvest.html` (cart).
- `brand.html` — the identity sheet (formerly `index.html`). Its `mark()` function is the source of truth for how the mark is built.
- `css/seeeds.css` — design system. `js/data.js` — products and roll call. `js/app.js` — header, footer, harvest (localStorage), page behaviour.
- Legal: `privacy.html` (Privacy Policy) and `privacy-rights.html` (rights + request form + Do-not-sell toggle). Cookie banner and Cookie Settings modal (necessary / functional / analytics / marketing) stored in localStorage `seeeds.consent.v1`; `window.seeedsConsent` and the `seeeds:consent` event tell future scripts what's allowed. Footer bottom links: Privacy Policy, Cookie Settings, Your Privacy Rights. Highlighted `[placeholders]` (company name, address, privacy email) must be filled in and the text reviewed by a lawyer before launch.
- Product page zoom: opens ONLY via the magnifier button or double-click / double-tap on the image (no hover zoom, single click does nothing). Fullscreen viewer: (click or double-tap to zoom, drag to pan, pinch, mouse wheel, +/- buttons, arrow keys between images, Esc to close).
- Checkout is a front-end preview only. Connect Shopify, Stripe or similar before taking payments.
- `assets/` — logo SVGs; `assets/photos/` demo photography ; `assets/products/` product cut-outs; `assets/splash/` CC0 splash SVGs (splash.png was removed at the client's request).

## Legal note

The shamrock is strongly associated with Ireland. Confirm name, domain and trademark availability with a registered attorney before filing or printing at scale.

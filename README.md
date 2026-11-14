# seeeds

> They buried us, but little did they know we were seeeds.

seeeds is a clothing brand that carries the names of the people who fought for our freedom. **Wear your freedom.**

This is the brand's storefront prototype: a static site (HTML, CSS, vanilla JS) with no build step.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
```

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| Shop (filters: `?g=men`, `?t=shoes`, `?c=bloom`, …) | `shop.html` |
| Product (with zoom) | `product.html?id=…` |
| Favourites | `favourites.html` |
| Harvest (cart) | `harvest.html` |
| Our Story | `story.html` |
| Privacy Policy / Your Privacy Rights | `privacy.html`, `privacy-rights.html` |
| Brand identity sheet | `brand.html` |

## Before launch

- Replace demo product photography (Unsplash, see `assets/photos/CREDITS.md` and `assets/products/CREDITS.md`).
- Connect checkout, accounts and forms to real services (currently front-end previews).
- Fill in the highlighted placeholders in the privacy pages and have them legally reviewed.
- Confirm trademark availability for the name and shamrock mark.

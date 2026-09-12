# Tests

Two layers, both safe to run locally. Neither is needed to publish the site.

## Unit and build checks

```sh
npm run check    # types and Astro diagnostics
npm run build    # production build into dist/
npm test         # node --test: routes, links, images, deployment paths
```

Run these after any content or configuration change.

## Browser checks

```sh
npm run test:browser
```

Playwright builds the site, serves it with `astro preview`, and verifies the interactions that unit tests cannot reach:

- the two desktop columns scroll independently
- both project panels can stay open at once, and a shared `?left=` / `right=` link opens its panel directly
- closing a panel returns focus and scroll position to the link that opened it
- browser back/forward and the Escape key restore earlier states
- on a phone, the group switch works and the detail panel fills the screen
- with JavaScript disabled, project links still open their own pages
- with reduced motion preferred, panels open and close instantly

Run these whenever you change `src/scripts/gallery.ts`, the gallery markup, or the layout CSS. The first run downloads a Chromium browser if one is not cached (`npx playwright install chromium`).

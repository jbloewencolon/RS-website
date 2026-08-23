# Self-hosted faces for the room

Three families, all SIL Open Font License 1.1 (`OFL.txt`, one copy — the
licence text is identical for all three; the per-family copyright lines
are below). Subsetted `woff2` as served by Google Fonts, fetched once and
committed; nothing here is loaded from a third party at runtime.

| File | Family | Style | Subset |
|---|---|---|---|
| `archivo-black-400-latin.woff2` | Archivo Black | 400 | latin |
| `caveat-latin.woff2` | Caveat (variable, 500–700) | 500–700 | latin |
| `caveat-latin-ext.woff2` | Caveat (variable, 500–700) | 500–700 | latin-ext |
| `courier-prime-400-latin.woff2` | Courier Prime | 400 | latin |
| `courier-prime-400-latin-ext.woff2` | Courier Prime | 400 | latin-ext |
| `courier-prime-400-italic-latin.woff2` | Courier Prime | 400 italic | latin |
| `courier-prime-400-italic-latin-ext.woff2` | Courier Prime | 400 italic | latin-ext |
| `courier-prime-700-latin.woff2` | Courier Prime | 700 | latin |
| `courier-prime-700-latin-ext.woff2` | Courier Prime | 700 | latin-ext |

Copyright 2017 The Archivo Black Project Authors (https://github.com/Omnibus-Type/ArchivoBlack)
Copyright 2014 The Caveat Project Authors (https://github.com/googlefonts/caveat)
Copyright 2015 The Courier Prime Project Authors (https://github.com/quoteunquoteapps/CourierPrime)

## Why these are in the repository

The reference design (`docs/Hot Honest and Ours.dc.html`) links
`fonts.googleapis.com`. This route cannot: its CSP is `default-src
'none'` with `style-src 'self'` and `font-src 'self'`, and
`scripts/check-origins.mjs` fails the build on any off-origin
subresource. More to the point, a page whose entire premise is that it
makes no network request once loaded cannot announce every visit to a
third party. Self-hosting is what lets the reference's typography ship
without giving that up.

This reverses **R-22** in `docs/spec/hot-honest-ours.md` §12.3, which
ruled webfonts out. See that section for the reversal note.

Archivo Black ships latin only — every word set in it is house copy and
ASCII. Courier Prime and Caveat carry what the reader writes, so both
also ship `latin-ext`.

## Refreshing them

There is no build step. Re-fetch by hand from the Google Fonts CSS API
(`https://fonts.googleapis.com/css2?family=Archivo+Black&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Caveat:wght@500;700&display=swap`
with a modern browser UA), take the `latin` and `latin-ext` `woff2` URLs,
and keep the `unicode-range` values in `../style.css` in step with the
ones the API returns.

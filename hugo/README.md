# Hugo build (RS-004)

This directory is the source for the site's static reading pages:
`Manifesto`, `Invitation`, `Learn`, `Archive`, `BehindTheScenes`, and
`Resources`. It reads the data in `data/` and writes plain HTML to
`public/`, which `../scripts/build-hugo.mjs` then copies over the
matching file at the repo root. **The copied file at the repo root is
what ships** — nobody reading the site ever runs Hugo, and `hugo/`
itself is not part of the deployed site (see
`docs/spec/decision-record-d1-d15.md` D2).

`Home.dc.html`, `Practise.dc.html`, and `Contribute.dc.html` are
deliberately **not** migrated here — each carries live interactive
logic (a form, a stateful tool) via the `dc-runtime` that Hugo's
static output can't hold. See `../docs/copy-editing-guide.md` for the
full map of which page's copy lives where.

## Editing content

Don't hand-edit the generated `Manifesto.dc.html` (etc.) at the repo
root — edit the layout or data file here and regenerate, or the next
regeneration silently overwrites your change. `npm run check` will
catch drift between the two (a "Hugo output out of sync" failure) but
won't tell you which side was the intended edit.

## Building

```
npm run build:hugo
```

Requires the `hugo` binary on `PATH`.

## Installing Hugo

**Pinned version: v0.164.0** (current stable as of 2026-08-07, verified
against both `github.com/gohugoio/hugo/releases` and `gohugo.io`'s own
installation page — see `completed.tasks.md` RS-004 for how). Hugo
ships as a single static Go binary with no dependency tree, which is
why D2 recommends it over a JS-based generator — nothing here needs
`node_modules`.

Any of these installs the exact pinned version:

- **Go toolchain** (what this project's own setup used): `go install github.com/gohugoio/hugo@v0.164.0`, then put the resulting binary (`$GOBIN/hugo` or `$(go env GOPATH)/bin/hugo`) on `PATH`.
- **Prebuilt binary**: download `hugo_0.164.0_<platform>.tar.gz` (or `.deb`/`.pkg` for Linux/macOS) from the project's GitHub releases and place `hugo` on `PATH`.
- Do **not** use a distro package manager's `hugo` package for this project — Ubuntu's `apt`, for one, currently lags several major versions behind (0.123.7 at the time of writing) and Hugo's template/data-file behavior has changed enough across that gap that output is not guaranteed to match.

The standard (non-"extended") build is sufficient — nothing here uses Hugo's Sass/SCSS pipeline.

# Albion Crafting Calculator

A free, browser-only crafting calculator for **Albion Online**, with a landing page in front of it.

## What's in the repo

| File | Purpose |
| --- | --- |
| `index.html` | Landing page: hero, feature overview, calls to action |
| `calculator.html` | The calculator app itself — one self-contained file |
| `favicon.svg` | Site icon (browsers and tabs) |
| `404.html` | Styled "page not found" page |

`index.html` is the entry point; nothing else needs a build step.

## Stack

Plain HTML, CSS and JavaScript with no framework, no bundler and no runtime dependencies. The only external request is the Inter webfont from Google Fonts. All application state lives in the visitor's browser via `localStorage`.

## Hosting

The site is pure static files, so any free static host works — GitHub Pages is deliberately not used. The recommended host is **Vercel Hobby**, which is free forever for personal, non-commercial projects:

1. Import this repository at [vercel.com/new](https://vercel.com/new).
2. Framework preset: **Other**. Build command: none. Output directory: repository root.
3. Every push to `main` then deploys automatically; pull requests get their own preview URL.

Cloudflare Pages and Netlify work the same way with identical settings (`/` as the publish directory, no build step), so the site stays portable.

## Data privacy

The calculator saves planner sessions, prices and settings in the visitor's browser using `localStorage`. There is no account system, backend or shared database: visitors cannot read one another's data.

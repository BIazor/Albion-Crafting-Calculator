# Albion Crafting Calculator

A free, browser-only crafting calculator for **Albion Online**, with a landing page in front of it.

Live at <https://albioncrafting.vercel.app/>:

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

The site is live at <https://albioncrafting.vercel.app/> on Vercel's free Hobby plan, and it is deployed straight from this repository: every push to `main` runs `.github/workflows/vercel.yml`, which publishes the repository root to the `albioncrafting` project.

The workflow needs one repository secret, `VERCEL_TOKEN` (create it at <https://vercel.com/account/tokens> and paste it under Settings &rarr; Secrets and variables &rarr; Actions). The Vercel team and project IDs are already pinned in the workflow file, so no other configuration is needed. Until the secret exists the deploy step is skipped with a notice instead of failing.

The site is pure static files, so the host is not a lock-in: Cloudflare Pages or Netlify would serve the same repository with no build step.

GitHub Pages is no longer used by this project.

## Data privacy

The calculator saves planner sessions, prices and settings in the visitor's browser using `localStorage`. There is no account system, backend or shared database: visitors cannot read one another's data.

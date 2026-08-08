# Building a Production Calibration System

A Slidev presentation prepared for a 30-minute Senior Computer Vision Engineer
technical panel interview. The main talk is paced for approximately 24–25
minutes, leaving time for questions.

## Install

Requires Node.js 20.12 or newer.

```sh
bun install
```

`npm install` also works if npm is your preferred package manager.

All presentation assets and fonts are local or system-provided. After the
dependencies are installed, the presentation does not fetch runtime assets from
the internet.

## Run locally

```sh
bun run dev
```

Use the arrow keys or spacebar to navigate. Press `o` for the slide overview and
`f` for fullscreen.

## Presenter mode

Start the presentation, then open the presenter view from Slidev's navigation
menu or visit:

```text
http://localhost:3030/presenter/
```

Speaker notes and the next-slide preview are available in presenter mode.

## Build static output

```sh
bun run build
```

The static presentation is written to `dist/`.

To build every public presentation registered by the parent website, run this
from the repository root:

```sh
bun run scripts/build-presentations.ts
```

The shared builder reads `content/slides/presentations.json`, writes each deck to its configured
route under the Hugo site's `public/slides/` directory, and excludes speaker
notes unless explicitly enabled. The GitHub Pages workflow runs it automatically
after building Hugo. This source project lives under `content/slides/`, outside
the active Hugo language content directory, so Hugo does not treat `slides.md`
as a website article.

## Export to PDF

The Playwright Chromium dependency is installed with the project. Export the
deck with:

```sh
bun run export
```

The output is `snap-calibration-presentation.pdf`. Review the PDF before the
onsite because incremental reveals are flattened for export.

## Edit the presentation

- Edit slide copy, order, and speaker notes in `slides.md`.
- Edit reusable diagrams in `components/`.
- Edit colors, typography, spacing, and component styling in `styles/index.css`.
- Add screenshots or other local media to `public/assets/`, then reference them
  as `/assets/filename.png`.

The factory-calibration slide contains a commented screenshot placeholder that
can be enabled after adding a Qt tooling screenshot.

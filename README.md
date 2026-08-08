# bobblelaw.github.io

Personal website built with Hugo and the `hugo-profile` theme.

## Development

The site requires Hugo Extended 0.164.0 or newer.

```sh
hugo server
```

Run the same strict production build used in CI with:

```sh
hugo --gc --minify --panicOnWarning --printPathWarnings
```

Site configuration is split by concern under `config/_default/`. Theme-specific
template customizations belong in the root `layouts/` directory so that the
`themes/hugo-profile` submodule can be updated independently.

## Presentations

Interactive Slidev decks are registered in `content/slides/presentations.json` and published
under `/slides/<route>/`. To add another deck:

1. Create a self-contained Slidev directory under `content/slides/` with
   `slides.md`, `package.json`, and a lockfile.
2. Add its directory and URL route to `content/slides/presentations.json`.
3. Add its title, summary, and link to `content/en-US/posts/presentations.md`.
4. Run `bun run scripts/build-presentations.ts --install`, then build Hugo and
   run `bun run scripts/build-presentations.ts`.

Routes must be unique lowercase slugs. Speaker notes are excluded by default;
set `includeNotes` to `true` only when notes are intentionally public.

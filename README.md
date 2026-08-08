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

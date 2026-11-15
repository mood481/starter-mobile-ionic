# @mood481/starter-mobile-ionic

Minimal reusable Ionic Angular + Capacitor starter built with `@mood481/starter-toolkit`.

## Baseline

- Ionic Angular 9.0.11, Angular 21.2.x, Capacitor 8.6.x, TypeScript 5.9.x.
- Angular standalone bootstrap, router, one neutral home page.
- Shared `template/`, mode overlays for `standalone` and `module`.
- No application-specific backend, styling system, extra libraries, test suite, or CI/CD.
- Standalone uses npm from Node, without an npm version pin.
- Module expects an existing Nx/pnpm workspace; no root mutations.
- Capacitor `appId` and `appName` are explicit render placeholders.

## Source layout

```text
template/                       shared Angular/Ionic source and configuration
modes/standalone/overlay/       standalone editor/ignore/Node files
modes/module/overlay/           Nx project metadata and module README
docs/examples/                 sample render requests
```

`package.json` inside `template/` has **no package manager pin**: the authoring
repository itself continues to use pnpm, whereas a generated standalone app
uses npm and a module uses its workspace package manager.

## Local acceptance (no tests yet)

```bash
pnpm install
pnpm validate
pnpm exec starter-render --input docs/examples/render.example.yaml
cd rendered
npm install
npm run typecheck
npm run build
npm run start
```

For module rendering, first create a compatible Nx/pnpm workspace under
`workspace/`. Then run:

```bash
pnpm exec starter-render --input docs/examples/render.module.example.yaml
```

The module output is confined to `workspace/apps/mobile`. It does not update the
root's pnpm workspace configuration or lockfile. See `docs/local-smoke.md` for
both commands and validation limits.

This initial extraction uses the neutral Angular standalone architecture of
`mood481/azarazam` as reference, not its product code. Tests, standard tooling,
and Angular 22 are deliberately deferred until the local baseline is verified.

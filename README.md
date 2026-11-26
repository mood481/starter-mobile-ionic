# @mood481/starter-mobile-ionic

Minimal reusable Ionic Angular + Capacitor starter built with `@mood481/starter-toolkit`.

## Baseline

- Ionic Angular 9.0.11, Angular 22.2.x, Capacitor 8.6.x, TypeScript 6.0.x.
- Angular standalone bootstrap, router, one neutral home page.
- Shared `template/`, mode overlays for `standalone` and `module`.
- No application-specific backend, styling system, or CI/CD.
- Standalone uses npm from Node, without an npm version pin.
- Module expects an existing Nx/pnpm workspace; no root mutations.
- Capacitor `appId` and `appName` are explicit render placeholders.
- Android and iOS (SPM) projects are included, with fixed Capacitor 8 dependencies.
- Build web assets and run `sync:android` or `sync:ios` before native builds.
- Android uses a fixed initial Java namespace, `starter.mood481.studio`; the consumer README documents how to rename it.
- Capacitor app, browser, device, haptics, keyboard, network and splash-screen plugins are included.

## Source layout

```text
template/                       shared Angular/Ionic source, configuration and native projects
modes/standalone/overlay/       standalone editor/ignore/Node files
modes/module/overlay/           Nx project metadata and module README
docs/examples/                 sample render requests
```

`package.json` inside `template/` has **no package manager pin**: the authoring
repository itself continues to use pnpm, whereas a generated standalone app
uses npm and a module uses its workspace package manager.

## Test baseline

The consumer template provides a typed `StorageService` backed by browser
`localStorage` with an injectable adapter, a minimal global error handler,
Angular/Vitest unit tests, and Playwright web E2E tests (Chromium).
Tests live in `template/test/unit` and `template/test/e2e`. Module mode
adds Nx `test` and `e2e` targets without changing the host configuration.

## Local acceptance

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
root's pnpm workspace configuration or lockfile. The receiving workspace must manage its own dependency installation and pnpm `allowBuilds`.

This initial extraction uses the neutral Angular standalone architecture of
`mood481/azarazam` as reference, not its product code. Native platform tests and CI/CD configuration are deliberately separate from the web test baseline.

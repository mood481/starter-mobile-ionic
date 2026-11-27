# @mood481/starter-mobile-ionic

Minimal reusable Ionic Angular + Capacitor starter built with `@mood481/starter-toolkit`.

## Baseline

- Ionic Angular 9.0.11, Angular 22.2.x, Capacitor 8.6.x, TypeScript 6.0.x.
- Angular standalone bootstrap, lazy routing, minimal home and example pages.
- Shared `template/`, mode overlays for `standalone` and `module`.
- No application-specific backend or styling system; optional consumer Codemagic templates are included.
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

## Consumer distribution templates

Codemagic workflows are provided for standalone (root `codemagic.yaml`) and
module (`codemagic/codemagic.yaml` for manual integration at workspace root).
They cover configurable beta store distribution, tag-triggered release validation
and a separate manually authorized release upload; see
`template/docs/operations/codemagic.md` for credentials, safety constraints, and setup.

## Authoring standards

The **starter authoring repository** installs `@mood481/dev-standards@0.5.2`
as a development dependency, with `simple-devel`, `quality`, `ts-js`, `angular` and `ionic-capacitor`. `pnpm validate` checks both the starter manifest and installed
standards; `pnpm standards:check` checks the standards alone. Consult
`docs/manifest.json` and its applicable rules, guides and local context before
making changes. The optional `AGENTS.md` entrypoint is intentionally absent.

The local criteria for permitted base classes and inheritance are recorded in
`docs/adrs/base-class-inheritance.md`. The generated app receives a consumer-
neutral copy of this ADR, alongside the three technology guides and Codemagic
operations. Standalone additionally receives an independent `docs/manifest.json`
with materialized rules and guides. Module mode has no separate standards
manifest or package dependency; the host workspace owns that policy.

## Documentation distribution

The shared `template/docs/` holds the three technology guides and two
consumer-owned documents for both modes. Standalone adds `docs/manifest.json`
and `simple-devel`/`quality` from its overlay; module adds neither. No
consumer depends on `@mood481/dev-standards` for install/build. Standalone
can run its CLI on demand through `npx` or `pnpm dlx` when registry access is
available. Managed guides should be refreshed from the author's installed
`dev-standards` version; do not hand-edit them.

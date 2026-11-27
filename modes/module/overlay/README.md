# __PROJECT_NAME__

__PROJECT_DESCRIPTION__

Ionic 9 + Angular 22 + Capacitor 8 module generated in an existing workspace.

This output is deliberately confined to its module directory. Rendering does
not update the workspace's package manager, lockfile, root manifest or Nx setup.

The host is expected to be compatible with Nx and pnpm, to include the module
in `pnpm-workspace.yaml`, and to install dependencies at the workspace root.
Use `pnpm --dir apps/mobile run build` (adjust the module path as needed), or
an Nx target when the host discovers this project.

## Native projects

Android and iOS (Swift Package Manager) are included. Do not run `cap add`.
After installing dependencies, build the web assets and sync the target platform:

```bash
pnpm run build
pnpm run sync:android
pnpm run sync:ios        # macOS with Xcode
pnpm run cap:doctor
pnpm run open:android    # Android Studio
pnpm run open:ios        # macOS with Xcode
```

Use `pnpm run sync` when both native toolchains are available; use
`pnpm run start:android` or `pnpm run start:ios` to launch on a device or emulator.
For module mode, use the equivalent `pnpm run` commands from the module directory.
Build and sync again after web or plugin changes. The web output is `www`.
Generated web copies, Capacitor runtime configuration and Cordova compatibility
projects are intentionally not tracked; sync restores them before native builds.

The included Capacitor plugins are app, browser, device, haptics, keyboard,
network and splash-screen. Keyboard uses default configuration. SystemBars is
available from Capacitor core. Use `pnpm run assets` after
adding your own source artwork in `assets/`; neutral native resources are included.

Capacitor identity:

- App ID: `__CAPACITOR_APP_ID__` (Android applicationId and iOS bundle identifier).
- App name: `__CAPACITOR_APP_NAME__`.

The Android Java namespace initially uses `starter.mood481.studio`, independently
of the application ID. The consumer should rename it to their own namespace:
change `namespace` in `android/app/build.gradle`, move the Java package directories
under `src/main/java`, `src/test/java` and `src/androidTest/java`, and update their
`package` declarations. The manifest uses `.MainActivity` relative to the Gradle
namespace; the FileProvider authority uses the application ID. Keep these identities
consistent when refactoring and sync before building.

The shared Angular template includes localization (Transloco), contextual
logging, global error handling, typed JSON browser storage, feedback and
connectivity services, and an example screen. No backend or authentication is
installed.

## Tests

After installing workspace dependencies, run `pnpm run test:unit` for Vitest.
For Playwright, install Chromium once with `pnpm exec playwright install chromium`
and run `pnpm run test:e2e`. Run `pnpm run test:release` to check
release-tag policy. Nx targets `test` and `e2e` are also included.
All tests and configuration are contained in this module; the host's root
configuration is not changed.

## Module documentation and standards

This module includes copies of `docs/guides/ts-js` (file:
`docs/guides/typescript-javascript.md`), `angular` and `ionic-capacitor`,
plus the local `docs/adrs/base-class-inheritance.md` and
`docs/operations/codemagic.md`.

These are module-scoped references, **not** an independent installation of
`dev-standards`: no `docs/manifest.json`, package dependency, or
`AGENTS.md` is added. The host workspace's canonical standards, ADRs and
operations take precedence when they disagree. Integrating or updating these
copies within the host's own standards manifest is an explicit host decision.
Do not invoke `dev-standards check/update` against the module directory.

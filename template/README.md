# __PROJECT_NAME__

__PROJECT_DESCRIPTION__

Minimal Ionic 9 + Angular 22 + Capacitor 8 application. The same sources support
standalone and module rendering; the selected overlay provides mode-specific files.

## Local development

With dependencies installed by your workspace package manager:

```bash
npm run start
npm run typecheck
npm run build
```

For a standalone output, use a Node.js version compatible with Angular (24.15+ for Angular 22) and `npm install`. No npm version
is pinned; npm is the version shipped with the selected Node installation.
For a module inside a pnpm workspace, run the equivalent scripts through pnpm.

## Native projects

Android and iOS (Swift Package Manager) are included. Do not run `cap add`.
After installing dependencies, build the web assets and sync the target platform:

```bash
npm run build
npm run sync:android
npm run sync:ios        # macOS with Xcode
npm run cap:doctor
npm run open:android    # Android Studio
npm run open:ios        # macOS with Xcode
```

Use `npm run sync` when both native toolchains are available; use
`npm run start:android` or `npm run start:ios` to launch on a device or emulator.
For module mode, use the equivalent `pnpm run` commands from the module directory.
Build and sync again after web or plugin changes. The web output is `www`.
Generated web copies, Capacitor runtime configuration and Cordova compatibility
projects are intentionally not tracked; sync restores them before native builds.

The included Capacitor plugins are app, browser, device, haptics, keyboard,
network and splash-screen. Keyboard uses default configuration. SystemBars is
available from Capacitor core. Use `npm run assets` (or `pnpm run assets`) after
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

The Angular foundation includes lazy routes, contextual logging, a plain optional
BaseMain class, app constants, a connectivity signal service, Ionic feedback
helpers, empty/loading states and Transloco dictionaries in Spanish and English.
Change defaults and add translations in `src/app/app.constants.ts` and
`src/assets/i18n/`. These translations are copied into `www/assets/i18n/` on build.

The `examples` page demonstrates these utilities; replace or remove it when
building a product. The foundation does not add advertising tracking, third-party error reporting,
backend APIs or authentication. Codemagic templates are included; see below.

## Error handling and storage

`GlobalErrorHandler` logs unexpected Angular/browser errors through the contextual
logger; it does not send telemetry or display user-facing notifications. Handle
recoverable failures in the feature that owns them.

`StorageService` serializes JSON and exposes asynchronous `get<T>`, `set<T>`,
and `remove` methods. The default `STORAGE_ADAPTER` uses browser
`localStorage`; override the injection token with an adapter implementing
`StorageAdapter` to use Capacitor Preferences or another backend. The generic
type is not a runtime schema validator. Missing keys resolve to `null`;
malformed JSON and inaccessible storage raise errors.

## Tests

Unit tests are run by Angular's Vitest builder. The Playwright suite starts
the web server automatically and uses Chromium.

```bash
npm run test:unit
npm run test:unit:watch
npx playwright install chromium
npm run test:e2e
npm run test:e2e:ui
```

Tests live under `test/unit` and `test/e2e`. The web E2E suite does not
test native Capacitor behavior, signing or app-store distribution. Run
`npm run typecheck` and `npm run build` separately. In a pnpm workspace,
use the equivalent `pnpm run` commands from the module directory.

## Codemagic distribution

The standalone template includes a root `codemagic.yaml`; for module mode,
merge `codemagic/codemagic.yaml` manually into the workspace root.
Review `docs/codemagic.md` before connecting signing credentials or enabling
beta tags. Beta tags upload signed builds to the stores using configurable
project distribution settings; release tags build and validate only. Store
upload for releases requires a separate manually approved workflow started
from the exact tag.

Validate release identity locally with `npm run test:release` (or pnpm).

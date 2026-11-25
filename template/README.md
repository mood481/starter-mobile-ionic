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
npm run doctor
npm run open:android    # Android Studio
npm run open:ios        # macOS with Xcode
```

Use `npm run sync` when both native toolchains are available; use
`npm run run:android` or `npm run run:ios` to launch on a device or emulator.
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

No backend, authentication, localization or CI/CD configuration is included.

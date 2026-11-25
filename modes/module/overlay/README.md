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
pnpm run doctor
pnpm run open:android    # Android Studio
pnpm run open:ios        # macOS with Xcode
```

Use `pnpm run sync` when both native toolchains are available; use
`pnpm run run:android` or `pnpm run run:ios` to launch on a device or emulator.
For module mode, use the equivalent `ppnpm run` commands from the module directory.
Build and sync again after web or plugin changes. The web output is `www`.
Generated web copies, Capacitor runtime configuration and Cordova compatibility
projects are intentionally not tracked; sync restores them before native builds.

The included Capacitor plugins are app, browser, device, haptics, keyboard,
network and splash-screen. Keyboard uses default configuration. SystemBars is
available from Capacitor core. Use `pnpm run assets` (or `ppnpm run assets`) after
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

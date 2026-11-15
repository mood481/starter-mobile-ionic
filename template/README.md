# __PROJECT_NAME__

__PROJECT_DESCRIPTION__

Minimal Ionic 9 + Angular 21 + Capacitor 8 application. The same sources support
standalone and module rendering; the selected overlay provides mode-specific files.

## Local development

With dependencies installed by your workspace package manager:

```bash
npm run start
npm run typecheck
npm run build
```

For a standalone output, use Node.js 24 or newer and `npm install`. No npm version
is pinned; npm is the version shipped with the selected Node installation.
For a module inside a pnpm workspace, run the equivalent scripts through pnpm.

## Native projects

Native Android/iOS directories are intentionally not pre-generated. After a
successful web build, run:

```bash
npm run build
npm run cap:add:android
npm run cap:add:ios
npm run cap:sync
```

Only run `cap:add:*` for platforms you intend to support. iOS tooling requires macOS
and Xcode; Android requires the Android SDK and a suitable JDK. Track native projects
in Git after generation if your delivery workflow needs reproducible native changes.

Capacitor identity:

- App ID: `__CAPACITOR_APP_ID__`
- App name: `__CAPACITOR_APP_NAME__`

No backend, authentication, localization, extra Capacitor plugins, or CI/CD
configuration is included in this baseline.

# Codemagic: mobile distribution workflows

The starter includes Codemagic YAML for both modes. All workflows require
successful typecheck, Vitest unit tests, release-policy tests, Playwright web
E2E tests, web build, Capacitor synchronization and native signing/builds.

## Consumer modes and tag contract

| | Standalone | Module |
| --- | --- | --- |
| Root of mobile app | Repository root | `MOBILE_APP_DIR` (defaults to `apps/mobile`) |
| Package manager | npm and `package-lock.json` | Host pnpm and `pnpm-lock.yaml` |
| Beta tag | `vX.Y.Z-<prerelease>` | `mobile/vX.Y.Z-<prerelease>` |
| Release tag | `vX.Y.Z` | `mobile/vX.Y.Z` |
| Tagged commit must be in | `devel` for beta; `main` for release | Same |
| Workflow YAML | Root `codemagic.yaml` | Copy/merge `codemagic/codemagic.yaml` into host root |

The renderer does not modify the host root in module mode. Review the copied
workflow's `MOBILE_APP_DIR` and the package manager version before enabling.
In module mode the root package lock and workspace configuration remain owned
by the receiving project.

Git tags do not belong to branches. The version resolver performs an explicit
remote `origin/devel` or `origin/main` reachability check on the tagged
commit, rejecting mismatched or unavailable remote state. Codemagic tag
patterns alone **do not validate branch ancestry**. For stronger release
isolation, protect `main`, `devel` and release tag namespaces in GitHub.

The prerelease label can be any valid SemVer prerelease, for example
`v1.2.0-beta.3`, `v1.2.0-rc.2`, `mobile/v1.2.0-preview.1`.
The declared `package.json` version may be just `1.2.0` for both
beta and release. A package version with a prerelease suffix is also
accepted if it exactly matches the tag. The native version (`versionName`
and `MARKETING_VERSION`) is the plain `X.Y.Z`; build counters are derived from Codemagic's numeric `PROJECT_BUILD_NUMBER`. Keep any independently declared
public app version or environment version synchronized with `X.Y.Z`.

## Beta distribution (automatic)

A beta tag triggers `mobile-beta` after source/version verification. On
passing the quality gates, Android AAB and iOS IPA are uploaded to their
respective stores.

- Google Play uses the configurable `GOOGLE_PLAY_TRACK`, initialized to
  `internal` as a working default. Change it in the consumer workflow or
  Codemagic environment to the desired testing track.
- App Store Connect receives an ordinary App Store-signed IPA, **without**
  TestFlight Internal-Only restrictions. The starter does not force any
  external testing groups, beta review, or release automation. The consumer
  selects any TestFlight publishing options they need.

An upload to App Store Connect is not the same as assignment to testers or
publication in the App Store.

## Release: tagged build + manual approval of store upload

The stable release tag automatically triggers `mobile-release`, which
runs all tests, builds signed artifacts and saves them in Codemagic, **without
any store publishing step**. It does not import store publishing credentials.

For an approved release, open Codemagic and manually select
`mobile-release-publish` **from the exact release tag** (not from a branch).
Enter the same exact tag in the required `approvedTag` input. The resolver
compares that input with `CM_TAG`, verifies its presence in `main`,
and reruns the same quality gates, build, signing and upload. The manual
build is the authorization to upload to stores. Restrict permission to
start this workflow to authorized release operators.

The manual workflow uses `GOOGLE_PLAY_TRACK=production` and
`submit_as_draft: true`, so Google Play receives a **production draft**,
and App Store Connect receives the normal IPA with no automatic App Review
submission. Consumers can deliberately change the store publication policy
after deciding on approval and rollout controls.

**Important:** this first generic flow recompiles for the publishing run;
it does not promote the exact bytes produced by `mobile-release`.
Codemagic's YAML publishing step does not offer a generic manual pause
between building and uploading. Exact binary promotion would require
verified candidate retrieval and store-specific APIs, beyond this template.

## Configuration and credentials

These are **consumer settings**, not project-specific script constants:

- `MOBILE_TAG_PREFIX`: `v` or `mobile/v`, set by each mode.
- `MOBILE_APP_DIR`: module location relative to the workspace root.
- `MOBILE_PACKAGE_MANAGER`: `npm` or `pnpm`.
- `IOS_BUNDLE_ID`: replaced by `CAPACITOR_APP_ID` during render.
- `GOOGLE_PLAY_TRACK`: Android publishing track, configured per workflow.
- `MOBILE_CHANNEL` and `MOBILE_PUBLISH_MODE`: workflow-owned release controls.

Store the following secret groups in Codemagic:

| Group | Required variables |
| --- | --- |
| `android_signing` | `CM_KEYSTORE` (base64) or `CM_KEYSTORE_PATH`, `CM_KEYSTORE_PASSWORD`, `CM_KEY_ALIAS`, `CM_KEY_PASSWORD` |
| `google_play` | `GOOGLE_PLAY_SERVICE_ACCOUNT_CREDENTIALS` |
| `app_store_connect` | `APP_STORE_CONNECT_PRIVATE_KEY`, `APP_STORE_CONNECT_KEY_IDENTIFIER`, `APP_STORE_CONNECT_ISSUER_ID`, `CERTIFICATE_PRIVATE_KEY` |

Do not commit credentials, profiles, certificates, or keystores. Create store
app records and validate account permissions and signing identities first.
The workflows use a macOS instance, Node 24, Java 21 and Xcode pinned to the Codemagic `26.4` image (26.4.1 on that image). Consumers
should update this deliberately with the corresponding native toolchain.

## Verification

Run the following before enabling Codemagic publishing:

```bash
npm run test:release
npm run typecheck
npm run test:unit
npm run test:e2e
npm run build
```

Use pnpm equivalents for module mode. After rendering, verify the YAML
against Codemagic's validator, inspect the native version numbers in produced
artifacts and test both workflows with a controlled release tag. The
starter author has not verified actual store publishing.

References:
- https://docs.codemagic.io/yaml-basic-configuration/yaml-getting-started/
- https://docs.codemagic.io/knowledge-codemagic/build-inputs/
- https://docs.codemagic.io/yaml-publishing/google-play/
- https://docs.codemagic.io/yaml-publishing/app-store-connect/

## Toolchain and native build-number configuration

The render request provides `NODE_VERSION`, `JAVA_VERSION`, and
`XCODE_VERSION` for Codemagic. Standalone also receives a generated `.nvmrc`.
Module mode additionally specifies `PNPM_VERSION` for Codemagic's pnpm
installation; it does not change the workspace's package-manager settings.

The shared `mobile-build.config.json` holds the independent Android and iOS
build-number offsets selected at render time. In each CI execution the required
base counter is `PROJECT_BUILD_NUMBER`. The resolver computes:

- `ANDROID_VERSION_CODE = PROJECT_BUILD_NUMBER + android.buildNumberOffset`
- `IOS_BUILD_NUMBER = PROJECT_BUILD_NUMBER + ios.buildNumberOffset`

Explicit `ANDROID_BUILD_NUMBER` and `IOS_BUILD_NUMBER` environment values
override the computed number for that platform. These should only be used
for controlled migrations or recovery builds. The project counter must remain
present to identify the CI execution even when an override is used.

The resolver validates positive decimal numbers and limits both resulting
platform build numbers to 2,100,000,000 (a deliberately conservative shared
policy, not a claim that both stores have identical format requirements).
Store-side uniqueness and monotonic progression remain the consumer's
responsibility. The public native version remains `X.Y.Z`, including for
beta tags; the approval workflow recompiles and can therefore produce
different native build numbers than the first release build.

# Publishing this starter

This repository is a **starter-authoring package**. Publishing distributes the
starter's `starter.yaml`, executable, templates, and overlays; it does not
publish an application rendered by the starter.

This guide is created by `starter-publish install` as a starting point for
maintainers. You may edit it for this repository. Running `install` again
preserves existing guide content rather than replacing your changes.

## One-time configuration

The installer configures `.github/workflows/starter-publish.yml` and aligns
`package.json.files` with the paths declared in `starter.yaml`:

```bash
pnpm exec starter-publish install
```

The repository must have one working `package.json.bin` entry and the
runtime dependencies needed by that executable. For starters created with
`@mood481/starter-cli`, `starter new` or `starter setup` provides the
render wrapper; the publisher does not create it.

In GitHub, open **Settings → Secrets and variables → Actions**:

- Set secret `GITEA_TOKEN` to a Gitea token with package read/write access.
- Optionally set variable `GITEA_NPM_REGISTRY` to the approved Gitea npm
  endpoint. Default: `https://git.mood481.es/api/packages/mood/npm/`.

The registry scope is configured by `actions/setup-node` at runtime. Do not
commit an `.npmrc` containing a token; no `.npmrc.example` is required.

The workflow installs dependencies with pnpm, runs `pnpm validate`, checks the
release plan, and publishes using the configured Gitea token. It has GitHub
`contents: read` permission. Some pnpm versions can report
`Skipped OIDC: ... INCORRECT_PERMISSIONS` during publication: this indicates
OIDC-based trusted publishing was unavailable. Our workflow uses
`GITEA_TOKEN` instead, so this warning alone does not mean publishing failed.
Do not grant `id-token: write` solely to hide that warning.

## Validate and inspect the package

Keep `package.json.version` at a **stable** `X.Y.Z`. The publisher derives
prerelease versions only in temporary staging; it does not rewrite the
committed version.

```bash
pnpm validate
pnpm exec starter-publish pack
pnpm exec starter-publish plan --prerelease devel.0
pnpm exec starter-publish publish --prerelease devel.0 --dry-run
```

The `pack` command creates a tarball under `dist/` by default without
uploading it. Inspect the packaged contents, especially executable permissions,
templates, overlays, and special files such as `.gitignore`.

You can also pack the starter directly using `pnpm pack` when its own
`package.json.files` is already complete. The publisher's `pack` command
additionally stages an isolated copy and discovers declared sources.

## Publish a prerelease

Use the installed GitHub Actions **Publish starter package** workflow and
**Run workflow**, entering the prerelease suffix:

- `devel.0` uses the `devel` dist-tag.
- `alpha.0`, `beta.0`, or `rc.0` use the `next` dist-tag.

You can also publish a prerelease locally with a suitable Gitea token:

```bash
GITEA_TOKEN=... pnpm exec starter-publish publish --prerelease devel.0
```

Supply the token securely in your shell or secret manager rather than
committing it to a script. A version already present in Gitea cannot be
re-published: choose the next prerelease number.

## Publish a stable release

After validating the exact commit, make sure `package.json.version` is the
desired stable version, e.g. `0.1.0`:

```bash
git tag v0.1.0
git push origin v0.1.0
```

The matching tag event runs the GitHub Actions workflow and publishes under
the `latest` dist-tag. The workflow also accepts version-matching prerelease
tags, such as `v0.1.0-beta.0`; those publish with `next` instead of `latest`.
A mismatched tag is rejected. The tool refuses to publish stable releases
from a local invocation.

## Maintenance

When you change template or overlay paths in `starter.yaml`, rerun
`starter-publish install` to synchronize the committed `files` allowlist
and check the workflow. The publishing commands independently recalculate
the required source paths when they prepare the temporary package.

The published package uses `docs/README.package.md` as its root README
if that file exists; otherwise, it uses `README.md`. This guide is for
starter maintainers and is not part of the distributed package unless you
explicitly include it in `package.json.files`.

If a publishing workflow already exists under a different name, the installer
refuses to create a competing workflow. Migrate it deliberately rather than
running two release processes.

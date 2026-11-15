# @mood481/starter-mobile-ionic

Reusable starter for Starter Mobile Ionic.

This is a **starter-authoring repository**, not the application or module it will
generate. Complete `starter.yaml` and the selected template sources before publishing.

## Contents

- `starter.yaml`: starter identity, enabled modes, templates, overlays,
  variants, and placeholder requirements.
- `template/`: common neutral source files with `__PLACEHOLDER__` tokens.
- `modes/standalone/overlay/`: standalone-only root files such as `.gitignore` and `.editorconfig`.
- `modes/module/overlay/`: module-specific README and any future overrides.

- `variants/`: optional overlays owned by the starter.
- `docs/examples/`: sample render requests for both canonical modes.
- `package.json`: **authoring** tools and dependencies (pnpm).

Starter ID: `starter-mobile-ionic`
Enabled modes: `standalone, module`
Default mode: `standalone`
Template layout: `overlay`


The repository is created with pnpm pinned to the version bundled by the starter
CLI. Authors may update `packageManager` and `engines.pnpm` together. This pin
does **not** determine whether a project rendered from the starter uses npm or pnpm.
The project package manager belongs to its template/overlay and render inputs.

## Authoring workflow

1. Complete `starter.yaml` and its active global and mode-specific sources.
2. Keep source layout and required placeholders consistent for each enabled mode.
3. Provide concrete placeholder values in the relevant render example.
4. Install authoring dependencies and validate:

```bash
pnpm install
pnpm validate
```

### Standalone example

```bash
pnpm exec starter-render --input docs/examples/render.example.yaml
```

This creates `rendered/` in the starter repository, which is ignored and can
be removed after inspection.

### Module example

```bash
mkdir -p workspace
pnpm exec starter-render --input docs/examples/render.module.example.yaml
```

The `workspace/` root must already exist; the renderer creates only the
`apps/example` target within it, never rewriting workspace-root files.
This baseline example should be adapted to the intended host workspace.

Both render request examples are provided for reference, but a request can
only run if its mode is enabled in `starter.yaml`.
The other two layouts are documented under `docs/examples/starter.*.yaml`.
These manifests are inactive and require their matching template/overlay
folders to be created or reorganized before switching; only the root
`starter.yaml` is active.
A module render does not
change the receiving workspace's package manager or lockfile.

For standalone consumer projects using npm and pnpm, the template may use
explicit `__PACKAGE_MANAGER__` and `__PACKAGE_MANAGER_VERSION__` placeholders,
or a pnpm base template plus an npm variant overlay. The renderer does not infer
package-manager values or create lockfiles.

## Standards and extensions

Shared development standards belong to `@mood481/dev-standards`, not this toolkit.
The starter may deliberately materialize a standards selection into its template
or give the generated project the dependency to manage its own selection.

Extension manifests are defined by the contract, but this renderer version does
not execute non-empty render-extension requests. Do not assume extensions,
workspace-root mutations, or starter-specific commands execute during rendering.

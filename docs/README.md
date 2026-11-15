# Starter documentation

This directory contains starter-owned authoring instructions and example render
requests. Shared rules and technology guides belong to `@mood481/dev-standards`;
the toolkit does not install them automatically.

## Render examples

- `examples/render.example.yaml`: standalone request for a **new** project root.
- `examples/render.module.example.yaml`: module request for a target inside an
  **existing** workspace root.

Both examples are included with every newly created starter, even a single-mode
starter. They are references, not automatically enabled capabilities: run an example
only if its mode is declared in `starter.yaml`. The module example assumes an
existing `workspace/` directory; create or configure the host workspace first.

When authoring a dual-mode starter, design its sources and placeholder requirements
together. The global template and placeholders should represent genuinely shared
requirements. Per-mode required lists replace global requirements (including with
`required: []`), while selected variants add their own required placeholders.

## Dual-mode template layouts

With both modes enabled, `starter new` generates `split` templates by default.
Use `--template-base common|overlay|split` to choose explicitly:

- `split`: independent `templates/standalone/` and `templates/module/`.
- `common`: one inherited global `template/`.
- `overlay`: global `template/` and `modes/module/overlay/`.

Two inactive manifests under `docs/examples/starter.<layout>.yaml` illustrate
the alternative layouts. Switching requires moving or creating their source
directories; copying only the YAML is insufficient. A single-mode starter
uses one global template, and `--template-base` is not accepted.

## Authoring versus generated projects

The starter repository itself uses **pnpm**. The generated standalone project may
use npm or pnpm depending on its template and render values. A module render cannot
change the package manager or lockfile of its receiving workspace, because it writes
only inside `paths.target`.

The renderer does not install dependencies, generate lockfiles, infer placeholder
values, mutate workspace-root configuration, or execute render extensions.

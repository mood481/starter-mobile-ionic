# ADR: Controlled use of base classes and inheritance

Status: accepted
Scope: code authored and maintained by the starter repository, including its template

## Context

The canonical `ts-js` guide prioritizes composition and reserves inheritance
for stable, substitutable specializations. That remains the default. In some
application and framework integration code, however, a small base class may
define a useful **protected capability contract** shared by a coherent family
of subclasses without representing a public domain subtype.

This repository permits that narrow, deliberate use of inheritance. It is a
**local exception** to the guide's restriction on implementation reuse, not a
general relaxation of the shared standard.

## Decision

Composition is the first choice. A reusable base class MAY be introduced or
retained only when all of the following hold:

- The intended subclasses form a meaningful, clearly delimited family and
  share a stable, explicitly understood *inherited contract*.
- The base offers one cohesive cross-cutting capability or lifecycle
  invariant through protected members; it is not a collection of unrelated
  service shortcuts, dependencies or application state.
- Subclasses genuinely use that capability. Extending an unused base purely
  for consistency or possible future needs is not justified.
- The inherited API remains small and stable, with a shallow hierarchy
  (normally a single base level). Subclasses must not depend on fragile
  override chains, hidden initialization order or knowledge of siblings.
- Constructor or field injection and lifecycle requirements are explicit;
  subclasses remain independently testable in the required framework context.
- The benefit over explicit delegation or injection is concrete, and any
  resulting coupling is accepted as part of the decision.

A base class MUST NOT be added solely to eliminate a few repeated lines,
to expose every shared service to every component, or to enforce an artificial
common ancestor. Prefer composition for optional capabilities, replaceable
behaviors and collaborations between unrelated types. Do not mix multiple
responsibilities into one increasingly broad base.

## Application and review

The existing `BaseMain` is one example of a deliberately small, opt-in
Angular-injection-based capability; its presence does **not** make inheritance
the default for new services or components. A new base class must be assessed
against the criteria above on its own merits.

If a base accumulates dependencies, mutable shared state or lifecycle hooks,
or if subclasses need increasingly different behavior, reassess it and favor
explicit collaborators. Keep framework-specific initialization constraints
visible in the code and tests.

## Consequences

This policy allows targeted inheritance where a stable protected contract
improves cohesion, while preserving the general preference for composition.
It introduces coupling between each subclass and its base; that cost must
remain bounded and reviewable. The canonical `dev-standards` documents are
unchanged.

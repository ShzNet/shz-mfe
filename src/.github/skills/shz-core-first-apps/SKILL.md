---
name: shz-core-first-apps
description: Use when generating or updating apps in this repository, especially host/module federation apps. Prefer @shznet/components and @shznet/core exports before creating local UI/runtime code, and keep generated app scaffolds minimal.
---

# SHZ Core-First Apps

When working on apps in this repo:

1. Read `libs/components/src/index.ts` and `libs/core/src/index.ts` first.
2. Reuse exported primitives, layout pieces, and federation/runtime helpers before writing app-local replacements.
3. Keep app-local code thin — compose existing library exports. Put new reusable UI or runtime behavior into `@shznet/components` or `@shznet/core`, then consume it.
4. **Generators** (`nx g @shznet/nx-generators:host` / `module-app`) intentionally scaffold a full starter: auth flow, sign-in page, theme toggle, notification bell, dashboard with stats, and a users page with DataTable + FilterBuilder. This is by design — do not strip it out.
5. When **manually extending** an existing app (not running a generator), add only what the user asks for. Do not add sample data, extra pages, or one-off components speculatively.
6. For module federation apps:
   - Prefer exposing `./Shell` and `./config`.
   - Prefer host-side loading through `@shznet/core` helpers instead of duplicating federation runtime logic.

If a needed primitive does not exist yet, add it to the appropriate library with a small API and then use it from the generated app.

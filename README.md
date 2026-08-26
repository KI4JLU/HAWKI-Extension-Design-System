# hawki-extension-design-system

Svelte 5 component library for HAWKI extensions.

> **No design-system component exists yet.** This repo currently only ships the build
> pipeline (package build, type generation, checks, tests, lint, format) and one throwaway
> `Placeholder` component used to prove the pipeline works end to end. Real components land
> starting with card 14.

**Package name is provisional.** Distribution and naming (card 03) are still deferred; this
package will be renamed before its first publish (card 13). Internal imports are relative
paths (not a self-reference through the package name), so the rename only touches
`package.json` and this README — not the component source.

Documentation, component usage, and design guidance live in the published Storybook (card 07),
not in this file.

## Development

```sh
npm install
npm run build   # svelte-package -> dist/, with .d.ts
npm run check   # svelte-check
npm run test    # vitest
npm run lint     # eslint + prettier --check
npm run format  # prettier --write
```

`storybook` / `build-storybook` are stubs — see card 07.

## Stack

Svelte 5 (runes), Vite, TypeScript, `@sveltejs/package` for the library build (not Vite library
mode — see the card 06 decision record for why), `bits-ui` for headless primitives,
`class-variance-authority` for variant maps.

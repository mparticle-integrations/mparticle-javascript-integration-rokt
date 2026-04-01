---
name: verify
description: Run lint, build, and tests to verify changes. Use when user says /verify, check my changes, validate changes, run checks, verify everything passes, pre-commit check, ready to commit, does it pass, CI check, sanity check
---

# Verify Skill - Rokt Web Kit

Run lint, build, and tests to verify the current state of the codebase.

## Steps

1. Run the following checks. Lint can run in parallel with the build+test sequence.

**Lint:**
```bash
npm run lint
```

**Build:**
```bash
npm run build
```

**Tests:**
```bash
npm run test
```

> `npm run test` runs Vitest in headless jsdom mode.
> `npm run build` runs Vite and produces IIFE and CommonJS bundles + TypeScript type declarations.

2. Report results in this format:

| Check  | Status |
|--------|--------|
| Lint   | PASS / FAIL |
| Build  | PASS / FAIL |
| Tests  | PASS / FAIL |

3. If any check fails, show the relevant error output so the user can diagnose and fix the issue.

## Notes

- TypeScript project — source is `src/Rokt-Kit.ts`, tests are `test/src/tests.spec.ts`
- Build uses Vite and produces `dist/Rokt-Kit.iife.js`, `dist/Rokt-Kit.common.js`, and `dist/Rokt-Kit.d.ts`
- Tests run in jsdom via Vitest (no browser required)
- `npm run test:watch` runs Vitest in watch mode for development
- `npm run test:coverage` generates a V8 coverage report

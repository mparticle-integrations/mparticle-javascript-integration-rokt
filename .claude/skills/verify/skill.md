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

**Build + Tests:**
```bash
npm run test
```

> `npm run test` runs `npm run build && npm run build:test && karma start test/karma.config.js` — it builds the source, builds the test bundle, and runs Karma with Mocha/Chai in Chrome and Firefox.

2. Report results in this format:

| Check  | Status |
|--------|--------|
| Lint   | PASS / FAIL |
| Build  | PASS / FAIL |
| Tests  | PASS / FAIL |

3. If any check fails, show the relevant error output so the user can diagnose and fix the issue.

## Notes

- This is a plain JavaScript (ES6) project — there is no TypeScript compilation step.
- Build uses Rollup and produces IIFE and CommonJS bundles.
- Tests run in real browsers (Chrome, Firefox) via Karma, not in Node/jsdom.
- `npm run test:debug` launches Chrome in non-headless mode for interactive debugging.

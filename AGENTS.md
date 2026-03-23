# Rokt Web Kit - Agent Instructions

This file provides guidance for AI coding agents working with the Rokt web kit codebase.

## About This Kit

The Rokt web kit (`@mparticle/web-rokt-kit`) is an mParticle integration kit (forwarder) that bridges the mParticle Web SDK and the Rokt Web SDK. It receives events from mParticle and forwards them to Rokt for placement selection, user targeting, and attribution.

**Module ID**: 181

## Tech Stack

- **Language**: ES5-style JavaScript (uses `var`, no arrow functions) — NOT TypeScript
- **Build Tool**: Rollup (IIFE and CommonJS output)
- **Testing**: Karma + Mocha/Chai (real browser tests in Chrome and Firefox)
- **Package Manager**: npm
- **Code Quality**: ESLint

## Project Structure

```
/
  src/
    Rokt-Kit.js           # Single monolithic source file (~900 lines)
  dist/
    Rokt-Kit.iife.js      # Browser bundle (IIFE)
    Rokt-Kit.common.js    # npm bundle (CommonJS)
  test/
    src/
      tests.js            # Mocha/Chai test suite
    config.js             # Test mParticle configuration
    karma.config.js       # Karma test runner config
    lib/                  # Test utilities
    end-to-end-testapp/   # E2E test app
  rollup.config.js        # Build configuration
  package.json
```

## Key Commands

```bash
npm run build          # Build IIFE and CommonJS bundles
npm run build:test     # Build test bundle
npm run lint           # ESLint check (src/ and test/src/)
npm run lint:fix       # ESLint autofix
npm run test           # Build + build tests + run Karma
npm run test:debug     # Non-headless Chrome for debugging
npm run watch          # Watch and rebuild on changes
```

## Code Conventions

- **Single source file**: All kit logic lives in `src/Rokt-Kit.js`
- **Constructor function pattern**: `var constructor = function() { ... }` with `var self = this;`
- **var declarations**: The codebase uses `var` throughout — match this style
- **No TypeScript**: No type annotations, no interfaces, no generics
- **Module registration**: Kit self-registers via `window.mParticle.addForwarder()` at load time

## Architecture

- Kit is an mParticle forwarder that self-registers via `window.mParticle.addForwarder()` at load time
- Kit attaches to the Rokt manager: `window.mParticle.Rokt.attachKit(self)`
- Rokt launcher loads asynchronously — events are queued until it's ready
- Configuration comes from mParticle server-side kit settings

## Testing Patterns

- Tests use Mocha `describe`/`it` blocks with Chai `expect` assertions
- mParticle SDK is mocked in test config
- Rokt launcher is mocked with spy functions
- `beforeEach` resets kit state between tests
- Tests run in real browsers (Chrome, Firefox) via Karma

## Common Gotchas

1. **Single file**: All changes go in `src/Rokt-Kit.js` — there are no imports/modules
2. **Browser-only**: Code runs in browser context, `window` is always available
3. **Async launcher**: Rokt launcher loads asynchronously — events must be queued until ready
4. **var scope**: Use `var` not `let`/`const` to match existing style
5. **self reference**: Use `var self = this;` pattern for callback context

## Available Skills

- **`/verify`**: Run lint, build, and tests to validate your changes. **You MUST run `/verify` before committing or opening a pull request.** Do not skip this step. See `.claude/skills/verify/skill.md`.

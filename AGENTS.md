# Rokt Web Kit - Agent Instructions

This file provides guidance for AI coding agents working with the Rokt web kit codebase.

## About This Kit

The Rokt web kit (`@mparticle/web-rokt-kit`) is an mParticle integration kit (forwarder) that bridges the mParticle Web SDK and the Rokt Web SDK. It receives events from mParticle and forwards them to Rokt for placement selection, user targeting, and attribution.

**Module ID**: 181

## Tech Stack

- **Language**: JavaScript (ES6) — NOT TypeScript
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

### Event Flow

```
mParticle SDK → Kit's process() → Event Queue → Rokt __event_stream__()
```

### Kit Lifecycle

1. mParticle loads and registers the kit via `addForwarder()`
2. Kit's `init()` called with settings and config
3. Rokt launcher script appended to DOM
4. Events queued until launcher is ready
5. Once ready, queue is drained and events flow directly

### Key Components

| Component | Purpose |
|-----------|---------|
| `initForwarder()` | Kit initialization, config parsing, launcher setup |
| `processEvent()` | Event processing pipeline with queuing |
| `selectPlacements()` | Core API for Rokt placement selection |
| `hashAttributes()` | SHA256 hashing via Rokt launcher |
| `_sendEventStream()` | Forwards mParticle events to Rokt |

### Integration with Core SDK

- Kit registers as a forwarder with `window.mParticle.addForwarder()`
- Kit attaches to Rokt manager: `window.mParticle.Rokt.attachKit(self)`
- Accesses mParticle APIs via `window.mParticle.*`
- Receives configuration from mParticle server-side kit settings

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

- **`/verify`**: Run lint, build, and tests to validate your changes before committing. See `.claude/skills/verify/skill.md`.

export function readJSON(key: string): unknown {
  try {
    const stored = window.localStorage.getItem(key);
    return stored === null ? null : JSON.parse(stored);
  } catch {
    return null;
  }
}

// writeJSON/removeKey never throw on storage failure (private mode, quota,
// access denied): kit-owned storage is a best-effort cache, and a failed
// write/remove must not break the caller. writeJSON returns whether the write
// landed so callers can surface a diagnostic; removeKey is fire-and-forget (a
// failed remove only risks orphaned data, resolved by the next write/clear).
export function writeJSON(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // no-op
  }
}

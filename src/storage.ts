export function readJSON(key: string): unknown {
  try {
    const stored = window.localStorage.getItem(key);
    return stored === null ? null : JSON.parse(stored);
  } catch {
    return null;
  }
}

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
    /* empty */
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function readNamespacedField(namespaceKey: string, field: string): unknown {
  const blob = readJSON(namespaceKey);
  return isPlainObject(blob) ? blob[field] : undefined;
}

export function writeNamespacedField(namespaceKey: string, field: string, value: unknown): boolean {
  const blob = readJSON(namespaceKey);
  const next = isPlainObject(blob) ? { ...blob } : {};
  next[field] = value;
  return writeJSON(namespaceKey, next);
}

export function removeNamespacedField(namespaceKey: string, field: string): void {
  const blob = readJSON(namespaceKey);
  if (!isPlainObject(blob) || !(field in blob)) {
    return;
  }
  const next = { ...blob };
  delete next[field];
  if (Object.keys(next).length === 0) {
    removeKey(namespaceKey);
  } else {
    writeJSON(namespaceKey, next);
  }
}

export function writeNamespacedFieldWithinBudget(
  namespaceKey: string,
  field: string,
  records: unknown[],
  maxBytes: number,
): boolean {
  while (records.length > 1 && JSON.stringify(records).length > maxBytes) {
    records.shift();
  }

  while (!writeNamespacedField(namespaceKey, field, records)) {
    if (records.length <= 1) {
      return false;
    }
    records.shift();
  }

  return true;
}

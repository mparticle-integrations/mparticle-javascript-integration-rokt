export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === 'object') {
    return Object.keys(value as object).length === 0;
  }
  if (Array.isArray(value)) {
    return (value as unknown[]).length === 0;
  }
  return false;
}

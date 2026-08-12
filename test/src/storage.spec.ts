import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  readJSON,
  writeJSON,
  removeKey,
  readNamespacedField,
  writeNamespacedField,
  removeNamespacedField,
} from '../../src/storage';

describe('storage: key-agnostic localStorage helpers', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  describe('readJSON', () => {
    it('returns the parsed value for a stored JSON string', () => {
      window.localStorage.setItem('k', JSON.stringify({ a: 1, b: [2, 3] }));
      expect(readJSON('k')).toEqual({ a: 1, b: [2, 3] });
    });

    it('round-trips values written by writeJSON', () => {
      writeJSON('k', ['x', 'y']);
      expect(readJSON('k')).toEqual(['x', 'y']);
    });

    it('returns null when the key is absent', () => {
      expect(readJSON('missing')).toBeNull();
    });

    it('returns null for malformed JSON (does not throw)', () => {
      window.localStorage.setItem('k', '{not valid json');
      expect(readJSON('k')).toBeNull();
    });

    it('returns null when getItem throws (access denied)', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });
      expect(readJSON('k')).toBeNull();
    });
  });

  describe('writeJSON', () => {
    it('persists the value as a JSON string and returns true', () => {
      expect(writeJSON('k', { hello: 'world' })).toBe(true);
      expect(window.localStorage.getItem('k')).toBe(JSON.stringify({ hello: 'world' }));
    });

    it('returns false when setItem throws (quota exceeded / private mode)', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      expect(writeJSON('k', { hello: 'world' })).toBe(false);
    });

    it('overwrites an existing value', () => {
      writeJSON('k', 1);
      writeJSON('k', 2);
      expect(readJSON('k')).toBe(2);
    });
  });

  describe('removeKey', () => {
    it('removes the stored key', () => {
      window.localStorage.setItem('k', '1');
      removeKey('k');
      expect(window.localStorage.getItem('k')).toBeNull();
    });

    it('does not throw when removeItem throws', () => {
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });
      expect(() => removeKey('k')).not.toThrow();
    });

    it('is a no-op for an absent key', () => {
      expect(() => removeKey('missing')).not.toThrow();
    });
  });

  describe('namespaced fields', () => {
    const NS = 'mp-rokt-kit';

    it('writeNamespacedField stores the value under a field of the namespace object', () => {
      expect(writeNamespacedField(NS, 'pageViews', [1, 2])).toBe(true);
      expect(readJSON(NS)).toEqual({ pageViews: [1, 2] });
    });

    it('readNamespacedField returns the stored field value', () => {
      writeNamespacedField(NS, 'pageViews', ['a']);
      expect(readNamespacedField(NS, 'pageViews')).toEqual(['a']);
    });

    it('preserves sibling fields on write (read-modify-write)', () => {
      writeNamespacedField(NS, 'pageViews', ['a']);
      writeNamespacedField(NS, 'other', { x: 1 });
      expect(readJSON(NS)).toEqual({ pageViews: ['a'], other: { x: 1 } });
    });

    it('overwrites only the targeted field', () => {
      writeNamespacedField(NS, 'pageViews', ['a']);
      writeNamespacedField(NS, 'other', 1);
      writeNamespacedField(NS, 'pageViews', ['b']);
      expect(readNamespacedField(NS, 'pageViews')).toEqual(['b']);
      expect(readNamespacedField(NS, 'other')).toBe(1);
    });

    it('readNamespacedField returns undefined when the key is absent', () => {
      expect(readNamespacedField(NS, 'pageViews')).toBeUndefined();
    });

    it('readNamespacedField returns undefined when the field is absent', () => {
      writeNamespacedField(NS, 'other', 1);
      expect(readNamespacedField(NS, 'pageViews')).toBeUndefined();
    });

    it('readNamespacedField returns undefined when the stored value is not a plain object', () => {
      writeJSON(NS, [1, 2, 3]);
      expect(readNamespacedField(NS, 'pageViews')).toBeUndefined();
    });

    it('writeNamespacedField returns false when the write throws', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      expect(writeNamespacedField(NS, 'pageViews', ['a'])).toBe(false);
    });

    it('removeNamespacedField clears the field but keeps other fields', () => {
      writeNamespacedField(NS, 'pageViews', ['a']);
      writeNamespacedField(NS, 'other', 1);
      removeNamespacedField(NS, 'pageViews');
      expect(readNamespacedField(NS, 'pageViews')).toBeUndefined();
      expect(readJSON(NS)).toEqual({ other: 1 });
    });

    it('removeNamespacedField drops the namespace key once its last field is gone', () => {
      writeNamespacedField(NS, 'pageViews', ['a']);
      removeNamespacedField(NS, 'pageViews');
      expect(window.localStorage.getItem(NS)).toBeNull();
    });

    it('removeNamespacedField is a no-op for an absent key or field', () => {
      expect(() => removeNamespacedField(NS, 'pageViews')).not.toThrow();
      writeNamespacedField(NS, 'other', 1);
      removeNamespacedField(NS, 'pageViews');
      expect(readJSON(NS)).toEqual({ other: 1 });
    });
  });
});

import type { LoggingService } from './Rokt-Kit';
import {
  readJSON,
  removeKey,
  readNamespacedField,
  writeNamespacedField,
  removeNamespacedField,
  writeNamespacedFieldWithinBudget,
} from './storage';

const LS_NAMESPACE_KEY = 'mp-rokt-kit';
const LS_PAGE_VIEWS_FIELD = 'pageViews';
const LEGACY_PAGE_VIEWS_KEY = 'mpPageViews';
const PAGE_VIEWS_MAX_LENGTH = 100 * 1024;

export interface PageEvent {
  pageUrl: string;
  sourceMessageId: string;
  timestamp: number;
  activeTimeOnSite?: number;
  activeTimeOnPage?: number;
}

export function migrateLegacyPageViewStorage(loggingService: LoggingService | null): void {
  const legacyViews = readJSON(LEGACY_PAGE_VIEWS_KEY);
  if (legacyViews === null) {
    return;
  }

  const alreadyMigrated = readNamespacedField(LS_NAMESPACE_KEY, LS_PAGE_VIEWS_FIELD) !== undefined;
  const needsMigration = !alreadyMigrated && Array.isArray(legacyViews);

  if (needsMigration) {
    const migrated = writeNamespacedField(LS_NAMESPACE_KEY, LS_PAGE_VIEWS_FIELD, legacyViews);
    if (!migrated) {
      loggingService?.log({
        message: 'Rokt Kit: Failed to migrate legacy page-view storage; retaining legacy key for retry',
        code: 'PAGE_VIEW_CAPTURE_FAILED',
      });
      return;
    }
  }

  removeKey(LEGACY_PAGE_VIEWS_KEY);
}

export function loadPageViews(loggingService: LoggingService | null): PageEvent[] {
  migrateLegacyPageViewStorage(loggingService);
  const stored = readNamespacedField(LS_NAMESPACE_KEY, LS_PAGE_VIEWS_FIELD);
  return Array.isArray(stored) ? (stored as PageEvent[]) : [];
}

export function writePageViews(pageViews: PageEvent[]): boolean {
  return writeNamespacedFieldWithinBudget(LS_NAMESPACE_KEY, LS_PAGE_VIEWS_FIELD, pageViews, PAGE_VIEWS_MAX_LENGTH);
}

export function clearPageViews(): void {
  removeNamespacedField(LS_NAMESPACE_KEY, LS_PAGE_VIEWS_FIELD);
}

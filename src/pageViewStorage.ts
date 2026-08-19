import type { LoggingService } from './Rokt-Kit';
import { readJSON, removeKey, readNamespacedField, writeNamespacedField, removeNamespacedField } from './storage';
import { sanitizeUrl } from './utils';

const LS_NAMESPACE_KEY = 'mp-rokt-kit';
const LS_PAGE_VIEWS_FIELD = 'pageViews';
const LEGACY_PAGE_VIEWS_KEY = 'mpPageViews';
const PAGE_VIEWS_MAX_COUNT = 25;

export interface PageEvent {
  pageUrl: string;
  sourceMessageId: string;
  timestamp: number;
  pageTitle?: string;
  canonicalUrl?: string;
  activeTimeOnSite?: number;
  activeTimeOnPage?: number;
}

function capPageViews(views: PageEvent[]): PageEvent[] {
  return views.slice(-PAGE_VIEWS_MAX_COUNT);
}

export function migrateLegacyPageViewStorage(loggingService: LoggingService | null): void {
  const legacyViews = readJSON(LEGACY_PAGE_VIEWS_KEY);
  if (legacyViews === null) {
    return;
  }

  const alreadyMigrated = readNamespacedField(LS_NAMESPACE_KEY, LS_PAGE_VIEWS_FIELD) !== undefined;
  const needsMigration = !alreadyMigrated && Array.isArray(legacyViews);

  if (needsMigration) {
    loggingService?.log({
      message: 'Rokt Kit: Migrating legacy page-view storage',
      code: 'PAGE_VIEW_LEGACY_MIGRATION',
    });
    const migrated = writeNamespacedField(LS_NAMESPACE_KEY, LS_PAGE_VIEWS_FIELD, legacyViews);
    if (!migrated) {
      loggingService?.log({
        message: 'Rokt Kit: Failed to migrate legacy page-view storage [reason: migration_retry]',
        code: 'PAGE_VIEW_CAPTURE_FAILED',
      });
    }
  }

  removeKey(LEGACY_PAGE_VIEWS_KEY);
}

export function loadPageViews(loggingService: LoggingService | null): PageEvent[] {
  migrateLegacyPageViewStorage(loggingService);
  const stored = readNamespacedField(LS_NAMESPACE_KEY, LS_PAGE_VIEWS_FIELD);
  return Array.isArray(stored) ? (stored as PageEvent[]) : [];
}

export function writePageViews(pageViews: PageEvent[], loggingService: LoggingService | null): boolean {
  let toWrite = capPageViews(pageViews);
  const requested = toWrite.length;
  while (toWrite.length > 0) {
    if (writeNamespacedField(LS_NAMESPACE_KEY, LS_PAGE_VIEWS_FIELD, toWrite)) {
      if (toWrite.length < requested) {
        loggingService?.log({
          message: `Rokt Kit: Page view storage reduced from ${requested} to ${toWrite.length} record(s) under quota pressure [reason: quota_eviction]`,
          code: 'PAGE_VIEW_QUOTA_EVICTION',
        });
      }
      return true;
    }
    toWrite = toWrite.slice(1);
  }
  return false;
}

export function clearPageViews(): void {
  removeNamespacedField(LS_NAMESPACE_KEY, LS_PAGE_VIEWS_FIELD);
}

export function buildPageEvents(pageViews: PageEvent[]): PageEvent[] {
  const views = capPageViews(pageViews);
  return views.map((pageView, index) => {
    const activeTimeOnSite = pageView.activeTimeOnSite;
    const hasActiveTime = activeTimeOnSite !== undefined && Number.isFinite(activeTimeOnSite);

    const next = views[index + 1];
    const nextActiveTimeOnSite = next?.activeTimeOnSite;
    const hasNextActiveTimeOnSite = nextActiveTimeOnSite !== undefined && Number.isFinite(nextActiveTimeOnSite);

    const diff = hasActiveTime && hasNextActiveTimeOnSite ? nextActiveTimeOnSite - activeTimeOnSite : undefined;

    return {
      pageUrl: pageView.pageUrl,
      sourceMessageId: pageView.sourceMessageId,
      timestamp: pageView.timestamp,
      ...(pageView.pageTitle !== undefined ? { pageTitle: pageView.pageTitle } : {}),
      ...(pageView.canonicalUrl !== undefined ? { canonicalUrl: pageView.canonicalUrl } : {}),
      ...(hasActiveTime ? { activeTimeOnSite } : {}),
      ...(diff !== undefined && diff >= 0 ? { activeTimeOnPage: diff } : {}),
    };
  });
}

export function readCanonicalUrl(): string | undefined {
  const link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  const href = link?.href;
  if (!href) {
    return undefined;
  }
  return sanitizeUrl(href);
}

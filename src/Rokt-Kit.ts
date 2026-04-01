//  Copyright 2025 mParticle, Inc.
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.

// ============================================================
// Types
// ============================================================

interface KitSettings {
  accountId: string;
  roktExtensions?: string;
  placementEventMapping?: string;
  placementEventAttributeMapping?: string;
  hashedEmailUserIdentityType?: string;
  onboardingExpProvider?: string;
}

interface EventAttributeCondition {
  operator: string;
  attributeValue: string;
}

interface PlacementEventRule {
  eventAttributeKey: string;
  conditions: EventAttributeCondition[];
}

interface EventAttributeMapping {
  value: string;
  map: string;
  conditions?: EventAttributeCondition[];
}

interface PlacementEventMappingEntry {
  jsmap: string;
  value: string;
}

interface RoktExtensionEntry {
  value: string;
}

interface RoktSelection {
  context?: {
    sessionId?: Promise<string>;
  };
  then?: (callback: (sel: RoktSelection) => void) => Promise<void>;
  catch?: (callback: () => void) => void;
}

interface RoktLauncher {
  selectPlacements(options: Record<string, unknown>): RoktSelection | Promise<RoktSelection>;
  hashAttributes(attributes: Record<string, unknown>): Promise<Record<string, unknown>>;
  use(extensionName: string): Promise<unknown>;
}

interface RoktGlobal {
  createLauncher(options: Record<string, unknown>): Promise<RoktLauncher>;
  createLocalLauncher(options: Record<string, unknown>): RoktLauncher;
  currentLauncher?: RoktLauncher;
  __event_stream__?(event: Record<string, unknown>): void;
  setExtensionData(data: Record<string, unknown>): void;
}

interface FilteredUser {
  getMPID(): string;
  getAllUserAttributes(): Record<string, unknown>;
  getUserIdentities?: () => { userIdentities: Record<string, string> };
}

interface KitFilters {
  userAttributeFilters?: string[];
  filterUserAttributes?: (attributes: Record<string, unknown>, filters?: string[]) => Record<string, unknown>;
  filteredUser?: FilteredUser | null;
}

interface RoktManager {
  attachKit(kit: RoktKit): void | Promise<void>;
  filters?: KitFilters;
  domain?: string;
  launcherOptions?: Record<string, unknown>;
  getLocalSessionAttributes?(): Record<string, unknown>;
  setLocalSessionAttribute?(key: string, value: unknown): void;
}

interface MParticleInstance {
  setIntegrationAttribute(moduleId: number, attrs: Record<string, unknown>): void;
}

interface OptimizelyState {
  getActiveExperimentIds(): string[];
  getVariationMap(): Record<string, { id: string }>;
}

interface OptimizelyGlobal {
  get(key: 'state'): OptimizelyState;
}

// Our view of the mParticle global with Rokt-specific extensions.
// We access window.mParticle via an explicit cast (see `mp()` helper below)
// rather than augmenting Window to avoid conflicts with @mparticle/web-sdk declarations.
interface MParticleExtended {
  Rokt: RoktManager;
  addForwarder(config: ForwarderRegistration): void;
  getVersion(): string;
  generateHash(value: string): string | number;
  logEvent(name: string, type: number, attrs?: Record<string, unknown>): void;
  EventType: { Other: number };
  getInstance(): MParticleInstance;
  sessionManager?: { getSession(): string };
  _getActiveForwarders(): Array<{ name: string }>;
  config?: { isLocalLauncherEnabled?: boolean };
  captureTiming?(metricName: string): void;
  forwarder?: RoktKit;
  loggedEvents?: Array<Record<string, unknown>>;
}

interface TestHelpers {
  generateLauncherScript: (domain: string | undefined, extensions: string[]) => string;
  extractRoktExtensions: (settingsString?: string) => string[];
  hashEventMessage: (messageType: number, eventType: number, eventName: string) => string | number;
  parseSettingsString: <T>(settingsString?: string) => T[];
  generateMappedEventLookup: (placementEventMapping: PlacementEventMappingEntry[]) => Record<string, string>;
  generateMappedEventAttributeLookup: (mapping: EventAttributeMapping[]) => Record<string, PlacementEventRule[]>;
  sendAdBlockMeasurementSignals: (domain: string | undefined, version: string | null) => void;
  createAutoRemovedIframe: (src: string) => void;
  djb2: (str: string) => number;
  setAllowedOriginHashes: (hashes: number[]) => void;
}

interface ForwarderRegistration {
  name: string;
  constructor: new () => RoktKit;
  getId: () => number;
}

interface MParticleEvent {
  EventDataType?: number;
  EventCategory?: number;
  EventName?: string;
  EventAttributes?: Record<string, unknown>;
  [key: string]: unknown;
}

declare global {
  interface Window {
    Rokt?: RoktGlobal;
    __rokt_li_guid__?: string;
    optimizely?: OptimizelyGlobal;
    // mParticle is declared as any to avoid conflicts with @mparticle/web-sdk type declarations.
    // We use the typed mp() accessor for all internal accesses.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mParticle: any;
  }
}

// ============================================================
// Module-level constants
// ============================================================

const name = 'Rokt';
const moduleId = 181;
const EVENT_NAME_SELECT_PLACEMENTS = 'selectPlacements';
const ADBLOCK_CONTROL_DOMAIN = 'apps.roktecommerce.com';
const INIT_LOG_SAMPLING_RATE = 0.1;

// ============================================================
// Helper: typed accessor for window.mParticle
// We use an explicit cast here to avoid conflicts with @mparticle/web-sdk
// type declarations while still providing full type safety for our usages.
// ============================================================

function mp(): MParticleExtended {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).mParticle as MParticleExtended;
}

// ============================================================
// Module-level utility functions
// ============================================================

function generateLauncherScript(domain: string | undefined, extensions: string[]): string {
  const resolvedDomain = typeof domain !== 'undefined' ? domain : 'apps.rokt.com';
  const protocol = 'https://';
  const launcherPath = '/wsdk/integrations/launcher.js';
  const baseUrl = [protocol, resolvedDomain, launcherPath].join('');

  if (!extensions || extensions.length === 0) {
    return baseUrl;
  }
  return baseUrl + '?extensions=' + extensions.join(',');
}

function isObject(val: unknown): val is Record<string, unknown> {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
}

function mergeObjects(...args: Record<string, unknown>[]): Record<string, unknown> {
  const resObj: Record<string, unknown> = {};
  for (const obj of args) {
    if (obj && typeof obj === 'object') {
      const keys = Object.keys(obj);
      for (const key of keys) {
        resObj[key] = obj[key];
      }
    }
  }
  return resObj;
}

function parseSettingsString<T>(settingsString?: string): T[] {
  if (!settingsString) {
    return [];
  }
  try {
    return JSON.parse(settingsString.replace(/&quot;/g, '"')) as T[];
  } catch (_error) {
    console.error('Settings string contains invalid JSON');
  }
  return [];
}

function extractRoktExtensions(settingsString?: string): string[] {
  const settings = settingsString ? parseSettingsString<RoktExtensionEntry>(settingsString) : [];
  const roktExtensions: string[] = [];

  for (let i = 0; i < settings.length; i++) {
    roktExtensions.push(settings[i].value);
  }

  return roktExtensions;
}

function generateMappedEventLookup(placementEventMapping: PlacementEventMappingEntry[]): Record<string, string> {
  if (!placementEventMapping) {
    return {};
  }

  const mappedEvents: Record<string, string> = {};
  for (let i = 0; i < placementEventMapping.length; i++) {
    const mapping = placementEventMapping[i];
    mappedEvents[mapping.jsmap] = mapping.value;
  }
  return mappedEvents;
}

function generateMappedEventAttributeLookup(
  placementEventAttributeMapping: EventAttributeMapping[],
): Record<string, PlacementEventRule[]> {
  const mappedAttributeKeys: Record<string, PlacementEventRule[]> = {};
  if (!Array.isArray(placementEventAttributeMapping)) {
    return mappedAttributeKeys;
  }
  for (let i = 0; i < placementEventAttributeMapping.length; i++) {
    const mapping = placementEventAttributeMapping[i];
    if (!mapping || !isString(mapping.value) || !isString(mapping.map)) {
      continue;
    }

    const mappedAttributeKey = mapping.value;
    const eventAttributeKey = mapping.map;

    if (!mappedAttributeKeys[mappedAttributeKey]) {
      mappedAttributeKeys[mappedAttributeKey] = [];
    }

    mappedAttributeKeys[mappedAttributeKey].push({
      eventAttributeKey: eventAttributeKey,
      conditions: Array.isArray(mapping.conditions) ? mapping.conditions : [],
    });
  }
  return mappedAttributeKeys;
}

function hashEventMessage(messageType: number, eventType: number, eventName: string): string | number {
  return mp().generateHash([messageType, eventType, eventName].join(''));
}

function isEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === 'object') {
    return Object.keys(value as object).length === 0;
  }
  if (Array.isArray(value)) {
    return (value as unknown[]).length === 0;
  }
  return false;
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function generateIntegrationName(customIntegrationName?: string): string {
  const coreSdkVersion = mp().getVersion();
  const kitVersion = process.env.PACKAGE_VERSION;
  let integrationName = 'mParticle_' + 'wsdkv_' + coreSdkVersion + '_kitv_' + kitVersion;

  if (customIntegrationName) {
    integrationName += '_' + customIntegrationName;
  }
  return integrationName;
}

function djb2(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return hash;
}

function createAutoRemovedIframe(src: string): void {
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
  iframe.src = src;
  iframe.onload = function () {
    iframe.onload = null;
    if (iframe.parentNode) {
      iframe.parentNode.removeChild(iframe);
    }
  };
  const target = document.body || document.head;
  if (target) {
    target.appendChild(iframe);
  }
}

function sendAdBlockMeasurementSignals(domain: string | undefined, version: string | null): void {
  const originHash = djb2(window.location.origin);
  const allowedOriginHashes = RoktKit._allowedOriginHashes;
  if (allowedOriginHashes.indexOf(originHash) === -1) {
    return;
  }

  if (Math.random() >= INIT_LOG_SAMPLING_RATE) {
    return;
  }

  const guid = window.__rokt_li_guid__;
  if (!guid) {
    return;
  }

  const pageUrl = window.location.href.split('?')[0].split('#')[0];
  const params =
    'version=' +
    encodeURIComponent(version ?? '') +
    '&launcherInstanceGuid=' +
    encodeURIComponent(guid) +
    '&pageUrl=' +
    encodeURIComponent(pageUrl);

  const existingDomain = domain || 'apps.rokt.com';
  createAutoRemovedIframe('https://' + existingDomain + '/v1/wsdk-init/index.html?' + params);

  createAutoRemovedIframe(
    'https://' + ADBLOCK_CONTROL_DOMAIN + '/v1/wsdk-init/index.html?' + params + '&isControl=true',
  );
}

// ============================================================
// RoktKit class
// ============================================================

class RoktKit {
  // Static field for allowed origin hashes (mutable by testHelpers)
  public static _allowedOriginHashes: number[] = [-553112570, 549508659];

  private static readonly PERFORMANCE_MARKS = {
    RoktScriptAppended: 'mp:RoktScriptAppended',
  };

  private static readonly EMAIL_SHA256_KEY = 'emailsha256';

  // Public fields (accessed by tests and the mParticle framework)
  public name = name;
  public moduleId = moduleId;
  public isInitialized = false;
  public launcher: RoktLauncher | null = null;
  public filters: KitFilters = {};
  public userAttributes: Record<string, unknown> = {};
  public testHelpers: TestHelpers | null = null;
  public placementEventMappingLookup: Record<string, string> = {};
  public placementEventAttributeMappingLookup: Record<string, PlacementEventRule[]> = {};
  public eventQueue: MParticleEvent[] = [];
  public eventStreamQueue: MParticleEvent[] = [];
  public integrationName: string | null = null;
  public domain?: string;

  // Private fields
  private _mappedEmailSha256Key?: string;
  private _onboardingExpProvider?: string;

  // ---- Private helpers ----

  private getEventAttributeValue(event: MParticleEvent, eventAttributeKey: string): unknown {
    const attributes = event && event.EventAttributes;
    if (!attributes) {
      return null;
    }

    if (typeof attributes[eventAttributeKey] === 'undefined') {
      return null;
    }

    return attributes[eventAttributeKey];
  }

  private doesEventAttributeConditionMatch(condition: EventAttributeCondition, actualValue: unknown): boolean {
    if (!condition || !isString(condition.operator)) {
      return false;
    }

    const operator = condition.operator.toLowerCase();
    const expectedValue = condition.attributeValue;

    if (operator === 'exists') {
      return actualValue !== null;
    }

    if (actualValue == null) {
      return false;
    }

    if (operator === 'equals') {
      return String(actualValue) === String(expectedValue);
    }

    if (operator === 'contains') {
      return String(actualValue).indexOf(String(expectedValue)) !== -1;
    }

    return false;
  }

  private doesEventMatchRule(event: MParticleEvent, rule: PlacementEventRule): boolean {
    if (!rule || !isString(rule.eventAttributeKey)) {
      return false;
    }

    const conditions = rule.conditions;
    if (!Array.isArray(conditions)) {
      return false;
    }

    const actualValue = this.getEventAttributeValue(event, rule.eventAttributeKey);

    if (conditions.length === 0) {
      return actualValue !== null;
    }
    for (let i = 0; i < conditions.length; i++) {
      if (!this.doesEventAttributeConditionMatch(conditions[i], actualValue)) {
        return false;
      }
    }

    return true;
  }

  private applyPlacementEventAttributeMapping(event: MParticleEvent): void {
    const mappedAttributeKeys = Object.keys(this.placementEventAttributeMappingLookup);
    for (let i = 0; i < mappedAttributeKeys.length; i++) {
      const mappedAttributeKey = mappedAttributeKeys[i];
      const rulesForMappedAttributeKey = this.placementEventAttributeMappingLookup[mappedAttributeKey];
      if (isEmpty(rulesForMappedAttributeKey)) {
        continue;
      }

      // Require ALL rules for the same key to match (AND).
      let allMatch = true;
      for (let j = 0; j < rulesForMappedAttributeKey.length; j++) {
        if (!this.doesEventMatchRule(event, rulesForMappedAttributeKey[j])) {
          allMatch = false;
          break;
        }
      }
      if (!allMatch) {
        continue;
      }

      mp().Rokt.setLocalSessionAttribute?.(mappedAttributeKey, true);
    }
  }

  private isLauncherReadyToAttach(): boolean {
    return !!window.Rokt && typeof window.Rokt.createLauncher === 'function';
  }

  /**
   * Returns the user identities from the filtered user, if any.
   */
  private returnUserIdentities(filteredUser: FilteredUser | null | undefined): Record<string, string> {
    if (!filteredUser || !filteredUser.getUserIdentities) {
      return {};
    }

    const userIdentities = filteredUser.getUserIdentities().userIdentities;

    return this.replaceOtherIdentityWithEmailsha256(userIdentities);
  }

  private returnLocalSessionAttributes(): Record<string, unknown> {
    if (!mp().Rokt || typeof mp().Rokt.getLocalSessionAttributes !== 'function') {
      return {};
    }
    if (isEmpty(this.placementEventMappingLookup) && isEmpty(this.placementEventAttributeMappingLookup)) {
      return {};
    }
    return mp().Rokt.getLocalSessionAttributes!();
  }

  private replaceOtherIdentityWithEmailsha256(userIdentities: Record<string, string>): Record<string, string> {
    const newUserIdentities = mergeObjects({}, userIdentities || {}) as Record<string, string>;
    const key = this._mappedEmailSha256Key;
    if (key && userIdentities[key]) {
      newUserIdentities[RoktKit.EMAIL_SHA256_KEY] = userIdentities[key];
    }
    if (key) {
      delete newUserIdentities[key];
    }

    return newUserIdentities;
  }

  private logSelectPlacementsEvent(attributes: unknown): void {
    if (!window.mParticle || typeof mp().logEvent !== 'function') {
      return;
    }

    if (!isObject(attributes)) {
      return;
    }

    const EVENT_TYPE_OTHER = mp().EventType.Other;

    mp().logEvent(EVENT_NAME_SELECT_PLACEMENTS, EVENT_TYPE_OTHER, attributes as Record<string, unknown>);
  }

  private processEventQueue(): void {
    this.eventQueue.forEach((event) => {
      this.process(event);
    });
    this.eventQueue = [];
  }

  private enrichEvent(event: MParticleEvent): Record<string, unknown> {
    return mergeObjects({}, event as Record<string, unknown>, {
      UserAttributes: this.userAttributes,
    });
  }

  private sendEventStream(event: MParticleEvent): void {
    if (window.Rokt && typeof window.Rokt.__event_stream__ === 'function') {
      if (this.eventStreamQueue.length) {
        const queuedEvents = this.eventStreamQueue;
        this.eventStreamQueue = [];
        for (let i = 0; i < queuedEvents.length; i++) {
          window.Rokt.__event_stream__!(this.enrichEvent(queuedEvents[i]));
        }
      }
      window.Rokt.__event_stream__!(this.enrichEvent(event));
    } else {
      this.eventStreamQueue.push(event);
    }
  }

  private setRoktSessionId(sessionId: string): void {
    if (!sessionId || typeof sessionId !== 'string') {
      return;
    }
    try {
      const mpInstance = mp().getInstance();
      if (mpInstance && typeof mpInstance.setIntegrationAttribute === 'function') {
        mpInstance.setIntegrationAttribute(moduleId, {
          roktSessionId: sessionId,
        });
      }
    } catch (_e) {
      // Best effort — never let this break the partner page
    }
  }

  private buildIdentityEvent(eventName: string, filteredUser: FilteredUser): MParticleEvent {
    const mpid = filteredUser.getMPID && typeof filteredUser.getMPID === 'function' ? filteredUser.getMPID() : null;
    const sessionId =
      mp() && mp().sessionManager && typeof mp().sessionManager!.getSession === 'function'
        ? mp().sessionManager!.getSession()
        : null;
    const userIdentities =
      filteredUser.getUserIdentities && typeof filteredUser.getUserIdentities === 'function'
        ? filteredUser.getUserIdentities().userIdentities
        : null;

    return {
      EventName: eventName,
      EventDataType: 14, // MessageType.Profile
      Timestamp: Date.now(),
      MPID: mpid,
      SessionId: sessionId,
      UserIdentities: userIdentities,
    };
  }

  private attachLauncher(accountId: string, launcherOptions: Record<string, unknown>): void {
    const mpSessionId =
      mp() && mp().sessionManager && typeof mp().sessionManager!.getSession === 'function'
        ? mp().sessionManager!.getSession()
        : undefined;

    const options = mergeObjects(
      { accountId: accountId },
      launcherOptions || {},
      mpSessionId ? { mpSessionId: mpSessionId } : {},
    );

    if (this.isPartnerInLocalLauncherTestGroup()) {
      const localLauncher = window.Rokt!.createLocalLauncher(options);
      this.initRoktLauncher(localLauncher);
    } else {
      window
        .Rokt!.createLauncher(options)
        .then((launcher) => this.initRoktLauncher(launcher))
        .catch((err: unknown) => {
          console.error('Error creating Rokt launcher:', err);
        });
    }
  }

  private initRoktLauncher(launcher: RoktLauncher): void {
    // Assign the launcher to a global variable for later access
    if (window.Rokt) {
      window.Rokt.currentLauncher = launcher;
    }
    // Locally cache the launcher and filters
    this.launcher = launcher;

    const roktFilters = mp().Rokt?.filters;

    if (!roktFilters) {
      console.warn('Rokt Kit: No filters have been set.');
    } else {
      this.filters = roktFilters;
      if (!roktFilters.filteredUser) {
        console.warn('Rokt Kit: No filtered user has been set.');
      }
    }

    // Kit must be initialized before attaching to the Rokt manager
    this.isInitialized = true;

    sendAdBlockMeasurementSignals(this.domain, this.integrationName);

    // Attaches the kit to the Rokt manager
    mp().Rokt.attachKit(this);
    this.processEventQueue();
  }

  private fetchOptimizely(): Record<string, unknown> {
    const forwarders = mp()
      ._getActiveForwarders()
      .filter((forwarder) => forwarder.name === 'Optimizely');

    try {
      if (forwarders.length > 0 && window.optimizely) {
        const optimizelyState = window.optimizely.get('state');
        if (!optimizelyState || !optimizelyState.getActiveExperimentIds) {
          return {};
        }
        const activeExperimentIds = optimizelyState.getActiveExperimentIds();
        const activeExperiments = activeExperimentIds.reduce((acc: Record<string, string>, expId: string) => {
          acc['rokt.custom.optimizely.experiment.' + expId + '.variationId'] =
            optimizelyState.getVariationMap()[expId].id;
          return acc;
        }, {});
        return activeExperiments;
      }
    } catch (error) {
      console.error('Error fetching Optimizely attributes:', error);
    }
    return {};
  }

  private isKitReady(): boolean {
    return !!(this.isInitialized && this.launcher);
  }

  private isPartnerInLocalLauncherTestGroup(): boolean {
    return !!(mp().config && mp().config!.isLocalLauncherEnabled && this.isAssignedToSampleGroup());
  }

  private isAssignedToSampleGroup(): boolean {
    const LOCAL_LAUNCHER_TEST_GROUP_THRESHOLD = 0.5;
    return Math.random() > LOCAL_LAUNCHER_TEST_GROUP_THRESHOLD;
  }

  private captureTiming(metricName: string): void {
    if (window && mp() && mp().captureTiming && metricName) {
      mp().captureTiming!(metricName);
    }
  }

  // ---- Public methods (mParticle Kit Callbacks) ----

  /**
   * Initializes the Rokt forwarder with settings from the mParticle server.
   */
  public init(
    settings: KitSettings,
    _service: unknown,
    testMode: boolean,
    _trackerId: unknown,
    filteredUserAttributes: Record<string, unknown>,
  ): void {
    const accountId = settings.accountId;
    const roktExtensions = extractRoktExtensions(settings.roktExtensions);
    this.userAttributes = filteredUserAttributes || {};
    this._onboardingExpProvider = settings.onboardingExpProvider;

    const placementEventMapping = parseSettingsString<PlacementEventMappingEntry>(settings.placementEventMapping);
    this.placementEventMappingLookup = generateMappedEventLookup(placementEventMapping);

    const placementEventAttributeMapping = parseSettingsString<EventAttributeMapping>(
      settings.placementEventAttributeMapping,
    );
    this.placementEventAttributeMappingLookup = generateMappedEventAttributeLookup(placementEventAttributeMapping);

    // Set dynamic OTHER_IDENTITY based on server settings
    if (settings.hashedEmailUserIdentityType) {
      this._mappedEmailSha256Key = settings.hashedEmailUserIdentityType.toLowerCase();
    }

    const domain = mp().Rokt?.domain;
    const launcherOptions = mergeObjects({}, (mp().Rokt?.launcherOptions as Record<string, unknown>) || {});
    this.integrationName = generateIntegrationName(launcherOptions.integrationName as string | undefined);
    launcherOptions.integrationName = this.integrationName;

    this.domain = domain;

    if (testMode) {
      this.testHelpers = {
        generateLauncherScript: generateLauncherScript,
        extractRoktExtensions: extractRoktExtensions,
        hashEventMessage: hashEventMessage,
        parseSettingsString: parseSettingsString,
        generateMappedEventLookup: generateMappedEventLookup,
        generateMappedEventAttributeLookup: generateMappedEventAttributeLookup,
        sendAdBlockMeasurementSignals: sendAdBlockMeasurementSignals,
        createAutoRemovedIframe: createAutoRemovedIframe,
        djb2: djb2,
        setAllowedOriginHashes: (hashes: number[]) => {
          RoktKit._allowedOriginHashes = hashes;
        },
      };
      this.attachLauncher(accountId, launcherOptions);
      return;
    }

    if (this.isLauncherReadyToAttach()) {
      this.attachLauncher(accountId, launcherOptions);
    } else {
      const target = document.head || document.body;
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = generateLauncherScript(domain, roktExtensions);
      script.async = true;
      script.crossOrigin = 'anonymous';
      (script as HTMLScriptElement & { fetchPriority: string }).fetchPriority = 'high';
      script.id = 'rokt-launcher';

      script.onload = () => {
        if (this.isLauncherReadyToAttach()) {
          this.attachLauncher(accountId, launcherOptions);
        } else {
          console.error('Rokt object is not available after script load.');
        }
      };

      script.onerror = (error) => {
        console.error('Error loading Rokt launcher script:', error);
      };

      target.appendChild(script);
      this.captureTiming(RoktKit.PERFORMANCE_MARKS.RoktScriptAppended);
    }
  }

  public process(event: MParticleEvent): void {
    if (!this.isKitReady()) {
      this.eventQueue.push(event);
      return;
    }

    this.sendEventStream(event);

    if (typeof mp().Rokt?.setLocalSessionAttribute !== 'function') {
      return;
    }

    if (!isEmpty(this.placementEventAttributeMappingLookup)) {
      this.applyPlacementEventAttributeMapping(event);
    }

    if (isEmpty(this.placementEventMappingLookup)) {
      return;
    }

    const hashedEvent = hashEventMessage(event.EventDataType ?? 0, event.EventCategory ?? 0, event.EventName ?? '');

    if (this.placementEventMappingLookup[String(hashedEvent)]) {
      const mappedValue = this.placementEventMappingLookup[String(hashedEvent)];
      mp().Rokt.setLocalSessionAttribute?.(mappedValue, true);
    }
  }

  public setExtensionData(partnerExtensionData: Record<string, unknown>): void {
    if (!this.isKitReady()) {
      console.error('Rokt Kit: Not initialized');
      return;
    }

    window.Rokt!.setExtensionData(partnerExtensionData);
  }

  public setUserAttribute(key: string, value: unknown): void {
    this.userAttributes[key] = value;
  }

  public removeUserAttribute(key: string): void {
    delete this.userAttributes[key];
  }

  public onUserIdentified(filteredUser: FilteredUser): void {
    this.filters.filteredUser = filteredUser;
    this.userAttributes = filteredUser.getAllUserAttributes();
    this.sendEventStream(this.buildIdentityEvent('identify', filteredUser));
  }

  public onLoginComplete(filteredUser: FilteredUser): void {
    this.userAttributes = filteredUser.getAllUserAttributes();
    this.sendEventStream(this.buildIdentityEvent('login', filteredUser));
  }

  public onLogoutComplete(filteredUser: FilteredUser): void {
    this.userAttributes = filteredUser.getAllUserAttributes();
    this.sendEventStream(this.buildIdentityEvent('logout', filteredUser));
  }

  public onModifyComplete(filteredUser: FilteredUser): void {
    this.userAttributes = filteredUser.getAllUserAttributes();
    this.sendEventStream(this.buildIdentityEvent('modify_user', filteredUser));
  }

  /**
   * Selects placements for Rokt Web SDK with merged attributes, filters, and experimentation options.
   */
  public selectPlacements(options: Record<string, unknown>): RoktSelection | Promise<RoktSelection> | undefined {
    const attributes = ((options && (options.attributes as Record<string, unknown>)) || {}) as Record<string, unknown>;
    const placementAttributes = mergeObjects(this.userAttributes, attributes);

    const filters = this.filters || {};
    const userAttributeFilters = (filters.userAttributeFilters as string[]) || [];
    const filteredUser = filters.filteredUser || null;
    const mpid =
      filteredUser && filteredUser.getMPID && typeof filteredUser.getMPID === 'function'
        ? filteredUser.getMPID()
        : null;

    let filteredAttributes: Record<string, unknown>;

    if (!filters) {
      console.warn('Rokt Kit: No filters available, using user attributes');
      filteredAttributes = placementAttributes;
    } else if (filters.filterUserAttributes) {
      filteredAttributes = filters.filterUserAttributes(placementAttributes, userAttributeFilters);
    } else {
      filteredAttributes = placementAttributes;
    }

    this.userAttributes = filteredAttributes;

    const optimizelyAttributes = this._onboardingExpProvider === 'Optimizely' ? this.fetchOptimizely() : {};

    const filteredUserIdentities = this.returnUserIdentities(filteredUser);

    const localSessionAttributes = this.returnLocalSessionAttributes();

    const selectPlacementsAttributes = mergeObjects(
      filteredUserIdentities as Record<string, unknown>,
      filteredAttributes,
      optimizelyAttributes,
      localSessionAttributes,
      { mpid: mpid },
    );

    const selectPlacementsOptions = mergeObjects(options, {
      attributes: selectPlacementsAttributes,
    });

    const selection = this.launcher!.selectPlacements(selectPlacementsOptions);

    // After selection resolves, sync the Rokt session ID back to mParticle
    if (selection && typeof (selection as Promise<RoktSelection>).then === 'function') {
      (selection as Promise<RoktSelection>)
        .then((sel) => {
          if (sel && sel.context && sel.context.sessionId) {
            sel.context.sessionId
              .then((sessionId) => {
                this.setRoktSessionId(sessionId);
                this.logSelectPlacementsEvent(selectPlacementsAttributes);
              })
              .catch(() => {
                this.logSelectPlacementsEvent(selectPlacementsAttributes);
              });
          } else {
            this.logSelectPlacementsEvent(selectPlacementsAttributes);
          }
        })
        .catch(() => {
          this.logSelectPlacementsEvent(selectPlacementsAttributes);
        });
    } else {
      this.logSelectPlacementsEvent(selectPlacementsAttributes);
    }

    return selection;
  }

  /**
   * Passes attributes to the Rokt Web SDK for client-side hashing.
   */
  public hashAttributes(attributes: Record<string, unknown>): Promise<Record<string, unknown>> | null {
    if (!this.isKitReady()) {
      console.error('Rokt Kit: Not initialized');
      return null;
    }
    return this.launcher!.hashAttributes(attributes);
  }

  /**
   * Enables optional Integration Launcher extensions before selecting placements.
   */
  public use(extensionName: string): Promise<unknown> {
    if (!this.isKitReady()) {
      console.error('Rokt Kit: Not initialized');
      return Promise.reject(new Error('Rokt Kit: Not initialized'));
    }
    if (!extensionName || !isString(extensionName)) {
      return Promise.reject(new Error('Rokt Kit: Invalid extension name'));
    }
    return this.launcher!.use(extensionName);
  }
}

// ============================================================
// Kit registration
// ============================================================

function getId(): number {
  return moduleId;
}

function register(config: { kits?: Record<string, unknown> }): void {
  if (!config) {
    window.console.log('You must pass a config object to register the kit ' + name);
    return;
  }
  if (!isObject(config)) {
    window.console.log("'config' must be an object. You passed in a " + typeof config);
    return;
  }

  if (isObject(config.kits)) {
    (config.kits as Record<string, unknown>)[name] = {
      constructor: RoktKit,
    };
  } else {
    config.kits = {};
    config.kits[name] = {
      constructor: RoktKit,
    };
  }
  window.console.log('Successfully registered ' + name + ' to your mParticle configuration');
}

if (typeof window !== 'undefined' && window.mParticle && mp().addForwarder) {
  mp().addForwarder({
    name: name,
    constructor: RoktKit,
    getId: getId,
  });
}

export { register };

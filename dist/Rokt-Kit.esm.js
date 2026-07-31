const $ = [
  "active_time_on_site_ms",
  "billingaddress1",
  "billingaddress2",
  "billingcity",
  "billingstate",
  "billingzipcode",
  "cartitems",
  "ccbin",
  "confirmationref",
  "conversiontype",
  "country",
  "couponcode",
  "currency",
  "language",
  "paymentserviceprovider",
  "paymentserviceproviderattribute",
  "paymenttype",
  "shippingaddress1",
  "shippingcity",
  "shippingcountry",
  "shippingmethod",
  "shippingstate",
  "shippingzipcode",
  "totalprice"
], Z = new Set($);
function z(n) {
  return Z.has(n.toLowerCase());
}
function S(n) {
  const e = {}, t = n || {}, i = Object.keys(t);
  for (let r = 0; r < i.length; r++) {
    const s = i[r];
    z(s) || (e[s] = t[s]);
  }
  return e;
}
const d = "Rokt", b = 181, ee = "selectPlacements", te = "apps.roktecommerce.com", ie = 0.1, ne = "ThankYouPageJourney", re = "rokt-launcher", se = "rokt-thank-you-element", oe = "userIdentifiedInWorkspace", ae = 3, w = "mpPageViews", ce = 25, le = "page_events", ue = "attr_", K = "title", de = 500, N = {
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  UNHANDLED_EXCEPTION: "UNHANDLED_EXCEPTION",
  IDENTITY_REQUEST: "IDENTITY_REQUEST",
  LOG_DELIVERY_FAILURE: "LOG_DELIVERY_FAILURE"
}, k = {
  ERROR: "ERROR",
  INFO: "INFO",
  WARNING: "WARNING"
}, he = "apps.rokt-api.com", pe = "/v1/log", ge = "/v1/errors", fe = 10;
function a() {
  return window.mParticle;
}
function M(n, e) {
  const i = [C(n), "/wsdk/integrations/launcher.js"].join("");
  return !e || e.length === 0 ? i : i + "?extensions=" + e.join(",");
}
function D(n) {
  return [C(n), "/rokt-elements/rokt-element-thank-you.js"].join("");
}
function C(n) {
  return ["https://", typeof n < "u" ? n : he].join("");
}
function B(n, e, t) {
  return n ? n.startsWith("http://") || n.startsWith("https://") ? n : "https://" + n : C(e) + t;
}
function x(n, e, t) {
  if (document.getElementById(n)) return;
  const i = document.head || document.body, r = document.createElement("script");
  r.id = n, r.type = "text/javascript", r.src = e, r.async = !0, r.crossOrigin = "anonymous", r.fetchPriority = "high", t?.onLoad && (r.onload = t.onLoad), t?.onError && (r.onerror = t.onError), i.appendChild(r);
}
function O(n) {
  return n != null && typeof n == "object" && Array.isArray(n) === !1;
}
function L(n) {
  if (!n)
    return [];
  try {
    return JSON.parse(n.replace(/&quot;/g, '"'));
  } catch {
    console.error("Settings string contains invalid JSON");
  }
  return [];
}
function Y(n) {
  const e = n ? L(n) : [], t = [], i = [];
  let r = !1;
  for (let s = 0; s < e.length; s++) {
    const o = e[s].value;
    o === "thank-you-journey" ? (r = !0, i.push(ne)) : t.push(o);
  }
  return {
    roktExtensionsQueryParams: t,
    legacyRoktExtensions: i,
    loadThankYouElement: r
  };
}
async function me(n, e) {
  const t = [];
  if (e)
    for (const i of n)
      t.push(e.use(i));
  return Promise.all(t);
}
function F(n) {
  if (!n)
    return {};
  const e = {};
  for (let t = 0; t < n.length; t++) {
    const i = n[t];
    e[i.jsmap] = i.value;
  }
  return e;
}
function j(n) {
  const e = {};
  if (!Array.isArray(n))
    return e;
  for (let t = 0; t < n.length; t++) {
    const i = n[t];
    if (!i || !m(i.value) || !m(i.map))
      continue;
    const r = i.value, s = i.map;
    e[r] || (e[r] = []), e[r].push({
      eventAttributeKey: s,
      conditions: Array.isArray(i.conditions) ? i.conditions : []
    });
  }
  return e;
}
function G(n, e, t) {
  return a().generateHash([n, e, t].join(""));
}
function T(n) {
  return n == null ? !0 : typeof n == "object" ? Object.keys(n).length === 0 : Array.isArray(n) ? n.length === 0 : !1;
}
function m(n) {
  return typeof n == "string";
}
function Ee(n) {
  let i = "mParticle_wsdkv_" + a().getVersion() + "_kitv_" + "1.29.0";
  return n && (i += "_" + n), i;
}
function q(n) {
  let e = 5381;
  for (let t = 0; t < n.length; t++)
    e = (e << 5) + e + n.charCodeAt(t), e = e & e;
  return e;
}
function P(n) {
  const e = document.createElement("iframe");
  e.style.display = "none", e.setAttribute("sandbox", "allow-scripts allow-same-origin"), e.src = n, e.onload = function() {
    e.onload = null, e.parentNode && e.parentNode.removeChild(e);
  };
  const t = document.body || document.head;
  t && t.appendChild(e);
}
function W(n, e) {
  const t = q(window.location.origin);
  if (_._allowedOriginHashes.indexOf(t) === -1 || Math.random() >= ie)
    return;
  const r = window.__rokt_li_guid__;
  if (!r)
    return;
  const s = window.location.href.split("?")[0].split("#")[0], o = "version=" + encodeURIComponent(e ?? "") + "&launcherInstanceGuid=" + encodeURIComponent(r) + "&pageUrl=" + encodeURIComponent(s);
  P("https://" + (n || "apps.rokt.com") + "/v1/wsdk-init/index.html?" + o), P(
    "https://" + te + "/v1/wsdk-init/index.html?" + o + "&isControl=true"
  );
}
function _e() {
  return typeof window < "u" && !!window.location?.search?.toLowerCase().includes("mp_enable_logging=true");
}
function ye() {
  return typeof window < "u" ? window.location?.href : void 0;
}
function Ie() {
  return typeof window < "u" ? window.navigator?.userAgent : void 0;
}
class J {
  constructor() {
    this._logCount = {};
  }
  incrementAndCheck(e) {
    const i = (this._logCount[e] || 0) + 1;
    return this._logCount[e] = i, i > fe;
  }
}
class U {
  constructor(e, t, i, r, s) {
    this._reporter = "mp-wsdk";
    const o = e.isLoggingEnabled;
    this._integrationName = t || "", this._launcherInstanceGuid = i, this._accountId = r || null, this._rateLimiter = s || new J(), this._isEnabled = _e() || o;
  }
  send(e, t, i, r, s, o) {
    if (!(!this._isEnabled || this._rateLimiter.incrementAndCheck(t)))
      try {
        const c = {
          additionalInformation: {
            message: i,
            version: this._integrationName
          },
          severity: t,
          code: r || N.UNKNOWN_ERROR,
          url: ye(),
          deviceInfo: Ie(),
          stackTrace: s,
          reporter: this._reporter,
          integration: this._integrationName
        }, u = {
          Accept: "text/plain;charset=UTF-8",
          "Content-Type": "application/json",
          "rokt-launcher-version": this._integrationName,
          "rokt-wsdk-version": "joint"
        };
        this._launcherInstanceGuid && (u["rokt-launcher-instance-guid"] = this._launcherInstanceGuid), this._accountId && (u["rokt-account-id"] = this._accountId), fetch(e, {
          method: "POST",
          headers: u,
          body: JSON.stringify(c)
        }).then((l) => {
          if (!l.ok) {
            const h = new Error("HTTP " + l.status + " from log endpoint");
            throw h.statusCode = l.status, h;
          }
        }).catch((l) => {
          console.error("ReportingTransport: Failed to send log", l), o && o(l);
        });
      } catch (c) {
        console.error("ReportingTransport: Failed to send log", c), o && o(c);
      }
  }
}
class H {
  constructor(e, t, i, r, s) {
    this._transport = new U(e, t, i, r, s), this._errorUrl = B(e?.errorUrl, e?.integrationDomain, ge);
  }
  report(e) {
    if (!e) return;
    const t = e.severity || k.ERROR;
    this._transport.send(this._errorUrl, t, e.message, e.code, e.stackTrace);
  }
}
class V {
  constructor(e, t, i, r, s, o) {
    this._transport = new U(e, i, r, s, o), this._loggingUrl = B(e?.loggingUrl, e?.integrationDomain, pe), this._errorReportingService = t;
  }
  log(e) {
    e && this._transport.send(
      this._loggingUrl,
      k.INFO,
      e.message,
      e.code,
      void 0,
      (t) => {
        if (this._errorReportingService) {
          const i = typeof t.statusCode == "number";
          this._errorReportingService.report({
            message: "LoggingService: Failed to send log: " + t.message,
            code: N.LOG_DELIVERY_FAILURE,
            severity: i ? k.ERROR : k.WARNING
          });
        }
      }
    );
  }
}
const g = class g {
  constructor() {
    this.name = d, this.id = b, this.moduleId = b, this.isInitialized = !1, this.launcher = null, this.filters = {}, this.userAttributes = {}, this.userIdentifiedInWorkspace = !1, this.testHelpers = null, this.placementEventMappingLookup = {}, this.placementEventAttributeMappingLookup = {}, this.integrationName = null, this.errorReportingService = null, this.loggingService = null, this._thankYouElementOnLoadCallback = null, this._isThankYouElementLoaded = !1, this._workspaceSearchInFlightPromise = null;
  }
  // ---- Private helpers ----
  getEventAttributeValue(e, t) {
    const i = e && e.EventAttributes;
    return !i || typeof i[t] > "u" ? null : i[t];
  }
  doesEventAttributeConditionMatch(e, t) {
    if (!e || !m(e.operator))
      return !1;
    const i = e.operator.toLowerCase(), r = e.attributeValue;
    return i === "exists" ? t !== null : t == null ? !1 : i === "equals" ? String(t) === String(r) : i === "contains" ? String(t).indexOf(String(r)) !== -1 : !1;
  }
  doesEventMatchRule(e, t) {
    if (!t || !m(t.eventAttributeKey))
      return !1;
    const i = t.conditions;
    if (!Array.isArray(i))
      return !1;
    const r = this.getEventAttributeValue(e, t.eventAttributeKey);
    if (i.length === 0)
      return r !== null;
    for (let s = 0; s < i.length; s++)
      if (!this.doesEventAttributeConditionMatch(i[s], r))
        return !1;
    return !0;
  }
  applyPlacementEventAttributeMapping(e) {
    const t = Object.keys(this.placementEventAttributeMappingLookup);
    for (let i = 0; i < t.length; i++) {
      const r = t[i], s = this.placementEventAttributeMappingLookup[r];
      if (T(s))
        continue;
      let o = !0;
      for (let c = 0; c < s.length; c++)
        if (!this.doesEventMatchRule(e, s[c])) {
          o = !1;
          break;
        }
      o && a().Rokt.setLocalSessionAttribute?.(r, !0);
    }
  }
  // Appends a page-view record to the persisted list under PAGE_VIEWS_KEY,
  // capping at MAX_PAGE_VIEWS (oldest evicted). Wrapped so a malformed event
  // can never throw out of the forwarder. Callers must confirm the event is a
  // page view and that setLocalSessionAttribute is available.
  capturePageView(e) {
    try {
      const t = a().Rokt.getLocalSessionAttributes?.()?.[w], i = Array.isArray(t) ? t : [];
      for (i.push({
        name: e.EventName,
        pageUrl: window.location.href,
        sourceMessageId: e.SourceMessageId,
        timestamp: e.Timestamp,
        activeTimeOnSite: e.ActiveTimeOnSite,
        eventAttributes: e.EventAttributes
      }); i.length > ce; )
        i.shift();
      a().Rokt.setLocalSessionAttribute?.(w, i);
    } catch (t) {
      console.error("Rokt Kit: Failed to capture page view", t);
    }
  }
  isLauncherReadyToAttach() {
    return !!window.Rokt && typeof window.Rokt.createLauncher == "function";
  }
  /**
   * Returns the user identities from the filtered user, if any.
   */
  returnUserIdentities(e) {
    if (!e || !e.getUserIdentities)
      return {};
    const t = e.getUserIdentities().userIdentities;
    return this.replaceOtherIdentityWithEmailsha256(t);
  }
  returnLocalSessionAttributes() {
    return !a().Rokt || typeof a().Rokt.getLocalSessionAttributes != "function" ? {} : a().Rokt.getLocalSessionAttributes();
  }
  buildPageEvents(e) {
    return e.map((t, i) => {
      const r = {};
      if (t.eventAttributes)
        for (const [o, c] of Object.entries(t.eventAttributes))
          o !== K && (r[`${ue}${o}`] = c);
      r.event_name = t.name, r.page_name = t.eventAttributes?.[K], r.pageUrl = t.pageUrl, r.sourceMessageId = t.sourceMessageId, r.timestamp = t.timestamp, r.activeTimeOnSite = t.activeTimeOnSite;
      const s = e[i + 1];
      if (s && typeof s.activeTimeOnSite == "number" && typeof t.activeTimeOnSite == "number") {
        const o = s.activeTimeOnSite - t.activeTimeOnSite;
        o >= 0 && (r.timeOnPage = o);
      }
      return r;
    });
  }
  replaceOtherIdentityWithEmailsha256(e) {
    const t = { ...e || {} }, i = this._mappedEmailSha256Key;
    return i && e[i] && (t[g.EMAIL_SHA256_KEY] = e[i]), i && delete t[i], t;
  }
  logSelectPlacementsEvent(e) {
    if (!window.mParticle || typeof a().logEvent != "function" || !O(e))
      return;
    const t = a().EventType.Other;
    a().logEvent(ee, t, e);
  }
  setRoktSessionId(e) {
    if (!(!e || typeof e != "string"))
      try {
        const t = a().getInstance();
        t && typeof t.setIntegrationAttribute == "function" && t.setIntegrationAttribute(b, {
          roktSessionId: e
        });
      } catch {
      }
  }
  attachLauncher(e, t, i = []) {
    const r = a() && a().sessionManager && typeof a().sessionManager.getSession == "function" ? a().sessionManager.getSession() : void 0, s = {
      accountId: e,
      ...t || {},
      ...r ? { mpSessionId: r } : {}
    };
    let o;
    this.isPartnerInLocalLauncherTestGroup() ? o = Promise.resolve(window.Rokt.createLocalLauncher(s)) : o = window.Rokt.createLauncher(s), o.then(async (c) => {
      await me(i, c), this.initRoktLauncher(c);
    }).catch((c) => {
      console.error("Error creating Rokt launcher:", c);
    });
  }
  initRoktLauncher(e) {
    window.Rokt && (window.Rokt.currentLauncher = e), this.launcher = e;
    const t = a().Rokt?.filters;
    t ? (this.filters = t, t.filteredUser ? this._workspaceSearchInFlightPromise = this.search(t.filteredUser) : console.warn("Rokt Kit: No filtered user has been set.")) : console.warn("Rokt Kit: No filters have been set."), this.isInitialized = !0, W(this.domain, this.integrationName), a().Rokt.attachKit(this);
  }
  fetchOptimizely() {
    const e = a()._getActiveForwarders().filter((t) => t.name === "Optimizely");
    try {
      if (e.length > 0 && window.optimizely) {
        const t = window.optimizely.get("state");
        return !t || !t.getActiveExperimentIds ? {} : t.getActiveExperimentIds().reduce((s, o) => (s["rokt.custom.optimizely.experiment." + o + ".variationId"] = t.getVariationMap()[o].id, s), {});
      }
    } catch (t) {
      console.error("Error fetching Optimizely attributes:", t);
    }
    return {};
  }
  isKitReady() {
    return !!(this.isInitialized && this.launcher);
  }
  isPartnerInLocalLauncherTestGroup() {
    return !!(a().config && a().config.isLocalLauncherEnabled && this.isAssignedToSampleGroup());
  }
  isAssignedToSampleGroup() {
    return Math.random() > 0.5;
  }
  captureTiming(e) {
    window && a() && a().captureTiming && e && a().captureTiming(e);
  }
  // ---- Public methods (mParticle Kit Callbacks) ----
  /**
   * Initializes the Rokt forwarder with settings from the mParticle server.
   */
  init(e, t, i, r, s) {
    const o = e, c = o.accountId;
    this.userAttributes = S(s), this._onboardingExpProvider = o.onboardingExpProvider;
    const u = L(o.placementEventMapping);
    this.placementEventMappingLookup = F(u);
    const l = L(
      o.placementEventAttributeMapping
    );
    this.placementEventAttributeMappingLookup = j(l), o.hashedEmailUserIdentityType && (this._mappedEmailSha256Key = o.hashedEmailUserIdentityType.toLowerCase()), this._workspaceIdSyncApiKey = m(o.workspaceIdSyncApiKey) ? o.workspaceIdSyncApiKey : void 0;
    const h = a().Rokt?.domain, { roktExtensionsQueryParams: v, legacyRoktExtensions: E, loadThankYouElement: R } = Y(
      o.roktExtensions
    ), p = {
      ...a().Rokt?.launcherOptions || {}
    };
    this.integrationName = Ee(p.integrationName), p.integrationName = this.integrationName, this.domain = h;
    const y = {
      loggingUrl: o.loggingUrl,
      errorUrl: o.errorUrl,
      integrationDomain: h,
      isLoggingEnabled: a().config?.isLoggingEnabled === !0
    }, I = new H(
      y,
      this.integrationName,
      window.__rokt_li_guid__,
      o.accountId
    ), A = new V(
      y,
      I,
      this.integrationName,
      window.__rokt_li_guid__,
      o.accountId
    );
    return this.errorReportingService = I, this.loggingService = A, a()._registerErrorReportingService && a()._registerErrorReportingService(I), a()._registerLoggingService && a()._registerLoggingService(A), i ? (this.testHelpers = {
      generateLauncherScript: M,
      generateThankYouElementScript: D,
      extractRoktExtensionConfig: Y,
      hashEventMessage: G,
      parseSettingsString: L,
      generateMappedEventLookup: F,
      generateMappedEventAttributeLookup: j,
      sendAdBlockMeasurementSignals: W,
      createAutoRemovedIframe: P,
      djb2: q,
      setAllowedOriginHashes: (f) => {
        g._allowedOriginHashes = f;
      },
      ReportingTransport: U,
      ErrorReportingService: H,
      LoggingService: V,
      RateLimiter: J,
      ErrorCodes: N,
      WSDKErrorSeverity: k
    }, this.attachLauncher(c, p), "Successfully initialized: " + d) : (R && (a().Rokt.flushOnShoppableAdsReadyMessageQueue?.(this), x(se, D(h), {
      onLoad: () => {
        this._isThankYouElementLoaded = !0, this._thankYouElementOnLoadCallback && this._thankYouElementOnLoadCallback();
      },
      onError: (f) => {
        console.error("Error loading Rokt Thank You Element script:", f);
      }
    })), this.isLauncherReadyToAttach() ? this.attachLauncher(c, p, E) : (x(re, M(h, v), {
      onLoad: () => {
        this.isLauncherReadyToAttach() ? this.attachLauncher(c, p, E) : console.error("Rokt object is not available after script load.");
      },
      onError: (f) => {
        console.error("Error loading Rokt launcher script:", f);
      }
    }), this.captureTiming(g.PERFORMANCE_MARKS.RoktScriptAppended)), "Successfully initialized: " + d);
  }
  process(e) {
    if (!this.isKitReady())
      return "Kit not ready for forwarder: " + d;
    if (typeof a().Rokt?.setLocalSessionAttribute == "function" && (e.EventDataType === ae && (console.warn("caputre Event", e), this.capturePageView(e)), T(this.placementEventAttributeMappingLookup) || this.applyPlacementEventAttributeMapping(e), !T(this.placementEventMappingLookup))) {
      const t = G(e.EventDataType, e.EventCategory, e.EventName ?? "");
      this.placementEventMappingLookup[String(t)] && a().Rokt.setLocalSessionAttribute?.(this.placementEventMappingLookup[String(t)], !0);
    }
    return "Successfully sent to forwarder: " + d;
  }
  setExtensionData(e) {
    if (!this.isKitReady()) {
      console.error("Rokt Kit: Not initialized");
      return;
    }
    window.Rokt.setExtensionData(e);
  }
  setUserAttribute(e, t) {
    return z(e) || (this.userAttributes[e] = t), "Successfully set user attribute for forwarder: " + d;
  }
  removeUserAttribute(e) {
    return delete this.userAttributes[e], "Successfully removed user attribute for forwarder: " + d;
  }
  handleIdentityComplete(e, t) {
    return this.userAttributes = S(e.getAllUserAttributes()), "Successfully called " + t + " for forwarder: " + d;
  }
  onUserIdentified(e) {
    const t = e;
    return this.filters.filteredUser = t, this._workspaceSearchInFlightPromise = this.search(t), this.handleIdentityComplete(e, "onUserIdentified");
  }
  search(e) {
    const t = this._workspaceIdSyncApiKey;
    if (!t)
      return this.userIdentifiedInWorkspace = !1, this._workspaceLastSearchedIdentitiesKey = void 0, Promise.resolve();
    const i = a().Identity?.search;
    if (typeof i != "function")
      return this.userIdentifiedInWorkspace = !1, this._workspaceLastSearchedIdentitiesKey = void 0, Promise.resolve();
    const r = e.getUserIdentities ? e.getUserIdentities().userIdentities : null, s = {};
    if (r)
      for (const u of Object.keys(r)) {
        const l = r[u];
        m(l) && l.length > 0 && (s[u] = l);
      }
    const o = Object.keys(s);
    if (o.length === 0)
      return this.userIdentifiedInWorkspace = !1, this._workspaceLastSearchedIdentitiesKey = void 0, Promise.resolve();
    const c = o.sort().map((u) => `${u}=${s[u]}`).join("&");
    return c === this._workspaceLastSearchedIdentitiesKey ? this._workspaceSearchInFlightPromise || Promise.resolve() : (this.userIdentifiedInWorkspace = !1, this._workspaceLastSearchedIdentitiesKey = c, new Promise((u) => {
      try {
        i(t, s, (l) => {
          l?.httpCode === 200 && (this.userIdentifiedInWorkspace = !0), u();
        });
      } catch (l) {
        console.error("Rokt Kit: Workspace IDSync search failed", l), this._workspaceLastSearchedIdentitiesKey = void 0, u();
      }
    }));
  }
  onLoginComplete(e, t) {
    return this.handleIdentityComplete(e, "onLoginComplete");
  }
  onLogoutComplete(e, t) {
    return this.userIdentifiedInWorkspace = !1, this._workspaceSearchInFlightPromise = null, this._workspaceLastSearchedIdentitiesKey = void 0, this.handleIdentityComplete(e, "onLogoutComplete");
  }
  onModifyComplete(e, t) {
    return this.handleIdentityComplete(e, "onModifyComplete");
  }
  /**
   * Selects placements for Rokt Web SDK with merged attributes, filters, and experimentation options.
   *
   * If a Workspace IDSync search is in flight from a recent onUserIdentified
   * call, this method waits up to `WORKSPACE_SEARCH_SELECT_TIMEOUT_MS` for it
   * to settle so the first placement call can include the
   * `userIdentifiedInWorkspace` flag without racing the network response.
   * The timeout protects against a stalled or slow search blocking placement
   * rendering — if it fires, selectPlacements proceeds without the flag.
   *
   * Implementation note: this method stays non-async deliberately. First,
   * the public return type is `RoktSelection | Promise<RoktSelection> |
   * undefined` — a superset of the `RoktSelection | Promise<RoktSelection>`
   * shape declared for `RoktLauncher.selectPlacements` above (line ~70).
   * Marking this `async` would narrow it to `Promise<RoktSelection |
   * undefined>` and silently change the contract for callers that read
   * the result synchronously. Second, `RoktSelection` has an optional
   * `then?` member, so TS treats it as ambiguously promise-like and
   * rejects it as the awaited return of an async function (TS1058) —
   * working around that would require a cast or wrapping every return in
   * `Promise.resolve(...)`. The inner work runs in `_dispatchPlacements`;
   * this wrapper just gates it on the in-flight search via `Promise.race`.
   */
  selectPlacements(e) {
    if (this._workspaceSearchInFlightPromise) {
      const t = this._workspaceSearchInFlightPromise;
      return Promise.race([
        t,
        new Promise((i) => setTimeout(i, de))
      ]).then(() => this._dispatchPlacements(e));
    }
    return this._dispatchPlacements(e);
  }
  _dispatchPlacements(e) {
    const t = e && e.attributes || {}, r = { ...S(this.userAttributes), ...t }, s = this.filters || {}, o = s.userAttributeFilters || [], c = s.filteredUser || null, u = c ? c.getMPID() : null;
    let l;
    s ? s.filterUserAttributes ? l = s.filterUserAttributes(r, o) : l = r : (console.warn("Rokt Kit: No filters available, using user attributes"), l = r), this.userAttributes = S(l);
    const h = this._onboardingExpProvider === "Optimizely" ? this.fetchOptimizely() : {}, v = this.returnUserIdentities(c), E = this.returnLocalSessionAttributes(), R = E[w], p = Array.isArray(R) ? this.buildPageEvents(R) : [];
    delete E[w];
    const y = {
      ...v,
      ...l,
      ...h,
      ...E,
      ...p.length ? { [le]: p } : {},
      ...this.userIdentifiedInWorkspace ? { [oe]: !0 } : {},
      mpid: u
    }, I = { ...e, attributes: y }, A = this.launcher.selectPlacements(I), f = () => this.logSelectPlacementsEvent(y);
    return Promise.resolve(A).then((Q) => Q?.context?.sessionId?.then((X) => this.setRoktSessionId(X))).catch(() => {
    }).finally(f), A;
  }
  /**
   * Passes attributes to the Rokt Web SDK for client-side hashing.
   */
  hashAttributes(e) {
    return this.isKitReady() ? this.launcher.hashAttributes(e) : (console.error("Rokt Kit: Not initialized"), null);
  }
  /**
   * Enables optional Integration Launcher extensions before selecting placements.
   *
   * @deprecated This functionality has been internalized and will be removed in a future release.
   */
  use(e) {
    return this.isKitReady() ? !e || !m(e) ? Promise.reject(new Error("Rokt Kit: Invalid extension name")) : this.launcher.use(e) : (console.error("Rokt Kit: Not initialized"), Promise.reject(new Error("Rokt Kit: Not initialized")));
  }
  /**
   * Registers a callback to be invoked once rokt-thank-you-element.js becomes available.
   */
  onShoppableAdsReady(e) {
    this._isThankYouElementLoaded ? e() : this._thankYouElementOnLoadCallback = e;
  }
};
g._allowedOriginHashes = [-553112570, 549508659], g.PERFORMANCE_MARKS = {
  RoktScriptAppended: "mp:RoktScriptAppended"
}, g.EMAIL_SHA256_KEY = "emailsha256";
let _ = g;
function Ae() {
  return b;
}
function ke(n) {
  if (!n) {
    window.console.log("You must pass a config object to register the kit " + d);
    return;
  }
  if (!O(n)) {
    window.console.log("'config' must be an object. You passed in a " + typeof n);
    return;
  }
  O(n.kits) ? n.kits[d] = {
    constructor: _
  } : (n.kits = {}, n.kits[d] = {
    constructor: _
  }), window.console.log("Successfully registered " + d + " to your mParticle configuration");
}
typeof window < "u" && window.mParticle && a().addForwarder && a().addForwarder({
  name: d,
  constructor: _,
  getId: Ae
});
export {
  ke as register
};
//# sourceMappingURL=Rokt-Kit.esm.js.map

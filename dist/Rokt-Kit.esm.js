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
function J(n) {
  return Z.has(n.toLowerCase());
}
function R(n) {
  const e = {}, t = n || {}, i = Object.keys(t);
  for (let r = 0; r < i.length; r++) {
    const s = i[r];
    J(s) || (e[s] = t[s]);
  }
  return e;
}
const d = "Rokt", w = 181, ee = "selectPlacements", te = "apps.roktecommerce.com", ie = 0.1, ne = "ThankYouPageJourney", re = "rokt-launcher", se = "rokt-thank-you-element", oe = "userIdentifiedInWorkspace", ae = 3, ce = 2, N = "mpPageViews", le = 25, ue = "page_events", de = 500, P = {
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  UNHANDLED_EXCEPTION: "UNHANDLED_EXCEPTION",
  IDENTITY_REQUEST: "IDENTITY_REQUEST",
  LOG_DELIVERY_FAILURE: "LOG_DELIVERY_FAILURE"
}, m = {
  ERROR: "ERROR",
  INFO: "INFO",
  WARNING: "WARNING"
}, he = "apps.rokt-api.com", pe = "/v1/log", ge = "/v1/errors", fe = 10;
function a() {
  return window.mParticle;
}
function K() {
  try {
    const n = window.localStorage.getItem(N);
    if (n === null)
      return [];
    const e = JSON.parse(n);
    return Array.isArray(e) ? e : [];
  } catch {
    return [];
  }
}
function me(n) {
  window.localStorage.setItem(N, JSON.stringify(n));
}
function M() {
  window.localStorage.removeItem(N);
}
function D(n, e) {
  const i = [C(n), "/wsdk/integrations/launcher.js"].join("");
  return !e || e.length === 0 ? i : i + "?extensions=" + e.join(",");
}
function F(n) {
  return [C(n), "/rokt-elements/rokt-element-thank-you.js"].join("");
}
function C(n) {
  return ["https://", typeof n < "u" ? n : he].join("");
}
function q(n, e, t) {
  return n ? n.startsWith("http://") || n.startsWith("https://") ? n : "https://" + n : C(e) + t;
}
function x(n, e, t) {
  if (document.getElementById(n)) return;
  const i = document.head || document.body, r = document.createElement("script");
  r.id = n, r.type = "text/javascript", r.src = e, r.async = !0, r.crossOrigin = "anonymous", r.fetchPriority = "high", t?.onLoad && (r.onload = t.onLoad), t?.onError && (r.onerror = t.onError), i.appendChild(r);
}
function T(n) {
  return n != null && typeof n == "object" && Array.isArray(n) === !1;
}
function v(n) {
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
  const e = n ? v(n) : [], t = [], i = [];
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
async function Ee(n, e) {
  const t = [];
  if (e)
    for (const i of n)
      t.push(e.use(i));
  return Promise.all(t);
}
function G(n) {
  if (!n)
    return {};
  const e = {};
  for (let t = 0; t < n.length; t++) {
    const i = n[t];
    e[i.jsmap] = i.value;
  }
  return e;
}
function W(n) {
  const e = {};
  if (!Array.isArray(n))
    return e;
  for (let t = 0; t < n.length; t++) {
    const i = n[t];
    if (!i || !E(i.value) || !E(i.map))
      continue;
    const r = i.value, s = i.map;
    e[r] || (e[r] = []), e[r].push({
      eventAttributeKey: s,
      conditions: Array.isArray(i.conditions) ? i.conditions : []
    });
  }
  return e;
}
function j(n, e, t) {
  return a().generateHash([n, e, t].join(""));
}
function L(n) {
  return n == null ? !0 : typeof n == "object" ? Object.keys(n).length === 0 : Array.isArray(n) ? n.length === 0 : !1;
}
function E(n) {
  return typeof n == "string";
}
function _e(n) {
  try {
    const e = new URL(n);
    return e.search = "", e.toString();
  } catch {
    return n;
  }
}
function ye(n) {
  let i = "mParticle_wsdkv_" + a().getVersion() + "_kitv_" + "1.30.2";
  return n && (i += "_" + n), i;
}
function B(n) {
  let e = 5381;
  for (let t = 0; t < n.length; t++)
    e = (e << 5) + e + n.charCodeAt(t), e = e & e;
  return e;
}
function O(n) {
  const e = document.createElement("iframe");
  e.style.display = "none", e.setAttribute("sandbox", "allow-scripts allow-same-origin"), e.src = n, e.onload = function() {
    e.onload = null, e.parentNode && e.parentNode.removeChild(e);
  };
  const t = document.body || document.head;
  t && t.appendChild(e);
}
function H(n, e) {
  const t = B(window.location.origin);
  if (y._allowedOriginHashes.indexOf(t) === -1 || Math.random() >= ie)
    return;
  const r = window.__rokt_li_guid__;
  if (!r)
    return;
  const s = window.location.href.split("?")[0].split("#")[0], o = "version=" + encodeURIComponent(e ?? "") + "&launcherInstanceGuid=" + encodeURIComponent(r) + "&pageUrl=" + encodeURIComponent(s);
  O("https://" + (n || "apps.rokt.com") + "/v1/wsdk-init/index.html?" + o), O(
    "https://" + te + "/v1/wsdk-init/index.html?" + o + "&isControl=true"
  );
}
function Ie() {
  return typeof window < "u" && !!window.location?.search?.toLowerCase().includes("mp_enable_logging=true");
}
function Se() {
  return typeof window < "u" ? window.location?.href : void 0;
}
function ke() {
  return typeof window < "u" ? window.navigator?.userAgent : void 0;
}
class Q {
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
    this._integrationName = t || "", this._launcherInstanceGuid = i, this._accountId = r || null, this._rateLimiter = s || new Q(), this._isEnabled = Ie() || o;
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
          code: r || P.UNKNOWN_ERROR,
          url: Se(),
          deviceInfo: ke(),
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
class V {
  constructor(e, t, i, r, s) {
    this._transport = new U(e, t, i, r, s), this._errorUrl = q(e?.errorUrl, e?.integrationDomain, ge);
  }
  report(e) {
    if (!e) return;
    const t = e.severity || m.ERROR;
    this._transport.send(this._errorUrl, t, e.message, e.code, e.stackTrace);
  }
}
class z {
  constructor(e, t, i, r, s, o) {
    this._transport = new U(e, i, r, s, o), this._loggingUrl = q(e?.loggingUrl, e?.integrationDomain, pe), this._errorReportingService = t;
  }
  log(e) {
    e && this._transport.send(
      this._loggingUrl,
      m.INFO,
      e.message,
      e.code,
      void 0,
      (t) => {
        if (this._errorReportingService) {
          const i = typeof t.statusCode == "number";
          this._errorReportingService.report({
            message: "LoggingService: Failed to send log: " + t.message,
            code: P.LOG_DELIVERY_FAILURE,
            severity: i ? m.ERROR : m.WARNING
          });
        }
      }
    );
  }
}
const f = class f {
  constructor() {
    this.name = d, this.id = w, this.moduleId = w, this.isInitialized = !1, this.launcher = null, this.filters = {}, this.userAttributes = {}, this.userIdentifiedInWorkspace = !1, this.testHelpers = null, this.placementEventMappingLookup = {}, this.placementEventAttributeMappingLookup = {}, this.integrationName = null, this.errorReportingService = null, this.loggingService = null, this._thankYouElementOnLoadCallback = null, this._isThankYouElementLoaded = !1, this._workspaceSearchInFlightPromise = null;
  }
  // ---- Private helpers ----
  getEventAttributeValue(e, t) {
    const i = e && e.EventAttributes;
    return !i || typeof i[t] > "u" ? null : i[t];
  }
  doesEventAttributeConditionMatch(e, t) {
    if (!e || !E(e.operator))
      return !1;
    const i = e.operator.toLowerCase(), r = e.attributeValue;
    return i === "exists" ? t !== null : t == null ? !1 : i === "equals" ? String(t) === String(r) : i === "contains" ? String(t).indexOf(String(r)) !== -1 : !1;
  }
  doesEventMatchRule(e, t) {
    if (!t || !E(t.eventAttributeKey))
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
      if (L(s))
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
  capturePageView(e) {
    let t;
    try {
      t = _e(window.location.href);
      const i = K(), r = {
        pageUrl: t,
        sourceMessageId: e.SourceMessageId,
        timestamp: e.Timestamp
      };
      for (Number.isFinite(e.ActiveTimeOnSite) && (r.activeTimeOnSite = e.ActiveTimeOnSite), i.push(r); i.length > le; )
        i.shift();
      me(i);
    } catch (i) {
      this.errorReportingService?.report({
        message: `Rokt Kit: Failed to capture page view for ${t}`,
        code: "PAGE_VIEW_CAPTURE_FAILED",
        severity: m.INFO,
        stackTrace: i instanceof Error ? i.stack : void 0
      });
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
      const r = {
        pageUrl: t.pageUrl,
        sourceMessageId: t.sourceMessageId,
        timestamp: t.timestamp
      }, s = t.activeTimeOnSite, o = s !== void 0 && Number.isFinite(s);
      o && (r.activeTimeOnSite = s);
      const u = e[i + 1]?.activeTimeOnSite, l = u !== void 0 && Number.isFinite(u);
      if (o && l) {
        const h = u - s;
        h >= 0 && (r.activeTimeOnPage = h);
      }
      return r;
    });
  }
  replaceOtherIdentityWithEmailsha256(e) {
    const t = { ...e || {} }, i = this._mappedEmailSha256Key;
    return i && e[i] && (t[f.EMAIL_SHA256_KEY] = e[i]), i && delete t[i], t;
  }
  logSelectPlacementsEvent(e) {
    if (!window.mParticle || typeof a().logEvent != "function" || !T(e))
      return;
    const t = a().EventType.Other;
    a().logEvent(ee, t, e);
  }
  setRoktSessionId(e) {
    if (!(!e || typeof e != "string"))
      try {
        const t = a().getInstance();
        t && typeof t.setIntegrationAttribute == "function" && t.setIntegrationAttribute(w, {
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
      await Ee(i, c), this.initRoktLauncher(c);
    }).catch((c) => {
      console.error("Error creating Rokt launcher:", c);
    });
  }
  initRoktLauncher(e) {
    window.Rokt && (window.Rokt.currentLauncher = e), this.launcher = e;
    const t = a().Rokt?.filters;
    t ? (this.filters = t, t.filteredUser ? this._workspaceSearchInFlightPromise = this.search(t.filteredUser) : console.warn("Rokt Kit: No filtered user has been set.")) : console.warn("Rokt Kit: No filters have been set."), this.isInitialized = !0, H(this.domain, this.integrationName), a().Rokt.attachKit(this);
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
  // When the partner has opted out of targeting (noTargeting launcher option),
  // the kit must not collect behavioral targeting signals such as page views.
  isTargetingDisabled() {
    return a().Rokt?.launcherOptions?.noTargeting === !0;
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
    this.userAttributes = R(s), this._onboardingExpProvider = o.onboardingExpProvider;
    const u = v(o.placementEventMapping);
    this.placementEventMappingLookup = G(u);
    const l = v(
      o.placementEventAttributeMapping
    );
    this.placementEventAttributeMappingLookup = W(l), o.hashedEmailUserIdentityType && (this._mappedEmailSha256Key = o.hashedEmailUserIdentityType.toLowerCase()), this._workspaceIdSyncApiKey = E(o.workspaceIdSyncApiKey) ? o.workspaceIdSyncApiKey : void 0;
    const h = a().Rokt?.domain, { roktExtensionsQueryParams: b, legacyRoktExtensions: I, loadThankYouElement: S } = Y(
      o.roktExtensions
    ), g = {
      ...a().Rokt?.launcherOptions || {}
    };
    this.integrationName = ye(g.integrationName), g.integrationName = this.integrationName, this.domain = h;
    const k = {
      loggingUrl: o.loggingUrl,
      errorUrl: o.errorUrl,
      integrationDomain: h,
      isLoggingEnabled: a().config?.isLoggingEnabled === !0
    }, _ = new V(
      k,
      this.integrationName,
      window.__rokt_li_guid__,
      o.accountId
    ), A = new z(
      k,
      _,
      this.integrationName,
      window.__rokt_li_guid__,
      o.accountId
    );
    if (this.errorReportingService = _, this.loggingService = A, this.isTargetingDisabled())
      try {
        M();
      } catch (p) {
        this.errorReportingService?.report({
          message: "Rokt Kit: Failed to clear page views when targeting is disabled",
          code: "PAGE_VIEW_CAPTURE_FAILED",
          severity: m.INFO,
          stackTrace: p instanceof Error ? p.stack : void 0
        });
      }
    return a()._registerErrorReportingService && a()._registerErrorReportingService(_), a()._registerLoggingService && a()._registerLoggingService(A), i ? (this.testHelpers = {
      generateLauncherScript: D,
      generateThankYouElementScript: F,
      extractRoktExtensionConfig: Y,
      hashEventMessage: j,
      parseSettingsString: v,
      generateMappedEventLookup: G,
      generateMappedEventAttributeLookup: W,
      sendAdBlockMeasurementSignals: H,
      createAutoRemovedIframe: O,
      djb2: B,
      setAllowedOriginHashes: (p) => {
        f._allowedOriginHashes = p;
      },
      ReportingTransport: U,
      ErrorReportingService: V,
      LoggingService: z,
      RateLimiter: Q,
      ErrorCodes: P,
      WSDKErrorSeverity: m
    }, this.attachLauncher(c, g), "Successfully initialized: " + d) : (S && (a().Rokt.flushOnShoppableAdsReadyMessageQueue?.(this), x(se, F(h), {
      onLoad: () => {
        this._isThankYouElementLoaded = !0, this._thankYouElementOnLoadCallback && this._thankYouElementOnLoadCallback();
      },
      onError: (p) => {
        console.error("Error loading Rokt Thank You Element script:", p);
      }
    })), this.isLauncherReadyToAttach() ? this.attachLauncher(c, g, I) : (x(re, D(h, b), {
      onLoad: () => {
        this.isLauncherReadyToAttach() ? this.attachLauncher(c, g, I) : console.error("Rokt object is not available after script load.");
      },
      onError: (p) => {
        console.error("Error loading Rokt launcher script:", p);
      }
    }), this.captureTiming(f.PERFORMANCE_MARKS.RoktScriptAppended)), "Successfully initialized: " + d);
  }
  process(e) {
    if (!this.isTargetingDisabled() && (e.EventDataType === ae && this.capturePageView(e), e.EventDataType === ce))
      try {
        M();
      } catch (t) {
        this.errorReportingService?.report({
          message: "Rokt Kit: Failed to clear page views on session end",
          code: "PAGE_VIEW_CAPTURE_FAILED",
          severity: m.INFO,
          stackTrace: t instanceof Error ? t.stack : void 0
        });
      }
    if (!this.isKitReady())
      return "Kit not ready for forwarder: " + d;
    if (typeof a().Rokt?.setLocalSessionAttribute == "function" && (L(this.placementEventAttributeMappingLookup) || this.applyPlacementEventAttributeMapping(e), !L(this.placementEventMappingLookup))) {
      const t = j(e.EventDataType, e.EventCategory, e.EventName ?? "");
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
    return J(e) || (this.userAttributes[e] = t), "Successfully set user attribute for forwarder: " + d;
  }
  removeUserAttribute(e) {
    return delete this.userAttributes[e], "Successfully removed user attribute for forwarder: " + d;
  }
  handleIdentityComplete(e, t) {
    return this.userAttributes = R(e.getAllUserAttributes()), "Successfully called " + t + " for forwarder: " + d;
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
        E(l) && l.length > 0 && (s[u] = l);
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
    const t = e && e.attributes || {}, r = { ...R(this.userAttributes), ...t }, s = this.filters || {}, o = s.userAttributeFilters || [], c = s.filteredUser || null, u = c ? c.getMPID() : null;
    let l;
    s ? s.filterUserAttributes ? l = s.filterUserAttributes(r, o) : l = r : (console.warn("Rokt Kit: No filters available, using user attributes"), l = r), this.userAttributes = R(l);
    const h = this._onboardingExpProvider === "Optimizely" ? this.fetchOptimizely() : {}, b = this.returnUserIdentities(c), I = this.returnLocalSessionAttributes(), S = this.buildPageEvents(K()), g = {
      ...b,
      ...l,
      ...h,
      ...I,
      ...S.length ? { [ue]: JSON.stringify(S) } : {},
      ...this.userIdentifiedInWorkspace ? { [oe]: !0 } : {},
      mpid: u
    }, k = { ...e, attributes: g }, _ = this.launcher.selectPlacements(k), A = () => this.logSelectPlacementsEvent(g);
    return Promise.resolve(_).then((p) => p?.context?.sessionId?.then((X) => this.setRoktSessionId(X))).catch(() => {
    }).finally(A), _;
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
    return this.isKitReady() ? !e || !E(e) ? Promise.reject(new Error("Rokt Kit: Invalid extension name")) : this.launcher.use(e) : (console.error("Rokt Kit: Not initialized"), Promise.reject(new Error("Rokt Kit: Not initialized")));
  }
  /**
   * Registers a callback to be invoked once rokt-thank-you-element.js becomes available.
   */
  onShoppableAdsReady(e) {
    this._isThankYouElementLoaded ? e() : this._thankYouElementOnLoadCallback = e;
  }
};
f._allowedOriginHashes = [-553112570, 549508659], f.PERFORMANCE_MARKS = {
  RoktScriptAppended: "mp:RoktScriptAppended"
}, f.EMAIL_SHA256_KEY = "emailsha256";
let y = f;
function Ae() {
  return w;
}
function Re(n) {
  if (!n) {
    window.console.log("You must pass a config object to register the kit " + d);
    return;
  }
  if (!T(n)) {
    window.console.log("'config' must be an object. You passed in a " + typeof n);
    return;
  }
  T(n.kits) ? n.kits[d] = {
    constructor: y
  } : (n.kits = {}, n.kits[d] = {
    constructor: y
  }), window.console.log("Successfully registered " + d + " to your mParticle configuration");
}
typeof window < "u" && window.mParticle && a().addForwarder && a().addForwarder({
  name: d,
  constructor: y,
  getId: Ae
});
export {
  Re as register
};
//# sourceMappingURL=Rokt-Kit.esm.js.map

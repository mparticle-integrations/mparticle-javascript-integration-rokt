const le = [
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
], ue = new Set(le);
function Z(i) {
  return ue.has(i.toLowerCase());
}
function b(i) {
  const e = {}, t = i || {}, n = Object.keys(t);
  for (let r = 0; r < n.length; r++) {
    const s = n[r];
    Z(s) || (e[s] = t[s]);
  }
  return e;
}
function _(i) {
  return typeof i == "object" && i !== null && !Array.isArray(i);
}
function m(i) {
  return typeof i == "string";
}
function L(i) {
  return typeof i == "function";
}
function C(i) {
  return i == null ? !0 : typeof i == "object" ? Object.keys(i).length === 0 : !1;
}
function D(i) {
  try {
    const e = new URL(i);
    return e.search = "", e.toString();
  } catch {
    return i;
  }
}
function O(i) {
  try {
    const e = window.localStorage.getItem(i);
    return e === null ? null : JSON.parse(e);
  } catch {
    return null;
  }
}
function ee(i, e) {
  try {
    return window.localStorage.setItem(i, JSON.stringify(e)), !0;
  } catch {
    return !1;
  }
}
function te(i) {
  try {
    window.localStorage.removeItem(i);
  } catch {
  }
}
function ie(i, e) {
  const t = O(i);
  return _(t) ? t[e] : void 0;
}
function M(i, e, t) {
  const n = O(i), r = _(n) ? { ...n } : {};
  return r[e] = t, ee(i, r);
}
function de(i, e) {
  const t = O(i);
  if (!_(t) || !(e in t))
    return;
  const n = { ...t };
  delete n[e], Object.keys(n).length === 0 ? te(i) : ee(i, n);
}
function he(i, e, t, n) {
  const r = t.slice(), s = () => r.length <= 1 ? !1 : (r.shift(), !0);
  let o = JSON.stringify(r).length > n;
  for (; o && s(); )
    o = JSON.stringify(r).length > n;
  let c = M(i, e, r);
  for (; !c && s(); )
    c = M(i, e, r);
  return c;
}
const k = "mp-rokt-kit", R = "pageViews", x = "mpPageViews", pe = 100 * 1024;
function ne(i) {
  const e = O(x);
  if (e === null)
    return;
  if (!(ie(k, R) !== void 0) && Array.isArray(e) && !M(k, R, e)) {
    i?.log({
      message: "Rokt Kit: Failed to migrate legacy page-view storage; retaining legacy key for retry",
      code: "PAGE_VIEW_CAPTURE_FAILED"
    });
    return;
  }
  te(x);
}
function G(i) {
  ne(i);
  const e = ie(k, R);
  return Array.isArray(e) ? e : [];
}
function ge(i) {
  return he(k, R, i, pe);
}
function W() {
  de(k, R);
}
function fe(i) {
  return i.map((e, t) => {
    const n = e.activeTimeOnSite, r = n !== void 0 && Number.isFinite(n), o = i[t + 1]?.activeTimeOnSite, c = o !== void 0 && Number.isFinite(o), u = r && c ? o - n : void 0;
    return {
      pageUrl: e.pageUrl,
      sourceMessageId: e.sourceMessageId,
      timestamp: e.timestamp,
      ...e.pageTitle !== void 0 ? { pageTitle: e.pageTitle } : {},
      ...e.canonicalUrl !== void 0 ? { canonicalUrl: e.canonicalUrl } : {},
      ...r ? { activeTimeOnSite: n } : {},
      ...u !== void 0 && u >= 0 ? { activeTimeOnPage: u } : {}
    };
  });
}
function me() {
  const e = document.querySelector('link[rel="canonical"]')?.href;
  if (e)
    return D(e);
}
const d = "Rokt", T = 181, Ee = "selectPlacements", _e = "apps.roktecommerce.com", Ie = 0.1, ye = "ThankYouPageJourney", Se = "rokt-launcher", Ae = "rokt-thank-you-element", ke = "userIdentifiedInWorkspace", Re = 3, ve = 2, we = "page_events", be = "mparticle_session_id", Le = 500, F = {
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  UNHANDLED_EXCEPTION: "UNHANDLED_EXCEPTION",
  IDENTITY_REQUEST: "IDENTITY_REQUEST",
  LOG_DELIVERY_FAILURE: "LOG_DELIVERY_FAILURE"
}, E = {
  ERROR: "ERROR",
  INFO: "INFO",
  WARNING: "WARNING"
}, Te = "apps.rokt-api.com", Ne = "/v1/log", Oe = "/v1/errors", Pe = 10;
function a() {
  return window.mParticle;
}
function j(i, e) {
  const n = [P(i), "/wsdk/integrations/launcher.js"].join("");
  return !e || e.length === 0 ? n : n + "?extensions=" + e.join(",");
}
function H(i) {
  return [P(i), "/rokt-elements/rokt-element-thank-you.js"].join("");
}
function P(i) {
  const e = typeof i < "u" ? i : Te;
  return e.includes("://") ? e.replace(/\/+$/, "") : ["https://", e].join("");
}
function re(i, e, t) {
  if (i)
    return i.startsWith("http://") || i.startsWith("https://") ? i : "https://" + i;
  const r = e?.includes("://") && !/^https?:\/\//i.test(e) ? void 0 : e;
  return P(r) + t;
}
function V(i, e, t) {
  if (document.getElementById(i)) return;
  const n = document.head || document.body, r = document.createElement("script");
  r.id = i, r.type = "text/javascript", r.src = e, r.async = !0, r.crossOrigin = "anonymous", r.fetchPriority = "high", t?.onLoad && (r.onload = t.onLoad), t?.onError && (r.onerror = t.onError), n.appendChild(r);
}
function N(i) {
  if (!i)
    return [];
  try {
    return JSON.parse(i.replace(/&quot;/g, '"'));
  } catch {
    console.error("Settings string contains invalid JSON");
  }
  return [];
}
function z(i) {
  const e = i ? N(i) : [], t = [], n = [];
  let r = !1;
  for (let s = 0; s < e.length; s++) {
    const o = e[s].value;
    o === "thank-you-journey" ? (r = !0, n.push(ye)) : t.push(o);
  }
  return {
    roktExtensionsQueryParams: t,
    legacyRoktExtensions: n,
    loadThankYouElement: r
  };
}
async function Ue(i, e) {
  const t = [];
  if (e)
    for (const n of i)
      t.push(e.use(n));
  return Promise.all(t);
}
function J(i) {
  if (!i)
    return {};
  const e = {};
  for (let t = 0; t < i.length; t++) {
    const n = i[t];
    e[n.jsmap] = n.value;
  }
  return e;
}
function B(i) {
  const e = {};
  if (!Array.isArray(i))
    return e;
  for (let t = 0; t < i.length; t++) {
    const n = i[t];
    if (!n || !m(n.value) || !m(n.map))
      continue;
    const r = n.value, s = n.map;
    e[r] || (e[r] = []), e[r].push({
      eventAttributeKey: s,
      conditions: Array.isArray(n.conditions) ? n.conditions : []
    });
  }
  return e;
}
function q(i, e, t) {
  return a().generateHash([i, e, t].join(""));
}
function Ce(i) {
  let n = "mParticle_wsdkv_" + a().getVersion() + "_kitv_" + "1.33.1";
  return i && (n += "_" + i), n;
}
function se(i) {
  let e = 5381;
  for (let t = 0; t < i.length; t++)
    e = (e << 5) + e + i.charCodeAt(t), e = e & e;
  return e;
}
function K(i) {
  const e = document.createElement("iframe");
  e.style.display = "none", e.setAttribute("sandbox", "allow-scripts allow-same-origin"), e.src = i, e.onload = function() {
    e.onload = null, e.parentNode && e.parentNode.removeChild(e);
  };
  const t = document.body || document.head;
  t && t.appendChild(e);
}
function $(i, e) {
  const t = se(window.location.origin);
  if (I._allowedOriginHashes.indexOf(t) === -1 || Math.random() >= Ie)
    return;
  const r = window.__rokt_li_guid__;
  if (!r || i && i.includes("://") && !/^https:\/\//i.test(i))
    return;
  const s = window.location.href.split("?")[0].split("#")[0], o = "version=" + encodeURIComponent(e ?? "") + "&launcherInstanceGuid=" + encodeURIComponent(r) + "&pageUrl=" + encodeURIComponent(s), c = i ? P(i) : "https://apps.rokt.com";
  K(c + "/v1/wsdk-init/index.html?" + o), K(
    "https://" + _e + "/v1/wsdk-init/index.html?" + o + "&isControl=true"
  );
}
function Me() {
  return typeof window < "u" && !!window.location?.search?.toLowerCase().includes("mp_enable_logging=true");
}
function Ke() {
  return typeof window < "u" ? window.location?.href : void 0;
}
function De() {
  return typeof window < "u" ? window.navigator?.userAgent : void 0;
}
class oe {
  constructor() {
    this._logCount = {};
  }
  incrementAndCheck(e) {
    const n = (this._logCount[e] || 0) + 1;
    return this._logCount[e] = n, n > Pe;
  }
}
class Y {
  constructor(e, t, n, r, s) {
    this._reporter = "mp-wsdk";
    const o = e.isLoggingEnabled;
    this._integrationName = t || "", this._launcherInstanceGuid = n, this._accountId = r || null, this._rateLimiter = s || new oe(), this._isEnabled = Me() || o;
  }
  send(e, t, n, r, s, o) {
    if (!(!this._isEnabled || this._rateLimiter.incrementAndCheck(t)))
      try {
        const c = {
          additionalInformation: {
            message: n,
            version: this._integrationName
          },
          severity: t,
          code: r || F.UNKNOWN_ERROR,
          url: Ke(),
          deviceInfo: De(),
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
            const p = new Error("HTTP " + l.status + " from log endpoint");
            throw p.statusCode = l.status, p;
          }
        }).catch((l) => {
          console.error("ReportingTransport: Failed to send log", l), o && o(l);
        });
      } catch (c) {
        console.error("ReportingTransport: Failed to send log", c), o && o(c);
      }
  }
}
class Q {
  constructor(e, t, n, r, s) {
    this._transport = new Y(e, t, n, r, s), this._errorUrl = re(e?.errorUrl, e?.integrationDomain, Oe);
  }
  report(e) {
    if (!e) return;
    const t = e.severity || E.ERROR;
    this._transport.send(this._errorUrl, t, e.message, e.code, e.stackTrace);
  }
}
class X {
  constructor(e, t, n, r, s, o) {
    this._transport = new Y(e, n, r, s, o), this._loggingUrl = re(e?.loggingUrl, e?.integrationDomain, Ne), this._errorReportingService = t;
  }
  log(e) {
    e && this._transport.send(
      this._loggingUrl,
      E.INFO,
      e.message,
      e.code,
      void 0,
      (t) => {
        if (this._errorReportingService) {
          const n = typeof t.statusCode == "number";
          this._errorReportingService.report({
            message: "LoggingService: Failed to send log: " + t.message,
            code: F.LOG_DELIVERY_FAILURE,
            severity: n ? E.ERROR : E.WARNING
          });
        }
      }
    );
  }
}
function Fe(i) {
  const e = D(window.location.href), t = i.EventAttributes?.title || document.title, n = me(), r = i.ActiveTimeOnSite;
  return {
    pageUrl: e,
    sourceMessageId: i.SourceMessageId,
    timestamp: i.Timestamp,
    ...t ? { pageTitle: t } : {},
    ...n !== void 0 ? { canonicalUrl: n } : {},
    ...Number.isFinite(r) ? { activeTimeOnSite: r } : {}
  };
}
const f = class f {
  constructor() {
    this.name = d, this.id = T, this.moduleId = T, this.isInitialized = !1, this.launcher = null, this.filters = {}, this.userAttributes = {}, this.userIdentifiedInWorkspace = !1, this.testHelpers = null, this.placementEventMappingLookup = {}, this.placementEventAttributeMappingLookup = {}, this.integrationName = null, this.errorReportingService = null, this.loggingService = null, this._thankYouElementOnLoadCallback = null, this._isThankYouElementLoaded = !1, this._workspaceSearchInFlightPromise = null;
  }
  // ---- Private helpers ----
  getEventAttributeValue(e, t) {
    const n = e && e.EventAttributes;
    return !n || typeof n[t] > "u" ? null : n[t];
  }
  doesEventAttributeConditionMatch(e, t) {
    if (!e || !m(e.operator))
      return !1;
    const n = e.operator.toLowerCase(), r = e.attributeValue;
    return n === "exists" ? t !== null : t == null ? !1 : n === "equals" ? String(t) === String(r) : n === "contains" ? String(t).indexOf(String(r)) !== -1 : !1;
  }
  doesEventMatchRule(e, t) {
    if (!t || !m(t.eventAttributeKey))
      return !1;
    const n = t.conditions;
    if (!Array.isArray(n))
      return !1;
    const r = this.getEventAttributeValue(e, t.eventAttributeKey);
    if (n.length === 0)
      return r !== null;
    for (let s = 0; s < n.length; s++)
      if (!this.doesEventAttributeConditionMatch(n[s], r))
        return !1;
    return !0;
  }
  applyPlacementEventAttributeMapping(e) {
    const t = Object.keys(this.placementEventAttributeMappingLookup);
    for (let n = 0; n < t.length; n++) {
      const r = t[n], s = this.placementEventAttributeMappingLookup[r];
      if (C(s))
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
      t = D(window.location.href);
      const n = G(this.loggingService), r = Fe(e);
      n.push(r), ge(n) || this.loggingService?.log({
        message: `Rokt Kit: Failed to persist page view for ${t}`,
        code: "PAGE_VIEW_CAPTURE_FAILED"
      });
    } catch (n) {
      this.loggingService?.log({
        message: `Rokt Kit: Failed to capture page view for ${t}: ${n instanceof Error ? n.message : String(n)}`,
        code: "PAGE_VIEW_CAPTURE_FAILED"
      });
    }
  }
  isLauncherReadyToAttach() {
    return !!window.Rokt && L(window.Rokt.createLauncher);
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
  replaceOtherIdentityWithEmailsha256(e) {
    const t = { ...e || {} }, n = this._mappedEmailSha256Key;
    return n && e[n] && (t[f.EMAIL_SHA256_KEY] = e[n]), n && delete t[n], t;
  }
  logSelectPlacementsEvent(e) {
    if (!window.mParticle || typeof a().logEvent != "function" || !_(e))
      return;
    const t = a().EventType.Other;
    a().logEvent(Ee, t, e);
  }
  setRoktSessionId(e) {
    if (!(!e || typeof e != "string"))
      try {
        const t = a().getInstance();
        t && L(t.setIntegrationAttribute) && t.setIntegrationAttribute(T, {
          roktSessionId: e
        });
      } catch {
      }
  }
  readMpSessionId() {
    const e = a()?.sessionManager, t = e?.getSessionId ?? e?.getSession;
    if (L(t))
      return t.call(e) || void 0;
  }
  attachLauncher(e, t, n = []) {
    const r = {
      accountId: e,
      ...t || {}
    };
    let s;
    this.isPartnerInLocalLauncherTestGroup() ? s = Promise.resolve(window.Rokt.createLocalLauncher(r)) : s = window.Rokt.createLauncher(r), s.then(async (o) => {
      await Ue(n, o), this.initRoktLauncher(o);
    }).catch((o) => {
      console.error("Error creating Rokt launcher:", o);
    });
  }
  initRoktLauncher(e) {
    window.Rokt && (window.Rokt.currentLauncher = e), this.launcher = e;
    const t = a().Rokt?.filters;
    t ? (this.filters = t, t.filteredUser ? this._workspaceSearchInFlightPromise = this.search(t.filteredUser) : console.warn("Rokt Kit: No filtered user has been set.")) : console.warn("Rokt Kit: No filters have been set."), this.isInitialized = !0, $(this.domain, this.integrationName), a().Rokt.attachKit(this);
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
  init(e, t, n, r, s) {
    const o = e, c = o.accountId;
    this.userAttributes = b(s), this._onboardingExpProvider = o.onboardingExpProvider;
    const u = N(o.placementEventMapping);
    this.placementEventMappingLookup = J(u);
    const l = N(
      o.placementEventAttributeMapping
    );
    this.placementEventAttributeMappingLookup = B(l), o.hashedEmailUserIdentityType && (this._mappedEmailSha256Key = o.hashedEmailUserIdentityType.toLowerCase()), this._workspaceIdSyncApiKey = m(o.workspaceIdSyncApiKey) ? o.workspaceIdSyncApiKey : void 0;
    const p = a().Rokt?.domain, { roktExtensionsQueryParams: U, legacyRoktExtensions: v, loadThankYouElement: w } = z(
      o.roktExtensions
    ), g = {
      ...a().Rokt?.launcherOptions || {}
    };
    this.integrationName = Ce(g.integrationName), g.integrationName = this.integrationName, this.domain = p;
    const y = {
      loggingUrl: o.loggingUrl,
      errorUrl: o.errorUrl,
      integrationDomain: p,
      isLoggingEnabled: a().config?.isLoggingEnabled === !0
    }, S = new Q(
      y,
      this.integrationName,
      window.__rokt_li_guid__,
      o.accountId
    ), A = new X(
      y,
      S,
      this.integrationName,
      window.__rokt_li_guid__,
      o.accountId
    );
    if (this.errorReportingService = S, this.loggingService = A, this.isTargetingDisabled())
      try {
        W();
      } catch (h) {
        this.errorReportingService?.report({
          message: "Rokt Kit: Failed to clear page views when targeting is disabled",
          code: "PAGE_VIEW_CAPTURE_FAILED",
          severity: E.INFO,
          stackTrace: h instanceof Error ? h.stack : void 0
        });
      }
    return a()._registerErrorReportingService && a()._registerErrorReportingService(S), a()._registerLoggingService && a()._registerLoggingService(A), n ? (this.testHelpers = {
      generateLauncherScript: j,
      generateThankYouElementScript: H,
      extractRoktExtensionConfig: z,
      hashEventMessage: q,
      parseSettingsString: N,
      generateMappedEventLookup: J,
      generateMappedEventAttributeLookup: B,
      sendAdBlockMeasurementSignals: $,
      createAutoRemovedIframe: K,
      djb2: se,
      setAllowedOriginHashes: (h) => {
        f._allowedOriginHashes = h;
      },
      ReportingTransport: Y,
      ErrorReportingService: Q,
      LoggingService: X,
      RateLimiter: oe,
      ErrorCodes: F,
      WSDKErrorSeverity: E
    }, this.attachLauncher(c, g), "Successfully initialized: " + d) : (w && (a().Rokt.flushOnShoppableAdsReadyMessageQueue?.(this), V(Ae, H(p), {
      onLoad: () => {
        this._isThankYouElementLoaded = !0, this._thankYouElementOnLoadCallback && this._thankYouElementOnLoadCallback();
      },
      onError: (h) => {
        console.error("Error loading Rokt Thank You Element script:", h);
      }
    })), this.isLauncherReadyToAttach() ? this.attachLauncher(c, g, v) : (V(Se, j(p, U), {
      onLoad: () => {
        this.isLauncherReadyToAttach() ? this.attachLauncher(c, g, v) : console.error("Rokt object is not available after script load.");
      },
      onError: (h) => {
        console.error("Error loading Rokt launcher script:", h);
      }
    }), this.captureTiming(f.PERFORMANCE_MARKS.RoktScriptAppended)), "Successfully initialized: " + d);
  }
  process(e) {
    if (this.isTargetingDisabled() || (e.EventDataType === Re && this.capturePageView(e), e.EventDataType === ve && (ne(this.loggingService), W())), !this.isKitReady())
      return "Kit not ready for forwarder: " + d;
    if (L(a().Rokt?.setLocalSessionAttribute) && (C(this.placementEventAttributeMappingLookup) || this.applyPlacementEventAttributeMapping(e), !C(this.placementEventMappingLookup))) {
      const t = q(e.EventDataType, e.EventCategory, e.EventName ?? "");
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
    return Z(e) || (this.userAttributes[e] = t), "Successfully set user attribute for forwarder: " + d;
  }
  removeUserAttribute(e) {
    return delete this.userAttributes[e], "Successfully removed user attribute for forwarder: " + d;
  }
  handleIdentityComplete(e, t) {
    return this.userAttributes = b(e.getAllUserAttributes()), "Successfully called " + t + " for forwarder: " + d;
  }
  onUserIdentified(e) {
    const t = e;
    return this.filters.filteredUser = t, this._workspaceSearchInFlightPromise = this.search(t), this.handleIdentityComplete(e, "onUserIdentified");
  }
  search(e) {
    const t = this._workspaceIdSyncApiKey;
    if (!t)
      return this.userIdentifiedInWorkspace = !1, this._workspaceLastSearchedIdentitiesKey = void 0, Promise.resolve();
    const n = a().Identity?.search;
    if (typeof n != "function")
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
        n(t, s, (l) => {
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
        new Promise((n) => setTimeout(n, Le))
      ]).then(() => this._dispatchPlacements(e));
    }
    return this._dispatchPlacements(e);
  }
  _dispatchPlacements(e) {
    const t = e && e.attributes || {}, r = { ...b(this.userAttributes), ...t }, s = this.filters || {}, o = s.userAttributeFilters || [], c = s.filteredUser || null, u = c ? c.getMPID() : null;
    let l;
    s ? s.filterUserAttributes ? l = s.filterUserAttributes(r, o) : l = r : (console.warn("Rokt Kit: No filters available, using user attributes"), l = r), this.userAttributes = b(l);
    const p = this._onboardingExpProvider === "Optimizely" ? this.fetchOptimizely() : {}, U = this.returnUserIdentities(c), v = this.returnLocalSessionAttributes(), w = fe(G(this.loggingService)), g = this.readMpSessionId(), y = {
      ...U,
      ...l,
      ...p,
      ...v,
      ...w.length ? { [we]: JSON.stringify(w) } : {},
      ...this.userIdentifiedInWorkspace ? { [ke]: !0 } : {},
      ...g ? { [be]: g } : {},
      mpid: u
    }, S = { ...e, attributes: y }, A = this.launcher.selectPlacements(S), h = () => this.logSelectPlacementsEvent(y);
    return Promise.resolve(A).then((ae) => ae?.context?.sessionId?.then((ce) => this.setRoktSessionId(ce))).catch(() => {
    }).finally(h), A;
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
f._allowedOriginHashes = [-553112570, 549508659], f.PERFORMANCE_MARKS = {
  RoktScriptAppended: "mp:RoktScriptAppended"
}, f.EMAIL_SHA256_KEY = "emailsha256";
let I = f;
function Ye() {
  return T;
}
function xe(i) {
  if (!i) {
    window.console.log("You must pass a config object to register the kit " + d);
    return;
  }
  if (!_(i)) {
    window.console.log("'config' must be an object. You passed in a " + typeof i);
    return;
  }
  _(i.kits) ? i.kits[d] = {
    constructor: I
  } : (i.kits = {}, i.kits[d] = {
    constructor: I
  }), window.console.log("Successfully registered " + d + " to your mParticle configuration");
}
typeof window < "u" && window.mParticle && a().addForwarder && a().addForwarder({
  name: d,
  constructor: I,
  getId: Ye
});
export {
  xe as register
};
//# sourceMappingURL=Rokt-Kit.esm.js.map

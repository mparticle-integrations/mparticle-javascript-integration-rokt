const Ie = [
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
], Se = new Set(Ie);
function se(i) {
  return Se.has(i.toLowerCase());
}
function L(i) {
  const e = {}, t = i || {}, n = Object.keys(t);
  for (let r = 0; r < n.length; r++) {
    const o = n[r];
    se(o) || (e[o] = t[o]);
  }
  return e;
}
function _(i) {
  return typeof i == "object" && i !== null && !Array.isArray(i);
}
function E(i) {
  return typeof i == "string";
}
function T(i) {
  return typeof i == "function";
}
function K(i) {
  return i == null ? !0 : typeof i == "object" ? Object.keys(i).length === 0 : !1;
}
function x(i) {
  try {
    const e = new URL(i);
    return e.search = "", e.toString();
  } catch {
    return i;
  }
}
const j = "__rokt_ls_probe__";
function F() {
  try {
    return window.localStorage.setItem(j, "1"), window.localStorage.removeItem(j), !0;
  } catch {
    return !1;
  }
}
function N(i) {
  try {
    const e = window.localStorage.getItem(i);
    return e === null ? null : JSON.parse(e);
  } catch {
    return null;
  }
}
function ae(i, e) {
  try {
    return window.localStorage.setItem(i, JSON.stringify(e)), !0;
  } catch {
    return !1;
  }
}
function ce(i) {
  try {
    window.localStorage.removeItem(i);
  } catch {
  }
}
function U(i, e) {
  const t = N(i);
  return _(t) ? t[e] : void 0;
}
function Y(i, e, t) {
  const n = N(i), r = _(n) ? { ...n } : {};
  return r[e] = t, ae(i, r);
}
function le(i, e) {
  const t = N(i);
  if (!_(t) || !(e in t))
    return;
  const n = { ...t };
  delete n[e], Object.keys(n).length === 0 ? ce(i) : ae(i, n);
}
const p = "mp-rokt-kit", R = "pageViews", O = "utmParams", H = "mpPageViews", ue = 25, Ae = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
function de(i) {
  return i.slice(-ue);
}
function he(i) {
  const e = N(H);
  if (e === null)
    return;
  !(U(p, R) !== void 0) && Array.isArray(e) && (i?.log({
    message: "Rokt Kit: Migrating legacy page-view storage",
    code: "PAGE_VIEW_LEGACY_MIGRATION"
  }), Y(p, R, e) || i?.log({
    message: "Rokt Kit: Failed to migrate legacy page-view storage [reason: migration_retry]",
    code: "PAGE_VIEW_CAPTURE_FAILED"
  })), ce(H);
}
function z(i) {
  he(i);
  const e = U(p, R);
  return Array.isArray(e) ? e : [];
}
function ye(i) {
  const e = de(i);
  for (let t = 0; t < e.length; t++) {
    const n = e.slice(t);
    if (Y(p, R, n))
      return n.length;
  }
  return 0;
}
function q() {
  le(p, R);
}
function ke(i) {
  const e = de(i);
  return e.map((t, n) => {
    const r = t.activeTimeOnSite, o = r !== void 0 && Number.isFinite(r), c = e[n + 1]?.activeTimeOnSite, u = c !== void 0 && Number.isFinite(c), l = o && u ? c - r : void 0;
    return {
      pageUrl: t.pageUrl,
      sourceMessageId: t.sourceMessageId,
      timestamp: t.timestamp,
      ...t.pageTitle !== void 0 ? { pageTitle: t.pageTitle } : {},
      ...t.canonicalUrl !== void 0 ? { canonicalUrl: t.canonicalUrl } : {},
      ...o ? { activeTimeOnSite: r } : {},
      ...l !== void 0 && l >= 0 ? { activeTimeOnPage: l } : {}
    };
  });
}
function Re(i) {
  if (U(p, O) !== void 0)
    return;
  const e = new URLSearchParams(window.location.search), t = {};
  for (const r of Ae) {
    const o = e.get(r);
    o && (t[r] = o);
  }
  if (Object.keys(t).length === 0)
    return;
  const n = Object.keys(t).join(", ");
  if (!Y(p, O, t)) {
    const r = F() ? "quota" : "ls_unavailable";
    i?.log({
      message: `Rokt Kit: Failed to persist UTM params [reason: ${r}]`,
      code: "UTM_CAPTURE_FAILED"
    });
    return;
  }
  i?.log({
    message: `Rokt Kit: Captured UTM params [${n}]`,
    code: "UTM_CAPTURE_SUCCESS"
  });
}
function ve() {
  const i = U(p, O);
  return _(i) ? i : null;
}
function $() {
  le(p, O);
}
function we() {
  const e = document.querySelector('link[rel="canonical"]')?.href;
  if (e)
    return x(e);
}
function Le() {
  return {
    context: null,
    lifecycle: "idle",
    recreateInFlight: null
  };
}
function Te(i, e) {
  i.context = {
    accountId: e.accountId,
    launcherOptions: { ...e.launcherOptions },
    legacyRoktExtensions: [...e.legacyRoktExtensions]
  };
}
function be(i) {
  i.lifecycle = "attached";
}
function Pe(i) {
  i.lifecycle !== "idle" && (i.lifecycle = "terminated");
}
function Oe(i) {
  i.lifecycle = "terminated";
}
function Ne(i) {
  i.context = null, i.lifecycle = "idle", i.recreateInFlight = null;
}
function Ue(i, e, t) {
  if (i.recreateInFlight)
    return i.recreateInFlight;
  if (i.lifecycle !== "terminated" || !i.context || !e)
    return;
  i.lifecycle = "recreating";
  const n = i.context;
  return i.recreateInFlight = t(n).finally(() => {
    i.recreateInFlight = null;
  }), i.recreateInFlight;
}
const d = "Rokt", b = 181, Ce = "selectPlacements", Me = "apps.roktecommerce.com", Ke = 0.1, Fe = "ThankYouPageJourney", De = "rokt-launcher", xe = "rokt-thank-you-element", Ye = "userIdentifiedInWorkspace", Ge = 3, We = 2, Ve = "page_events", je = "page_view_attributes", He = "mparticle_session_id", ze = "mparticle_device_id", J = 500, G = {
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  UNHANDLED_EXCEPTION: "UNHANDLED_EXCEPTION",
  IDENTITY_REQUEST: "IDENTITY_REQUEST",
  LOG_DELIVERY_FAILURE: "LOG_DELIVERY_FAILURE"
}, S = {
  ERROR: "ERROR",
  INFO: "INFO",
  WARNING: "WARNING"
}, qe = "apps.rokt-api.com", $e = "/v1/log", Je = "/v1/errors", Be = 10;
function a() {
  return window.mParticle;
}
function B(i, e) {
  const n = [C(i), "/wsdk/integrations/launcher.js"].join("");
  return !e || e.length === 0 ? n : n + "?extensions=" + e.join(",");
}
function Q(i) {
  return [C(i), "/rokt-elements/rokt-element-thank-you.js"].join("");
}
function C(i) {
  const e = typeof i < "u" ? i : qe;
  return e.includes("://") ? e.replace(/\/+$/, "") : ["https://", e].join("");
}
function ge(i, e, t) {
  if (i)
    return i.startsWith("http://") || i.startsWith("https://") ? i : "https://" + i;
  const r = e?.includes("://") && !/^https?:\/\//i.test(e) ? void 0 : e;
  return C(r) + t;
}
function X(i, e, t) {
  if (document.getElementById(i)) return;
  const n = document.head || document.body, r = document.createElement("script");
  r.id = i, r.type = "text/javascript", r.src = e, r.async = !0, r.crossOrigin = "anonymous", r.fetchPriority = "high", t?.onLoad && (r.onload = t.onLoad), t?.onError && (r.onerror = t.onError), n.appendChild(r);
}
function P(i) {
  if (!i)
    return [];
  try {
    return JSON.parse(i.replace(/&quot;/g, '"'));
  } catch {
    console.error("Settings string contains invalid JSON");
  }
  return [];
}
function Z(i) {
  const e = i ? P(i) : [], t = [], n = [];
  let r = !1;
  for (let o = 0; o < e.length; o++) {
    const s = e[o].value;
    s === "thank-you-journey" ? (r = !0, n.push(Fe)) : t.push(s);
  }
  return {
    roktExtensionsQueryParams: t,
    legacyRoktExtensions: n,
    loadThankYouElement: r
  };
}
async function Qe(i, e) {
  const t = [];
  if (e)
    for (const n of i)
      t.push(e.use(n));
  return Promise.all(t);
}
function ee(i) {
  if (!i)
    return {};
  const e = {};
  for (let t = 0; t < i.length; t++) {
    const n = i[t];
    e[n.jsmap] = n.value;
  }
  return e;
}
function te(i) {
  const e = {};
  if (!Array.isArray(i))
    return e;
  for (let t = 0; t < i.length; t++) {
    const n = i[t];
    if (!n || !E(n.value) || !E(n.map))
      continue;
    const r = n.value, o = n.map;
    e[r] || (e[r] = []), e[r].push({
      eventAttributeKey: o,
      conditions: Array.isArray(n.conditions) ? n.conditions : []
    });
  }
  return e;
}
function ie(i, e, t) {
  return a().generateHash([i, e, t].join(""));
}
function Xe(i) {
  let n = "mParticle_wsdkv_" + a().getVersion() + "_kitv_" + "1.36.0";
  return i && (n += "_" + i), n;
}
function pe(i) {
  let e = 5381;
  for (let t = 0; t < i.length; t++)
    e = (e << 5) + e + i.charCodeAt(t), e = e & e;
  return e;
}
function D(i) {
  const e = document.createElement("iframe");
  e.style.display = "none", e.setAttribute("sandbox", "allow-scripts allow-same-origin"), e.src = i, e.onload = function() {
    e.onload = null, e.parentNode && e.parentNode.removeChild(e);
  };
  const t = document.body || document.head;
  t && t.appendChild(e);
}
function ne(i, e) {
  const t = pe(window.location.origin);
  if (A._allowedOriginHashes.indexOf(t) === -1 || Math.random() >= Ke)
    return;
  const r = window.__rokt_li_guid__;
  if (!r || i && i.includes("://") && !/^https:\/\//i.test(i))
    return;
  const o = window.location.href.split("?")[0].split("#")[0], s = "version=" + encodeURIComponent(e ?? "") + "&launcherInstanceGuid=" + encodeURIComponent(r) + "&pageUrl=" + encodeURIComponent(o), c = i ? C(i) : "https://apps.rokt.com";
  D(c + "/v1/wsdk-init/index.html?" + s), D(
    "https://" + Me + "/v1/wsdk-init/index.html?" + s + "&isControl=true"
  );
}
function Ze() {
  return typeof window < "u" && !!window.location?.search?.toLowerCase().includes("mp_enable_logging=true");
}
function et() {
  return typeof window < "u" ? window.location?.href : void 0;
}
function tt() {
  return typeof window < "u" ? window.navigator?.userAgent : void 0;
}
class fe {
  constructor() {
    this._logCount = {};
  }
  incrementAndCheck(e) {
    const n = (this._logCount[e] || 0) + 1;
    return this._logCount[e] = n, n > Be;
  }
}
class W {
  constructor(e, t, n, r, o) {
    this._reporter = "mp-wsdk";
    const s = e.isLoggingEnabled;
    this._integrationName = t || "", this._launcherInstanceGuid = n, this._accountId = r || null, this._rateLimiter = o || new fe(), this._isEnabled = Ze() || s;
  }
  send(e, t, n, r, o, s) {
    if (!(!this._isEnabled || this._rateLimiter.incrementAndCheck(t)))
      try {
        const c = {
          additionalInformation: {
            message: n,
            version: this._integrationName
          },
          severity: t,
          code: r || G.UNKNOWN_ERROR,
          url: et(),
          deviceInfo: tt(),
          stackTrace: o,
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
            const g = new Error("HTTP " + l.status + " from log endpoint");
            throw g.statusCode = l.status, g;
          }
        }).catch((l) => {
          console.error("ReportingTransport: Failed to send log", l), s && s(l);
        });
      } catch (c) {
        console.error("ReportingTransport: Failed to send log", c), s && s(c);
      }
  }
}
class re {
  constructor(e, t, n, r, o) {
    this._transport = new W(e, t, n, r, o), this._errorUrl = ge(e?.errorUrl, e?.integrationDomain, Je);
  }
  report(e) {
    if (!e) return;
    const t = e.severity || S.ERROR;
    this._transport.send(this._errorUrl, t, e.message, e.code, e.stackTrace);
  }
}
class oe {
  constructor(e, t, n, r, o, s) {
    this._transport = new W(e, n, r, o, s), this._loggingUrl = ge(e?.loggingUrl, e?.integrationDomain, $e), this._errorReportingService = t;
  }
  log(e) {
    e && this._transport.send(
      this._loggingUrl,
      S.INFO,
      e.message,
      e.code,
      void 0,
      (t) => {
        if (this._errorReportingService) {
          const n = typeof t.statusCode == "number";
          this._errorReportingService.report({
            message: "LoggingService: Failed to send log: " + t.message,
            code: G.LOG_DELIVERY_FAILURE,
            severity: n ? S.ERROR : S.WARNING
          });
        }
      }
    );
  }
}
function it(i) {
  const e = x(window.location.href), t = i.EventAttributes?.title || document.title, n = we(), r = i.ActiveTimeOnSite;
  return {
    pageUrl: e,
    sourceMessageId: i.SourceMessageId,
    timestamp: i.Timestamp,
    ...t ? { pageTitle: t } : {},
    ...n !== void 0 ? { canonicalUrl: n } : {},
    ...Number.isFinite(r) ? { activeTimeOnSite: r } : {}
  };
}
const m = class m {
  constructor() {
    this.name = d, this.id = b, this.moduleId = b, this.isInitialized = !1, this.launcher = null, this.filters = {}, this.userAttributes = {}, this.userIdentifiedInWorkspace = !1, this.testHelpers = null, this.placementEventMappingLookup = {}, this.placementEventAttributeMappingLookup = {}, this.integrationName = null, this.errorReportingService = null, this.loggingService = null, this._thankYouElementOnLoadCallback = null, this._isThankYouElementLoaded = !1, this._workspaceSearchInFlightPromise = null, this._launcherAttachState = Le();
  }
  // ---- Private helpers ----
  getEventAttributeValue(e, t) {
    const n = e && e.EventAttributes;
    return !n || typeof n[t] > "u" ? null : n[t];
  }
  doesEventAttributeConditionMatch(e, t) {
    if (!e || !E(e.operator))
      return !1;
    const n = e.operator.toLowerCase(), r = e.attributeValue;
    return n === "exists" ? t !== null : t == null ? !1 : n === "equals" ? String(t) === String(r) : n === "contains" ? String(t).indexOf(String(r)) !== -1 : !1;
  }
  doesEventMatchRule(e, t) {
    if (!t || !E(t.eventAttributeKey))
      return !1;
    const n = t.conditions;
    if (!Array.isArray(n))
      return !1;
    const r = this.getEventAttributeValue(e, t.eventAttributeKey);
    if (n.length === 0)
      return r !== null;
    for (let o = 0; o < n.length; o++)
      if (!this.doesEventAttributeConditionMatch(n[o], r))
        return !1;
    return !0;
  }
  applyPlacementEventAttributeMapping(e) {
    const t = Object.keys(this.placementEventAttributeMappingLookup);
    for (let n = 0; n < t.length; n++) {
      const r = t[n], o = this.placementEventAttributeMappingLookup[r];
      if (K(o))
        continue;
      let s = !0;
      for (let c = 0; c < o.length; c++)
        if (!this.doesEventMatchRule(e, o[c])) {
          s = !1;
          break;
        }
      s && a().Rokt.setLocalSessionAttribute?.(r, !0);
    }
  }
  capturePageView(e) {
    let t;
    try {
      t = x(window.location.href);
      const n = z(this.loggingService), r = it(e);
      n.push(r);
      const o = Math.min(n.length, ue), s = ye(n);
      if (s === 0) {
        const c = F() ? "quota" : "ls_unavailable";
        this.loggingService?.log({
          message: `Rokt Kit: Failed to persist page view for ${t} [reason: ${c}]`,
          code: "PAGE_VIEW_CAPTURE_FAILED"
        });
      } else s < o && this.loggingService?.log({
        message: `Rokt Kit: Page view storage reduced from ${o} to ${s} record(s) under quota pressure [reason: quota_eviction]`,
        code: "PAGE_VIEW_QUOTA_EVICTION"
      });
    } catch (n) {
      const r = F() ? "exception" : "ls_unavailable", o = n instanceof Error ? n.message : String(n);
      this.loggingService?.log({
        message: `Rokt Kit: Failed to capture page view for ${t}: ${o} [reason: ${r}]`,
        code: "PAGE_VIEW_CAPTURE_FAILED"
      });
    }
  }
  isLauncherReadyToAttach() {
    return !!window.Rokt && T(window.Rokt.createLauncher);
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
    return n && e[n] && (t[m.EMAIL_SHA256_KEY] = e[n]), n && delete t[n], t;
  }
  logSelectPlacementsEvent(e) {
    if (!window.mParticle || typeof a().logEvent != "function" || !_(e))
      return;
    const t = a().EventType.Other;
    a().logEvent(Ce, t, e);
  }
  setRoktSessionId(e) {
    if (!(!e || typeof e != "string"))
      try {
        const t = a().getInstance();
        t && T(t.setIntegrationAttribute) && t.setIntegrationAttribute(b, {
          roktSessionId: e
        });
      } catch {
      }
  }
  readMpSessionId() {
    const e = a()?.sessionManager, t = e?.getSessionId ?? e?.getSession;
    if (T(t))
      return t.call(e) || void 0;
  }
  readMpDeviceId() {
    return a()?.getDeviceId?.() || void 0;
  }
  attachLauncher(e, t, n = []) {
    Te(this._launcherAttachState, {
      accountId: e,
      launcherOptions: t || {},
      legacyRoktExtensions: n
    });
    const r = {
      accountId: e,
      ...t || {}
    };
    let o;
    return this.isPartnerInLocalLauncherTestGroup() ? o = Promise.resolve(window.Rokt.createLocalLauncher(r)) : o = window.Rokt.createLauncher(r), o.then(async (s) => {
      await Qe([...n], s), this.initRoktLauncher(s);
    }).catch((s) => {
      Oe(this._launcherAttachState), console.error("Error creating Rokt launcher:", s);
    });
  }
  recreateLauncherIfTerminated() {
    return Ue(
      this._launcherAttachState,
      this.isLauncherReadyToAttach(),
      (e) => this.attachLauncher(e.accountId, e.launcherOptions, e.legacyRoktExtensions)
    );
  }
  initRoktLauncher(e) {
    window.Rokt && (window.Rokt.currentLauncher = e), this.launcher = e, be(this._launcherAttachState);
    const t = a().Rokt?.filters;
    t ? (this.filters = t, t.filteredUser ? this._workspaceSearchInFlightPromise = this.search(t.filteredUser) : console.warn("Rokt Kit: No filtered user has been set.")) : console.warn("Rokt Kit: No filters have been set."), this.isInitialized = !0, ne(this.domain, this.integrationName), a().Rokt.attachKit(this);
  }
  fetchOptimizely() {
    const e = a()._getActiveForwarders().filter((t) => t.name === "Optimizely");
    try {
      if (e.length > 0 && window.optimizely) {
        const t = window.optimizely.get("state");
        return !t || !t.getActiveExperimentIds ? {} : t.getActiveExperimentIds().reduce((o, s) => (o["rokt.custom.optimizely.experiment." + s + ".variationId"] = t.getVariationMap()[s].id, o), {});
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
  init(e, t, n, r, o) {
    const s = e, c = s.accountId;
    this.userAttributes = L(o), this._onboardingExpProvider = s.onboardingExpProvider;
    const u = P(s.placementEventMapping);
    this.placementEventMappingLookup = ee(u);
    const l = P(
      s.placementEventAttributeMapping
    );
    this.placementEventAttributeMappingLookup = te(l), s.hashedEmailUserIdentityType && (this._mappedEmailSha256Key = s.hashedEmailUserIdentityType.toLowerCase()), this._workspaceIdSyncApiKey = E(s.workspaceIdSyncApiKey) ? s.workspaceIdSyncApiKey : void 0;
    const g = a().Rokt?.domain, { roktExtensionsQueryParams: M, legacyRoktExtensions: v, loadThankYouElement: w } = Z(
      s.roktExtensions
    ), f = {
      ...a().Rokt?.launcherOptions || {}
    };
    this.integrationName = Xe(f.integrationName), f.integrationName = this.integrationName, this.domain = g;
    const y = {
      loggingUrl: s.loggingUrl,
      errorUrl: s.errorUrl,
      integrationDomain: g,
      isLoggingEnabled: a().config?.isLoggingEnabled === !0
    }, I = new re(
      y,
      this.integrationName,
      window.__rokt_li_guid__,
      s.accountId
    ), k = new oe(
      y,
      I,
      this.integrationName,
      window.__rokt_li_guid__,
      s.accountId
    );
    if (this.errorReportingService = I, this.loggingService = k, this.isTargetingDisabled())
      try {
        q(), $();
      } catch (h) {
        this.errorReportingService?.report({
          message: "Rokt Kit: Failed to clear page views when targeting is disabled",
          code: "PAGE_VIEW_CAPTURE_FAILED",
          severity: S.INFO,
          stackTrace: h instanceof Error ? h.stack : void 0
        });
      }
    return a()._registerErrorReportingService && a()._registerErrorReportingService(I), a()._registerLoggingService && a()._registerLoggingService(k), n ? (this.testHelpers = {
      generateLauncherScript: B,
      generateThankYouElementScript: Q,
      extractRoktExtensionConfig: Z,
      hashEventMessage: ie,
      parseSettingsString: P,
      generateMappedEventLookup: ee,
      generateMappedEventAttributeLookup: te,
      sendAdBlockMeasurementSignals: ne,
      createAutoRemovedIframe: D,
      djb2: pe,
      setAllowedOriginHashes: (h) => {
        m._allowedOriginHashes = h;
      },
      ReportingTransport: W,
      ErrorReportingService: re,
      LoggingService: oe,
      RateLimiter: fe,
      ErrorCodes: G,
      WSDKErrorSeverity: S,
      resetLauncherAttachState: () => Ne(this._launcherAttachState)
    }, this.attachLauncher(c, f), "Successfully initialized: " + d) : (w && (a().Rokt.flushOnShoppableAdsReadyMessageQueue?.(this), X(xe, Q(g), {
      onLoad: () => {
        this._isThankYouElementLoaded = !0, this._thankYouElementOnLoadCallback && this._thankYouElementOnLoadCallback();
      },
      onError: (h) => {
        console.error("Error loading Rokt Thank You Element script:", h);
      }
    })), this.isLauncherReadyToAttach() ? this.attachLauncher(c, f, v) : (X(De, B(g, M), {
      onLoad: () => {
        this.isLauncherReadyToAttach() ? this.attachLauncher(c, f, v) : console.error("Rokt object is not available after script load.");
      },
      onError: (h) => {
        console.error("Error loading Rokt launcher script:", h);
      }
    }), this.captureTiming(m.PERFORMANCE_MARKS.RoktScriptAppended)), "Successfully initialized: " + d);
  }
  process(e) {
    if (this.isTargetingDisabled() || (e.EventDataType === Ge && (Re(this.loggingService), this.capturePageView(e)), e.EventDataType === We && (he(this.loggingService), q(), $())), !this.isKitReady())
      return "Kit not ready for forwarder: " + d;
    if (T(a().Rokt?.setLocalSessionAttribute) && (K(this.placementEventAttributeMappingLookup) || this.applyPlacementEventAttributeMapping(e), !K(this.placementEventMappingLookup))) {
      const t = ie(e.EventDataType, e.EventCategory, e.EventName ?? "");
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
    return se(e) || (this.userAttributes[e] = t), "Successfully set user attribute for forwarder: " + d;
  }
  removeUserAttribute(e) {
    return delete this.userAttributes[e], "Successfully removed user attribute for forwarder: " + d;
  }
  handleIdentityComplete(e, t) {
    return this.userAttributes = L(e.getAllUserAttributes()), "Successfully called " + t + " for forwarder: " + d;
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
    const r = e.getUserIdentities ? e.getUserIdentities().userIdentities : null, o = {};
    if (r)
      for (const u of Object.keys(r)) {
        const l = r[u];
        E(l) && l.length > 0 && (o[u] = l);
      }
    const s = Object.keys(o);
    if (s.length === 0)
      return this.userIdentifiedInWorkspace = !1, this._workspaceLastSearchedIdentitiesKey = void 0, Promise.resolve();
    const c = s.sort().map((u) => `${u}=${o[u]}`).join("&");
    return c === this._workspaceLastSearchedIdentitiesKey ? this._workspaceSearchInFlightPromise || Promise.resolve() : (this.userIdentifiedInWorkspace = !1, this._workspaceLastSearchedIdentitiesKey = c, new Promise((u) => {
      try {
        n(t, o, (l) => {
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
   * this wrapper just gates it on the in-flight search via `Promise.race`,
   * and on a post-terminate createLauncher when the SPA needs a new instance.
   */
  selectPlacements(e) {
    const t = this.recreateLauncherIfTerminated();
    if (t) {
      const n = this._workspaceSearchInFlightPromise, r = n ? Promise.race([
        n,
        new Promise((o) => setTimeout(o, J))
      ]) : Promise.resolve();
      return Promise.all([t, r]).then(
        () => this._dispatchPlacements(e)
      );
    }
    if (this._workspaceSearchInFlightPromise) {
      const n = this._workspaceSearchInFlightPromise;
      return Promise.race([
        n,
        new Promise((r) => setTimeout(r, J))
      ]).then(() => this._dispatchPlacements(e));
    }
    return this._dispatchPlacements(e);
  }
  _dispatchPlacements(e) {
    const t = e && e.attributes || {}, r = { ...L(this.userAttributes), ...t }, o = this.filters || {}, s = o.userAttributeFilters || [], c = o.filteredUser || null, u = c ? c.getMPID() : null;
    let l;
    o ? o.filterUserAttributes ? l = o.filterUserAttributes(r, s) : l = r : (console.warn("Rokt Kit: No filters available, using user attributes"), l = r), this.userAttributes = L(l);
    const g = this._onboardingExpProvider === "Optimizely" ? this.fetchOptimizely() : {}, M = this.returnUserIdentities(c), v = this.returnLocalSessionAttributes(), w = ke(z(this.loggingService)), f = ve(), y = this.readMpSessionId(), I = this.readMpDeviceId(), k = {
      ...M,
      ...l,
      ...g,
      ...v,
      ...w.length ? { [Ve]: JSON.stringify(w) } : {},
      ...f ? { [je]: f } : {},
      ...this.userIdentifiedInWorkspace ? { [Ye]: !0 } : {},
      ...y ? { [He]: y } : {},
      ...I ? { [ze]: I } : {},
      mpid: u
    }, h = { ...e, attributes: k }, V = this.launcher.selectPlacements(h), me = () => this.logSelectPlacementsEvent(k);
    return Promise.resolve(V).then((Ee) => Ee?.context?.sessionId?.then((_e) => this.setRoktSessionId(_e))).catch(() => {
    }).finally(me), V;
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
   * Tears down the Rokt launcher and the placements it rendered.
   *
   * The kit's launcher reference is left in place so isKitReady() stays true.
   * The Web SDK clears its memoized launcher on terminate, so a later
   * createLauncher (SPA navigation) produces a new instance. The next
   * selectPlacements call re-attaches that instance. Nulling the reference
   * here would flip the kit to not-ready with no drain path for queued calls.
   */
  terminate() {
    return this.isKitReady() ? (Pe(this._launcherAttachState), this.launcher.terminate()) : (console.error("Rokt Kit: Not initialized"), Promise.resolve());
  }
  /**
   * Registers a callback to be invoked once rokt-thank-you-element.js becomes available.
   */
  onShoppableAdsReady(e) {
    this._isThankYouElementLoaded ? e() : this._thankYouElementOnLoadCallback = e;
  }
};
m._allowedOriginHashes = [-553112570, 549508659], m.PERFORMANCE_MARKS = {
  RoktScriptAppended: "mp:RoktScriptAppended"
}, m.EMAIL_SHA256_KEY = "emailsha256";
let A = m;
function nt() {
  return b;
}
function rt(i) {
  if (!i) {
    window.console.log("You must pass a config object to register the kit " + d);
    return;
  }
  if (!_(i)) {
    window.console.log("'config' must be an object. You passed in a " + typeof i);
    return;
  }
  _(i.kits) ? i.kits[d] = {
    constructor: A
  } : (i.kits = {}, i.kits[d] = {
    constructor: A
  }), window.console.log("Successfully registered " + d + " to your mParticle configuration");
}
typeof window < "u" && window.mParticle && a().addForwarder && a().addForwarder({
  name: d,
  constructor: A,
  getId: nt
});
export {
  rt as register
};
//# sourceMappingURL=Rokt-Kit.esm.js.map

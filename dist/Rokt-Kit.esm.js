const u = "Rokt";
const Q = "selectPlacements", B = "apps.roktecommerce.com";
const I = {
  LOGIN: "login",
  LOGOUT: "logout",
  MODIFY_USER: "modify_user",
  IDENTIFY: "identify"
}, V = "ThankYouPageJourney", W = "rokt-launcher", q = "rokt-thank-you-element", N = {
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  UNHANDLED_EXCEPTION: "UNHANDLED_EXCEPTION",
  IDENTITY_REQUEST: "IDENTITY_REQUEST"
}, w = {
  ERROR: "ERROR",
  INFO: "INFO",
  WARNING: "WARNING"
}, J = "apps.rokt-api.com/v1/log", X = "apps.rokt-api.com/v1/errors", Z = 10;
function s() {
  return window.mParticle;
}
function U(i, t) {
  const n = [H(i), "/wsdk/integrations/launcher.js"].join("");
  return !t || t.length === 0 ? n : n + "?extensions=" + t.join(",");
}
function M(i) {
  return [H(i), "/rokt-elements/rokt-element-thank-you.js"].join("");
}
function H(i) {
  return ["https://", typeof i < "u" ? i : "apps.rokt-api.com"].join("");
}
function C(i, t, e) {
  if (document.getElementById(i)) return;
  const n = document.head || document.body, r = document.createElement("script");
  r.id = i, r.type = "text/javascript", r.src = t, r.async = !0, r.crossOrigin = "anonymous", r.fetchPriority = "high", e?.onLoad && (r.onload = e.onLoad), e?.onError && (r.onerror = e.onError), n.appendChild(r);
}
function S(i) {
  return i != null && typeof i == "object" && Array.isArray(i) === !1;
}
function b(i) {
  if (!i)
    return [];
  try {
    return JSON.parse(i.replace(/&quot;/g, '"'));
  } catch {
    console.error("Settings string contains invalid JSON");
  }
  return [];
}
function P(i) {
  const t = i ? b(i) : [], e = [], n = [];
  let r = !1;
  for (let a = 0; a < t.length; a++) {
    const o = t[a].value;
    o === "thank-you-journey" ? (r = !0, n.push(V)) : e.push(o);
  }
  return {
    roktExtensionsQueryParams: e,
    legacyRoktExtensions: n,
    loadThankYouElement: r
  };
}
async function $(i, t) {
  const e = [];
  if (t)
    for (const n of i)
      e.push(t.use(n));
  return Promise.all(e);
}
function K(i) {
  if (!i)
    return {};
  const t = {};
  for (let e = 0; e < i.length; e++) {
    const n = i[e];
    t[n.jsmap] = n.value;
  }
  return t;
}
function x(i) {
  const t = {};
  if (!Array.isArray(i))
    return t;
  for (let e = 0; e < i.length; e++) {
    const n = i[e];
    if (!n || !y(n.value) || !y(n.map))
      continue;
    const r = n.value, a = n.map;
    t[r] || (t[r] = []), t[r].push({
      eventAttributeKey: a,
      conditions: Array.isArray(n.conditions) ? n.conditions : []
    });
  }
  return t;
}
function D(i, t, e) {
  return s().generateHash([i, t, e].join(""));
}
function R(i) {
  return i == null ? !0 : typeof i == "object" ? Object.keys(i).length === 0 : Array.isArray(i) ? i.length === 0 : !1;
}
function y(i) {
  return typeof i == "string";
}
function tt(i) {
  let n = "mParticle_wsdkv_" + s().getVersion() + "_kitv_" + "1.25.1";
  return i && (n += "_" + i), n;
}
function F(i) {
  let t = 5381;
  for (let e = 0; e < i.length; e++)
    t = (t << 5) + t + i.charCodeAt(e), t = t & t;
  return t;
}
function O(i) {
  const t = document.createElement("iframe");
  t.style.display = "none", t.setAttribute("sandbox", "allow-scripts allow-same-origin"), t.src = i, t.onload = function() {
    t.onload = null, t.parentNode && t.parentNode.removeChild(t);
  };
  const e = document.body || document.head;
  e && e.appendChild(t);
}
function Y(i, t) {
  const e = F(window.location.origin);
  if (g._allowedOriginHashes.indexOf(e) === -1 || Math.random() >= 0.1)
    return;
  const r = window.__rokt_li_guid__;
  if (!r)
    return;
  const a = window.location.href.split("?")[0].split("#")[0], o = "version=" + encodeURIComponent(t ?? "") + "&launcherInstanceGuid=" + encodeURIComponent(r) + "&pageUrl=" + encodeURIComponent(a);
  O("https://" + (i || "apps.rokt.com") + "/v1/wsdk-init/index.html?" + o), O(
    "https://" + B + "/v1/wsdk-init/index.html?" + o + "&isControl=true"
  );
}
function et() {
  return typeof window < "u" && !!window.ROKT_DOMAIN;
}
function nt() {
  return typeof window < "u" && !!window.location?.search?.toLowerCase().includes("mp_enable_logging=true");
}
function it() {
  return typeof window < "u" ? window.location?.href : void 0;
}
function rt() {
  return typeof window < "u" ? window.navigator?.userAgent : void 0;
}
class z {
  constructor() {
    this._logCount = {};
  }
  incrementAndCheck(t) {
    const n = (this._logCount[t] || 0) + 1;
    return this._logCount[t] = n, n > Z;
  }
}
class T {
  constructor(t, e, n, r, a) {
    this._reporter = "mp-wsdk";
    const o = t?.isLoggingEnabled === !0 || t?.isLoggingEnabled === "true";
    this._integrationName = e || "", this._launcherInstanceGuid = n, this._accountId = r || null, this._rateLimiter = a || new z(), this._isEnabled = nt() || et() && o;
  }
  send(t, e, n, r, a, o) {
    if (!(!this._isEnabled || this._rateLimiter.incrementAndCheck(e)))
      try {
        const c = {
          additionalInformation: {
            message: n,
            version: this._integrationName
          },
          severity: e,
          code: r || N.UNKNOWN_ERROR,
          url: it(),
          deviceInfo: rt(),
          stackTrace: a,
          reporter: this._reporter,
          integration: this._integrationName
        }, l = {
          Accept: "text/plain;charset=UTF-8",
          "Content-Type": "application/json",
          "rokt-launcher-version": this._integrationName,
          "rokt-wsdk-version": "joint"
        };
        this._launcherInstanceGuid && (l["rokt-launcher-instance-guid"] = this._launcherInstanceGuid), this._accountId && (l["rokt-account-id"] = this._accountId), fetch(t, {
          method: "POST",
          headers: l,
          body: JSON.stringify(c)
        }).catch((p) => {
          console.error("ReportingTransport: Failed to send log", p), o && o(p);
        });
      } catch (c) {
        console.error("ReportingTransport: Failed to send log", c), o && o(c);
      }
  }
}
class j {
  constructor(t, e, n, r, a) {
    this._transport = new T(t, e, n, r, a), this._errorUrl = "https://" + (t?.errorUrl || X);
  }
  report(t) {
    if (!t) return;
    const e = t.severity || w.ERROR;
    this._transport.send(this._errorUrl, e, t.message, t.code, t.stackTrace);
  }
}
class G {
  constructor(t, e, n, r, a, o) {
    this._transport = new T(t, n, r, a, o), this._loggingUrl = "https://" + (t?.loggingUrl || J), this._errorReportingService = e;
  }
  log(t) {
    t && this._transport.send(
      this._loggingUrl,
      w.INFO,
      t.message,
      t.code,
      void 0,
      (e) => {
        this._errorReportingService && this._errorReportingService.report({
          message: "LoggingService: Failed to send log: " + e.message,
          code: N.UNKNOWN_ERROR,
          severity: w.ERROR
        });
      }
    );
  }
}
const h = class h {
  constructor() {
    this.name = u, this.id = 181, this.moduleId = 181, this.isInitialized = !1, this.launcher = null, this.filters = {}, this.userAttributes = {}, this.testHelpers = null, this.placementEventMappingLookup = {}, this.placementEventAttributeMappingLookup = {}, this.batchQueue = [], this.batchStreamQueue = [], this.pendingIdentityEvents = [], this.integrationName = null, this.errorReportingService = null, this.loggingService = null, this._thankYouElementOnLoadCallback = null, this._isThankYouElementLoaded = !1;
  }
  // ---- Private helpers ----
  getEventAttributeValue(t, e) {
    const n = t && t.EventAttributes;
    return !n || typeof n[e] > "u" ? null : n[e];
  }
  doesEventAttributeConditionMatch(t, e) {
    if (!t || !y(t.operator))
      return !1;
    const n = t.operator.toLowerCase(), r = t.attributeValue;
    return n === "exists" ? e !== null : e == null ? !1 : n === "equals" ? String(e) === String(r) : n === "contains" ? String(e).indexOf(String(r)) !== -1 : !1;
  }
  doesEventMatchRule(t, e) {
    if (!e || !y(e.eventAttributeKey))
      return !1;
    const n = e.conditions;
    if (!Array.isArray(n))
      return !1;
    const r = this.getEventAttributeValue(t, e.eventAttributeKey);
    if (n.length === 0)
      return r !== null;
    for (let a = 0; a < n.length; a++)
      if (!this.doesEventAttributeConditionMatch(n[a], r))
        return !1;
    return !0;
  }
  applyPlacementEventAttributeMapping(t) {
    const e = Object.keys(this.placementEventAttributeMappingLookup);
    for (let n = 0; n < e.length; n++) {
      const r = e[n], a = this.placementEventAttributeMappingLookup[r];
      if (R(a))
        continue;
      let o = !0;
      for (let c = 0; c < a.length; c++)
        if (!this.doesEventMatchRule(t, a[c])) {
          o = !1;
          break;
        }
      o && s().Rokt.setLocalSessionAttribute?.(r, !0);
    }
  }
  isLauncherReadyToAttach() {
    return !!window.Rokt && typeof window.Rokt.createLauncher == "function";
  }
  /**
   * Returns the user identities from the filtered user, if any.
   */
  returnUserIdentities(t) {
    if (!t || !t.getUserIdentities)
      return {};
    const e = t.getUserIdentities().userIdentities;
    return this.replaceOtherIdentityWithEmailsha256(e);
  }
  returnLocalSessionAttributes() {
    return !s().Rokt || typeof s().Rokt.getLocalSessionAttributes != "function" ? {} : R(this.placementEventMappingLookup) && R(this.placementEventAttributeMappingLookup) ? {} : s().Rokt.getLocalSessionAttributes();
  }
  replaceOtherIdentityWithEmailsha256(t) {
    const e = { ...t || {} }, n = this._mappedEmailSha256Key;
    return n && t[n] && (e[h.EMAIL_SHA256_KEY] = t[n]), n && delete e[n], e;
  }
  logSelectPlacementsEvent(t) {
    if (!window.mParticle || typeof s().logEvent != "function" || !S(t))
      return;
    const e = s().EventType.Other;
    s().logEvent(Q, e, t);
  }
  buildIdentityEvent(t, e) {
    const n = e.getMPID(), r = s() && s().sessionManager && typeof s().sessionManager.getSession == "function" ? s().sessionManager.getSession() : void 0;
    return {
      event_type: t,
      data: {
        timestamp_unixtime_ms: Date.now(),
        session_uuid: r ?? void 0,
        mpid: n
      }
    };
  }
  mergePendingIdentityEvents(t) {
    if (this.pendingIdentityEvents.length === 0)
      return t;
    const e = {
      ...t,
      events: [...t.events ?? [], ...this.pendingIdentityEvents]
    };
    return this.pendingIdentityEvents = [], e;
  }
  drainBatchQueue() {
    this.batchQueue.forEach((t) => {
      this.processBatch(t);
    }), this.batchQueue = [];
  }
  processBatch(t) {
    return this.isKitReady() ? (this.sendBatchStream(this.mergePendingIdentityEvents(t)), "Successfully sent batch to forwarder: " + u) : (this.batchQueue.push(t), "Batch queued for forwarder: " + u);
  }
  sendBatchStream(t) {
    if (window.Rokt && typeof window.Rokt.__batch_stream__ == "function") {
      if (this.batchStreamQueue.length) {
        const e = this.batchStreamQueue;
        this.batchStreamQueue = [];
        for (let n = 0; n < e.length; n++)
          window.Rokt.__batch_stream__(e[n]);
      }
      window.Rokt.__batch_stream__(t);
    } else
      this.batchStreamQueue.push(t);
  }
  setRoktSessionId(t) {
    if (!(!t || typeof t != "string"))
      try {
        const e = s().getInstance();
        e && typeof e.setIntegrationAttribute == "function" && e.setIntegrationAttribute(181, {
          roktSessionId: t
        });
      } catch {
      }
  }
  attachLauncher(t, e, n = []) {
    const r = s() && s().sessionManager && typeof s().sessionManager.getSession == "function" ? s().sessionManager.getSession() : void 0, a = {
      accountId: t,
      ...e || {},
      ...r ? { mpSessionId: r } : {}
    };
    let o;
    this.isPartnerInLocalLauncherTestGroup() ? o = Promise.resolve(window.Rokt.createLocalLauncher(a)) : o = window.Rokt.createLauncher(a), o.then(async (c) => {
      await $(n, c), this.initRoktLauncher(c);
    }).catch((c) => {
      console.error("Error creating Rokt launcher:", c);
    });
  }
  initRoktLauncher(t) {
    window.Rokt && (window.Rokt.currentLauncher = t), this.launcher = t;
    const e = s().Rokt?.filters;
    e ? (this.filters = e, e.filteredUser || console.warn("Rokt Kit: No filtered user has been set.")) : console.warn("Rokt Kit: No filters have been set."), this.isInitialized = !0, Y(this.domain, this.integrationName), s().Rokt.attachKit(this), this.drainBatchQueue();
  }
  fetchOptimizely() {
    const t = s()._getActiveForwarders().filter((e) => e.name === "Optimizely");
    try {
      if (t.length > 0 && window.optimizely) {
        const e = window.optimizely.get("state");
        return !e || !e.getActiveExperimentIds ? {} : e.getActiveExperimentIds().reduce((a, o) => (a["rokt.custom.optimizely.experiment." + o + ".variationId"] = e.getVariationMap()[o].id, a), {});
      }
    } catch (e) {
      console.error("Error fetching Optimizely attributes:", e);
    }
    return {};
  }
  isKitReady() {
    return !!(this.isInitialized && this.launcher);
  }
  isPartnerInLocalLauncherTestGroup() {
    return !!(s().config && s().config.isLocalLauncherEnabled && this.isAssignedToSampleGroup());
  }
  isAssignedToSampleGroup() {
    return Math.random() > 0.5;
  }
  captureTiming(t) {
    window && s() && s().captureTiming && t && s().captureTiming(t);
  }
  // ---- Public methods (mParticle Kit Callbacks) ----
  /**
   * Initializes the Rokt forwarder with settings from the mParticle server.
   */
  init(t, e, n, r, a) {
    const o = t, c = o.accountId;
    this.userAttributes = a || {}, this._onboardingExpProvider = o.onboardingExpProvider;
    const l = b(o.placementEventMapping);
    this.placementEventMappingLookup = K(l);
    const p = b(
      o.placementEventAttributeMapping
    );
    this.placementEventAttributeMappingLookup = x(p), o.hashedEmailUserIdentityType && (this._mappedEmailSha256Key = o.hashedEmailUserIdentityType.toLowerCase());
    const f = s().Rokt?.domain, { roktExtensionsQueryParams: v, legacyRoktExtensions: m, loadThankYouElement: L } = P(
      o.roktExtensions
    ), d = {
      ...s().Rokt?.launcherOptions || {}
    };
    this.integrationName = tt(d.integrationName), d.integrationName = this.integrationName, this.domain = f;
    const k = {
      loggingUrl: o.loggingUrl,
      errorUrl: o.errorUrl,
      isLoggingEnabled: o.isLoggingEnabled === "true" || o.isLoggingEnabled === !0
    }, E = new j(
      k,
      this.integrationName,
      window.__rokt_li_guid__,
      o.accountId
    ), A = new G(
      k,
      E,
      this.integrationName,
      window.__rokt_li_guid__,
      o.accountId
    );
    return this.errorReportingService = E, this.loggingService = A, s()._registerErrorReportingService && s()._registerErrorReportingService(E), s()._registerLoggingService && s()._registerLoggingService(A), n ? (this.testHelpers = {
      generateLauncherScript: U,
      generateThankYouElementScript: M,
      extractRoktExtensionConfig: P,
      hashEventMessage: D,
      parseSettingsString: b,
      generateMappedEventLookup: K,
      generateMappedEventAttributeLookup: x,
      sendAdBlockMeasurementSignals: Y,
      createAutoRemovedIframe: O,
      djb2: F,
      setAllowedOriginHashes: (_) => {
        h._allowedOriginHashes = _;
      },
      ReportingTransport: T,
      ErrorReportingService: j,
      LoggingService: G,
      RateLimiter: z,
      ErrorCodes: N,
      WSDKErrorSeverity: w
    }, this.attachLauncher(c, d), "Successfully initialized: " + u) : (L && (s().Rokt.flushOnShoppableAdsReadyMessageQueue?.(this), C(q, M(f), {
      onLoad: () => {
        this._isThankYouElementLoaded = !0, this._thankYouElementOnLoadCallback && this._thankYouElementOnLoadCallback();
      },
      onError: (_) => {
        console.error("Error loading Rokt Thank You Element script:", _);
      }
    })), this.isLauncherReadyToAttach() ? this.attachLauncher(c, d, m) : (C(W, U(f, v), {
      onLoad: () => {
        this.isLauncherReadyToAttach() ? this.attachLauncher(c, d, m) : console.error("Rokt object is not available after script load.");
      },
      onError: (_) => {
        console.error("Error loading Rokt launcher script:", _);
      }
    }), this.captureTiming(h.PERFORMANCE_MARKS.RoktScriptAppended)), "Successfully initialized: " + u);
  }
  process(t) {
    if (!this.isKitReady())
      return "Kit not ready for forwarder: " + u;
    if (typeof s().Rokt?.setLocalSessionAttribute == "function" && (R(this.placementEventAttributeMappingLookup) || this.applyPlacementEventAttributeMapping(t), !R(this.placementEventMappingLookup))) {
      const e = D(t.EventDataType, t.EventCategory, t.EventName ?? "");
      this.placementEventMappingLookup[String(e)] && s().Rokt.setLocalSessionAttribute?.(this.placementEventMappingLookup[String(e)], !0);
    }
    return "Successfully sent to forwarder: " + u;
  }
  setExtensionData(t) {
    if (!this.isKitReady()) {
      console.error("Rokt Kit: Not initialized");
      return;
    }
    window.Rokt.setExtensionData(t);
  }
  setUserAttribute(t, e) {
    return this.userAttributes[t] = e, "Successfully set user attribute for forwarder: " + u;
  }
  removeUserAttribute(t) {
    return delete this.userAttributes[t], "Successfully removed user attribute for forwarder: " + u;
  }
  handleIdentityComplete(t, e, n) {
    const r = t;
    return this.userAttributes = t.getAllUserAttributes(), this.pendingIdentityEvents.push(this.buildIdentityEvent(e, r)), "Successfully called " + n + " for forwarder: " + u;
  }
  onUserIdentified(t) {
    return this.filters.filteredUser = t, this.handleIdentityComplete(t, I.IDENTIFY, "onUserIdentified");
  }
  onLoginComplete(t, e) {
    return this.handleIdentityComplete(t, I.LOGIN, "onLoginComplete");
  }
  onLogoutComplete(t, e) {
    return this.handleIdentityComplete(t, I.LOGOUT, "onLogoutComplete");
  }
  onModifyComplete(t, e) {
    return this.handleIdentityComplete(t, I.MODIFY_USER, "onModifyComplete");
  }
  /**
   * Selects placements for Rokt Web SDK with merged attributes, filters, and experimentation options.
   */
  selectPlacements(t) {
    const e = t && t.attributes || {}, n = { ...this.userAttributes, ...e }, r = this.filters || {}, a = r.userAttributeFilters || [], o = r.filteredUser || null, c = o ? o.getMPID() : null;
    let l;
    r ? r.filterUserAttributes ? l = r.filterUserAttributes(n, a) : l = n : (console.warn("Rokt Kit: No filters available, using user attributes"), l = n), this.userAttributes = l;
    const p = this._onboardingExpProvider === "Optimizely" ? this.fetchOptimizely() : {}, f = this.returnUserIdentities(o), v = this.returnLocalSessionAttributes(), m = {
      ...f,
      ...l,
      ...p,
      ...v,
      mpid: c
    }, L = { ...t, attributes: m }, d = this.launcher.selectPlacements(L), k = () => this.logSelectPlacementsEvent(m);
    return Promise.resolve(d).then((E) => E?.context?.sessionId?.then((A) => this.setRoktSessionId(A))).catch(() => {
    }).finally(k), d;
  }
  /**
   * Passes attributes to the Rokt Web SDK for client-side hashing.
   */
  hashAttributes(t) {
    return this.isKitReady() ? this.launcher.hashAttributes(t) : (console.error("Rokt Kit: Not initialized"), null);
  }
  /**
   * Enables optional Integration Launcher extensions before selecting placements.
   *
   * @deprecated This functionality has been internalized and will be removed in a future release.
   */
  use(t) {
    return this.isKitReady() ? !t || !y(t) ? Promise.reject(new Error("Rokt Kit: Invalid extension name")) : this.launcher.use(t) : (console.error("Rokt Kit: Not initialized"), Promise.reject(new Error("Rokt Kit: Not initialized")));
  }
  /**
   * Registers a callback to be invoked once rokt-thank-you-element.js becomes available.
   */
  onShoppableAdsReady(t) {
    this._isThankYouElementLoaded ? t() : this._thankYouElementOnLoadCallback = t;
  }
};
h._allowedOriginHashes = [-553112570, 549508659], h.PERFORMANCE_MARKS = {
  RoktScriptAppended: "mp:RoktScriptAppended"
}, h.EMAIL_SHA256_KEY = "emailsha256";
let g = h;
function ot() {
  return 181;
}
function st(i) {
  if (!i) {
    window.console.log("You must pass a config object to register the kit " + u);
    return;
  }
  if (!S(i)) {
    window.console.log("'config' must be an object. You passed in a " + typeof i);
    return;
  }
  S(i.kits) ? i.kits[u] = {
    constructor: g
  } : (i.kits = {}, i.kits[u] = {
    constructor: g
  }), window.console.log("Successfully registered " + u + " to your mParticle configuration");
}
typeof window < "u" && window.mParticle && s().addForwarder && s().addForwarder({
  name: u,
  constructor: g,
  getId: ot
});
export {
  st as register
};
//# sourceMappingURL=Rokt-Kit.esm.js.map

const u = "Rokt";
const Q = "selectPlacements", B = "apps.roktecommerce.com";
const k = {
  LOGIN: "login",
  LOGOUT: "logout",
  MODIFY_USER: "modify_user",
  IDENTIFY: "identify"
}, V = "ThankYouJourney", W = "rokt-launcher", q = "rokt-thank-you-element", O = {
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  UNHANDLED_EXCEPTION: "UNHANDLED_EXCEPTION",
  IDENTITY_REQUEST: "IDENTITY_REQUEST"
}, w = {
  ERROR: "ERROR",
  INFO: "INFO",
  WARNING: "WARNING"
}, J = "apps.rokt-api.com/v1/log", X = "apps.rokt-api.com/v1/errors", Z = 10;
function a() {
  return window.mParticle;
}
function U(i, t) {
  const n = [Y(i), "/wsdk/integrations/launcher.js"].join("");
  return !t || t.length === 0 ? n : n + "?extensions=" + t.join(",");
}
function M(i) {
  return [Y(i), "/rokt-elements/rokt-element-thank-you.js"].join("");
}
function Y(i) {
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
function A(i) {
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
  const t = i ? A(i) : [], e = [], n = [];
  let r = !1;
  for (let s = 0; s < t.length; s++) {
    const o = t[s].value;
    o === "thank-you-journey" ? (r = !0, n.push(V)) : e.push(o);
  }
  return {
    roktExtensionsQueryParams: e,
    legacyRoktExtensions: n,
    loadThankYouElement: r
  };
}
function $(i) {
  for (const t of i)
    window.Rokt?.use(t);
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
    if (!n || !_(n.value) || !_(n.map))
      continue;
    const r = n.value, s = n.map;
    t[r] || (t[r] = []), t[r].push({
      eventAttributeKey: s,
      conditions: Array.isArray(n.conditions) ? n.conditions : []
    });
  }
  return t;
}
function D(i, t, e) {
  return a().generateHash([i, t, e].join(""));
}
function E(i) {
  return i == null ? !0 : typeof i == "object" ? Object.keys(i).length === 0 : Array.isArray(i) ? i.length === 0 : !1;
}
function _(i) {
  return typeof i == "string";
}
function tt(i) {
  let n = "mParticle_wsdkv_" + a().getVersion() + "_kitv_" + "1.25.0";
  return i && (n += "_" + i), n;
}
function F(i) {
  let t = 5381;
  for (let e = 0; e < i.length; e++)
    t = (t << 5) + t + i.charCodeAt(e), t = t & t;
  return t;
}
function N(i) {
  const t = document.createElement("iframe");
  t.style.display = "none", t.setAttribute("sandbox", "allow-scripts allow-same-origin"), t.src = i, t.onload = function() {
    t.onload = null, t.parentNode && t.parentNode.removeChild(t);
  };
  const e = document.body || document.head;
  e && e.appendChild(t);
}
function j(i, t) {
  const e = F(window.location.origin);
  if (g._allowedOriginHashes.indexOf(e) === -1 || Math.random() >= 0.1)
    return;
  const r = window.__rokt_li_guid__;
  if (!r)
    return;
  const s = window.location.href.split("?")[0].split("#")[0], o = "version=" + encodeURIComponent(t ?? "") + "&launcherInstanceGuid=" + encodeURIComponent(r) + "&pageUrl=" + encodeURIComponent(s);
  N("https://" + (i || "apps.rokt.com") + "/v1/wsdk-init/index.html?" + o), N(
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
  constructor(t, e, n, r, s) {
    this._reporter = "mp-wsdk";
    const o = t?.isLoggingEnabled === !0 || t?.isLoggingEnabled === "true";
    this._integrationName = e || "", this._launcherInstanceGuid = n, this._accountId = r || null, this._rateLimiter = s || new z(), this._isEnabled = nt() || et() && o;
  }
  send(t, e, n, r, s, o) {
    if (!(!this._isEnabled || this._rateLimiter.incrementAndCheck(e)))
      try {
        const c = {
          additionalInformation: {
            message: n,
            version: this._integrationName
          },
          severity: e,
          code: r || O.UNKNOWN_ERROR,
          url: it(),
          deviceInfo: rt(),
          stackTrace: s,
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
class G {
  constructor(t, e, n, r, s) {
    this._transport = new T(t, e, n, r, s), this._errorUrl = "https://" + (t?.errorUrl || X);
  }
  report(t) {
    if (!t) return;
    const e = t.severity || w.ERROR;
    this._transport.send(this._errorUrl, e, t.message, t.code, t.stackTrace);
  }
}
class H {
  constructor(t, e, n, r, s, o) {
    this._transport = new T(t, n, r, s, o), this._loggingUrl = "https://" + (t?.loggingUrl || J), this._errorReportingService = e;
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
          code: O.UNKNOWN_ERROR,
          severity: w.ERROR
        });
      }
    );
  }
}
const h = class h {
  constructor() {
    this.name = u, this.id = 181, this.moduleId = 181, this.isInitialized = !1, this.launcher = null, this.filters = {}, this.userAttributes = {}, this.testHelpers = null, this.placementEventMappingLookup = {}, this.placementEventAttributeMappingLookup = {}, this.batchQueue = [], this.batchStreamQueue = [], this.pendingIdentityEvents = [], this.integrationName = null, this.errorReportingService = null, this.loggingService = null;
  }
  // ---- Private helpers ----
  getEventAttributeValue(t, e) {
    const n = t && t.EventAttributes;
    return !n || typeof n[e] > "u" ? null : n[e];
  }
  doesEventAttributeConditionMatch(t, e) {
    if (!t || !_(t.operator))
      return !1;
    const n = t.operator.toLowerCase(), r = t.attributeValue;
    return n === "exists" ? e !== null : e == null ? !1 : n === "equals" ? String(e) === String(r) : n === "contains" ? String(e).indexOf(String(r)) !== -1 : !1;
  }
  doesEventMatchRule(t, e) {
    if (!e || !_(e.eventAttributeKey))
      return !1;
    const n = e.conditions;
    if (!Array.isArray(n))
      return !1;
    const r = this.getEventAttributeValue(t, e.eventAttributeKey);
    if (n.length === 0)
      return r !== null;
    for (let s = 0; s < n.length; s++)
      if (!this.doesEventAttributeConditionMatch(n[s], r))
        return !1;
    return !0;
  }
  applyPlacementEventAttributeMapping(t) {
    const e = Object.keys(this.placementEventAttributeMappingLookup);
    for (let n = 0; n < e.length; n++) {
      const r = e[n], s = this.placementEventAttributeMappingLookup[r];
      if (E(s))
        continue;
      let o = !0;
      for (let c = 0; c < s.length; c++)
        if (!this.doesEventMatchRule(t, s[c])) {
          o = !1;
          break;
        }
      o && a().Rokt.setLocalSessionAttribute?.(r, !0);
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
    return !a().Rokt || typeof a().Rokt.getLocalSessionAttributes != "function" ? {} : E(this.placementEventMappingLookup) && E(this.placementEventAttributeMappingLookup) ? {} : a().Rokt.getLocalSessionAttributes();
  }
  replaceOtherIdentityWithEmailsha256(t) {
    const e = { ...t || {} }, n = this._mappedEmailSha256Key;
    return n && t[n] && (e[h.EMAIL_SHA256_KEY] = t[n]), n && delete e[n], e;
  }
  logSelectPlacementsEvent(t) {
    if (!window.mParticle || typeof a().logEvent != "function" || !S(t))
      return;
    const e = a().EventType.Other;
    a().logEvent(Q, e, t);
  }
  buildIdentityEvent(t, e) {
    const n = e.getMPID(), r = a() && a().sessionManager && typeof a().sessionManager.getSession == "function" ? a().sessionManager.getSession() : void 0;
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
        const e = a().getInstance();
        e && typeof e.setIntegrationAttribute == "function" && e.setIntegrationAttribute(181, {
          roktSessionId: t
        });
      } catch {
      }
  }
  attachLauncher(t, e) {
    const n = a() && a().sessionManager && typeof a().sessionManager.getSession == "function" ? a().sessionManager.getSession() : void 0, r = {
      accountId: t,
      ...e || {},
      ...n ? { mpSessionId: n } : {}
    };
    if (this.isPartnerInLocalLauncherTestGroup()) {
      const s = window.Rokt.createLocalLauncher(r);
      this.initRoktLauncher(s);
    } else
      window.Rokt.createLauncher(r).then((s) => this.initRoktLauncher(s)).catch((s) => {
        console.error("Error creating Rokt launcher:", s);
      });
  }
  initRoktLauncher(t) {
    window.Rokt && (window.Rokt.currentLauncher = t), this.launcher = t;
    const e = a().Rokt?.filters;
    e ? (this.filters = e, e.filteredUser || console.warn("Rokt Kit: No filtered user has been set.")) : console.warn("Rokt Kit: No filters have been set."), this.isInitialized = !0, j(this.domain, this.integrationName), a().Rokt.attachKit(this), this.drainBatchQueue();
  }
  fetchOptimizely() {
    const t = a()._getActiveForwarders().filter((e) => e.name === "Optimizely");
    try {
      if (t.length > 0 && window.optimizely) {
        const e = window.optimizely.get("state");
        return !e || !e.getActiveExperimentIds ? {} : e.getActiveExperimentIds().reduce((s, o) => (s["rokt.custom.optimizely.experiment." + o + ".variationId"] = e.getVariationMap()[o].id, s), {});
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
    return !!(a().config && a().config.isLocalLauncherEnabled && this.isAssignedToSampleGroup());
  }
  isAssignedToSampleGroup() {
    return Math.random() > 0.5;
  }
  captureTiming(t) {
    window && a() && a().captureTiming && t && a().captureTiming(t);
  }
  // ---- Public methods (mParticle Kit Callbacks) ----
  /**
   * Initializes the Rokt forwarder with settings from the mParticle server.
   */
  init(t, e, n, r, s) {
    const o = t, c = o.accountId;
    this.userAttributes = s || {}, this._onboardingExpProvider = o.onboardingExpProvider;
    const l = A(o.placementEventMapping);
    this.placementEventMappingLookup = K(l);
    const p = A(
      o.placementEventAttributeMapping
    );
    this.placementEventAttributeMappingLookup = x(p), o.hashedEmailUserIdentityType && (this._mappedEmailSha256Key = o.hashedEmailUserIdentityType.toLowerCase());
    const f = a().Rokt?.domain, { roktExtensionsQueryParams: b, legacyRoktExtensions: R, loadThankYouElement: v } = P(
      o.roktExtensions
    ), d = {
      ...a().Rokt?.launcherOptions || {}
    };
    this.integrationName = tt(d.integrationName), d.integrationName = this.integrationName, this.domain = f;
    const y = {
      loggingUrl: o.loggingUrl,
      errorUrl: o.errorUrl,
      isLoggingEnabled: o.isLoggingEnabled === "true" || o.isLoggingEnabled === !0
    }, m = new G(
      y,
      this.integrationName,
      window.__rokt_li_guid__,
      o.accountId
    ), I = new H(
      y,
      m,
      this.integrationName,
      window.__rokt_li_guid__,
      o.accountId
    );
    return this.errorReportingService = m, this.loggingService = I, a()._registerErrorReportingService && a()._registerErrorReportingService(m), a()._registerLoggingService && a()._registerLoggingService(I), n ? (this.testHelpers = {
      generateLauncherScript: U,
      generateThankYouElementScript: M,
      extractRoktExtensionConfig: P,
      hashEventMessage: D,
      parseSettingsString: A,
      generateMappedEventLookup: K,
      generateMappedEventAttributeLookup: x,
      sendAdBlockMeasurementSignals: j,
      createAutoRemovedIframe: N,
      djb2: F,
      setAllowedOriginHashes: (L) => {
        h._allowedOriginHashes = L;
      },
      ReportingTransport: T,
      ErrorReportingService: G,
      LoggingService: H,
      RateLimiter: z,
      ErrorCodes: O,
      WSDKErrorSeverity: w
    }, this.attachLauncher(c, d), "Successfully initialized: " + u) : (v && C(q, M(f)), this.isLauncherReadyToAttach() ? this.attachLauncher(c, d) : (C(W, U(f, b), {
      onLoad: () => {
        this.isLauncherReadyToAttach() ? (this.attachLauncher(c, d), $(R)) : console.error("Rokt object is not available after script load.");
      },
      onError: (L) => {
        console.error("Error loading Rokt launcher script:", L);
      }
    }), this.captureTiming(h.PERFORMANCE_MARKS.RoktScriptAppended)), "Successfully initialized: " + u);
  }
  process(t) {
    if (!this.isKitReady())
      return "Kit not ready for forwarder: " + u;
    if (typeof a().Rokt?.setLocalSessionAttribute == "function" && (E(this.placementEventAttributeMappingLookup) || this.applyPlacementEventAttributeMapping(t), !E(this.placementEventMappingLookup))) {
      const e = D(t.EventDataType, t.EventCategory, t.EventName ?? "");
      this.placementEventMappingLookup[String(e)] && a().Rokt.setLocalSessionAttribute?.(this.placementEventMappingLookup[String(e)], !0);
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
    return this.filters.filteredUser = t, this.handleIdentityComplete(t, k.IDENTIFY, "onUserIdentified");
  }
  onLoginComplete(t, e) {
    return this.handleIdentityComplete(t, k.LOGIN, "onLoginComplete");
  }
  onLogoutComplete(t, e) {
    return this.handleIdentityComplete(t, k.LOGOUT, "onLogoutComplete");
  }
  onModifyComplete(t, e) {
    return this.handleIdentityComplete(t, k.MODIFY_USER, "onModifyComplete");
  }
  /**
   * Selects placements for Rokt Web SDK with merged attributes, filters, and experimentation options.
   */
  selectPlacements(t) {
    const e = t && t.attributes || {}, n = { ...this.userAttributes, ...e }, r = this.filters || {}, s = r.userAttributeFilters || [], o = r.filteredUser || null, c = o ? o.getMPID() : null;
    let l;
    r ? r.filterUserAttributes ? l = r.filterUserAttributes(n, s) : l = n : (console.warn("Rokt Kit: No filters available, using user attributes"), l = n), this.userAttributes = l;
    const p = this._onboardingExpProvider === "Optimizely" ? this.fetchOptimizely() : {}, f = this.returnUserIdentities(o), b = this.returnLocalSessionAttributes(), R = {
      ...f,
      ...l,
      ...p,
      ...b,
      mpid: c
    }, v = { ...t, attributes: R }, d = this.launcher.selectPlacements(v), y = () => this.logSelectPlacementsEvent(R);
    return Promise.resolve(d).then((m) => m?.context?.sessionId?.then((I) => this.setRoktSessionId(I))).catch(() => {
    }).finally(y), d;
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
    return this.isKitReady() ? !t || !_(t) ? Promise.reject(new Error("Rokt Kit: Invalid extension name")) : this.launcher.use(t) : (console.error("Rokt Kit: Not initialized"), Promise.reject(new Error("Rokt Kit: Not initialized")));
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
typeof window < "u" && window.mParticle && a().addForwarder && a().addForwarder({
  name: u,
  constructor: g,
  getId: ot
});
export {
  st as register
};
//# sourceMappingURL=Rokt-Kit.esm.js.map

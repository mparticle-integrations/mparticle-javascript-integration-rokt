const c = "Rokt";
const j = "selectPlacements", z = "apps.roktecommerce.com";
const w = {
  LOGIN: "login",
  LOGOUT: "logout",
  MODIFY_USER: "modify_user",
  IDENTIFY: "identify"
}, N = {
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  UNHANDLED_EXCEPTION: "UNHANDLED_EXCEPTION",
  IDENTITY_REQUEST: "IDENTITY_REQUEST"
}, I = {
  ERROR: "ERROR",
  INFO: "INFO",
  WARNING: "WARNING"
}, Y = "apps.rokt-api.com/v1/log", Q = "apps.rokt-api.com/v1/errors", V = 10;
function s() {
  return window.mParticle;
}
function U(n, t) {
  const o = ["https://", typeof n < "u" ? n : "apps.rokt.com", "/wsdk/integrations/launcher.js"].join("");
  return !t || t.length === 0 ? o : o + "?extensions=" + t.join(",");
}
function S(n) {
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
function T(n) {
  const t = n ? v(n) : [], e = [];
  for (let i = 0; i < t.length; i++)
    e.push(t[i].value);
  return e;
}
function M(n) {
  if (!n)
    return {};
  const t = {};
  for (let e = 0; e < n.length; e++) {
    const i = n[e];
    t[i.jsmap] = i.value;
  }
  return t;
}
function P(n) {
  const t = {};
  if (!Array.isArray(n))
    return t;
  for (let e = 0; e < n.length; e++) {
    const i = n[e];
    if (!i || !R(i.value) || !R(i.map))
      continue;
    const r = i.value, o = i.map;
    t[r] || (t[r] = []), t[r].push({
      eventAttributeKey: o,
      conditions: Array.isArray(i.conditions) ? i.conditions : []
    });
  }
  return t;
}
function C(n, t, e) {
  return s().generateHash([n, t, e].join(""));
}
function _(n) {
  return n == null ? !0 : typeof n == "object" ? Object.keys(n).length === 0 : Array.isArray(n) ? n.length === 0 : !1;
}
function R(n) {
  return typeof n == "string";
}
function B(n) {
  let i = "mParticle_wsdkv_" + s().getVersion() + "_kitv_" + "1.24.1";
  return n && (i += "_" + n), i;
}
function G(n) {
  let t = 5381;
  for (let e = 0; e < n.length; e++)
    t = (t << 5) + t + n.charCodeAt(e), t = t & t;
  return t;
}
function L(n) {
  const t = document.createElement("iframe");
  t.style.display = "none", t.setAttribute("sandbox", "allow-scripts allow-same-origin"), t.src = n, t.onload = function() {
    t.onload = null, t.parentNode && t.parentNode.removeChild(t);
  };
  const e = document.body || document.head;
  e && e.appendChild(t);
}
function K(n, t) {
  const e = G(window.location.origin);
  if (m._allowedOriginHashes.indexOf(e) === -1 || Math.random() >= 0.1)
    return;
  const r = window.__rokt_li_guid__;
  if (!r)
    return;
  const o = window.location.href.split("?")[0].split("#")[0], a = "version=" + encodeURIComponent(t ?? "") + "&launcherInstanceGuid=" + encodeURIComponent(r) + "&pageUrl=" + encodeURIComponent(o);
  L("https://" + (n || "apps.rokt.com") + "/v1/wsdk-init/index.html?" + a), L(
    "https://" + z + "/v1/wsdk-init/index.html?" + a + "&isControl=true"
  );
}
function W() {
  return typeof window < "u" && !!window.ROKT_DOMAIN;
}
function q() {
  return typeof window < "u" && !!window.location?.search?.toLowerCase().includes("mp_enable_logging=true");
}
function J() {
  return typeof window < "u" ? window.location?.href : void 0;
}
function X() {
  return typeof window < "u" ? window.navigator?.userAgent : void 0;
}
class F {
  constructor() {
    this._logCount = {};
  }
  incrementAndCheck(t) {
    const i = (this._logCount[t] || 0) + 1;
    return this._logCount[t] = i, i > V;
  }
}
class O {
  constructor(t, e, i, r, o) {
    this._reporter = "mp-wsdk";
    const a = t?.isLoggingEnabled === !0 || t?.isLoggingEnabled === "true";
    this._integrationName = e || "", this._launcherInstanceGuid = i, this._accountId = r || null, this._rateLimiter = o || new F(), this._isEnabled = q() || W() && a;
  }
  send(t, e, i, r, o, a) {
    if (!(!this._isEnabled || this._rateLimiter.incrementAndCheck(e)))
      try {
        const u = {
          additionalInformation: {
            message: i,
            version: this._integrationName
          },
          severity: e,
          code: r || N.UNKNOWN_ERROR,
          url: J(),
          deviceInfo: X(),
          stackTrace: o,
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
          body: JSON.stringify(u)
        }).catch((g) => {
          console.error("ReportingTransport: Failed to send log", g), a && a(g);
        });
      } catch (u) {
        console.error("ReportingTransport: Failed to send log", u), a && a(u);
      }
  }
}
class D {
  constructor(t, e, i, r, o) {
    this._transport = new O(t, e, i, r, o), this._errorUrl = "https://" + (t?.errorUrl || Q);
  }
  report(t) {
    if (!t) return;
    const e = t.severity || I.ERROR;
    this._transport.send(this._errorUrl, e, t.message, t.code, t.stackTrace);
  }
}
class x {
  constructor(t, e, i, r, o, a) {
    this._transport = new O(t, i, r, o, a), this._loggingUrl = "https://" + (t?.loggingUrl || Y), this._errorReportingService = e;
  }
  log(t) {
    t && this._transport.send(
      this._loggingUrl,
      I.INFO,
      t.message,
      t.code,
      void 0,
      (e) => {
        this._errorReportingService && this._errorReportingService.report({
          message: "LoggingService: Failed to send log: " + e.message,
          code: N.UNKNOWN_ERROR,
          severity: I.ERROR
        });
      }
    );
  }
}
const p = class p {
  constructor() {
    this.name = c, this.id = 181, this.moduleId = 181, this.isInitialized = !1, this.launcher = null, this.filters = {}, this.userAttributes = {}, this.testHelpers = null, this.placementEventMappingLookup = {}, this.placementEventAttributeMappingLookup = {}, this.batchQueue = [], this.batchStreamQueue = [], this.pendingIdentityEvents = [], this.integrationName = null, this.errorReportingService = null, this.loggingService = null;
  }
  // ---- Private helpers ----
  getEventAttributeValue(t, e) {
    const i = t && t.EventAttributes;
    return !i || typeof i[e] > "u" ? null : i[e];
  }
  doesEventAttributeConditionMatch(t, e) {
    if (!t || !R(t.operator))
      return !1;
    const i = t.operator.toLowerCase(), r = t.attributeValue;
    return i === "exists" ? e !== null : e == null ? !1 : i === "equals" ? String(e) === String(r) : i === "contains" ? String(e).indexOf(String(r)) !== -1 : !1;
  }
  doesEventMatchRule(t, e) {
    if (!e || !R(e.eventAttributeKey))
      return !1;
    const i = e.conditions;
    if (!Array.isArray(i))
      return !1;
    const r = this.getEventAttributeValue(t, e.eventAttributeKey);
    if (i.length === 0)
      return r !== null;
    for (let o = 0; o < i.length; o++)
      if (!this.doesEventAttributeConditionMatch(i[o], r))
        return !1;
    return !0;
  }
  applyPlacementEventAttributeMapping(t) {
    const e = Object.keys(this.placementEventAttributeMappingLookup);
    for (let i = 0; i < e.length; i++) {
      const r = e[i], o = this.placementEventAttributeMappingLookup[r];
      if (_(o))
        continue;
      let a = !0;
      for (let u = 0; u < o.length; u++)
        if (!this.doesEventMatchRule(t, o[u])) {
          a = !1;
          break;
        }
      a && s().Rokt.setLocalSessionAttribute?.(r, !0);
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
    return !s().Rokt || typeof s().Rokt.getLocalSessionAttributes != "function" ? {} : _(this.placementEventMappingLookup) && _(this.placementEventAttributeMappingLookup) ? {} : s().Rokt.getLocalSessionAttributes();
  }
  replaceOtherIdentityWithEmailsha256(t) {
    const e = { ...t || {} }, i = this._mappedEmailSha256Key;
    return i && t[i] && (e[p.EMAIL_SHA256_KEY] = t[i]), i && delete e[i], e;
  }
  logSelectPlacementsEvent(t) {
    if (!window.mParticle || typeof s().logEvent != "function" || !S(t))
      return;
    const e = s().EventType.Other;
    s().logEvent(j, e, t);
  }
  buildIdentityEvent(t, e) {
    const i = e.getMPID(), r = s() && s().sessionManager && typeof s().sessionManager.getSession == "function" ? s().sessionManager.getSession() : void 0;
    return {
      event_type: t,
      data: {
        timestamp_unixtime_ms: Date.now(),
        session_uuid: r ?? void 0,
        mpid: i
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
    return this.isKitReady() ? (this.sendBatchStream(this.mergePendingIdentityEvents(t)), "Successfully sent batch to forwarder: " + c) : (this.batchQueue.push(t), "Batch queued for forwarder: " + c);
  }
  sendBatchStream(t) {
    if (window.Rokt && typeof window.Rokt.__batch_stream__ == "function") {
      if (this.batchStreamQueue.length) {
        const e = this.batchStreamQueue;
        this.batchStreamQueue = [];
        for (let i = 0; i < e.length; i++)
          window.Rokt.__batch_stream__(e[i]);
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
  attachLauncher(t, e) {
    const i = s() && s().sessionManager && typeof s().sessionManager.getSession == "function" ? s().sessionManager.getSession() : void 0, r = {
      accountId: t,
      ...e || {},
      ...i ? { mpSessionId: i } : {}
    };
    if (this.isPartnerInLocalLauncherTestGroup()) {
      const o = window.Rokt.createLocalLauncher(r);
      this.initRoktLauncher(o);
    } else
      window.Rokt.createLauncher(r).then((o) => this.initRoktLauncher(o)).catch((o) => {
        console.error("Error creating Rokt launcher:", o);
      });
  }
  initRoktLauncher(t) {
    window.Rokt && (window.Rokt.currentLauncher = t), this.launcher = t;
    const e = s().Rokt?.filters;
    e ? (this.filters = e, e.filteredUser || console.warn("Rokt Kit: No filtered user has been set.")) : console.warn("Rokt Kit: No filters have been set."), this.isInitialized = !0, K(this.domain, this.integrationName), s().Rokt.attachKit(this), this.drainBatchQueue();
  }
  fetchOptimizely() {
    const t = s()._getActiveForwarders().filter((e) => e.name === "Optimizely");
    try {
      if (t.length > 0 && window.optimizely) {
        const e = window.optimizely.get("state");
        return !e || !e.getActiveExperimentIds ? {} : e.getActiveExperimentIds().reduce((o, a) => (o["rokt.custom.optimizely.experiment." + a + ".variationId"] = e.getVariationMap()[a].id, o), {});
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
  init(t, e, i, r, o) {
    const a = t, u = a.accountId, l = T(a.roktExtensions);
    this.userAttributes = o || {}, this._onboardingExpProvider = a.onboardingExpProvider;
    const g = v(a.placementEventMapping);
    this.placementEventMappingLookup = M(g);
    const k = v(
      a.placementEventAttributeMapping
    );
    this.placementEventAttributeMappingLookup = P(k), a.hashedEmailUserIdentityType && (this._mappedEmailSha256Key = a.hashedEmailUserIdentityType.toLowerCase());
    const y = s().Rokt?.domain, h = {
      ...s().Rokt?.launcherOptions || {}
    };
    this.integrationName = B(h.integrationName), h.integrationName = this.integrationName, this.domain = y;
    const A = {
      loggingUrl: a.loggingUrl,
      errorUrl: a.errorUrl,
      isLoggingEnabled: a.isLoggingEnabled === "true" || a.isLoggingEnabled === !0
    }, f = new D(
      A,
      this.integrationName,
      window.__rokt_li_guid__,
      a.accountId
    ), b = new x(
      A,
      f,
      this.integrationName,
      window.__rokt_li_guid__,
      a.accountId
    );
    if (this.errorReportingService = f, this.loggingService = b, s()._registerErrorReportingService && s()._registerErrorReportingService(f), s()._registerLoggingService && s()._registerLoggingService(b), i)
      return this.testHelpers = {
        generateLauncherScript: U,
        extractRoktExtensions: T,
        hashEventMessage: C,
        parseSettingsString: v,
        generateMappedEventLookup: M,
        generateMappedEventAttributeLookup: P,
        sendAdBlockMeasurementSignals: K,
        createAutoRemovedIframe: L,
        djb2: G,
        setAllowedOriginHashes: (E) => {
          p._allowedOriginHashes = E;
        },
        ReportingTransport: O,
        ErrorReportingService: D,
        LoggingService: x,
        RateLimiter: F,
        ErrorCodes: N,
        WSDKErrorSeverity: I
      }, this.attachLauncher(u, h), "Successfully initialized: " + c;
    if (this.isLauncherReadyToAttach())
      this.attachLauncher(u, h);
    else {
      const E = document.head || document.body, d = document.createElement("script");
      d.type = "text/javascript", d.src = U(y, l), d.async = !0, d.crossOrigin = "anonymous", d.fetchPriority = "high", d.id = "rokt-launcher", d.onload = () => {
        this.isLauncherReadyToAttach() ? this.attachLauncher(u, h) : console.error("Rokt object is not available after script load.");
      }, d.onerror = (H) => {
        console.error("Error loading Rokt launcher script:", H);
      }, E.appendChild(d), this.captureTiming(p.PERFORMANCE_MARKS.RoktScriptAppended);
    }
    return "Successfully initialized: " + c;
  }
  process(t) {
    if (!this.isKitReady())
      return "Kit not ready for forwarder: " + c;
    if (typeof s().Rokt?.setLocalSessionAttribute == "function" && (_(this.placementEventAttributeMappingLookup) || this.applyPlacementEventAttributeMapping(t), !_(this.placementEventMappingLookup))) {
      const e = C(t.EventDataType, t.EventCategory, t.EventName ?? "");
      this.placementEventMappingLookup[String(e)] && s().Rokt.setLocalSessionAttribute?.(this.placementEventMappingLookup[String(e)], !0);
    }
    return "Successfully sent to forwarder: " + c;
  }
  setExtensionData(t) {
    if (!this.isKitReady()) {
      console.error("Rokt Kit: Not initialized");
      return;
    }
    window.Rokt.setExtensionData(t);
  }
  setUserAttribute(t, e) {
    return this.userAttributes[t] = e, "Successfully set user attribute for forwarder: " + c;
  }
  removeUserAttribute(t) {
    return delete this.userAttributes[t], "Successfully removed user attribute for forwarder: " + c;
  }
  onUserIdentified(t) {
    const e = t;
    return this.filters.filteredUser = e, this.userAttributes = t.getAllUserAttributes(), this.pendingIdentityEvents.push(this.buildIdentityEvent(w.IDENTIFY, e)), "Successfully called onUserIdentified for forwarder: " + c;
  }
  onLoginComplete(t, e) {
    const i = t;
    return this.userAttributes = t.getAllUserAttributes(), this.pendingIdentityEvents.push(this.buildIdentityEvent(w.LOGIN, i)), "Successfully called onLoginComplete for forwarder: " + c;
  }
  onLogoutComplete(t, e) {
    const i = t;
    return this.userAttributes = t.getAllUserAttributes(), this.pendingIdentityEvents.push(this.buildIdentityEvent(w.LOGOUT, i)), "Successfully called onLogoutComplete for forwarder: " + c;
  }
  onModifyComplete(t, e) {
    const i = t;
    return this.userAttributes = t.getAllUserAttributes(), this.pendingIdentityEvents.push(this.buildIdentityEvent(w.MODIFY_USER, i)), "Successfully called onModifyComplete for forwarder: " + c;
  }
  /**
   * Selects placements for Rokt Web SDK with merged attributes, filters, and experimentation options.
   */
  selectPlacements(t) {
    const e = t && t.attributes || {}, i = { ...this.userAttributes, ...e }, r = this.filters || {}, o = r.userAttributeFilters || [], a = r.filteredUser || null, u = a ? a.getMPID() : null;
    let l;
    r ? r.filterUserAttributes ? l = r.filterUserAttributes(i, o) : l = i : (console.warn("Rokt Kit: No filters available, using user attributes"), l = i), this.userAttributes = l;
    const g = this._onboardingExpProvider === "Optimizely" ? this.fetchOptimizely() : {}, k = this.returnUserIdentities(a), y = this.returnLocalSessionAttributes(), h = {
      ...k,
      ...l,
      ...g,
      ...y,
      mpid: u
    }, A = { ...t, attributes: h }, f = this.launcher.selectPlacements(A), b = () => this.logSelectPlacementsEvent(h);
    return Promise.resolve(f).then((E) => E?.context?.sessionId?.then((d) => this.setRoktSessionId(d))).catch(() => {
    }).finally(b), f;
  }
  /**
   * Passes attributes to the Rokt Web SDK for client-side hashing.
   */
  hashAttributes(t) {
    return this.isKitReady() ? this.launcher.hashAttributes(t) : (console.error("Rokt Kit: Not initialized"), null);
  }
  /**
   * Enables optional Integration Launcher extensions before selecting placements.
   */
  use(t) {
    return this.isKitReady() ? !t || !R(t) ? Promise.reject(new Error("Rokt Kit: Invalid extension name")) : this.launcher.use(t) : (console.error("Rokt Kit: Not initialized"), Promise.reject(new Error("Rokt Kit: Not initialized")));
  }
};
p._allowedOriginHashes = [-553112570, 549508659], p.PERFORMANCE_MARKS = {
  RoktScriptAppended: "mp:RoktScriptAppended"
}, p.EMAIL_SHA256_KEY = "emailsha256";
let m = p;
function Z() {
  return 181;
}
function $(n) {
  if (!n) {
    window.console.log("You must pass a config object to register the kit " + c);
    return;
  }
  if (!S(n)) {
    window.console.log("'config' must be an object. You passed in a " + typeof n);
    return;
  }
  S(n.kits) ? n.kits[c] = {
    constructor: m
  } : (n.kits = {}, n.kits[c] = {
    constructor: m
  }), window.console.log("Successfully registered " + c + " to your mParticle configuration");
}
typeof window < "u" && window.mParticle && s().addForwarder && s().addForwarder({
  name: c,
  constructor: m,
  getId: Z
});
export {
  $ as register
};
//# sourceMappingURL=Rokt-Kit.esm.js.map

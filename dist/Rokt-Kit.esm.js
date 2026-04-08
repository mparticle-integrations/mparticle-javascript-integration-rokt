const g = "Rokt";
const H = "selectPlacements", j = "apps.roktecommerce.com";
const L = {
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  UNHANDLED_EXCEPTION: "UNHANDLED_EXCEPTION",
  IDENTITY_REQUEST: "IDENTITY_REQUEST"
}, w = {
  ERROR: "ERROR",
  INFO: "INFO",
  WARNING: "WARNING"
}, F = "apps.rokt-api.com/v1/log", z = "apps.rokt-api.com/v1/errors", Q = 10;
function s() {
  return window.mParticle;
}
function O(n, t) {
  const o = ["https://", typeof n < "u" ? n : "apps.rokt.com", "/wsdk/integrations/launcher.js"].join("");
  return !t || t.length === 0 ? o : o + "?extensions=" + t.join(",");
}
function k(n) {
  return n != null && typeof n == "object" && Array.isArray(n) === !1;
}
function y(n) {
  if (!n)
    return [];
  try {
    return JSON.parse(n.replace(/&quot;/g, '"'));
  } catch {
    console.error("Settings string contains invalid JSON");
  }
  return [];
}
function M(n) {
  const t = n ? y(n) : [], e = [];
  for (let i = 0; i < t.length; i++)
    e.push(t[i].value);
  return e;
}
function T(n) {
  if (!n)
    return {};
  const t = {};
  for (let e = 0; e < n.length; e++) {
    const i = n[e];
    t[i.jsmap] = i.value;
  }
  return t;
}
function U(n) {
  const t = {};
  if (!Array.isArray(n))
    return t;
  for (let e = 0; e < n.length; e++) {
    const i = n[e];
    if (!i || !v(i.value) || !v(i.map))
      continue;
    const r = i.value, o = i.map;
    t[r] || (t[r] = []), t[r].push({
      eventAttributeKey: o,
      conditions: Array.isArray(i.conditions) ? i.conditions : []
    });
  }
  return t;
}
function P(n, t, e) {
  return s().generateHash([n, t, e].join(""));
}
function R(n) {
  return n == null ? !0 : typeof n == "object" ? Object.keys(n).length === 0 : Array.isArray(n) ? n.length === 0 : !1;
}
function v(n) {
  return typeof n == "string";
}
function V(n) {
  let i = "mParticle_wsdkv_" + s().getVersion() + "_kitv_" + "1.23.0";
  return n && (i += "_" + n), i;
}
function x(n) {
  let t = 5381;
  for (let e = 0; e < n.length; e++)
    t = (t << 5) + t + n.charCodeAt(e), t = t & t;
  return t;
}
function S(n) {
  const t = document.createElement("iframe");
  t.style.display = "none", t.setAttribute("sandbox", "allow-scripts allow-same-origin"), t.src = n, t.onload = function() {
    t.onload = null, t.parentNode && t.parentNode.removeChild(t);
  };
  const e = document.body || document.head;
  e && e.appendChild(t);
}
function C(n, t) {
  const e = x(window.location.origin);
  if (f._allowedOriginHashes.indexOf(e) === -1 || Math.random() >= 0.1)
    return;
  const r = window.__rokt_li_guid__;
  if (!r)
    return;
  const o = window.location.href.split("?")[0].split("#")[0], a = "version=" + encodeURIComponent(t ?? "") + "&launcherInstanceGuid=" + encodeURIComponent(r) + "&pageUrl=" + encodeURIComponent(o);
  S("https://" + (n || "apps.rokt.com") + "/v1/wsdk-init/index.html?" + a), S(
    "https://" + j + "/v1/wsdk-init/index.html?" + a + "&isControl=true"
  );
}
function Y() {
  return typeof window < "u" && !!window.ROKT_DOMAIN;
}
function W() {
  return typeof window < "u" && !!window.location?.search?.toLowerCase().includes("mp_enable_logging=true");
}
function q() {
  return typeof window < "u" ? window.location?.href : void 0;
}
function B() {
  return typeof window < "u" ? window.navigator?.userAgent : void 0;
}
class G {
  constructor() {
    this._logCount = {};
  }
  incrementAndCheck(t) {
    const i = (this._logCount[t] || 0) + 1;
    return this._logCount[t] = i, i > Q;
  }
}
class N {
  constructor(t, e, i, r, o) {
    this._reporter = "mp-wsdk";
    const a = t?.isLoggingEnabled === !0 || t?.isLoggingEnabled === "true";
    this._integrationName = e || "", this._launcherInstanceGuid = i, this._accountId = r || null, this._rateLimiter = o || new G(), this._isEnabled = W() || Y() && a;
  }
  send(t, e, i, r, o, a) {
    if (!(!this._isEnabled || this._rateLimiter.incrementAndCheck(e)))
      try {
        const c = {
          additionalInformation: {
            message: i,
            version: this._integrationName
          },
          severity: e,
          code: r || L.UNKNOWN_ERROR,
          url: q(),
          deviceInfo: B(),
          stackTrace: o,
          reporter: this._reporter,
          integration: this._integrationName
        }, u = {
          Accept: "text/plain;charset=UTF-8",
          "Content-Type": "application/json",
          "rokt-launcher-version": this._integrationName,
          "rokt-wsdk-version": "joint"
        };
        this._launcherInstanceGuid && (u["rokt-launcher-instance-guid"] = this._launcherInstanceGuid), this._accountId && (u["rokt-account-id"] = this._accountId), fetch(t, {
          method: "POST",
          headers: u,
          body: JSON.stringify(c)
        }).catch((p) => {
          console.error("ReportingTransport: Failed to send log", p), a && a(p);
        });
      } catch (c) {
        console.error("ReportingTransport: Failed to send log", c), a && a(c);
      }
  }
}
class D {
  constructor(t, e, i, r, o) {
    this._transport = new N(t, e, i, r, o), this._errorUrl = "https://" + (t?.errorUrl || z);
  }
  report(t) {
    if (!t) return;
    const e = t.severity || w.ERROR;
    this._transport.send(this._errorUrl, e, t.message, t.code, t.stackTrace);
  }
}
class K {
  constructor(t, e, i, r, o, a) {
    this._transport = new N(t, i, r, o, a), this._loggingUrl = "https://" + (t?.loggingUrl || F), this._errorReportingService = e;
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
          code: L.UNKNOWN_ERROR,
          severity: w.ERROR
        });
      }
    );
  }
}
const d = class d {
  constructor() {
    this.name = g, this.moduleId = 181, this.isInitialized = !1, this.launcher = null, this.filters = {}, this.userAttributes = {}, this.testHelpers = null, this.placementEventMappingLookup = {}, this.placementEventAttributeMappingLookup = {}, this.eventQueue = [], this.eventStreamQueue = [], this.integrationName = null, this.errorReportingService = null, this.loggingService = null;
  }
  // ---- Private helpers ----
  getEventAttributeValue(t, e) {
    const i = t && t.EventAttributes;
    return !i || typeof i[e] > "u" ? null : i[e];
  }
  doesEventAttributeConditionMatch(t, e) {
    if (!t || !v(t.operator))
      return !1;
    const i = t.operator.toLowerCase(), r = t.attributeValue;
    return i === "exists" ? e !== null : e == null ? !1 : i === "equals" ? String(e) === String(r) : i === "contains" ? String(e).indexOf(String(r)) !== -1 : !1;
  }
  doesEventMatchRule(t, e) {
    if (!e || !v(e.eventAttributeKey))
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
      if (R(o))
        continue;
      let a = !0;
      for (let c = 0; c < o.length; c++)
        if (!this.doesEventMatchRule(t, o[c])) {
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
    return !s().Rokt || typeof s().Rokt.getLocalSessionAttributes != "function" ? {} : R(this.placementEventMappingLookup) && R(this.placementEventAttributeMappingLookup) ? {} : s().Rokt.getLocalSessionAttributes();
  }
  replaceOtherIdentityWithEmailsha256(t) {
    const e = { ...t || {} }, i = this._mappedEmailSha256Key;
    return i && t[i] && (e[d.EMAIL_SHA256_KEY] = t[i]), i && delete e[i], e;
  }
  logSelectPlacementsEvent(t) {
    if (!window.mParticle || typeof s().logEvent != "function" || !k(t))
      return;
    const e = s().EventType.Other;
    s().logEvent(H, e, t);
  }
  processEventQueue() {
    this.eventQueue.forEach((t) => {
      this.process(t);
    }), this.eventQueue = [];
  }
  enrichEvent(t) {
    return { ...t, UserAttributes: this.userAttributes };
  }
  sendEventStream(t) {
    if (window.Rokt && typeof window.Rokt.__event_stream__ == "function") {
      if (this.eventStreamQueue.length) {
        const e = this.eventStreamQueue;
        this.eventStreamQueue = [];
        for (let i = 0; i < e.length; i++)
          window.Rokt.__event_stream__(this.enrichEvent(e[i]));
      }
      window.Rokt.__event_stream__(this.enrichEvent(t));
    } else
      this.eventStreamQueue.push(t);
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
  buildIdentityEvent(t, e) {
    const i = e.getMPID && typeof e.getMPID == "function" ? e.getMPID() : null, r = s() && s().sessionManager && typeof s().sessionManager.getSession == "function" ? s().sessionManager.getSession() : null, o = e.getUserIdentities && typeof e.getUserIdentities == "function" ? e.getUserIdentities().userIdentities : null;
    return {
      EventName: t,
      EventDataType: 14,
      EventCategory: 0,
      Timestamp: Date.now(),
      MPID: i,
      SessionId: r,
      UserIdentities: o
    };
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
    e ? (this.filters = e, e.filteredUser || console.warn("Rokt Kit: No filtered user has been set.")) : console.warn("Rokt Kit: No filters have been set."), this.isInitialized = !0, C(this.domain, this.integrationName), s().Rokt.attachKit(this), this.processEventQueue();
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
    const a = t.accountId, c = M(t.roktExtensions);
    this.userAttributes = o || {}, this._onboardingExpProvider = t.onboardingExpProvider;
    const u = y(t.placementEventMapping);
    this.placementEventMappingLookup = T(u);
    const p = y(
      t.placementEventAttributeMapping
    );
    this.placementEventAttributeMappingLookup = U(p), t.hashedEmailUserIdentityType && (this._mappedEmailSha256Key = t.hashedEmailUserIdentityType.toLowerCase());
    const b = s().Rokt?.domain, h = {
      ...s().Rokt?.launcherOptions || {}
    };
    this.integrationName = V(h.integrationName), h.integrationName = this.integrationName, this.domain = b;
    const m = {
      loggingUrl: t.loggingUrl,
      errorUrl: t.errorUrl,
      isLoggingEnabled: t.isLoggingEnabled === "true" || t.isLoggingEnabled === !0
    }, E = new D(
      m,
      this.integrationName,
      window.__rokt_li_guid__,
      t.accountId
    ), _ = new K(
      m,
      E,
      this.integrationName,
      window.__rokt_li_guid__,
      t.accountId
    );
    if (this.errorReportingService = E, this.loggingService = _, s()._registerErrorReportingService && s()._registerErrorReportingService(E), s()._registerLoggingService && s()._registerLoggingService(_), i) {
      this.testHelpers = {
        generateLauncherScript: O,
        extractRoktExtensions: M,
        hashEventMessage: P,
        parseSettingsString: y,
        generateMappedEventLookup: T,
        generateMappedEventAttributeLookup: U,
        sendAdBlockMeasurementSignals: C,
        createAutoRemovedIframe: S,
        djb2: x,
        setAllowedOriginHashes: (A) => {
          d._allowedOriginHashes = A;
        },
        ReportingTransport: N,
        ErrorReportingService: D,
        LoggingService: K,
        RateLimiter: G,
        ErrorCodes: L,
        WSDKErrorSeverity: w
      }, this.attachLauncher(a, h);
      return;
    }
    if (this.isLauncherReadyToAttach())
      this.attachLauncher(a, h);
    else {
      const A = document.head || document.body, l = document.createElement("script");
      l.type = "text/javascript", l.src = O(b, c), l.async = !0, l.crossOrigin = "anonymous", l.fetchPriority = "high", l.id = "rokt-launcher", l.onload = () => {
        this.isLauncherReadyToAttach() ? this.attachLauncher(a, h) : console.error("Rokt object is not available after script load.");
      }, l.onerror = (I) => {
        console.error("Error loading Rokt launcher script:", I);
      }, A.appendChild(l), this.captureTiming(d.PERFORMANCE_MARKS.RoktScriptAppended);
    }
  }
  process(t) {
    if (!this.isKitReady()) {
      this.eventQueue.push(t);
      return;
    }
    if (this.sendEventStream(t), typeof s().Rokt?.setLocalSessionAttribute != "function" || (R(this.placementEventAttributeMappingLookup) || this.applyPlacementEventAttributeMapping(t), R(this.placementEventMappingLookup)))
      return;
    const e = P(t.EventDataType, t.EventCategory, t.EventName ?? "");
    if (this.placementEventMappingLookup[String(e)]) {
      const i = this.placementEventMappingLookup[String(e)];
      s().Rokt.setLocalSessionAttribute?.(i, !0);
    }
  }
  setExtensionData(t) {
    if (!this.isKitReady()) {
      console.error("Rokt Kit: Not initialized");
      return;
    }
    window.Rokt.setExtensionData(t);
  }
  setUserAttribute(t, e) {
    this.userAttributes[t] = e, this.sendEventStream(
      this.buildIdentityEvent("set_user_attributes", this.filters.filteredUser ?? {})
    );
  }
  removeUserAttribute(t) {
    delete this.userAttributes[t];
  }
  onUserIdentified(t) {
    this.filters.filteredUser = t, this.userAttributes = t.getAllUserAttributes(), this.sendEventStream(this.buildIdentityEvent("identify", t));
  }
  onLoginComplete(t) {
    this.userAttributes = t.getAllUserAttributes(), this.sendEventStream(this.buildIdentityEvent("login", t));
  }
  onLogoutComplete(t) {
    this.userAttributes = t.getAllUserAttributes(), this.sendEventStream(this.buildIdentityEvent("logout", t));
  }
  onModifyComplete(t) {
    this.userAttributes = t.getAllUserAttributes(), this.sendEventStream(this.buildIdentityEvent("modify_user", t));
  }
  /**
   * Selects placements for Rokt Web SDK with merged attributes, filters, and experimentation options.
   */
  selectPlacements(t) {
    const e = t && t.attributes || {}, i = { ...this.userAttributes, ...e }, r = this.filters || {}, o = r.userAttributeFilters || [], a = r.filteredUser || null, c = a && a.getMPID && typeof a.getMPID == "function" ? a.getMPID() : null;
    let u;
    r ? r.filterUserAttributes ? u = r.filterUserAttributes(i, o) : u = i : (console.warn("Rokt Kit: No filters available, using user attributes"), u = i), this.userAttributes = u;
    const p = this._onboardingExpProvider === "Optimizely" ? this.fetchOptimizely() : {}, b = this.returnUserIdentities(a), h = this.returnLocalSessionAttributes(), m = {
      ...b,
      ...u,
      ...p,
      ...h,
      mpid: c
    }, E = { ...t, attributes: m }, _ = this.launcher.selectPlacements(E), A = () => this.logSelectPlacementsEvent(m);
    return Promise.resolve(_).then((l) => l?.context?.sessionId?.then((I) => this.setRoktSessionId(I))).catch(() => {
    }).finally(A), _;
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
    return this.isKitReady() ? !t || !v(t) ? Promise.reject(new Error("Rokt Kit: Invalid extension name")) : this.launcher.use(t) : (console.error("Rokt Kit: Not initialized"), Promise.reject(new Error("Rokt Kit: Not initialized")));
  }
};
d._allowedOriginHashes = [-553112570, 549508659], d.PERFORMANCE_MARKS = {
  RoktScriptAppended: "mp:RoktScriptAppended"
}, d.EMAIL_SHA256_KEY = "emailsha256";
let f = d;
function J() {
  return 181;
}
function X(n) {
  if (!n) {
    window.console.log("You must pass a config object to register the kit " + g);
    return;
  }
  if (!k(n)) {
    window.console.log("'config' must be an object. You passed in a " + typeof n);
    return;
  }
  k(n.kits) ? n.kits[g] = {
    constructor: f
  } : (n.kits = {}, n.kits[g] = {
    constructor: f
  }), window.console.log("Successfully registered " + g + " to your mParticle configuration");
}
typeof window < "u" && window.mParticle && s().addForwarder && s().addForwarder({
  name: g,
  constructor: f,
  getId: J
});
export {
  X as register
};
//# sourceMappingURL=Rokt-Kit.esm.js.map

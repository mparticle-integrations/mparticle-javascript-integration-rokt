const c = "Rokt";
const j = "selectPlacements", F = "apps.roktecommerce.com";
const L = {
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  UNHANDLED_EXCEPTION: "UNHANDLED_EXCEPTION",
  IDENTITY_REQUEST: "IDENTITY_REQUEST"
}, v = {
  ERROR: "ERROR",
  INFO: "INFO",
  WARNING: "WARNING"
}, z = "apps.rokt-api.com/v1/log", Q = "apps.rokt-api.com/v1/errors", B = 10;
function o() {
  return window.mParticle;
}
function O(n, t) {
  const s = ["https://", typeof n < "u" ? n : "apps.rokt.com", "/wsdk/integrations/launcher.js"].join("");
  return !t || t.length === 0 ? s : s + "?extensions=" + t.join(",");
}
function S(n) {
  return n != null && typeof n == "object" && Array.isArray(n) === !1;
}
function w(n) {
  if (!n)
    return [];
  try {
    return JSON.parse(n.replace(/&quot;/g, '"'));
  } catch {
    console.error("Settings string contains invalid JSON");
  }
  return [];
}
function U(n) {
  const t = n ? w(n) : [], e = [];
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
function M(n) {
  const t = {};
  if (!Array.isArray(n))
    return t;
  for (let e = 0; e < n.length; e++) {
    const i = n[e];
    if (!i || !y(i.value) || !y(i.map))
      continue;
    const r = i.value, s = i.map;
    t[r] || (t[r] = []), t[r].push({
      eventAttributeKey: s,
      conditions: Array.isArray(i.conditions) ? i.conditions : []
    });
  }
  return t;
}
function P(n, t, e) {
  return o().generateHash([n, t, e].join(""));
}
function _(n) {
  return n == null ? !0 : typeof n == "object" ? Object.keys(n).length === 0 : Array.isArray(n) ? n.length === 0 : !1;
}
function y(n) {
  return typeof n == "string";
}
function V(n) {
  let i = "mParticle_wsdkv_" + o().getVersion() + "_kitv_" + "1.24.0";
  return n && (i += "_" + n), i;
}
function x(n) {
  let t = 5381;
  for (let e = 0; e < n.length; e++)
    t = (t << 5) + t + n.charCodeAt(e), t = t & t;
  return t;
}
function k(n) {
  const t = document.createElement("iframe");
  t.style.display = "none", t.setAttribute("sandbox", "allow-scripts allow-same-origin"), t.src = n, t.onload = function() {
    t.onload = null, t.parentNode && t.parentNode.removeChild(t);
  };
  const e = document.body || document.head;
  e && e.appendChild(t);
}
function C(n, t) {
  const e = x(window.location.origin);
  if (m._allowedOriginHashes.indexOf(e) === -1 || Math.random() >= 0.1)
    return;
  const r = window.__rokt_li_guid__;
  if (!r)
    return;
  const s = window.location.href.split("?")[0].split("#")[0], a = "version=" + encodeURIComponent(t ?? "") + "&launcherInstanceGuid=" + encodeURIComponent(r) + "&pageUrl=" + encodeURIComponent(s);
  k("https://" + (n || "apps.rokt.com") + "/v1/wsdk-init/index.html?" + a), k(
    "https://" + F + "/v1/wsdk-init/index.html?" + a + "&isControl=true"
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
function J() {
  return typeof window < "u" ? window.navigator?.userAgent : void 0;
}
class G {
  constructor() {
    this._logCount = {};
  }
  incrementAndCheck(t) {
    const i = (this._logCount[t] || 0) + 1;
    return this._logCount[t] = i, i > B;
  }
}
class N {
  constructor(t, e, i, r, s) {
    this._reporter = "mp-wsdk";
    const a = t?.isLoggingEnabled === !0 || t?.isLoggingEnabled === "true";
    this._integrationName = e || "", this._launcherInstanceGuid = i, this._accountId = r || null, this._rateLimiter = s || new G(), this._isEnabled = W() || Y() && a;
  }
  send(t, e, i, r, s, a) {
    if (!(!this._isEnabled || this._rateLimiter.incrementAndCheck(e)))
      try {
        const u = {
          additionalInformation: {
            message: i,
            version: this._integrationName
          },
          severity: e,
          code: r || L.UNKNOWN_ERROR,
          url: q(),
          deviceInfo: J(),
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
          body: JSON.stringify(u)
        }).catch((g) => {
          console.error("ReportingTransport: Failed to send log", g), a && a(g);
        });
      } catch (u) {
        console.error("ReportingTransport: Failed to send log", u), a && a(u);
      }
  }
}
class K {
  constructor(t, e, i, r, s) {
    this._transport = new N(t, e, i, r, s), this._errorUrl = "https://" + (t?.errorUrl || Q);
  }
  report(t) {
    if (!t) return;
    const e = t.severity || v.ERROR;
    this._transport.send(this._errorUrl, e, t.message, t.code, t.stackTrace);
  }
}
class D {
  constructor(t, e, i, r, s, a) {
    this._transport = new N(t, i, r, s, a), this._loggingUrl = "https://" + (t?.loggingUrl || z), this._errorReportingService = e;
  }
  log(t) {
    t && this._transport.send(
      this._loggingUrl,
      v.INFO,
      t.message,
      t.code,
      void 0,
      (e) => {
        this._errorReportingService && this._errorReportingService.report({
          message: "LoggingService: Failed to send log: " + e.message,
          code: L.UNKNOWN_ERROR,
          severity: v.ERROR
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
    if (!t || !y(t.operator))
      return !1;
    const i = t.operator.toLowerCase(), r = t.attributeValue;
    return i === "exists" ? e !== null : e == null ? !1 : i === "equals" ? String(e) === String(r) : i === "contains" ? String(e).indexOf(String(r)) !== -1 : !1;
  }
  doesEventMatchRule(t, e) {
    if (!e || !y(e.eventAttributeKey))
      return !1;
    const i = e.conditions;
    if (!Array.isArray(i))
      return !1;
    const r = this.getEventAttributeValue(t, e.eventAttributeKey);
    if (i.length === 0)
      return r !== null;
    for (let s = 0; s < i.length; s++)
      if (!this.doesEventAttributeConditionMatch(i[s], r))
        return !1;
    return !0;
  }
  applyPlacementEventAttributeMapping(t) {
    const e = Object.keys(this.placementEventAttributeMappingLookup);
    for (let i = 0; i < e.length; i++) {
      const r = e[i], s = this.placementEventAttributeMappingLookup[r];
      if (_(s))
        continue;
      let a = !0;
      for (let u = 0; u < s.length; u++)
        if (!this.doesEventMatchRule(t, s[u])) {
          a = !1;
          break;
        }
      a && o().Rokt.setLocalSessionAttribute?.(r, !0);
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
    return !o().Rokt || typeof o().Rokt.getLocalSessionAttributes != "function" ? {} : _(this.placementEventMappingLookup) && _(this.placementEventAttributeMappingLookup) ? {} : o().Rokt.getLocalSessionAttributes();
  }
  replaceOtherIdentityWithEmailsha256(t) {
    const e = { ...t || {} }, i = this._mappedEmailSha256Key;
    return i && t[i] && (e[p.EMAIL_SHA256_KEY] = t[i]), i && delete e[i], e;
  }
  logSelectPlacementsEvent(t) {
    if (!window.mParticle || typeof o().logEvent != "function" || !S(t))
      return;
    const e = o().EventType.Other;
    o().logEvent(j, e, t);
  }
  buildIdentityEvent(t, e) {
    const i = e.getMPID(), r = o() && o().sessionManager && typeof o().sessionManager.getSession == "function" ? o().sessionManager.getSession() : null, s = e.getUserIdentities && typeof e.getUserIdentities == "function" ? e.getUserIdentities().userIdentities : null;
    return {
      EventName: t,
      EventDataType: 14,
      EventCategory: 0,
      Timestamp: Date.now(),
      MPID: i,
      SessionId: r,
      UserIdentities: s
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
        const e = o().getInstance();
        e && typeof e.setIntegrationAttribute == "function" && e.setIntegrationAttribute(181, {
          roktSessionId: t
        });
      } catch {
      }
  }
  attachLauncher(t, e) {
    const i = o() && o().sessionManager && typeof o().sessionManager.getSession == "function" ? o().sessionManager.getSession() : void 0, r = {
      accountId: t,
      ...e || {},
      ...i ? { mpSessionId: i } : {}
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
    const e = o().Rokt?.filters;
    e ? (this.filters = e, e.filteredUser || console.warn("Rokt Kit: No filtered user has been set.")) : console.warn("Rokt Kit: No filters have been set."), this.isInitialized = !0, C(this.domain, this.integrationName), o().Rokt.attachKit(this), this.drainBatchQueue();
  }
  fetchOptimizely() {
    const t = o()._getActiveForwarders().filter((e) => e.name === "Optimizely");
    try {
      if (t.length > 0 && window.optimizely) {
        const e = window.optimizely.get("state");
        return !e || !e.getActiveExperimentIds ? {} : e.getActiveExperimentIds().reduce((s, a) => (s["rokt.custom.optimizely.experiment." + a + ".variationId"] = e.getVariationMap()[a].id, s), {});
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
    return !!(o().config && o().config.isLocalLauncherEnabled && this.isAssignedToSampleGroup());
  }
  isAssignedToSampleGroup() {
    return Math.random() > 0.5;
  }
  captureTiming(t) {
    window && o() && o().captureTiming && t && o().captureTiming(t);
  }
  // ---- Public methods (mParticle Kit Callbacks) ----
  /**
   * Initializes the Rokt forwarder with settings from the mParticle server.
   */
  init(t, e, i, r, s) {
    const a = t, u = a.accountId, l = U(a.roktExtensions);
    this.userAttributes = s || {}, this._onboardingExpProvider = a.onboardingExpProvider;
    const g = w(a.placementEventMapping);
    this.placementEventMappingLookup = T(g);
    const I = w(
      a.placementEventAttributeMapping
    );
    this.placementEventAttributeMappingLookup = M(I), a.hashedEmailUserIdentityType && (this._mappedEmailSha256Key = a.hashedEmailUserIdentityType.toLowerCase());
    const R = o().Rokt?.domain, h = {
      ...o().Rokt?.launcherOptions || {}
    };
    this.integrationName = V(h.integrationName), h.integrationName = this.integrationName, this.domain = R;
    const A = {
      loggingUrl: a.loggingUrl,
      errorUrl: a.errorUrl,
      isLoggingEnabled: a.isLoggingEnabled === "true" || a.isLoggingEnabled === !0
    }, f = new K(
      A,
      this.integrationName,
      window.__rokt_li_guid__,
      a.accountId
    ), b = new D(
      A,
      f,
      this.integrationName,
      window.__rokt_li_guid__,
      a.accountId
    );
    if (this.errorReportingService = f, this.loggingService = b, o()._registerErrorReportingService && o()._registerErrorReportingService(f), o()._registerLoggingService && o()._registerLoggingService(b), i)
      return this.testHelpers = {
        generateLauncherScript: O,
        extractRoktExtensions: U,
        hashEventMessage: P,
        parseSettingsString: w,
        generateMappedEventLookup: T,
        generateMappedEventAttributeLookup: M,
        sendAdBlockMeasurementSignals: C,
        createAutoRemovedIframe: k,
        djb2: x,
        setAllowedOriginHashes: (E) => {
          p._allowedOriginHashes = E;
        },
        ReportingTransport: N,
        ErrorReportingService: K,
        LoggingService: D,
        RateLimiter: G,
        ErrorCodes: L,
        WSDKErrorSeverity: v
      }, this.attachLauncher(u, h), "Successfully initialized: " + c;
    if (this.isLauncherReadyToAttach())
      this.attachLauncher(u, h);
    else {
      const E = document.head || document.body, d = document.createElement("script");
      d.type = "text/javascript", d.src = O(R, l), d.async = !0, d.crossOrigin = "anonymous", d.fetchPriority = "high", d.id = "rokt-launcher", d.onload = () => {
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
    if (typeof o().Rokt?.setLocalSessionAttribute == "function" && (_(this.placementEventAttributeMappingLookup) || this.applyPlacementEventAttributeMapping(t), !_(this.placementEventMappingLookup))) {
      const e = P(t.EventDataType, t.EventCategory, t.EventName ?? "");
      this.placementEventMappingLookup[String(e)] && o().Rokt.setLocalSessionAttribute?.(this.placementEventMappingLookup[String(e)], !0);
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
    return this.filters.filteredUser = e, this.userAttributes = t.getAllUserAttributes(), this.pendingIdentityEvents.push(this.buildIdentityEvent("identify", e)), "Successfully called onUserIdentified for forwarder: " + c;
  }
  onLoginComplete(t, e) {
    const i = t;
    return this.userAttributes = t.getAllUserAttributes(), this.pendingIdentityEvents.push(this.buildIdentityEvent("login", i)), "Successfully called onLoginComplete for forwarder: " + c;
  }
  onLogoutComplete(t, e) {
    const i = t;
    return this.userAttributes = t.getAllUserAttributes(), this.pendingIdentityEvents.push(this.buildIdentityEvent("logout", i)), "Successfully called onLogoutComplete for forwarder: " + c;
  }
  onModifyComplete(t, e) {
    const i = t;
    return this.userAttributes = t.getAllUserAttributes(), this.pendingIdentityEvents.push(this.buildIdentityEvent("modify", i)), "Successfully called onModifyComplete for forwarder: " + c;
  }
  /**
   * Selects placements for Rokt Web SDK with merged attributes, filters, and experimentation options.
   */
  selectPlacements(t) {
    const e = t && t.attributes || {}, i = { ...this.userAttributes, ...e }, r = this.filters || {}, s = r.userAttributeFilters || [], a = r.filteredUser || null, u = a ? a.getMPID() : null;
    let l;
    r ? r.filterUserAttributes ? l = r.filterUserAttributes(i, s) : l = i : (console.warn("Rokt Kit: No filters available, using user attributes"), l = i), this.userAttributes = l;
    const g = this._onboardingExpProvider === "Optimizely" ? this.fetchOptimizely() : {}, I = this.returnUserIdentities(a), R = this.returnLocalSessionAttributes(), h = {
      ...I,
      ...l,
      ...g,
      ...R,
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
    return this.isKitReady() ? !t || !y(t) ? Promise.reject(new Error("Rokt Kit: Invalid extension name")) : this.launcher.use(t) : (console.error("Rokt Kit: Not initialized"), Promise.reject(new Error("Rokt Kit: Not initialized")));
  }
};
p._allowedOriginHashes = [-553112570, 549508659], p.PERFORMANCE_MARKS = {
  RoktScriptAppended: "mp:RoktScriptAppended"
}, p.EMAIL_SHA256_KEY = "emailsha256";
let m = p;
function X() {
  return 181;
}
function Z(n) {
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
typeof window < "u" && window.mParticle && o().addForwarder && o().addForwarder({
  name: c,
  constructor: m,
  getId: X
});
export {
  Z as register
};
//# sourceMappingURL=Rokt-Kit.esm.js.map

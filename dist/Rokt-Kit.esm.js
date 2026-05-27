const V = [
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
], q = new Set(V);
function z(n) {
  return q.has(n.toLowerCase());
}
function A(n) {
  const e = {}, t = n || {}, i = Object.keys(t);
  for (let r = 0; r < i.length; r++) {
    const s = i[r];
    z(s) || (e[s] = t[s]);
  }
  return e;
}
const d = "Rokt", w = 181, J = "selectPlacements", X = "apps.roktecommerce.com", $ = 0.1, v = {
  LOGIN: "login",
  LOGOUT: "logout",
  MODIFY_USER: "modify_user",
  IDENTIFY: "identify"
}, Z = "ThankYouPageJourney", ee = "rokt-launcher", te = "rokt-thank-you-element", ie = "userIdentifiedInWorkspace", ne = 500, P = {
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  UNHANDLED_EXCEPTION: "UNHANDLED_EXCEPTION",
  IDENTITY_REQUEST: "IDENTITY_REQUEST"
}, L = {
  ERROR: "ERROR",
  INFO: "INFO",
  WARNING: "WARNING"
}, re = "apps.rokt-api.com/v1/log", se = "apps.rokt-api.com/v1/errors", oe = 10;
function a() {
  return window.mParticle;
}
function C(n, e) {
  const i = [W(n), "/wsdk/integrations/launcher.js"].join("");
  return !e || e.length === 0 ? i : i + "?extensions=" + e.join(",");
}
function M(n) {
  return [W(n), "/rokt-elements/rokt-element-thank-you.js"].join("");
}
function W(n) {
  return ["https://", typeof n < "u" ? n : "apps.rokt-api.com"].join("");
}
function K(n, e, t) {
  if (document.getElementById(n)) return;
  const i = document.head || document.body, r = document.createElement("script");
  r.id = n, r.type = "text/javascript", r.src = e, r.async = !0, r.crossOrigin = "anonymous", r.fetchPriority = "high", t?.onLoad && (r.onload = t.onLoad), t?.onError && (r.onerror = t.onError), i.appendChild(r);
}
function T(n) {
  return n != null && typeof n == "object" && Array.isArray(n) === !1;
}
function b(n) {
  if (!n)
    return [];
  try {
    return JSON.parse(n.replace(/&quot;/g, '"'));
  } catch {
    console.error("Settings string contains invalid JSON");
  }
  return [];
}
function D(n) {
  const e = n ? b(n) : [], t = [], i = [];
  let r = !1;
  for (let s = 0; s < e.length; s++) {
    const o = e[s].value;
    o === "thank-you-journey" ? (r = !0, i.push(Z)) : t.push(o);
  }
  return {
    roktExtensionsQueryParams: t,
    legacyRoktExtensions: i,
    loadThankYouElement: r
  };
}
async function ae(n, e) {
  const t = [];
  if (e)
    for (const i of n)
      t.push(e.use(i));
  return Promise.all(t);
}
function x(n) {
  if (!n)
    return {};
  const e = {};
  for (let t = 0; t < n.length; t++) {
    const i = n[t];
    e[i.jsmap] = i.value;
  }
  return e;
}
function Y(n) {
  const e = {};
  if (!Array.isArray(n))
    return e;
  for (let t = 0; t < n.length; t++) {
    const i = n[t];
    if (!i || !f(i.value) || !f(i.map))
      continue;
    const r = i.value, s = i.map;
    e[r] || (e[r] = []), e[r].push({
      eventAttributeKey: s,
      conditions: Array.isArray(i.conditions) ? i.conditions : []
    });
  }
  return e;
}
function F(n, e, t) {
  return a().generateHash([n, e, t].join(""));
}
function I(n) {
  return n == null ? !0 : typeof n == "object" ? Object.keys(n).length === 0 : Array.isArray(n) ? n.length === 0 : !1;
}
function f(n) {
  return typeof n == "string";
}
function ce(n) {
  let i = "mParticle_wsdkv_" + a().getVersion() + "_kitv_" + "1.27.0";
  return n && (i += "_" + n), i;
}
function Q(n) {
  let e = 5381;
  for (let t = 0; t < n.length; t++)
    e = (e << 5) + e + n.charCodeAt(t), e = e & e;
  return e;
}
function N(n) {
  const e = document.createElement("iframe");
  e.style.display = "none", e.setAttribute("sandbox", "allow-scripts allow-same-origin"), e.src = n, e.onload = function() {
    e.onload = null, e.parentNode && e.parentNode.removeChild(e);
  };
  const t = document.body || document.head;
  t && t.appendChild(e);
}
function j(n, e) {
  const t = Q(window.location.origin);
  if (m._allowedOriginHashes.indexOf(t) === -1 || Math.random() >= $)
    return;
  const r = window.__rokt_li_guid__;
  if (!r)
    return;
  const s = window.location.href.split("?")[0].split("#")[0], o = "version=" + encodeURIComponent(e ?? "") + "&launcherInstanceGuid=" + encodeURIComponent(r) + "&pageUrl=" + encodeURIComponent(s);
  N("https://" + (n || "apps.rokt.com") + "/v1/wsdk-init/index.html?" + o), N(
    "https://" + X + "/v1/wsdk-init/index.html?" + o + "&isControl=true"
  );
}
function ue() {
  return typeof window < "u" && !!window.location?.search?.toLowerCase().includes("mp_enable_logging=true");
}
function le() {
  return typeof window < "u" ? window.location?.href : void 0;
}
function de() {
  return typeof window < "u" ? window.navigator?.userAgent : void 0;
}
class B {
  constructor() {
    this._logCount = {};
  }
  incrementAndCheck(e) {
    const i = (this._logCount[e] || 0) + 1;
    return this._logCount[e] = i, i > oe;
  }
}
class U {
  constructor(e, t, i, r, s) {
    this._reporter = "mp-wsdk";
    const o = e.isLoggingEnabled;
    this._integrationName = t || "", this._launcherInstanceGuid = i, this._accountId = r || null, this._rateLimiter = s || new B(), this._isEnabled = ue() || o;
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
          url: le(),
          deviceInfo: de(),
          stackTrace: s,
          reporter: this._reporter,
          integration: this._integrationName
        }, l = {
          Accept: "text/plain;charset=UTF-8",
          "Content-Type": "application/json",
          "rokt-launcher-version": this._integrationName,
          "rokt-wsdk-version": "joint"
        };
        this._launcherInstanceGuid && (l["rokt-launcher-instance-guid"] = this._launcherInstanceGuid), this._accountId && (l["rokt-account-id"] = this._accountId), fetch(e, {
          method: "POST",
          headers: l,
          body: JSON.stringify(c)
        }).catch((u) => {
          console.error("ReportingTransport: Failed to send log", u), o && o(u);
        });
      } catch (c) {
        console.error("ReportingTransport: Failed to send log", c), o && o(c);
      }
  }
}
class H {
  constructor(e, t, i, r, s) {
    this._transport = new U(e, t, i, r, s), this._errorUrl = "https://" + (e?.errorUrl || se);
  }
  report(e) {
    if (!e) return;
    const t = e.severity || L.ERROR;
    this._transport.send(this._errorUrl, t, e.message, e.code, e.stackTrace);
  }
}
class G {
  constructor(e, t, i, r, s, o) {
    this._transport = new U(e, i, r, s, o), this._loggingUrl = "https://" + (e?.loggingUrl || re), this._errorReportingService = t;
  }
  log(e) {
    e && this._transport.send(
      this._loggingUrl,
      L.INFO,
      e.message,
      e.code,
      void 0,
      (t) => {
        this._errorReportingService && this._errorReportingService.report({
          message: "LoggingService: Failed to send log: " + t.message,
          code: P.UNKNOWN_ERROR,
          severity: L.ERROR
        });
      }
    );
  }
}
const h = class h {
  constructor() {
    this.name = d, this.id = w, this.moduleId = w, this.isInitialized = !1, this.launcher = null, this.filters = {}, this.userAttributes = {}, this.userIdentifiedInWorkspace = !1, this.testHelpers = null, this.placementEventMappingLookup = {}, this.placementEventAttributeMappingLookup = {}, this.batchQueue = [], this.batchStreamQueue = [], this.pendingIdentityEvents = [], this.integrationName = null, this.errorReportingService = null, this.loggingService = null, this._thankYouElementOnLoadCallback = null, this._isThankYouElementLoaded = !1, this._workspaceSearchInFlightPromise = null;
  }
  // ---- Private helpers ----
  getEventAttributeValue(e, t) {
    const i = e && e.EventAttributes;
    return !i || typeof i[t] > "u" ? null : i[t];
  }
  doesEventAttributeConditionMatch(e, t) {
    if (!e || !f(e.operator))
      return !1;
    const i = e.operator.toLowerCase(), r = e.attributeValue;
    return i === "exists" ? t !== null : t == null ? !1 : i === "equals" ? String(t) === String(r) : i === "contains" ? String(t).indexOf(String(r)) !== -1 : !1;
  }
  doesEventMatchRule(e, t) {
    if (!t || !f(t.eventAttributeKey))
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
      if (I(s))
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
    return !a().Rokt || typeof a().Rokt.getLocalSessionAttributes != "function" ? {} : I(this.placementEventMappingLookup) && I(this.placementEventAttributeMappingLookup) ? {} : a().Rokt.getLocalSessionAttributes();
  }
  replaceOtherIdentityWithEmailsha256(e) {
    const t = { ...e || {} }, i = this._mappedEmailSha256Key;
    return i && e[i] && (t[h.EMAIL_SHA256_KEY] = e[i]), i && delete t[i], t;
  }
  logSelectPlacementsEvent(e) {
    if (!window.mParticle || typeof a().logEvent != "function" || !T(e))
      return;
    const t = a().EventType.Other;
    a().logEvent(J, t, e);
  }
  buildIdentityEvent(e, t) {
    const i = t.getMPID(), r = a() && a().sessionManager && typeof a().sessionManager.getSession == "function" ? a().sessionManager.getSession() : void 0;
    return {
      event_type: e,
      data: {
        timestamp_unixtime_ms: Date.now(),
        session_uuid: r ?? void 0,
        mpid: i
      }
    };
  }
  mergePendingIdentityEvents(e) {
    if (this.pendingIdentityEvents.length === 0)
      return e;
    const t = {
      ...e,
      events: [...e.events ?? [], ...this.pendingIdentityEvents]
    };
    return this.pendingIdentityEvents = [], t;
  }
  drainBatchQueue() {
    this.batchQueue.forEach((e) => {
      this.processBatch(e);
    }), this.batchQueue = [];
  }
  processBatch(e) {
    if (!this.isKitReady())
      return this.batchQueue.push(e), "Batch queued for forwarder: " + d;
    const t = this.enrichCommerceEventTypes(this.mergePendingIdentityEvents(e));
    return this.sendBatchStream(t), "Successfully sent batch to forwarder: " + d;
  }
  enrichCommerceEventTypes(e) {
    if (!e.events)
      return e;
    for (const t of e.events) {
      if (t.event_type !== "commerce_event") continue;
      const { data: i } = t;
      if (!i) continue;
      const r = i.custom_flags?.["Rokt.CommerceEventType"];
      r && T(i.product_action) && (i.product_action.action = r);
    }
    return e;
  }
  sendBatchStream(e) {
    if (window.Rokt && typeof window.Rokt.__batch_stream__ == "function") {
      if (this.batchStreamQueue.length) {
        const t = this.batchStreamQueue;
        this.batchStreamQueue = [];
        for (let i = 0; i < t.length; i++)
          window.Rokt.__batch_stream__(t[i]);
      }
      window.Rokt.__batch_stream__(e);
    } else
      this.batchStreamQueue.push(e);
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
      await ae(i, c), this.initRoktLauncher(c);
    }).catch((c) => {
      console.error("Error creating Rokt launcher:", c);
    });
  }
  initRoktLauncher(e) {
    window.Rokt && (window.Rokt.currentLauncher = e), this.launcher = e;
    const t = a().Rokt?.filters;
    t ? (this.filters = t, t.filteredUser ? this._workspaceSearchInFlightPromise = this.search(t.filteredUser) : console.warn("Rokt Kit: No filtered user has been set.")) : console.warn("Rokt Kit: No filters have been set."), this.isInitialized = !0, j(this.domain, this.integrationName), a().Rokt.attachKit(this), this.drainBatchQueue();
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
    this.userAttributes = A(s), this._onboardingExpProvider = o.onboardingExpProvider;
    const l = b(o.placementEventMapping);
    this.placementEventMappingLookup = x(l);
    const u = b(
      o.placementEventAttributeMapping
    );
    this.placementEventAttributeMappingLookup = Y(u), o.hashedEmailUserIdentityType && (this._mappedEmailSha256Key = o.hashedEmailUserIdentityType.toLowerCase()), this._workspaceIdSyncApiKey = f(o.workspaceIdSyncApiKey) ? o.workspaceIdSyncApiKey : void 0;
    const E = a().Rokt?.domain, { roktExtensionsQueryParams: O, legacyRoktExtensions: k, loadThankYouElement: R } = D(
      o.roktExtensions
    ), p = {
      ...a().Rokt?.launcherOptions || {}
    };
    this.integrationName = ce(p.integrationName), p.integrationName = this.integrationName, this.domain = E;
    const _ = {
      loggingUrl: o.loggingUrl,
      errorUrl: o.errorUrl,
      isLoggingEnabled: a().config?.isLoggingEnabled === !0
    }, y = new H(
      _,
      this.integrationName,
      window.__rokt_li_guid__,
      o.accountId
    ), S = new G(
      _,
      y,
      this.integrationName,
      window.__rokt_li_guid__,
      o.accountId
    );
    return this.errorReportingService = y, this.loggingService = S, a()._registerErrorReportingService && a()._registerErrorReportingService(y), a()._registerLoggingService && a()._registerLoggingService(S), i ? (this.testHelpers = {
      generateLauncherScript: C,
      generateThankYouElementScript: M,
      extractRoktExtensionConfig: D,
      hashEventMessage: F,
      parseSettingsString: b,
      generateMappedEventLookup: x,
      generateMappedEventAttributeLookup: Y,
      sendAdBlockMeasurementSignals: j,
      createAutoRemovedIframe: N,
      djb2: Q,
      setAllowedOriginHashes: (g) => {
        h._allowedOriginHashes = g;
      },
      ReportingTransport: U,
      ErrorReportingService: H,
      LoggingService: G,
      RateLimiter: B,
      ErrorCodes: P,
      WSDKErrorSeverity: L
    }, this.attachLauncher(c, p), "Successfully initialized: " + d) : (R && (a().Rokt.flushOnShoppableAdsReadyMessageQueue?.(this), K(te, M(E), {
      onLoad: () => {
        this._isThankYouElementLoaded = !0, this._thankYouElementOnLoadCallback && this._thankYouElementOnLoadCallback();
      },
      onError: (g) => {
        console.error("Error loading Rokt Thank You Element script:", g);
      }
    })), this.isLauncherReadyToAttach() ? this.attachLauncher(c, p, k) : (K(ee, C(E, O), {
      onLoad: () => {
        this.isLauncherReadyToAttach() ? this.attachLauncher(c, p, k) : console.error("Rokt object is not available after script load.");
      },
      onError: (g) => {
        console.error("Error loading Rokt launcher script:", g);
      }
    }), this.captureTiming(h.PERFORMANCE_MARKS.RoktScriptAppended)), "Successfully initialized: " + d);
  }
  process(e) {
    if (!this.isKitReady())
      return "Kit not ready for forwarder: " + d;
    if (typeof a().Rokt?.setLocalSessionAttribute == "function" && (I(this.placementEventAttributeMappingLookup) || this.applyPlacementEventAttributeMapping(e), !I(this.placementEventMappingLookup))) {
      const t = F(e.EventDataType, e.EventCategory, e.EventName ?? "");
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
  handleIdentityComplete(e, t, i) {
    const r = e;
    return this.userAttributes = A(e.getAllUserAttributes()), this.pendingIdentityEvents.push(this.buildIdentityEvent(t, r)), "Successfully called " + i + " for forwarder: " + d;
  }
  onUserIdentified(e) {
    const t = e;
    return this.filters.filteredUser = t, this._workspaceSearchInFlightPromise = this.search(t), this.handleIdentityComplete(e, v.IDENTIFY, "onUserIdentified");
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
      for (const l of Object.keys(r)) {
        const u = r[l];
        f(u) && u.length > 0 && (s[l] = u);
      }
    const o = Object.keys(s);
    if (o.length === 0)
      return this.userIdentifiedInWorkspace = !1, this._workspaceLastSearchedIdentitiesKey = void 0, Promise.resolve();
    const c = o.sort().map((l) => `${l}=${s[l]}`).join("&");
    return c === this._workspaceLastSearchedIdentitiesKey ? this._workspaceSearchInFlightPromise || Promise.resolve() : (this.userIdentifiedInWorkspace = !1, this._workspaceLastSearchedIdentitiesKey = c, new Promise((l) => {
      try {
        i(t, s, (u) => {
          u?.httpCode === 200 && (this.userIdentifiedInWorkspace = !0), l();
        });
      } catch (u) {
        console.error("Rokt Kit: Workspace IDSync search failed", u), this._workspaceLastSearchedIdentitiesKey = void 0, l();
      }
    }));
  }
  onLoginComplete(e, t) {
    return this.handleIdentityComplete(e, v.LOGIN, "onLoginComplete");
  }
  onLogoutComplete(e, t) {
    return this.userIdentifiedInWorkspace = !1, this._workspaceSearchInFlightPromise = null, this._workspaceLastSearchedIdentitiesKey = void 0, this.handleIdentityComplete(e, v.LOGOUT, "onLogoutComplete");
  }
  onModifyComplete(e, t) {
    return this.handleIdentityComplete(e, v.MODIFY_USER, "onModifyComplete");
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
        new Promise((i) => setTimeout(i, ne))
      ]).then(() => this._dispatchPlacements(e));
    }
    return this._dispatchPlacements(e);
  }
  _dispatchPlacements(e) {
    const t = e && e.attributes || {}, r = { ...A(this.userAttributes), ...t }, s = this.filters || {}, o = s.userAttributeFilters || [], c = s.filteredUser || null, l = c ? c.getMPID() : null;
    let u;
    s ? s.filterUserAttributes ? u = s.filterUserAttributes(r, o) : u = r : (console.warn("Rokt Kit: No filters available, using user attributes"), u = r), this.userAttributes = A(u);
    const E = this._onboardingExpProvider === "Optimizely" ? this.fetchOptimizely() : {}, O = this.returnUserIdentities(c), k = this.returnLocalSessionAttributes(), R = {
      ...O,
      ...u,
      ...E,
      ...k,
      ...this.userIdentifiedInWorkspace ? { [ie]: !0 } : {},
      mpid: l
    }, p = { ...e, attributes: R }, _ = this.launcher.selectPlacements(p), y = () => this.logSelectPlacementsEvent(R);
    return Promise.resolve(_).then((S) => S?.context?.sessionId?.then((g) => this.setRoktSessionId(g))).catch(() => {
    }).finally(y), _;
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
    return this.isKitReady() ? !e || !f(e) ? Promise.reject(new Error("Rokt Kit: Invalid extension name")) : this.launcher.use(e) : (console.error("Rokt Kit: Not initialized"), Promise.reject(new Error("Rokt Kit: Not initialized")));
  }
  /**
   * Registers a callback to be invoked once rokt-thank-you-element.js becomes available.
   */
  onShoppableAdsReady(e) {
    this._isThankYouElementLoaded ? e() : this._thankYouElementOnLoadCallback = e;
  }
};
h._allowedOriginHashes = [-553112570, 549508659], h.PERFORMANCE_MARKS = {
  RoktScriptAppended: "mp:RoktScriptAppended"
}, h.EMAIL_SHA256_KEY = "emailsha256";
let m = h;
function he() {
  return w;
}
function pe(n) {
  if (!n) {
    window.console.log("You must pass a config object to register the kit " + d);
    return;
  }
  if (!T(n)) {
    window.console.log("'config' must be an object. You passed in a " + typeof n);
    return;
  }
  T(n.kits) ? n.kits[d] = {
    constructor: m
  } : (n.kits = {}, n.kits[d] = {
    constructor: m
  }), window.console.log("Successfully registered " + d + " to your mParticle configuration");
}
typeof window < "u" && window.mParticle && a().addForwarder && a().addForwarder({
  name: d,
  constructor: m,
  getId: he
});
export {
  pe as register
};
//# sourceMappingURL=Rokt-Kit.esm.js.map

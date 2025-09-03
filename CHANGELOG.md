## [1.7.1](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/compare/v1.7.0...v1.7.1) (2025-09-03)


### Bug Fixes

* Return early if settings string is null ([#42](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/issues/42)) ([c0eb788](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/commit/c0eb7884dd0aeb7539e58059b8af21dea0569453))

# [1.7.0](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/compare/v1.6.3...v1.7.0) (2025-09-02)

### Features

* Map events to an attribute flag for selectPlacements ([#41](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/pull/41)[613d790](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/commit/613d790159545b747fb1a8f2a7249c7853d25bc3))

## [1.6.3](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/compare/v1.6.2...v1.6.3) (2025-08-12)


### Bug Fixes

* Correct isInitialized check in hashAttributes and setExtensionData functions ([#39](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/issues/39)) ([3a13833](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/commit/3a13833582e1efc61e7c803ef6f4a8be2ed5de84))

## [1.6.2](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/compare/v1.6.1...v1.6.2) (2025-07-22)


### Bug Fixes

* map other in selectPlacements to emailsha256 ([#38](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/issues/38)) ([c0e9482](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/commit/c0e94824925bc2024b69f6bbc1e07d62ea5e1bad))

# [1.6.1](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/compare/v1.6.0...v1.6.1) (2025-07-16)

### Bug Fixes

* Handle Invalid Extension Settings ([#37](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/pull/37)) ([fff87ac](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/commit/fff87ac213f836cd6b74bf5367663d262ac51d72))


# [1.6.0](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/compare/v1.5.0...v1.6.0) (2025-07-14)


### Bug Fixes

* Prevent mutation of global launcherOptions during initialization ([#36](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/issues/36)) ([0f36fac](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/commit/0f36facf257cc08eea118205454ef76ef973d581))


### Features

* Add Extensions to Rokt Kit ([#26](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/issues/26)) ([73e9696](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/commit/73e96969e40e919aa119aa7bdd79aa93ae320cd2))
* Support adding identities to select placement attributes ([#35](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/issues/35)) ([f9595ea](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/commit/f9595ea8cb629634b7e7bc9f92dc9186ea64f9a9))

# [1.5.0](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/compare/v1.4.1...v1.5.0) (2025-06-10)


### Features

* Support CNAME for launcher.js ([#34](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/issues/34)) ([58efaaa](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/commit/58efaaad92e91994a0829ffdd4ac843d89c0dcec))

## [1.4.1](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/compare/v1.4.0...v1.4.1) (2025-06-03)


### Bug Fixes

* Revise sandbox setting ([#32](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/issues/32)) ([f79830b](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/commit/f79830b5dec2430a8c5c815640457c53037ff3ce))

# [1.4.0](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/compare/v1.3.2...v1.4.0) (2025-06-02)


### Features

* Expose Rokt launcher config options ([#30](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/issues/30)) ([6cf2344](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/commit/6cf234425621922614d3f8908e624211f4d7b485))

## [1.3.2](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/compare/v1.3.1...v1.3.2) (2025-05-27)


### Bug Fixes

* return the select placements call ([#31](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/issues/31)) ([38b4903](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/commit/38b490337daca1dede7ba2fb5e1b3804092e25f9))

## [1.3.1](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/compare/v1.3.0...v1.3.1) (2025-05-13)


### Bug Fixes

* Update attachLauncher to use options object for integration settings ([#29](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/issues/29)) ([a6ad782](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/commit/a6ad782730930b1b746f8a5ba2f20ebeb98b23b3))
* Update integrationName to support postfix ([#28](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/issues/28)) ([1180363](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/commit/11803639b7bdefc9757f7cd8b592e93d3cfabe28))

# [1.3.0](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/compare/v1.2.1...v1.3.0) (2025-04-22)


### Features

* Add hashAttributes method ([#24](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/issues/24)) ([8418e83](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/commit/8418e83d58be17c51921019f81ddbeba726dd82c))

## [1.2.1](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/compare/v1.2.0...v1.2.1) (2025-04-16)


### Bug Fixes

* Remove sandbox mode on rokt kit ([#22](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/issues/22)) ([58f8ae5](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/commit/58f8ae5112d6d944090f7b9c336bc02b39ed227b))

# [1.2.0](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/compare/v1.1.0...v1.2.0) (2025-04-08)


### Features

* Add optimizely attribute fetching functionality ([#20](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/issues/20)) ([fdf9ca9](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/commit/fdf9ca9965b7d1c70d302454b24f2b07a9a01798))

# [1.1.0](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/compare/v1.0.0...v1.1.0) (2025-04-04)


### Features

* add mparticle to launcher integration name ([0d62fdd](https://github.com/mparticle-integrations/mparticle-javascript-integration-rokt/commit/0d62fddf08c93bae3784552bf094284c380d4546))

## 1.0.0 (2025-04-03)
-  Initial Release

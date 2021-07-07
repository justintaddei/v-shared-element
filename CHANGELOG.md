# Changelog

#### 3.1.0 (July 5th, 2021)

**Features**
- Added support for Vue 3 (#26)

#### 3.0.3 (December 24th, 2020)

**Bug fixes**
- Fixed `restrictToRoutes` comparing against the `from` path instead of `to`.

#### 3.0.2 (December 24th, 2020)

**Other**
- Removed `console.log`s that where erroneously left into the 3.0.1 release.

## 3.0.1  (December 23th, 2020)

> **See v3.0.0**

## 3.0.0 (October 26th, 2020)

> **NOTE:** The initial release of v3 was riddled with bugs and has been unpublished.  
> The v3.0.1 is now the first release of v3

**Breaking changes**
- Updated illusory to v2 which has a new API. Consult the illusory docs for more info. (This will only impact users who have used `vm.$illusory` or `vm.$createIllusoryElement`)
- `restrictToViewport` now defaults to `true`.
- `includeChildren` now defaults to `true`.

**Features**
- Updated *illusory* to v2.0.3
- Added `restrictToRoutes` option to help with performance when many shared-elements are present (See #20).
- `v-shared-element` is now a Nuxt.js module! You no longer need to create an entry in ~/plugins to use it.


### 2.1.0 (June 9th, 2020)

*Features*
- Added `ignoreTransparency` option (see [#4](https://github.com/justintaddei/v-shared-element/issues/4) for why).
- Added `sharedElementMixin` for `keep-alive routes` to resolve [#2](https://github.com/justintaddei/v-shared-element/issues/2).
- Added `restrictToViewport` option ([#7](https://github.com/justintaddei/v-shared-element/issues/7)).
- Updated *illusory* to v1.4.1.
  
*Other*
- Complete rewrite of the documentation.

---

#### 2.0.4 (June 2nd, 2020)

*Bug fixes*
- Updated illusory to patch v1.2.3

*Other*
- Update other dependencies.
- Adjust Changelog formatting.

#### 2.0.3 (June 2nd, 2020)

*Bug fixes*
- Updated illusory to patch v1.2.2  

*Other*
- Started keeping a changelog. 

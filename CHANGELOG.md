# Changelog

## 3.0.0

**Breaking changes**
- Updated illusory to v2 which has a new API. Consult the illusory docs for more info. (This will only impact users who have used `vm.$illusory` or `vm.$createIllusoryElement`)
- `restrictToViewport` now defaults to `true`.

**Features**
- Updated *illusory* to v2.0.2
- Added `restrictToRoutes` option to help with performance when many shared-elements are present (See #20).


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

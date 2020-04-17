# v-shared-element

![](https://img.shields.io/github/issues-raw/justintaddei/v-shared-element.svg?style=flat)
![](https://img.shields.io/npm/v/v-shared-element.svg?style=flat)
![](https://img.shields.io/npm/dt/v-shared-element.svg?style=flat)
![](https://img.shields.io/npm/l/v-shared-element.svg?style=flat)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
![](https://img.shields.io/github/languages/top/justintaddei/v-shared-element.svg?colorB=blue&style=flat)
![](https://img.shields.io/badge/status-awesome-red.svg?style=flat)

Declarative shared-element transitions for Vue.js  
[Example](https://justintaddei.github.io/v-shared-element/)

## Install

```sh
$ npm install v-shared-element
```

## Register the plugin

### Vue.js + vue-router

In your `main.js` file

```js
import Vue from 'vue'
import {
    SharedElementRouteGuard,
    SharedElementDirective
} from 'v-shared-element'

Vue.use(SharedElementDirective)

const router = new VueRouter({ ... })

router.beforeEach(SharedElementRouteGuard)
```

### Nuxt.js

Create a file in `~/plugins` named `v-shared-element.client.js`

```js
import Vue from 'vue';
import { NuxtSharedElementRouteGuard, SharedElementDirective } from 'v-shared-element';

Vue.use(SharedElementDirective);

export default NuxtSharedElementRouteGuard;
```

Then in your `nuxt.config.js`

```js
export default {
  plugins: ['~/plugins/v-shared-element.client.ts'],
};
```

## Usage

Add `v-shared-element` to the element you want to transition on each page.

```html
<div v-shared-element:your-id></div>

<!-- Or -->

<div v-shared-element:[computedId]></div>
```

## Per-element options

```html
<div
  v-shared-element:profile="{
        type: 'auto',
        easing: 'ease',
        duration: '300ms',
        endDuration: '100ms',
        compositeOnly: false,
        zIndex: 1000
      }"
></div>
```

## Global options

```js
Vue.use(SharedElementDirective, {
  type: 'auto',
  easing: 'ease',
  duration: '300ms',
  endDuration: '100ms',
  compositeOnly: false,
  zIndex: 1000,
});
```

## Options

- type: `'cross-fade' | 'reveal' | 'auto'`
  - `cross-fade` will fade out the old element and at the same time will fade the new one in underneath.
  - `reveal` starts with both elements at full opacity then fades out the old element to reveal the new one underneath.
  - `auto` will use "cross-fade" when compositeOnly = true || the old element's opacity !== 1 and "reveal" otherwise.
- easing: `string`
  - Sets the easing fuction of the transition. This can be any value that is accepted by the CSS `transition-timing-function` property.
- duration: `string`
  - Sets the duration of the transition. This can be any value that is accepted by the CSS `transition-duration` property.
- endDuration: `string`
  - When the transition is finished, the contents of the shared-element will take this long to fade in. This can be any value that is accepted by the CSS `transition-duration` property. Set this to `"0s"` to disable it (the contents of the shared element will render as soon as the transition finishes).
- compositeOnly: `boolean`
  - By default, a shared-element transition consists of `transform` `opacity` and `border-radius`. Setting this to `true` will limit the transition to `transform` and `opacity` only.
- zIndex: `number`
  - The z-index used for the shared-elements during the transition.

# Caveats

Any CSS `transform` applied to a shared-element other than `translate` (e.g. `rotate`) will break the transition.

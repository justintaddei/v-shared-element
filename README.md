# v-shared-element

![](https://img.shields.io/github/issues-raw/justintaddei/v-shared-element.svg?style=flat)
![](https://img.shields.io/npm/v/v-shared-element.svg?style=flat)
![](https://img.shields.io/npm/dt/v-shared-element.svg?style=flat)
![](https://img.shields.io/npm/l/v-shared-element.svg?style=flat)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
![](https://img.shields.io/badge/language-typescript-blue.svg?style=flat)
![](https://img.shields.io/badge/status-awesome-red.svg?style=flat)

Declarative shared-element transitions between pages for Vue.js and Nuxt.js  
Uses [illusory](https://npmjs.com/package/illusory) under the hood. 

**[Example](https://justintaddei.github.io/v-shared-element/)**  
_Source code for the example can be found on the [`example` branch](https://github.com/justintaddei/v-shared-element/tree/example)._

## Install

```sh
$ npm install v-shared-element
```
**or**
```html
<script src="http://unpkg.com/illusory">
<script src="http://unpkg.com/v-shared-element">
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
  plugins: ['~/plugins/v-shared-element.client.js'],
};
```

### TypeScript
If you use TypeScript, create a `vue.d.ts` file and paste in the following:
```ts
import { illusory, IllusoryElement } from 'illusory/types'
import { IOptions } from 'illusory/types/options'

declare module 'vue/types/vue' {
  interface Vue {
    $illusory: typeof illusory
    $createIllusoryElement: (
      el: HTMLElement | SVGElement,
      opts?: Partial<IOptions>
    ) => IllusoryElement
  }
}
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
        easing: 'ease',
        duration: '300ms',
        endDuration: '150ms',
        zIndex: 1,
        compositeOnly: false,
        includeChildren: false,
      }"
></div>
```

## Global options

```js
Vue.use(SharedElementDirective, {
  easing: 'ease',
  duration: '300ms',
  endDuration: '150ms',
  zIndex: 1,
  compositeOnly: false,
  includeChildren: false,
});
```

## Option hierarchy

If options are specified on a per-element bases, the options specified on the page you are navigating *away from* will take precedence over those (if any) that are specified on the page you're navigating *to*. The only exception is `includeChildren` as it will be applied to each element individually.

## Options

- `includeChildren`: `boolean`  
  - default: `false`  
  **Note:** Applies to each element individually.   
  When true, all `ChildNode`'s of the element are included in the animation.
- easing: `string`
  - default: `'ease'`  
  Sets the easing fuction of the transition. This can be any value that is accepted by the CSS `transition-timing-function` property.
- duration: `string`
  - default: `'300ms'`  
  Sets the duration of the transition. This can be any value that is accepted by the CSS `transition-duration` property.
- endDuration: `string`
  - default: `'150ms'`  
  **Note:** has no effect if `includeChildren` is `true`.  
  When the transition is finished, the shared-element will take this long to fade out (making it seem as though its contents fade in). This can be any value that is accepted by the CSS `transition-duration` property. Set this to `"0s"` to disable it (the contents of the shared element will render as soon as the transition finishes).
- compositeOnly: `boolean`
  - default: `false`  
  By default, a shared-element transition consists of `transform` `opacity` and `border-radius`. Setting this to `true` will limit the transition to `transform` and `opacity` only.
- zIndex: `number`
  - default: `1`  
  The z-index used for the shared-elements during the transition.

# illusory

`v-shared-element` uses [illusory](https://npmjs.com/package/illusory) under the hood to morph between elements and is made available on the Vue instance. For documention on how to use it, [click here](https://npmjs.com/package/illusory).

illusory is exposed as **`Vue.prototype.$illusory`** and **`Vue.prototype.$createIllusoryElement`**

For example:
```html
<template>
  <div>
    <div ref="from"></div>
    <div ref="to"></div>
    <button @click="morph">Morph!</button>
  </div>
</template>

<script>
  export default {
    methods: {
      morph() {
        this.$illusory(this.$refs.from, this.$refs.to)
      }
    }
  }
</script>
```


# Caveats

Any CSS `transform` applied to a shared-element other than `translate` (e.g. `rotate`) will break the transition.

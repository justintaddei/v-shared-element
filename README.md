<p align="center">
<img width="150" src="https://raw.githubusercontent.com/justintaddei/v-shared-element/assets/logo.png" alt="Vue logo">
</p>
<h1 align="center">v-shared-element</h1>

![](https://img.shields.io/github/issues-raw/justintaddei/v-shared-element.svg?style=flat)
![](https://img.shields.io/npm/v/v-shared-element.svg?style=flat)
![](https://img.shields.io/npm/dt/v-shared-element.svg?style=flat)
[![](https://img.shields.io/badge/Chat_on-Spectrum-blueviolet?logo=spectrum&style=flat)](https://spectrum.chat/v-shared-element?tab=chat)
![](https://img.shields.io/npm/l/v-shared-element.svg?style=flat)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
![](https://img.shields.io/badge/language-typescript-blue.svg?style=flat)
![](https://img.shields.io/badge/status-awesome-red.svg?style=flat)

Declarative shared-element transitions between pages for [Vue.js](https://vuejs.org/).  
*Uses [illusory](https://npmjs.com/package/illusory) under the hood.*

### **[Example page](https://justintaddei.github.io/v-shared-element/)**  <!-- omit in toc -->
> _Source code for the example can be found on the [`example` branch](https://github.com/justintaddei/v-shared-element/tree/example)._

[![gif of example page](https://github.com/justintaddei/v-shared-element/blob/assets/readme-demo.gif?raw=true)](https://justintaddei.github.io/v-shared-element/)

#### Community chat <!-- omit in toc -->  
[![](https://img.shields.io/badge/Chat_on-Spectrum-blueviolet?style=for-the-badge&logo=spectrum)](https://spectrum.chat/v-shared-element?tab=chat)

---

**Index**
- [Install](#install)
  - [Register the plugin](#register-the-plugin)
    - [Vue.js + vue-router](#vuejs--vue-router)
    - [Nuxt.js](#nuxtjs)
- [Usage](#usage)
    - [Usage with `v-for`](#usage-with-v-for)
    - [Usage with `keep-alive`](#usage-with-keep-alive)
- [Options](#options)
  - [Setting global options](#setting-global-options)
  - [Setting per-element options](#setting-per-element-options)
  - [Summary](#summary)
  - [Details](#details)
    - [easing](#easing)
    - [duration](#duration)
    - [endDuration](#endduration)
    - [zIndex](#zindex)
    - [compositeOnly](#compositeonly)
    - [includeChildren](#includechildren)
    - [ignoreTransparency](#ignoretransparency)
    - [restrictToViewport](#restricttoviewport)
- [Usage with page transitions](#usage-with-page-transitions)
- [illusory](#illusory)
- [Asking question and reporting bugs](#asking-question-and-reporting-bugs)
- [How to contributing](#how-to-contributing)
  - [Development setup](#development-setup)
  - [Common NPM Scripts](#common-npm-scripts)
  - [Web page for development](#web-page-for-development)
- [License](#license)

## Install

**npm**
```sh
$ npm i v-shared-element
```
or  

**CDN**  
```html
<script src="https://unpkg.com/illusory"></script>
<script src="https://unpkg.com/v-shared-element"></script>
```

### Register the plugin

#### Vue.js + vue-router  

```js
//main.js

import Vue from 'vue'
import {
    SharedElementRouteGuard,
    SharedElementDirective
} from 'v-shared-element'

Vue.use(SharedElementDirective)

const router = new VueRouter({ ... })

router.beforeEach(SharedElementRouteGuard)
```
or  

#### Nuxt.js

Create a file in `~/plugins` named `v-shared-element.client.js`
```js
// ~/plugins/v-shared-element.client.js

import Vue from 'vue';
import { SharedElementDirective, NuxtSharedElementRouteGuard } from 'v-shared-element';

Vue.use(SharedElementDirective);

export default NuxtSharedElementRouteGuard;
```
Then add it in your `nuxt.config.js`

```js
export default {
  plugins: ['~/plugins/v-shared-element.client.js'],
}
```

## Usage

Add `v-shared-element:<namespace>` to an element to transform it into a shared-element. On another page add the directive to an element and use the same namespace. That's it, you're done (there are more options below if you need them).
> Note: A given namespace should only be used once per-page. See below for usage with `v-for`.  
> Also, `keep-alive` routes need special treatment (see below).

```html
<div v-shared-element:namespace></div>
```

#### Usage with `v-for`

Suppose you have a list of contacts and you want all the profile pictures to be shared-elements.  
Use ["dynamic directive arguments"](https://vuejs.org/v2/guide/custom-directive.html#Dynamic-Directive-Arguments) to give a different namespace to each contact in the list (this is typically the same ID used for `v-for`'s `:key` prop).

```vue
<img
  :src="contact.profile"
  v-shared-element:[contact.id]
/>
```

![contact example gif](https://raw.githubusercontent.com/justintaddei/v-shared-element/assets/contacts.gif)

<details>
  <summary>Detailed example</summary>

```html
<template>
  <div>
    <h1>Contacts</h1>
    <ul>
      <li
        v-for="contact in contacts"
        :key="contact.id"
      >
        <img
          :src="contact.profile"
          v-shared-element:[contact.id]
        />
        <span>{{ contact.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      contacts: [
        {
          id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000',
          profile: './user/11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000/profile',
          name: 'John Doe'
        },
        ...
      ]
    }
  }
}
</script>
```
</details>

#### Usage with `keep-alive`

If you have routes that use `<keep-alive>`, you must add some additional code. Otherwise, the transition will only run once, and not run again while the component remains alive.

To fix this, use `sharedElementMixin` on routes that are "kept alive".

##### Using sharedElementMixin <!-- omit in toc -->

Import the mixin into to any components on your `keep-alive` routes that contain *shared-elements*. Then, in those components, pass `$keepSharedElementAlive`—a method provided by the mixin—as an option to every `v-shared-element` directive on that route. Everything should now work as you would expect.

> Note: This is **only** necessary for routes that are kept alive. For example, if `/home` is kept alive but `/about` is not, then only `/home` needs to import the mixin.

<details>
  <summary><code>keep-alive</code> example</summary>

<br/>

```vue
<template>
    <div>
        <img
            src="logo.png"
            v-shared-element:logo="{ $keepSharedElementAlive }"
        />
    </div>
</template>

<script>    
import { sharedElementMixin } from 'v-shared-element'

export default {
    mixins: [sharedElementMixin]
}
</script>
```
</details>

## Options  

Options can be applied globally (when you register the plugin) and/or on each individual shared-element.

#### A note on option hierarchy <!-- omit in toc -->

- *Per-element* options **always** override global options.
- *Per-element* options on the page being navigated away from take precedence.
  - The only exception to this is `includeChildren` since it applies to each element individually.
  > If you're navigating from `/home` to `/about`, per-element options specified in `/home` will override those specified in `/about`.


### Setting global options

```js
// In main.js or ~/plugins/v-shared-element.client.js

...

Vue.use(SharedElementDirective, {
  /* options */
});

...
```

### Setting per-element options

```vue
<img
  src="logo.png"
  v-shared-element:logo="{
    /* options */
  }"
/>
```

### Summary

| option             | type                  | default   |
| ------------------ | --------------------- | --------- |
| easing             | `string`              | `"ease"`  |
| duration           | `string`              | `"300ms"` |
| endDuration        | `string`              | `"150ms"` |
| zIndex             | `number`              | `1`       |
| compositeOnly      | `boolean`             | `false`   |
| includeChildren    | `boolean`             | `false`   |
| ignoreTransparency | `boolean \| string[]` | `["img"]` |
| restrictToViewport | `boolean`             | `false`   |


### Details

#### easing

- **type:** `string`
- *default:* `"ease"`  

  A CSS [easing-function](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function) defining the acceleration curve of the transition (e.g. `"ease-in"`, `"cubic-bezier(.29, 1.01, 1, -0.68)"`).

#### duration

- **type:** `string`
- *default:* `"300ms"`  

  A CSS [time](https://developer.mozilla.org/en-US/docs/Web/CSS/time) denoting the amount of time the transition should take (e.g. `"0.5s"`, `"250ms"`).

#### endDuration
- **type:** `string | false`
- *default:* `"100ms"` 

  A CSS [time](https://developer.mozilla.org/en-US/docs/Web/CSS/time) denoting the duration of the "fade out" stage of the animation to blend the duplicated element with the real one. Set to `false` or `"0s"` to disable the fade out effect.
  > **Note:** This option only applies if `includeChildren` is `false`.

#### zIndex
- **type:** `number`
- *default:* `1`

  The `z-index` to be used for the shared-element during the animation.

#### compositeOnly
- **type:** `boolean`
- *default:* `false`
  
  Setting this to `true` will limit the transition to `transform` and `opacity` properties only (improves performance).

  **`compositeOnly: true`** *(notice that `border-radius` is not animated)*

  ![](https://raw.githubusercontent.com/justintaddei/v-shared-element/assets/compositeOnly.gif)

#### includeChildren
- **type:** `boolean`
- *default:* `false`

  `v-shared-element` works by cloning each element (and its *computed styles*) then positioning the clones over the original element. By default, only the *root* node—the one that has the directive on it—will be cloned. Setting `includeChildren` to `true` will also clone the root node's *entire* subtree **(this is needed to clone text elements such as `h1`).**

  **`includeChildren: false`**  

  ![](https://raw.githubusercontent.com/justintaddei/v-shared-element/assets/includeChildren_false.gif)

  **`includeChildren: true`**  

  ![](https://raw.githubusercontent.com/justintaddei/v-shared-element/assets/includeChildren_true.gif)

#### ignoreTransparency
- **type:** `boolean | string[]`
- *default:* `["img"]`

  Typically, if you're navigating from `/home` to `/about`, then the clone of the shared-element on `/about` will fade in and the clone from `/home` will remain at `opacity: 1`.  
  However, if the shared-element on `/home` has a `background-color` with an alpha channel (e.g. `rgba(0, 0, 0, 0.5)`), or no `background-color` at all, then the clone of the `/home` element will **fade out** *while* the clone of the element from `/about` fades in. This is usually what you want *unless* the element has a background that `v-shared-element` can't detect. This could happen if the element is acting as a container for an `<img>` element but has no background of its own, or it has a `background-image` without a `background-color` specified. In this case, setting `ignoreTransparency` to `true` will override this behavior. You can also specify an array of HTML tag-names (e.g. `["img", "div", "button"]`) to automatically set this option to `true` for those elements (a `string[]` like this is best used as a [global option](#setting-global-options)).
  > Try setting this to `true` if you see a "flash" half-way through the transition.

#### restrictToViewport
- **type:** `boolean`
- *default:* `false`
  
  By default, all shared-elements, with a matching element on the next page, will be activated when the route changes—regardless of their position in the document. With `restrictToViewport` set to `true`, only those elements which are in the viewport will be activated (those outside the viewport will behave as normal elements).

  > **Recommended:**  
  > Setting this to `true` makes navigation feel smoother.  
  > This setting is disabled by default to preserve backwards compatibility.  

  **`restrictToViewport: true`**  

  ![](https://raw.githubusercontent.com/justintaddei/v-shared-element/assets/restrictToViewport.gif)

## Usage with page transitions

> <small>Thanks to [@719media](https://github.com/719media) for figuring out how to make this work.</small>

This section assumes you have an understanding of Vue's transition component.  

**In your CSS**
```css
.page-enter-active {
  transition: opacity 150ms ease 150ms;
}

.page-leave-active {
  position: absolute;
  transition: opacity 150ms ease;
}

.page-leave-to,
.page-enter {
  opacity: 0;
}
```

**For Vue.js + vue-router**
```vue
// App.vue (or equivalent)

<div id="app">
  <transition
    name="page"
    @before-leave="beforeLeave"
    @after-leave="afterLeave"
  >
    <router-view></router-view>
  </transition>
</div>

<script>
export default {
  methods: {
    beforeLeave(el) {
      const {top} = el.getBoundingClientRect();
      el.style.position = "fixed";
      el.style.top = `${top}px`;
      el.style.left = 0;
      el.style.right = 0;
      el.style.zIndex = '-1';
    },
    afterLeave(el) {
      el.style.position = '';
      el.style.top = '';
      el.style.left = '';
      el.style.right = '';
      el.style.zIndex = '';
    }
  }
}
</script>
```

or

**For Nuxt.js**


```js
// nuxt.config.js

export default {
  pageTransition: {
    name: 'page',
    mode: '',
    beforeLeave(el) {
      const {top} = el.getBoundingClientRect();
      el.style.position = "fixed";
      el.style.top = `${top}px`;
      el.style.left = 0;
      el.style.right = 0;
      el.style.zIndex = '-1';
    },
    afterLeave(el) {
      el.style.position = '';
      el.style.top = '';
      el.style.left = '';
      el.style.right = '';
      el.style.zIndex = '';
    }
  }
}
```

**Important note about page transitions**

If the total duration of the page transition is *longer* than the duration of a shared-element on that page, things will get weird. You have been warned.

## illusory

`v-shared-element` derives its element-morphing powers from its sister project [illusory](https://github.com/justintaddei/illusory).

illusory comes bundled with `v-shared-element` as Vue instance methods.  
For more information on how to use it, see the [illusory documentation](https://github.com/justintaddei/illusory) or the [illusory example page](https://justintaddei.github.io/illusory/).

illusory is exposed on the Vue instance as `$illusory` and `$createIllusoryElement`.

For example:

```vue
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

## Asking question and reporting bugs

If you're experiencing any problems, or have general questions about the plugin, feel free open a new issue (but search through the existing ones first, as your question may have been answered already).

> Note that issues related to the `$illusory` and `$createIllusoryElement` should be opened on the [illusory repository](https://github.com/justintaddei/illusory/issues) instead.

## How to contributing

### Development setup

1. Fork and clone the repo.
   
   ```sh
    $ git clone https://github.com/<your username>/v-shared-element.git
   ```
2. Install the dependencies
   
   ```sh
    $ npm install
   ```
3. Create a new branch for your pull request
   
   ```sh
    $ git checkout -b pr/your-branch-name
   ```

### Common NPM Scripts

- `npm run build` — Runs the build script.
- `npm run dev` — Runs the build script in watch mode.
- `npm run test` — Runs the tests.
- `npm run format` — Fixes any code formatting issues.
- `npm run lint` — Lints the code.

### Web page for development

Run `npm link` so you can use it in other local projects.


**Method one**  
You can either create a new Vue.js or Nuxt.js project and use `npm link v-shared-element` to test your changes. 

or

**Method two**  
Clone the repo again, this time into a new directory. Then and run the following:

```sh
$ git checkout example
```
```sh
$ npm install
```
```sh
$ npm link v-shared-element
```
```sh
$ npm run dev
```

You should now have the example page running on `localhost`.  
Hot reload will be triggered by changes made to `v-shared-element`.

> See [CONTRIBUTING.md](https://github.com/justintaddei/v-shared-element/blob/master/CONTRIBUTING.md) for info.

## License

This project is distributed under the [MIT License](https://github.com/justintaddei/v-shared-element/blob/master/LICENSE.md).

### The MIT License (MIT)  <!-- omit in toc -->

Copyright (c) 2020 Justin Taddei

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

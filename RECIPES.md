# Common recipes <!-- omit in toc -->

Here you will find common recipes for things the plugin doesn't do by default.

- [Routes with `keep-alive`](#routes-with-keep-alive)

## Routes with `keep-alive`

As discussed in [issue #2](https://github.com/justintaddei/v-shared-element/issues/2), using `<keep-alive>` makes the transition only run once, and then never again for that namespace.

To address this shortcoming, *v-shared-element* provides the mixin `sharedElementMixin`. To use it, add to all components on your `keep-alive` routes that contain *shared elements*. Then, in those components, pass `$keepSharedElementAlive` (it's a function provided by the mixin) as an option to every `v-shared-element` directive on that route. Everything should now work as normal.

```vue
<template>
    <div>
        <img
            src="logo.png"
            v-shared-element:id="{ $keepSharedElementAlive }"
        >
    </div>
</template>

<script>    
import { sharedElementMixin } from 'v-shared-element'

export default {
    mixins: [sharedElementMixin]
}
</script>
```

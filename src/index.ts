import { IIllusoryElementOptions, illusory, IllusoryElement } from 'illusory'
import { VNode as VNode2 } from 'vue-2/types/vnode';
import { VueConstructor as Vue2 } from 'vue-2';
import { PluginObject as PluginObject2 } from 'vue-2/types/plugin'
import { VNode as VNode3, Plugin as PluginObject3, App } from 'vue-3'
import { sharedElementMixin } from './mixin'
import { DEFAULT_OPTIONS, ISharedElementOptions } from './options'
import { createRouteGuard } from './routeGuard'
import { ICachedSharedElement } from './types/ICachedSharedElement'
import { ISharedElementCandidate } from './types/ISharedElementCandidate'
import { hideElement } from './utils/hideElement'
import { nextFrame } from './utils/nextFrame'

type PluginObject = PluginObject2<Partial<ISharedElementOptions>> & PluginObject3;
type VNode = VNode2 & VNode3;

/**
 * Map of all elements on the current page that
 * are tagged with v-shared-element
 */
const sharedElementCandidates = new Map<string, ISharedElementCandidate>()
/**
 * Map of all the shared elements that were tagged
 */
const sharedElementCache = new Map<string, ICachedSharedElement>()

async function trigger(activeElement: HTMLElement, vnode: VNode, combinedOptions: ISharedElementOptions, id: string) {
  activeElement.dataset.illusoryId = id

  // Add this element to the candidates list
  sharedElementCandidates.set(id, {
    element: activeElement,
    options: combinedOptions
  })

  // See if
  const cachedElement = sharedElementCache.get(id)

  // If this element had a matching shared element
  // in the previous route it would've been in the `sharedElementCache`.
  // If it isn't in the cache there's no more work to do.
  if (!cachedElement) return

  const { finished } = illusory(cachedElement.element, activeElement, {
    element: {
      includeChildren: combinedOptions.includeChildren,
      ignoreTransparency: cachedElement.options.ignoreTransparency,
      processClone(node, depth) {
        // Hide any nested shared elements if they're currently animating
        // because otherwise they'll show up in the clone and in their
        // animation
        if (
          depth > 0 &&
          (node instanceof HTMLElement || node instanceof SVGElement) &&
          node.dataset.illusoryId &&
          sharedElementCache.has(node.dataset.illusoryId)
        ) {
          hideElement(node)
        }

        return node
      }
    },
    compositeOnly: cachedElement.options.compositeOnly,
    duration: cachedElement.options.duration,
    zIndex: cachedElement.options.zIndex,
    easing: cachedElement.options.easing,
    relativeTo: [],
    async beforeAnimate(from, to) {
      // Wait for the next frame
      await nextFrame()

      // Reset the "to" element because
      // some browsers give the wrong value for
      // the BCR on the first frame (I'm looking at you Safari)
      to.rect = to.natural.getBoundingClientRect()

      to.setStyle('left', `${to.rect.left}px`)
      to.setStyle('top', `${to.rect.top}px`)
      to._to(from)

      await nextFrame()
    },
    beforeDetach(from, to) {
      // if there was no `endDuration`
      // then we don't need to fade out
      if (
        combinedOptions.includeChildren ||
        !combinedOptions.endDuration ||
        parseFloat(combinedOptions.endDuration) <= 0
      )
        return

      from.hide()
      to.showNatural()

      to.setStyle('transition', `opacity ${combinedOptions.endDuration}`)
      to.hide()

      return to.waitFor('opacity')
    }
  })

  await finished
}

const $createIllusoryElement = (
  el: HTMLElement | SVGElement,
  opts: IIllusoryElementOptions
) => new IllusoryElement(el, opts)

const insertedMounted = (options: Partial<ISharedElementOptions> = {}) => async (activeElement, binding, vnode) => {
  const combinedOptions: ISharedElementOptions = { ...DEFAULT_OPTIONS, ...options, ...binding.value }

  // v-shared-element:id
  const id = binding.arg
  if (!id)
    throw new Error(
      `Missing ID on a v-shared-element. For usage see: https://github.com/justintaddei/v-shared-element#readme`
    )

  if (binding.value?.$keepSharedElementAlive)
    binding.value.$keepSharedElementAlive(() => {
      trigger(activeElement, vnode, combinedOptions, id)
    })

  trigger(activeElement, vnode, combinedOptions, id)
}

const isVue3 = (app: Vue2 | App): app is App => 'config' in app && 'globalProperties' in app.config

/**
 * Vue.js plugin
 * @example
 * Vue.use(SharedElementDirective, options)
 */
const SharedElementDirective: PluginObject = {
  install(app: Vue2 | App, options?: Partial<ISharedElementOptions>) {
    // Vue 2
    if (!isVue3(app)) {
      app.prototype.$illusory = illusory
      app.prototype.$createIllusoryElement = $createIllusoryElement

      app.directive('shared-element', {
        inserted: insertedMounted(options),
      })
      return
    }

    // Vue 3
    app.config.globalProperties.$illusory = illusory
    app.config.globalProperties.$createIllusoryElement = $createIllusoryElement

    app.directive('shared-element', {
      mounted: insertedMounted(options),
    })
  }
}

const createSharedElementDirective = (options: Partial<ISharedElementOptions> = {}): PluginObject3 => ({
  install: (app, options?: any[]) => SharedElementDirective.install(app, options),
})

const { NuxtSharedElementRouteGuard, SharedElementRouteGuard } = createRouteGuard(
  sharedElementCandidates,
  sharedElementCache
)

export {
  createSharedElementDirective,
  SharedElementDirective,
  SharedElementRouteGuard,
  NuxtSharedElementRouteGuard,
  sharedElementMixin,
  ISharedElementOptions
}

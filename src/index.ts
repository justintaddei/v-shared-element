import { illusory, IllusoryElement } from 'illusory'
import { IOptions } from 'illusory/types/options'
import { PluginObject } from 'vue/types/plugin'
import { DEFAULT_OPTIONS, ISharedElementOptions } from './options'
import { createRouteGuard } from './routeGuard'
import { ICachedSharedElement } from './types/ICachedSharedElement'
import { ISharedElementCandidate } from './types/ISharedElementCandidate'
import { $emit } from './utils/emit'
import { VNode } from 'vue'
import { sharedElementMixin } from './mixin'

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
    options: combinedOptions,
  })

  // See if
  const cachedElement = sharedElementCache.get(id)

  // If this element had a matching shared element
  // in the previous route it would've been in the `sharedElementCache`.
  // If it isn't in the cache there's no more work to do.
  if (!cachedElement) return

  await illusory(cachedElement.element, activeElement, {
    includeChildren: combinedOptions.includeChildren,
    compositeOnly: cachedElement.options.compositeOnly,
    duration: cachedElement.options.duration,
    zIndex: cachedElement.options.zIndex,
    easing: cachedElement.options.easing,
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
      )
        node.style.visibility = 'hidden'
    },
    async beforeAnimate(from, to) {
      // Wait for the next frame
      await new Promise((r) => requestAnimationFrame(r))

      // Reset the "to" element because
      // some browsers give the wrong value for
      // the BCR on the first frame (I'm looking at you Safari)
      to.rect = to.natural.getBoundingClientRect()

      to.setStyle('left', `${to.rect.left}px`)
      to.setStyle('top', `${to.rect.top}px`)
      to._to(from)

      await new Promise((r) => requestAnimationFrame(r))

      $emit(vnode, 'shared-element-activated', id)
    },
    beforeDetach(from, to) {
      // if there was no `endDuration`
      // then we don't need to fade out
      if (
        combinedOptions.includeChildren ||
        !combinedOptions.endDuration ||
        parseFloat(combinedOptions.endDuration) <= 0
      )
        return $emit(vnode, 'shared-element-settled', id)

      from.hide()
      to.showNatural()

      $emit(vnode, 'shared-element-settled', id)

      to.setStyle('transition', `opacity ${combinedOptions.endDuration}`)
      to.hide()

      return to.waitFor('opacity')
    },
  })

  $emit(vnode, 'shared-element-finished', id)
}

/**
 * Vue.js plugin
 * @example
 * Vue.use(SharedElementDirective, options)
 */
const SharedElementDirective: PluginObject<Partial<ISharedElementOptions>> = {
  install(Vue, options) {
    Vue.prototype.$illusory = illusory
    Vue.prototype.$createIllusoryElement = (el: HTMLElement | SVGElement, opts: IOptions) =>
      new IllusoryElement(el, opts)

    Vue.directive('shared-element', {
      async inserted(activeElement, binding, vnode) {
        const combinedOptions: ISharedElementOptions = { ...DEFAULT_OPTIONS, ...options, ...binding.value }

        // v-shared-element:id
        const id = binding.arg
        if (!id)
          throw new Error(
            `Missing ID on a v-shared-element. For usage see: https://github.com/justintaddei/v-shared-element#readme`,
          )

        if (binding.value?.$keepSharedElementAlive)
          binding.value.$keepSharedElementAlive(() => {
            trigger(activeElement, vnode, combinedOptions, id)
          })

        trigger(activeElement, vnode, combinedOptions, id)
      },
    })
  },
}

const { NuxtSharedElementRouteGuard, SharedElementRouteGuard } = createRouteGuard(
  sharedElementCandidates,
  sharedElementCache,
)

export { SharedElementDirective, SharedElementRouteGuard, NuxtSharedElementRouteGuard, sharedElementMixin }

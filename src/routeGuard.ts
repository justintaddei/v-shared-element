import { IllusoryElement } from 'illusory'
import { Vue } from 'vue-2/types/vue'
import { NavigationGuard as NavigationGuard3, VueRouter as VueRouter3 } from 'vue-router-3/types/router'
import { NavigationGuard as NavigationGuard4, NavigationGuardWithThis, Router as VueRouter4 } from 'vue-router-4'
import { ICachedSharedElement } from './types/ICachedSharedElement'
import { ISharedElementCandidate } from './types/ISharedElementCandidate'
import { hideElement } from './utils/hideElement'
import { withinViewport } from './utils/withinViewport'

type NavigationGuard = NavigationGuard3<Vue> & NavigationGuard4 & NavigationGuardWithThis<undefined>
type VueRouter = VueRouter3 & VueRouter4

export function createRouteGuard(
  sharedElementCandidates: Map<string, ISharedElementCandidate>,
  sharedElementCache: Map<string, ICachedSharedElement>
) {
  /**
   * Vue.js route guard
   * @example
   * router.beforeEach(SharedElementRouteGuard)
   */
  const SharedElementRouteGuard: NavigationGuard = (to, from, next: () => void) => {
    // Clear any existing shared elements (i.e. from the route before last)
    sharedElementCache.clear()

    const subSharedElements: (HTMLElement | SVGElement)[] = []

    // Let's loop over all the candidates and create a record of them
    sharedElementCandidates.forEach((candidate, id) => {
      if (candidate.options.restrictToRoutes) {
        if (Array.isArray(candidate.options.restrictToRoutes)) {
          if (!candidate.options.restrictToRoutes.includes(to.path)) return
        } else if (typeof candidate.options.restrictToRoutes === 'function') {
          if (!candidate.options.restrictToRoutes(to, from, id)) return
        }
      }

      if (candidate.options.restrictToViewport) {
        const bcr = candidate.element.getBoundingClientRect()
        if (!withinViewport(bcr)) return
      }

      const element = new IllusoryElement(candidate.element, {
        includeChildren: candidate.options.includeChildren,
        ignoreTransparency: candidate.options.ignoreTransparency,
        processClone(node, depth) {
          if (
            depth > 0 &&
            (node instanceof HTMLElement || node instanceof SVGElement) &&
            node.dataset.illusoryId &&
            sharedElementCache.has(node.dataset.illusoryId)
          )
            subSharedElements.push(node)

          return node
        }
      })

      sharedElementCache.set(id, {
        id,
        element,
        options: candidate.options
      })
    })

    // Then lets clear the candidates list
    sharedElementCandidates.clear()

    subSharedElements.forEach((el) => {
      hideElement(el)
    })

    // Move on to the next middleware
    next()
  }

  /**
   * Nuxt.js plugin
   * @example
   * export default NuxtSharedElementRouteGuard
   */
  const NuxtSharedElementRouteGuard = (context: { app: { router: VueRouter } }) => {
    const { router } = context.app

    // Listen for the route to change
    router.beforeEach(SharedElementRouteGuard)
  }

  return { SharedElementRouteGuard, NuxtSharedElementRouteGuard }
}

import { IllusoryElement } from 'illusory'
import { ICachedSharedElement } from './types/ICachedSharedElement'
import { ISharedElementCandidate } from './types/ISharedElementCandidate'
import { hideElement } from './utils/hideElement'
import { withinViewport } from './utils/withinViewport'

export function createRouteGuard(
  sharedElementCandidates: Map<string, ISharedElementCandidate>,
  sharedElementCache: Map<string, ICachedSharedElement>
) {
  /**
   * Vue.js route guard
   * @example
   * router.beforeEach(SharedElementRouteGuard)
   */
  const SharedElementRouteGuard = (to, from, next: () => void) => {
    // Clear any existing shared elements (i.e. from the route before last)
    sharedElementCache.clear()

    const subSharedElements: (HTMLElement | SVGElement)[] = []

    // Let's loop over all the candidates and create a record of them
    sharedElementCandidates.forEach((candidate, id) => {
      if (candidate.options.restrictToRoutes) {
        if (Array.isArray(candidate.options.restrictToRoutes)) {
          if (!candidate.options.restrictToRoutes.includes(from.path)) return
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
  const NuxtSharedElementRouteGuard = (context: any) => {
    const { router } = context.app

    // Listen for the route to change
    router.beforeEach(SharedElementRouteGuard)
  }

  return { SharedElementRouteGuard, NuxtSharedElementRouteGuard }
}

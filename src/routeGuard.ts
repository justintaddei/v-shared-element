import { IllusoryElement } from 'illusory'
import { ICachedSharedElement } from './types/ICachedSharedElement'
import { ISharedElementCandidate } from './types/ISharedElementCandidate'
import { withinViewport } from './utils/withinViewport'

export function createRouteGuard(
  sharedElementCandidates: Map<string, ISharedElementCandidate>,
  sharedElementCache: Map<string, ICachedSharedElement>,
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
      const element = new IllusoryElement(candidate.element, {
        includeChildren: candidate.options.includeChildren,
        zIndex: candidate.options.zIndex,
        ignoreTransparency: candidate.options.ignoreTransparency,
        processClone(node, depth) {
          if (
            depth > 0 &&
            (node instanceof HTMLElement || node instanceof SVGElement) &&
            node.dataset.illusoryId &&
            sharedElementCache.has(node.dataset.illusoryId)
          )
            subSharedElements.push(node)
        },
      })

      if (candidate.options.restrictToViewport && !withinViewport(element)) return

      sharedElementCache.set(id, {
        id,
        element,
        options: candidate.options,
      })
    })

    // Then lets clear the candidates list
    sharedElementCandidates.clear()

    subSharedElements.forEach((el) => (el.style.visibility = 'hidden'))

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

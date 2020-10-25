import { prepareCandidates } from './utils/sharedElementHandler'

export function createRouteGuard() {
  /**
   * Vue.js route guard
   * @example
   * router.beforeEach(SharedElementRouteGuard)
   */
  const SharedElementRouteGuard = (to, from, next: () => void) => {
    prepareCandidates()
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

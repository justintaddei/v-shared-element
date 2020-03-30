import { PluginObject } from 'vue/types/plugin';
import { duplicateNode, removePreexistingClones } from './dom-helpers';
import { transition } from './transition';

/**
 * SharedElement Options
 */
export interface ISharedElementOptions {
  /**
   * Controls how the elements will be swapped.
   *
   * `cross-fade` will fade out the old element and at the
   *  same time will fade the new one in underneath.
   *
   * `reveal` starts with **both** elements at **full opacity** then fades
   *  out the old element to reveal the new one underneath.
   *
   * `auto` will use `"cross-fade"` when `compositeOnly = true || the old element's opacity !== 1` and `"reveal"` otherwise.
   *
   *  @default 'auto'
   */
  type: 'cross-fade' | 'reveal' | 'auto';
  /**
   * CSS easing function
   * @default "ease"
   */
  easing: string;
  /**
   * CSS duration
   * @default "300ms"
   */
  duration: string;
  /**
   * CSS duration that controls the
   * the "fade-out" stage of the animation
   * to blend the cloned node with the real one.
   * Set to `"0s"` to disable
   * @default "100ms"
   */
  endDuration: string;
  /**
   * Setting to `true` will limit animations to `transform` and `opacity` only
   * @default true
   */
  compositeOnly: boolean;
  /**
   * The z-index used for elements during the animation
   * @default 1000
   */
  zIndex: number;
}

/**
 * A shared element that may or may not
 * need to be transitioned to the next route
 */
interface ISharedElementCandidate {
  element: HTMLElement;
  options: ISharedElementOptions;
}

/**
 * A cached shared element from the previous route
 */
export interface ICachedSharedElement {
  id: string;
  clonedNode: HTMLElement;
  actualNode: HTMLElement;
  boundingRect: DOMRect;
  options: ISharedElementOptions;
}

/**
 * SharedElements that exist on the current route.
 */
const sharedElementCandidates = new Map<string, ISharedElementCandidate>();
/**
 * A Cache of the SharedElements from this route
 */
const sharedElementCache = new Map<string, ICachedSharedElement>();

const defaultOptions: ISharedElementOptions = {
  type: 'auto',
  easing: 'ease',
  duration: '300ms',
  endDuration: '100ms',
  compositeOnly: false,
  zIndex: 1000,
};

/**
 * Vue.js plugin
 * @example
 * Vue.use(SharedElementDirective, options)
 */
export const SharedElementDirective: PluginObject<Partial<ISharedElementOptions>> = {
  install(Vue, options) {
    Vue.directive('shared-element', {
      inserted(activeElement, binding) {
        const id = binding.arg;

        if (!id)
          throw new Error(
            `Missing ID on a v-shared-element. For usage see: https://github.com/justintaddei/v-shared-element#readme`,
          );

        // Add this element to the candidates list
        sharedElementCandidates.set(id, {
          element: activeElement,
          options: { ...defaultOptions, ...options, ...binding.value },
        });

        /**
         * An element cached from the previous route
         */
        const cachedElement = sharedElementCache.get(id);

        // If this element had a matching shared element
        // in the previous route it would've been in the `sharedElementCache`.
        // If it isn't in the cache there's no more work to do.
        if (!cachedElement) return;

        // Now transition form the duplicate element to the new one.
        // If we're working with an img tag we need to make sure
        // that it's full loaded or we will see a visual flash
        // (even if it's loaded from cache since the disk might be
        // slow on the device)
        if (activeElement.tagName === 'IMG' && !(activeElement as HTMLImageElement).complete) {
          activeElement.addEventListener('load', () => transition(cachedElement, activeElement), {
            once: true,
          });
        } else {
          transition(cachedElement, activeElement);
        }
      },
    });
  },
};

/**
 * Vue.js route guard
 * @example
 * router.beforeEach(SharedElementRouteGuard)
 */
export const SharedElementRouteGuard = (to, from, next: () => void) => {
  // We'll use a try-catch here just in case.
  // If `next()` isn't called then our app will look frozen.
  try {
    // Clear any existing shared elements (i.e. from the route before last)
    sharedElementCache.clear();

    // Let's loop over all the candidates and create a record of them
    sharedElementCandidates.forEach((candidate, id) => {
      // Cancel any current animation for the same shared element.
      // This protects against people spamming links/buttons
      removePreexistingClones(id);
      sharedElementCache.set(id, {
        id,
        actualNode: candidate.element,
        clonedNode: duplicateNode(candidate.element, id),
        boundingRect: candidate.element.getBoundingClientRect(),
        options: candidate.options,
      });
    });

    // Then lets clear the candidates list
    sharedElementCandidates.clear();
  } catch (e) {
    console.error(e);
  }

  // Move on to the next middleware
  next();
};

/**
 * Nuxt.js plugin
 * @example
 * export default NuxtSharedElementRouteGuard
 */
export const NuxtSharedElementRouteGuard = (context: any) => {
  const { router } = context.app;

  // Listen for the route to change
  router.beforeEach(SharedElementRouteGuard);
};

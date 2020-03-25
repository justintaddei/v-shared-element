import { PluginObject } from 'vue/types/plugin';
import { duplicateNode } from './dom-helpers';
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
   * `auto` will use `"cross-fade"` when `compositeOnly = true` or `"reveal"` otherwise.
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

export interface ICachedSharedElement {
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
            `No shared-element ID for ${activeElement.tagName}. Usage: https://github.com/justintaddei/v-shared-element#readme`,
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
      sharedElementCache.set(id, {
        actualNode: candidate.element,
        clonedNode: duplicateNode(candidate.element),
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

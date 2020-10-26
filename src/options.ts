import { Route } from 'vue-router/types/router'

/**
 * SharedElement Options.
 */
export interface ISharedElementOptions {
  /**
   * CSS easing function.
   * @default "ease"
   */
  easing: string
  /**
   * CSS duration.
   * @default "300ms"
   */
  duration: string
  /**
   * CSS duration that controls
   * the "fade-out" stage of the animation
   * to blend the cloned node with the real one.
   * Set to `"0s"` to disable.
   * @default "150ms"
   */
  endDuration: string | false
  /**
   * Setting to `true` will limit animations to `transform` and `opacity` only.
   * @default false
   */
  compositeOnly: boolean
  /**
   * The z-index used for elements during the animation.
   * @default 1
   */
  zIndex: number
  /**
   * If `true`, child nodes will be included in the animation.
   * @default true
   */
  includeChildren: boolean
  /**
   * If `false` and the element we're transitioning **to** has a transparent background then
   * the element we're transitioning from will fade out.
   * If `true` the transparency of the element's background will be ignored.
   *
   * This can also be an array of tag names that should be ignored (e.g. `['img', 'button']`).
   * @default ['img']
   */
  ignoreTransparency: boolean | string[]

  /**
   * Setting this to `true` will disable any shared-elements on the
   * current page **unless** they are in the viewport.
   * @default true
   */
  restrictToViewport: boolean

  /**
   * Prevents the shared-element from enter the cloning unless one of the following is true:
   *
   * If `restrictToRoutes` is any array and the `path` of the upcoming route matches an item
   * in that array.
   *
   * Or, if `restrictToRoutes` is a function and that function that returns true.
   *
   *
   * ---
   *
   * Setting `restrictToRoutes` to `false` disables this behavior completely.
   *
   * ---
   *
   * @default
   * false
   *
   * @example
   * ```html
   * <button
   *  v-shared-element:id="{
   *    restrictToRoutes(to, from, id) {
   *      return id === to.params.productId
   *    }
   *  }">Click me</button>
   * ```
   */
  restrictToRoutes: false | string[] | ((to: Route, from: Route, id: string) => boolean)
}

export const DEFAULT_OPTIONS: ISharedElementOptions = {
  easing: 'ease',
  duration: '300ms',
  endDuration: '150ms',
  zIndex: 1,
  compositeOnly: false,
  includeChildren: true,
  ignoreTransparency: ['img'],
  restrictToViewport: true,
  restrictToRoutes: false
}

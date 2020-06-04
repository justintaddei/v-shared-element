/**
 * SharedElement Options
 */
export interface ISharedElementOptions {
  /**
   * CSS easing function
   * @default "ease"
   */
  easing: string
  /**
   * CSS duration
   * @default "300ms"
   */
  duration: string
  /**
   * CSS duration that controls the
   * the "fade-out" stage of the animation
   * to blend the cloned node with the real one.
   * Set to `"0s"` to disable
   * @default "100ms"
   */
  endDuration: string | false
  /**
   * Setting to `true` will limit animations to `transform` and `opacity` only
   * @default true
   */
  compositeOnly: boolean
  /**
   * The z-index used for elements during the animation
   * @default 1000
   */
  zIndex: number
  /**
   * If `true`, child nodes will be included in the animation
   * @default false
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
}

export const DEFAULT_OPTIONS: ISharedElementOptions = {
  easing: 'ease',
  duration: '300ms',
  endDuration: '150ms',
  zIndex: 1,
  compositeOnly: false,
  includeChildren: false,
  ignoreTransparency: ['img'],
}

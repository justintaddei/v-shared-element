import { ISharedElementOptions } from '../options'

/**
 * A shared element that may or may not
 * need to be transitioned to the next route
 */
export interface ISharedElementCandidate {
  element: HTMLElement
  options: ISharedElementOptions
}

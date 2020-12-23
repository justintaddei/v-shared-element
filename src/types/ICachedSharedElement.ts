import { IllusoryElement } from 'illusory'
import { ISharedElementOptions } from '../options'

/**
 * A cached shared element from the previous route
 */
export interface ICachedSharedElement {
  id: string
  element: IllusoryElement
  options: ISharedElementOptions
}

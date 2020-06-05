import { IllusoryElement } from 'illusory/types'

export function withinViewport({ rect }: IllusoryElement) {
  return rect.bottom >= 0 && rect.right >= 0 && rect.top <= window.innerHeight && rect.left <= window.innerWidth
}

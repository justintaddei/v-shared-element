export function hideElement(element: HTMLElement | SVGElement) {
  element.style.animation = 'none'
  element.style.transition = 'none'
  element.style.opacity = '0'
}

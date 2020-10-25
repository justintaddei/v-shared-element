import { IllusoryElement } from 'illusory'
import { ICachedSharedElement } from '../types/ICachedSharedElement'
import { ISharedElementCandidate } from '../types/ISharedElementCandidate'
import { hideElement } from './hideElement'
import { withinViewport } from './withinViewport'

/**
 * Map of all elements on the current page that
 * are tagged with v-shared-element
 */
const sharedElementCandidates = new Map<string, ISharedElementCandidate>()
/**
 * Map of all the shared elements that were tagged
 */
const sharedElementCache = new Map<string, ICachedSharedElement>()

// @ts-ignore
window.secache = sharedElementCache

let remainingCandidates: string[] = []
let processingCandidates = false
let cacheInvalidated = false

const subSharedElements: (HTMLElement | SVGElement)[] = []

function cacheIllusoryElement(id: string, candidate: ISharedElementCandidate) {
  const element = new IllusoryElement(candidate.element, {
    includeChildren: candidate.options.includeChildren,
    // zIndex: candidate.options.zIndex,
    ignoreTransparency: candidate.options.ignoreTransparency,
    processClone(node, depth) {
      if (
        depth > 0 &&
        (node instanceof HTMLElement || node instanceof SVGElement) &&
        node.dataset.illusoryId &&
        sharedElementCache.has(node.dataset.illusoryId)
      )
        subSharedElements.push(node)

      return node
    },
  })

  sharedElementCache.set(id, {
    id,
    element,
    options: candidate.options,
  })

  //   element.natural.style.outline = '3px solid green'
}

function enqueueCandidate(id: string) {
  if (cacheInvalidated) {
    cacheInvalidated = false
    sharedElementCache.clear()
  }

  remainingCandidates.push(id)

  if (processingCandidates) return

  processingCandidates = true

  function processQueue(deadline) {
    while (deadline.timeRemaining() > 0) {
      if (!remainingCandidates.length) break

      const _id = remainingCandidates.shift()!
      const candidate = sharedElementCandidates.get(_id)!

      cacheIllusoryElement(_id, candidate)

      sharedElementCandidates.delete(_id)
    }

    if (remainingCandidates.length) window.requestIdleCallback(processQueue)
    else processingCandidates = false
  }

  window.requestIdleCallback(processQueue)
}

function registerCandidate(id: string, candidate: ISharedElementCandidate) {
  sharedElementCandidates.set(id, candidate)

  enqueueCandidate(id)
}

function hasCachedSharedElement(id: string) {
  return sharedElementCache.has(id)
}

function getCachedSharedElement(id: string) {
  return sharedElementCache.get(id)
}

function prepareCandidates() {
  if (!remainingCandidates.length) return console.log('no elements left to cache')

  console.log('remainingCandidates.length :>> ', remainingCandidates.length)

  remainingCandidates.forEach((id) => {
    const candidate = sharedElementCandidates.get(id)!

    if (candidate.options.restrictToViewport) {
      const bcr = candidate.element.getBoundingClientRect()
      if (!withinViewport(bcr)) return
    }

    cacheIllusoryElement(id, candidate)
  })

  // Then lets clear the candidates list
  sharedElementCandidates.clear()
  remainingCandidates = []

  subSharedElements.forEach((el) => {
    hideElement(el)
  })

  sharedElementCache.forEach(({ element }) => {
    element.rect = element.natural.getBoundingClientRect()

    element.setStyle('left', `${element.rect.left}px`)
    element.setStyle('top', `${element.rect.top}px`)
  })

  cacheInvalidated = true
}
export { registerCandidate, prepareCandidates, hasCachedSharedElement, getCachedSharedElement }

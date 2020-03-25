import { duplicateNode, offsetTransform } from './dom-helpers';
import { ICachedSharedElement } from './index';

/**
 * Transitions one DOM element to another
 */
export function transition(cachedElement: ICachedSharedElement, activeElement: HTMLElement) {
  // The original value of the `style` attrbute.
  // Used to reset the attribute to it's original state after
  // we alter it to apply the transition
  const activeElementOriginalStyleAttribute = activeElement.getAttribute('style');

  const activeElementClone = duplicateNode(activeElement, cachedElement.id);

  const activeElementBoundingRect = activeElement.getBoundingClientRect();

  const cachedElementBorderRadius = cachedElement.clonedNode.style.borderRadius;
  const activeElementBorderRadius = activeElementClone.style.borderRadius;
  const cachedElementOpacity = cachedElement.clonedNode.style.opacity;
  const activeElementOpacity = activeElementClone.style.opacity;

  /**
   * CSS transform used to put the cached element over the active element
   */
  const cachedElementTransform = offsetTransform(activeElementBoundingRect, cachedElement.boundingRect);
  /**
   * CSS transform used position the activeElement in the same place as the cached element
   */
  const activeElementTransform = offsetTransform(cachedElement.boundingRect, activeElementBoundingRect);

  // Now we can hide the "real" element on the old route
  // which is important if the route has a transition of its own
  cachedElement.actualNode.style.transition = 'none';
  cachedElement.actualNode.style.animation = 'none';
  cachedElement.actualNode.style.opacity = '0';

  // The duplicate element is a copy of the original element and is `positioned: fixed`
  // if set the top and left of the duplicate to the BoundingClientRect values
  // of the original, it will sit right on top of it.
  cachedElement.clonedNode.style.left = `${cachedElement.boundingRect.left}px`;
  cachedElement.clonedNode.style.top = `${cachedElement.boundingRect.top}px`;
  cachedElement.clonedNode.style.zIndex = `${cachedElement.options.zIndex}`;

  activeElementClone.style.left = `${activeElementBoundingRect.left}px`;
  activeElementClone.style.top = `${activeElementBoundingRect.top}px`;
  // The active element's z-index to 1 less
  // than that of the cachedElement so it appears below it
  activeElementClone.style.zIndex = `${cachedElement.options.zIndex}`;

  // Any transitions or animations on the element
  // could interfere with setting the opacity
  activeElement.style.transition = 'none';
  activeElement.style.animation = 'none';
  activeElement.style.opacity = '0';

  // The css transition is calculated each time so that it can be changed
  // by options passed to `v-shared-element`
  let cssTransition = `transform ${cachedElement.options.duration} ${cachedElement.options.easing}, opacity ${cachedElement.options.duration} linear`;

  // If we aren't limiting the transition to `transform`
  // and `opacity` then we'll add a transition for border-radius as well
  if (!cachedElement.options.compositeOnly)
    cssTransition = `${cssTransition}, border-radius ${cachedElement.options.duration} ${cachedElement.options.easing}`;

  // Figure out if we need to cross-fade the elements or "reveal" the active element
  if (
    cachedElement.options.type === 'cross-fade' ||
    (cachedElement.options.type === 'auto' && (cachedElement.options.compositeOnly || cachedElementOpacity !== '1'))
  ) {
    activeElementClone.style.opacity = '0';
  }

  // Move the active element clone to the starting position
  activeElementClone.style.transform = activeElementTransform;

  // Change the border-radius if necessary
  if (!cachedElement.options.compositeOnly) activeElementClone.style.borderRadius = cachedElementBorderRadius;

  // Now we need to actually add the clones to the document
  document.body.appendChild(activeElementClone);
  document.body.appendChild(cachedElement.clonedNode);

  // Flush css changes
  activeElement.offsetHeight;

  // Set the transitions on the elements
  cachedElement.clonedNode.style.transition = cssTransition;
  activeElementClone.style.transition = cssTransition;

  // Make them move
  cachedElement.clonedNode.style.transform = cachedElementTransform;
  activeElementClone.style.transform = 'none';

  // Cross-fade or "reveal" them
  cachedElement.clonedNode.style.opacity = '0';
  activeElementClone.style.opacity = activeElementOpacity;

  // If necessary, also change the border-radius so it animates
  if (!cachedElement.options.compositeOnly) {
    cachedElement.clonedNode.style.borderRadius = activeElementBorderRadius;
    activeElementClone.style.borderRadius = activeElementBorderRadius;
  }

  // Wait for the animations to finish
  activeElementClone.addEventListener('transitionend', (e) => {
    // Make sure they stopped moving
    if (e.propertyName !== 'transform') return;

    // Reset the style attribute of the active element if necessary
    if (activeElementOriginalStyleAttribute) activeElement.setAttribute('style', activeElementOriginalStyleAttribute);
    // Or just remove it if it wasn't there to begin with
    else activeElement.removeAttribute('style');

    // Remove the duplicate nodes
    cachedElement.clonedNode.remove();
    activeElementClone.remove();
  });
}

import { duplicateNode, transformFromOffset } from './dom-helpers';
import { ICachedSharedElement } from './index';

export function transition(cachedElement: ICachedSharedElement, activeElement: HTMLElement) {
  const activeElementOriginalStyleAttribute = activeElement.getAttribute('style');

  const activeElementClone = duplicateNode(activeElement);

  const activeElementBoundingRect = activeElement.getBoundingClientRect();

  const cachedElementBorderRadius = cachedElement.clonedNode.style.borderRadius;
  const activeElementBorderRadius = activeElementClone.style.borderRadius;

  const cachedElementTransform = transformFromOffset(activeElementBoundingRect, cachedElement.boundingRect);
  const activeElementTransform = transformFromOffset(cachedElement.boundingRect, activeElementBoundingRect);

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

  let cssTransition = `transform ${cachedElement.options.duration} ${cachedElement.options.easing}, opacity ${cachedElement.options.duration} linear`;

  if (!cachedElement.options.compositeOnly)
    cssTransition = `${cssTransition}, border-radius ${cachedElement.options.duration} ${cachedElement.options.easing}`;

  if (
    cachedElement.options.type === 'cross-fade' ||
    (cachedElement.options.type === 'auto' && cachedElement.options.compositeOnly)
  ) {
    activeElementClone.style.opacity = '0';
  }

  // Move the active element clone to the starting position
  activeElementClone.style.transform = activeElementTransform;
  if (!cachedElement.options.compositeOnly) activeElementClone.style.borderRadius = cachedElementBorderRadius;

  // Now we need to actually add the clones to the document
  document.body.appendChild(activeElementClone);
  document.body.appendChild(cachedElement.clonedNode);

  // Flush css changes
  activeElement.offsetHeight;

  cachedElement.clonedNode.style.transition = cssTransition;
  activeElementClone.style.transition = cssTransition;

  cachedElement.clonedNode.style.transform = cachedElementTransform;
  activeElementClone.style.transform = 'none';

  cachedElement.clonedNode.style.opacity = '0';
  activeElementClone.style.opacity = '';

  if (!cachedElement.options.compositeOnly) {
    cachedElement.clonedNode.style.borderRadius = activeElementBorderRadius;
    activeElementClone.style.borderRadius = activeElementBorderRadius;
  }

  activeElementClone.addEventListener('transitionend', (e) => {
    if (e.propertyName !== 'transform') return;

    if (activeElementOriginalStyleAttribute) activeElement.setAttribute('style', activeElementOriginalStyleAttribute);
    else activeElement.removeAttribute('style');

    cachedElement.clonedNode.remove();
    activeElementClone.remove();
  });
}

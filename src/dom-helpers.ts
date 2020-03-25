/**
 * Removes all `data-*` attributes from an element
 * @param clone an HTMLElement
 */
function clearDataAttributes(clone: HTMLElement) {
  const dataset = clone.dataset;
  for (const key in dataset) {
    if (dataset.hasOwnProperty(key)) {
      clone.removeAttribute(
        'data-' +
          key
            .split(/(?=[A-Z])/)
            .join('-')
            .toLowerCase(),
      );
    }
  }
}

/**
 * Copies the computed styles from one element to another
 */
function copyStyles(node: HTMLElement, targetNode: HTMLElement) {
  const computedStyles = window.getComputedStyle(node);

  for (let i = 0, l = computedStyles.length; i < l; i++) {
    const key = computedStyles[i];
    targetNode.style[key] = computedStyles[key];
  }
}

/**
 * Creates a duplicate of `node` using a
 * combination of `cloneNode` and `getComputedStyles`
 */
export function duplicateNode(node: HTMLElement) {
  const clone = node.cloneNode() as HTMLElement;

  // Remove all data-* attributes
  // because these can interfere with Vue
  clearDataAttributes(clone);

  // Ensure the two elements have the same styles
  copyStyles(node, clone);

  // Clear styles that my cause issues
  // when trying to position / animate the clone
  clone.style.left = 'auto';
  clone.style.right = 'auto';
  clone.style.top = 'auto';
  clone.style.bottom = 'auto';
  clone.style.transform = 'none';
  clone.style.transformOrigin = '0% 0%';
  clone.style.transition = 'none';
  clone.style.animation = 'none';
  clone.style.margin = '0 0 0 0';

  // position:fixed; so that we can easily
  // position it directly over the original element
  clone.style.position = 'fixed';

  return clone;
}

/**
 * Calculate the difference in position/scale between two elements
 */
export function transformFromOffset(from: DOMRect, to: DOMRect) {
  return `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${
    from.height / to.height
  })`;
}

// Element.remove polyfill
(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty('remove')) {
      return;
    }
    Object.defineProperty(item, 'remove', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function remove() {
        if (this.parentNode === null) {
          return;
        }
        this.parentNode.removeChild(this);
      },
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

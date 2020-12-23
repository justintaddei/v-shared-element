export function nextFrame() {
  return new Promise((r) => requestAnimationFrame(r))
}

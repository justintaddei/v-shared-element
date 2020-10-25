declare interface Window {
  requestIdleCallback(cb: (deadline: { timeRemaining: () => number }) => void): void
}

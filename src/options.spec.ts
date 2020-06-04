import { DEFAULT_OPTIONS } from './options'

test('Has correct default options', () => {
  expect(DEFAULT_OPTIONS).toEqual({
    easing: 'ease',
    duration: '300ms',
    endDuration: '150ms',
    zIndex: 1,
    compositeOnly: false,
    includeChildren: false,
    ignoreTransparency: ['img'],
  })
})

import { render } from '@testing-library/react'

import BoundedContextCanvas from './bounded-context-canvas'

describe('BoundedContextCanvas', () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: () => true,
  })

  // Mock image.decode for tldraw compatibility
  Object.defineProperty(HTMLImageElement.prototype, 'decode', {
    writable: true,
    value: () => Promise.resolve(),
  })

  it('should render successfully', () => {
    const { baseElement } = render(<BoundedContextCanvas />)
    expect(baseElement).toBeTruthy()
  })
})

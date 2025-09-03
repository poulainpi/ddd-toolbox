import { render } from '@testing-library/react'

import DomainStorytelling from './domain-storytelling'

describe('DomainStorytelling', () => {
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
    const { baseElement } = render(<DomainStorytelling />)
    expect(baseElement).toBeTruthy()
  })
})

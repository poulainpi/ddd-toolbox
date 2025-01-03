import { render } from '@testing-library/react'

import DomainStorytelling from './domain-storytelling'

describe('DomainStorytelling', () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: () => true,
  })

  it('should render successfully', () => {
    const { baseElement } = render(<DomainStorytelling />)
    expect(baseElement).toBeTruthy()
  })
})

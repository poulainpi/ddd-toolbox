import { render } from '@testing-library/react'

import DomainStorytelling from './domain-storytelling'

describe('DomainStorytelling', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DomainStorytelling />)
    expect(baseElement).toBeTruthy()
  })
})

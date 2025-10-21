import { render } from '@testing-library/react'

import BoundedContextCanvas from './bounded-context-canvas'

describe('BoundedContextCanvas', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BoundedContextCanvas />)
    expect(baseElement).toBeTruthy()
  })
})

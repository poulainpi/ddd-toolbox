import { render } from '@testing-library/react'

import FeatureEventStorming from './feature-event-storming'

describe('FeatureEventStorming', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeatureEventStorming />)
    expect(baseElement).toBeTruthy()
  })
})

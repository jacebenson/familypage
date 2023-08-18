import { render } from '@redwoodjs/testing/web'

import IcsFetch from './IcsFetch'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('IcsFetch', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<IcsFetch />)
    }).not.toThrow()
  })
})

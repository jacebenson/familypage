import { render } from '@redwoodjs/testing/web'

import SetFamily from './SetFamily'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('SetFamily', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SetFamily />)
    }).not.toThrow()
  })
})

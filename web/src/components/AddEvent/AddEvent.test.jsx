import { render } from '@redwoodjs/testing/web'

import AddEvent from './AddEvent'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('AddEvent', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AddEvent />)
    }).not.toThrow()
  })
})

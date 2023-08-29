import { render } from '@redwoodjs/testing/web'

import FieldLabel from './FieldLabel'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('FieldLabel', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<FieldLabel />)
    }).not.toThrow()
  })
})

import { render } from '@redwoodjs/testing/web'

import InviteMember from './InviteMember'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('InviteMember', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<InviteMember />)
    }).not.toThrow()
  })
})

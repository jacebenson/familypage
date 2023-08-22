import { render } from '@redwoodjs/testing/web'

import InviteToFamilyPage from './InviteToFamilyPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('InviteToFamilyPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<InviteToFamilyPage />)
    }).not.toThrow()
  })
})

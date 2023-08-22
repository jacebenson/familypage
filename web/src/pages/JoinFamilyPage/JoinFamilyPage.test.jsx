import { render } from '@redwoodjs/testing/web'

import JoinFamilyPage from './JoinFamilyPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('JoinFamilyPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<JoinFamilyPage />)
    }).not.toThrow()
  })
})

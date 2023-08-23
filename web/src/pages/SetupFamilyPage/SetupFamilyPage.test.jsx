import { render } from '@redwoodjs/testing/web'

import SetupFamilyPage from './SetupFamilyPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('SetupFamilyPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SetupFamilyPage />)
    }).not.toThrow()
  })
})

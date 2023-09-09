import { render } from '@redwoodjs/testing/web'

import EditEventPublicPage from './EditEventPublicPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('EditEventPublicPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<EditEventPublicPage />)
    }).not.toThrow()
  })
})

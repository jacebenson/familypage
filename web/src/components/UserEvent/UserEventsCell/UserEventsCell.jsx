import { Link, routes } from '@redwoodjs/router'

import UserEvents from 'src/components/UserEvent/UserEvents'

export const QUERY = gql`
  query FindUserEvents {
    userEvents {
      id
      userId
      eventId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No userEvents yet. '}
      <Link to={routes.newUserEvent()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ userEvents }) => {
  return <UserEvents userEvents={userEvents} />
}

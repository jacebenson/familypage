import { Link, routes } from '@redwoodjs/router'

import Events from 'src/components/Event/Events'

export const QUERY = gql`
  query FindEvents {
    events {
      id
      title
      description
      location
      url
      status
      busyStatus
      organizer
      attendees
      start
      duration
      geo
      familyId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No events yet. '}
      <Link to={routes.newEvent()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ events }) => {
  return <Events events={events} />
}

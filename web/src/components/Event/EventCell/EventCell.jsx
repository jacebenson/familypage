import Event from 'src/components/Event/Event'

export const QUERY = gql`
  query FindEventById($id: String!) {
    event: event(id: $id) {
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

export const Empty = () => <div>Event not found</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ event }) => {
  return <Event event={event} />
}

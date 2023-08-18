export const QUERY = gql`
  query FindCalendarModalQuery($id: String!) {
    calendarModal: event(id: $id) {
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
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ calendarModal }) => {
  return <div>{JSON.stringify(calendarModal)}</div>
}

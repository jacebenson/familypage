import UserEvent from 'src/components/UserEvent/UserEvent'

export const QUERY = gql`
  query FindUserEventById($id: String!) {
    userEvent: userEvent(id: $id) {
      id
      userId
      eventId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>UserEvent not found</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ userEvent }) => {
  return <UserEvent userEvent={userEvent} />
}

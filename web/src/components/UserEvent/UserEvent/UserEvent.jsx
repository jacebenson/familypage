import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import 'src/lib/formatters'

const DELETE_USER_EVENT_MUTATION = gql`
  mutation DeleteUserEventMutation($id: String!) {
    deleteUserEvent(id: $id) {
      id
    }
  }
`

const UserEvent = ({ userEvent }) => {
  const [deleteUserEvent] = useMutation(DELETE_USER_EVENT_MUTATION, {
    onCompleted: () => {
      toast.success('UserEvent deleted')
      navigate(routes.userEvents())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete userEvent ' + id + '?')) {
      deleteUserEvent({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            UserEvent {userEvent.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{userEvent.id}</td>
            </tr>
            <tr>
              <th>User id</th>
              <td>{userEvent.userId}</td>
            </tr>
            <tr>
              <th>Event id</th>
              <td>{userEvent.eventId}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editUserEvent({ id: userEvent.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(userEvent.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default UserEvent

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/UserEvent/UserEventsCell'
import { truncate } from 'src/lib/formatters'

const DELETE_USER_EVENT_MUTATION = gql`
  mutation DeleteUserEventMutation($id: String!) {
    deleteUserEvent(id: $id) {
      id
    }
  }
`

const UserEventsList = ({ userEvents }) => {
  const [deleteUserEvent] = useMutation(DELETE_USER_EVENT_MUTATION, {
    onCompleted: () => {
      toast.success('UserEvent deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete userEvent ' + id + '?')) {
      deleteUserEvent({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>User id</th>
            <th>Event id</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {userEvents.map((userEvent) => (
            <tr key={userEvent.id}>
              <td>{truncate(userEvent.id)}</td>
              <td>{truncate(userEvent.userId)}</td>
              <td>{truncate(userEvent.eventId)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.userEvent({ id: userEvent.id })}
                    title={'Show userEvent ' + userEvent.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editUserEvent({ id: userEvent.id })}
                    title={'Edit userEvent ' + userEvent.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete userEvent ' + userEvent.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(userEvent.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserEventsList

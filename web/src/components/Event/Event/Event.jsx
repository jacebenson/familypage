import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import 'src/lib/formatters'

const DELETE_EVENT_MUTATION = gql`
  mutation DeleteEventMutation($id: String!) {
    deleteEvent(id: $id) {
      id
    }
  }
`

const Event = ({ event }) => {
  const [deleteEvent] = useMutation(DELETE_EVENT_MUTATION, {
    onCompleted: () => {
      toast.success('Event deleted')
      navigate(routes.events())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete event ' + id + '?')) {
      deleteEvent({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Event {event.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{event.id}</td>
            </tr>
            <tr>
              <th>Title</th>
              <td>{event.title}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{event.description}</td>
            </tr>
            <tr>
              <th>Location</th>
              <td>{event.location}</td>
            </tr>
            <tr>
              <th>Url</th>
              <td>{event.url}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>{event.status}</td>
            </tr>
            <tr>
              <th>Busy status</th>
              <td>{event.busyStatus}</td>
            </tr>
            <tr>
              <th>Organizer</th>
              <td>{event.organizer}</td>
            </tr>
            <tr>
              <th>Attendees</th>
              <td>{event.attendees}</td>
            </tr>
            <tr>
              <th>Start</th>
              <td>{event.start}</td>
            </tr>
            <tr>
              <th>Duration</th>
              <td>{event.duration}</td>
            </tr>
            <tr>
              <th>Geo</th>
              <td>{event.geo}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editEvent({ id: event.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(event.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Event

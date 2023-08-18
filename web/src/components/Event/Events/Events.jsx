import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Event/EventsCell'
import { truncate } from 'src/lib/formatters'

const DELETE_EVENT_MUTATION = gql`
  mutation DeleteEventMutation($id: String!) {
    deleteEvent(id: $id) {
      id
    }
  }
`

const EventsList = ({ events }) => {
  const [deleteEvent] = useMutation(DELETE_EVENT_MUTATION, {
    onCompleted: () => {
      toast.success('Event deleted')
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
    if (confirm('Are you sure you want to delete event ' + id + '?')) {
      deleteEvent({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Description</th>
            <th>Location</th>
            <th>Url</th>
            <th>Status</th>
            <th>Busy status</th>
            <th>Organizer</th>
            <th>Attendees</th>
            <th>Start</th>
            <th>Duration</th>
            <th>Geo</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{truncate(event.id)}</td>
              <td>{truncate(event.title)}</td>
              <td>{truncate(event.description)}</td>
              <td>{truncate(event.location)}</td>
              <td>{truncate(event.url)}</td>
              <td>{truncate(event.status)}</td>
              <td>{truncate(event.busyStatus)}</td>
              <td>{truncate(event.organizer)}</td>
              <td>{truncate(event.attendees)}</td>
              <td>{truncate(event.start)}</td>
              <td>{truncate(event.duration)}</td>
              <td>{truncate(event.geo)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.event({ id: event.id })}
                    title={'Show event ' + event.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editEvent({ id: event.id })}
                    title={'Edit event ' + event.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete event ' + event.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(event.id)}
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

export default EventsList

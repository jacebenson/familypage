import { navigate, routes } from '@redwoodjs/router'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import UserEventForm from 'src/components/UserEvent/UserEventForm'

export const QUERY = gql`
  query EditUserEventById($id: String!) {
    userEvent: userEvent(id: $id) {
      id
      userId
      eventId
    }
  }
`
const UPDATE_USER_EVENT_MUTATION = gql`
  mutation UpdateUserEventMutation(
    $id: String!
    $input: UpdateUserEventInput!
  ) {
    updateUserEvent(id: $id, input: $input) {
      id
      userId
      eventId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ userEvent }) => {
  const [updateUserEvent, { loading, error }] = useMutation(
    UPDATE_USER_EVENT_MUTATION,
    {
      onCompleted: () => {
        toast.success('UserEvent updated')
        navigate(routes.userEvents())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input, id) => {
    updateUserEvent({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit UserEvent {userEvent?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <UserEventForm
          userEvent={userEvent}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}

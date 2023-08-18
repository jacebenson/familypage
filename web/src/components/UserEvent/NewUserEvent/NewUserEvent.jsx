import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import UserEventForm from 'src/components/UserEvent/UserEventForm'

const CREATE_USER_EVENT_MUTATION = gql`
  mutation CreateUserEventMutation($input: CreateUserEventInput!) {
    createUserEvent(input: $input) {
      id
    }
  }
`

const NewUserEvent = () => {
  const [createUserEvent, { loading, error }] = useMutation(
    CREATE_USER_EVENT_MUTATION,
    {
      onCompleted: () => {
        toast.success('UserEvent created')
        navigate(routes.userEvents())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input) => {
    createUserEvent({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New UserEvent</h2>
      </header>
      <div className="rw-segment-main">
        <UserEventForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewUserEvent

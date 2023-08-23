import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import FamilyForm from 'src/components/Family/FamilyForm'

const CREATE_FAMILY_MUTATION_MODAL = gql`
  mutation CreateFamilyMutation($input: CreateFamilyInput!) {
    createFamily(input: $input) {
      id
    }
  }
`

const NewFamilyModal = ({redirect}) => {
  const [createFamily, { loading, error }] = useMutation(
    CREATE_FAMILY_MUTATION_MODAL,
    {
      onCompleted: (family) => {
        toast.success('Family created')
        console.log({family})
        navigate(routes.calendarWithId({familyId: family.createFamily.id}))
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input) => {
    createFamily({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Family</h2>
      </header>
      <div className="rw-segment-main">
        <FamilyForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewFamilyModal

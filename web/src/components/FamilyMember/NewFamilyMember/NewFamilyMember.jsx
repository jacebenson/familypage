import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import FamilyMemberForm from 'src/components/FamilyMember/FamilyMemberForm'

const CREATE_FAMILY_MEMBER_MUTATION = gql`
  mutation CreateFamilyMemberMutation($input: CreateFamilyMemberInput!) {
    createFamilyMember(input: $input) {
      id
    }
  }
`

const NewFamilyMember = () => {
  const [createFamilyMember, { loading, error }] = useMutation(
    CREATE_FAMILY_MEMBER_MUTATION,
    {
      onCompleted: () => {
        toast.success('FamilyMember created')
        navigate(routes.familyMembers())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input) => {
    createFamilyMember({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New FamilyMember</h2>
      </header>
      <div className="rw-segment-main">
        <FamilyMemberForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewFamilyMember

import { navigate, routes } from '@redwoodjs/router'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import FamilyMemberForm from 'src/components/FamilyMember/FamilyMemberForm'

export const QUERY = gql`
  query EditFamilyMemberById($id: String!) {
    familyMember: familyMember(id: $id) {
      id
      familyId
      userId
      admin
    }
  }
`
const UPDATE_FAMILY_MEMBER_MUTATION = gql`
  mutation UpdateFamilyMemberMutation(
    $id: String!
    $input: UpdateFamilyMemberInput!
  ) {
    updateFamilyMember(id: $id, input: $input) {
      id
      familyId
      userId
      admin
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ familyMember }) => {
  const [updateFamilyMember, { loading, error }] = useMutation(
    UPDATE_FAMILY_MEMBER_MUTATION,
    {
      onCompleted: () => {
        toast.success('FamilyMember updated')
        navigate(routes.familyMembers())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input, id) => {
    updateFamilyMember({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit FamilyMember {familyMember?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <FamilyMemberForm
          familyMember={familyMember}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}

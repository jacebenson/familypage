import FamilyMember from 'src/components/FamilyMember/FamilyMember'

export const QUERY = gql`
  query FindFamilyMemberById($id: String!) {
    familyMember: familyMember(id: $id) {
      id
      familyId
      userId
      admin
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>FamilyMember not found</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ familyMember }) => {
  return <FamilyMember familyMember={familyMember} />
}

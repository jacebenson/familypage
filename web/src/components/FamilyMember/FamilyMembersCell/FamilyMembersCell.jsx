import { Link, routes } from '@redwoodjs/router'

import FamilyMembers from 'src/components/FamilyMember/FamilyMembers'

export const QUERY = gql`
  query FindFamilyMembers {
    familyMembers {
      id
      familyId
      userId
      headOfHousehold
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No familyMembers yet. '}
      <Link to={routes.newFamilyMember()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ familyMembers }) => {
  return <FamilyMembers familyMembers={familyMembers} />
}

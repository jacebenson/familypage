import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/FamilyMember/FamilyMembersCell'
import { checkboxInputTag, truncate } from 'src/lib/formatters'

const DELETE_FAMILY_MEMBER_MUTATION = gql`
  mutation DeleteFamilyMemberMutation($id: String!) {
    deleteFamilyMember(id: $id) {
      id
    }
  }
`

const FamilyMembersList = ({ familyMembers }) => {
  const [deleteFamilyMember] = useMutation(DELETE_FAMILY_MEMBER_MUTATION, {
    onCompleted: () => {
      toast.success('FamilyMember deleted')
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
    if (confirm('Are you sure you want to delete familyMember ' + id + '?')) {
      deleteFamilyMember({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Family id</th>
            <th>User id</th>
            <th>Admin</th>
            <th>Invite code</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {familyMembers.map((familyMember) => (
            <tr key={familyMember.id}>
              <td>{truncate(familyMember.id)}</td>
              <td>{truncate(familyMember.familyId)}</td>
              <td>{truncate(familyMember.userId)}</td>
              <td>{checkboxInputTag(familyMember.admin)}</td>
              <td>{truncate(familyMember.inviteCode)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.familyMember({ id: familyMember.id })}
                    title={'Show familyMember ' + familyMember.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editFamilyMember({ id: familyMember.id })}
                    title={'Edit familyMember ' + familyMember.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete familyMember ' + familyMember.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(familyMember.id)}
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

export default FamilyMembersList

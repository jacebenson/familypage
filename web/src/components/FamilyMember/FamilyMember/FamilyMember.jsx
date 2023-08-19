import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { checkboxInputTag } from 'src/lib/formatters'

const DELETE_FAMILY_MEMBER_MUTATION = gql`
  mutation DeleteFamilyMemberMutation($id: String!) {
    deleteFamilyMember(id: $id) {
      id
    }
  }
`

const FamilyMember = ({ familyMember }) => {
  const [deleteFamilyMember] = useMutation(DELETE_FAMILY_MEMBER_MUTATION, {
    onCompleted: () => {
      toast.success('FamilyMember deleted')
      navigate(routes.familyMembers())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete familyMember ' + id + '?')) {
      deleteFamilyMember({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            FamilyMember {familyMember.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{familyMember.id}</td>
            </tr>
            <tr>
              <th>Family id</th>
              <td>{familyMember.familyId}</td>
            </tr>
            <tr>
              <th>User id</th>
              <td>{familyMember.userId}</td>
            </tr>
            <tr>
              <th>Head of household</th>
              <td>{checkboxInputTag(familyMember.headOfHousehold)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editFamilyMember({ id: familyMember.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(familyMember.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default FamilyMember

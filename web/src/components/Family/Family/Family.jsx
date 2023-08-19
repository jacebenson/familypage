import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import 'src/lib/formatters'

const DELETE_FAMILY_MUTATION = gql`
  mutation DeleteFamilyMutation($id: String!) {
    deleteFamily(id: $id) {
      id
    }
  }
`

const Family = ({ family }) => {
  const [deleteFamily] = useMutation(DELETE_FAMILY_MUTATION, {
    onCompleted: () => {
      toast.success('Family deleted')
      navigate(routes.families())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete family ' + id + '?')) {
      deleteFamily({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Family {family.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{family.id}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{family.name}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{family.description}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editFamily({ id: family.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(family.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Family

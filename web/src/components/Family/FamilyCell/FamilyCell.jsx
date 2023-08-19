import Family from 'src/components/Family/Family'

export const QUERY = gql`
  query FindFamilyById($id: String!) {
    family: family(id: $id) {
      id
      name
      description
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Family not found</div>

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ family }) => {
  return <Family family={family} />
}

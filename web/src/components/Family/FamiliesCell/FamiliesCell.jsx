import { Link, routes } from '@redwoodjs/router'

import Families from 'src/components/Family/Families'

export const QUERY = gql`
  query FindFamilies {
    families {
      id
      name
      description
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No families yet. '}
      <Link to={routes.newFamily()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ families }) => {
  return <Families families={families} />
}

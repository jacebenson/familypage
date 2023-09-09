import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import EditEventCell from 'src/components/EditEventCell'

const EditEventPublicPage = ({id}) => {
  return (
    <>
      <MetaTags title="EditEventPublic" description="EditEventPublic page" />
      <EditEventCell
        id={id}
        redirect={false}
        editMode={true}
      />
    </>
  )
}

export default EditEventPublicPage

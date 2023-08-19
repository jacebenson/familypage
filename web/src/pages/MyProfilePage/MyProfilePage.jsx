import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import ProfileCell from 'src/components/ProfileCell'
import { useAuth } from 'src/auth'
const MyProfilePage = () => {
  const { currentUser } = useAuth()
  return (
    <>
      <MetaTags title="MyProfile" description="MyProfile page" />

      <ProfileCell id={currentUser.id} />
    </>
  )
}

export default MyProfilePage

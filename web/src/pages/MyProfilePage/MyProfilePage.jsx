import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import ProfileCell from 'src/components/ProfileCell'
import { useAuth } from 'src/auth'
import { Text } from '@chakra-ui/react'
import FamilyMembersCell from 'src/components/FamilyMembersCell'
const MyProfilePage = () => {
  const { currentUser } = useAuth()
  let familyId = currentUser?.FamilyMember[0]?.Family?.id
  let familyName = currentUser?.FamilyMember[0]?.Family?.name
  let isAdmin = currentUser?.FamilyMember[0]?.admin
  return (
    <>
      <MetaTags title="MyProfile" description="MyProfile page" />

      <ProfileCell id={currentUser.id} />
    </>
  )
}

export default MyProfilePage

import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import FamilyMembersCell from 'src/components/FamilyMembersCell'
import { useAuth } from 'src/auth'
const InviteToFamilyPage = () => {
  const { currentUser } = useAuth()
  let familyId = currentUser?.FamilyMember[0]?.Family?.id
  return (
    <>
      <MetaTags title="InviteToFamily" description="InviteToFamily page" />

      <FamilyMembersCell familyId={familyId} />
    </>
  )
}

export default InviteToFamilyPage

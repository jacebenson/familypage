import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import FamilyMembersCell from 'src/components/FamilyMembersCell'
import InviteMember from "src/components/InviteMember"
import { useAuth } from 'src/auth'
import { useParams } from '@redwoodjs/router'
const InviteToFamilyPage = () => {
  const { currentUser } = useAuth()
  let familyId = currentUser?.FamilyMember[0]?.Family?.id
  let urlFamilyId = useParams().familyId
  let id = familyId || urlFamilyId
  return (
    <>
      <MetaTags title="InviteToFamily" description="InviteToFamily page" />
      <FamilyMembersCell familyId={id} />
    </>
  )
}

export default InviteToFamilyPage

import { Button, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react"
import { useMutation } from "@redwoodjs/web"
import { toast } from "@redwoodjs/web/toast"
import InviteMemberForm from "src/components/FamilyMember/FamilyMemberForm/InviteMemberForm"
import { navigate, routes } from "@redwoodjs/router"
let CREATE_INVITE_MUTATION = gql`
    mutation createMemberInvite($email: String, $name: String) {
      createMemberInvite(input: {email: $email, name: $name}) {
        id
        familyId
        userId
        admin
      }
    }
  `


const InviteMember = ({familyId, refresh}) => {
  // this is a single text input field that will
  // create a user with the email address entered
  // create a familyMember with the user id and family id

  const [createInvite, { loading, error }] = useMutation(CREATE_INVITE_MUTATION, {
    onCompleted: (data) => {
      toast.success('Invite sent')
      navigate(routes.calendar())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
  const onSave = (input) => {
    console.log({
      method: 'InviteMember.onSave',
      input })
    createInvite({ variables: { ...input } })

  }


  return (
    <div>
      <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">Invite FamilyMember</h2>
      </header>
      <div className="rw-segment-main">
      <InviteMemberForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
    </div>

  )
}

export default InviteMember

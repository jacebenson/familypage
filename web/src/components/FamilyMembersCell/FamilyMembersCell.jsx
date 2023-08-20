import { Box, Code, Table, Thead, Th, Tbody, Tr, Td, Button } from "@chakra-ui/react"
import InviteMember from "../InviteMember/InviteMember"
import { useAuth } from "src/auth"
import { useMutation } from '@redwoodjs/web'
export const QUERY = gql`
  query FamilyMembersQuery($familyId: String) {
    familyMembersByFamily (familyId: $familyId) {
      id
      admin
      inviteCode
      User {
        name
      }
    }
  }
`

export const DELETE_MEMBER_MUTATION = gql`
  mutation DeleteFamilyMemberMutation($id: String!) {
    deleteFamilyMember(id: $id) {
      id
    }
  }
`
export const beforeQuery = (props) => {
  // now i'm expecting a familyId
  return {
    variables: { familyId: props?.familyId },
    fetchPolicy: 'no-cache',
  }
}

export const Loading = () => <div>Loading...</div>

export const Empty = ({familyId}) => <InviteMember familyId={familyId} />

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ familyMembersByFamily, familyId }) => {
  const { currentUser } = useAuth()
  const [deleteFamilyMember] = useMutation(DELETE_MEMBER_MUTATION, {
    onCompleted: () => {
      toast.success('FamilyMember deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete familyMember ' + id + '?')) {
      deleteFamilyMember({ variables: { id } })
    }
  }
  return (
    <Box>
      <InviteMember familyId={familyId} />
      {/*<Code whiteSpace={'pre-wrap'}>
        {JSON.stringify(familyMembersByFamily,' ',2)}
      </Code>*/}
      {/**Lets make a quick table */}
      <Table>
        <Thead>
          <Tr>
          <Th>Name</Th>
          <Th>Invite Code</Th>
          {currentUser?.FamilyMember[0]?.admin ? <Th>Action</Th> : null}
          </Tr>
        </Thead>
        <Tbody>
          {familyMembersByFamily.map((familyMember) => (
            <Tr key={familyMember.id}>
              <Td>{familyMember.User.name}</Td>
              <Td>{familyMember.inviteCode}</Td>
              {currentUser?.FamilyMember[0]?.admin && (
                <Td>
                  <Button
                  colorScheme="red"
                  onClick={() => onDeleteClick(familyMember.id)}
                  >
                    Delete
                  </Button>
                </Td>
              )}

            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}

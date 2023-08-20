import { useMutation, useQuery } from '@redwoodjs/web'
import { useState } from 'react'
import { toast } from '@redwoodjs/web/toast'
import { Box, Button, Flex, Input } from '@chakra-ui/react'
import UserForm from 'src/components/User/UserForm'
import { navigate, routes } from '@redwoodjs/router'
export const QUERY = gql`
  query FindProfileQuery($id: String!) {
    profile: user(id: $id) {
      id
      name
      email

    }
  }
`
export const UPDATE_USERPROFILE_MUTATION = gql`
  mutation UpdateUserMutation($id: String!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      email
      name
    }
  }
`
export const beforeQuery = ({ id }) => {
  return { variables: { id } }
}
export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ profile }) => {
  const [updateUser, { loading, error }] = useMutation(UPDATE_USERPROFILE_MUTATION, {
    onCompleted: () => {
      toast.success('User updated')
      navigate(routes.calendar())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSave = (input, id) => {
    updateUser({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Update Profile
        </h2>
      </header>
      <div className="rw-segment-main">
        <UserForm user={profile} onSave={onSave} error={error} loading={loading} />
      </div>
      <div className="rw-segment-main">
        If you want to change your password, follow the forgot password link after you logout.
      </div>
    </div>
  )
}

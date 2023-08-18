export const schema = gql`
  type UserEvent {
    id: String!
    userId: String!
    eventId: String!
    user: User!
    event: Event!
  }

  type Query {
    userEvents: [UserEvent!]! @requireAuth
    userEvent(id: String!): UserEvent @requireAuth
  }

  input CreateUserEventInput {
    userId: String!
    eventId: String!
  }

  input UpdateUserEventInput {
    userId: String
    eventId: String
  }

  type Mutation {
    createUserEvent(input: CreateUserEventInput!): UserEvent! @requireAuth
    updateUserEvent(id: String!, input: UpdateUserEventInput!): UserEvent!
      @requireAuth
    deleteUserEvent(id: String!): UserEvent! @requireAuth
  }
`

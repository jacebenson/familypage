export const schema = gql`
  type User {
    id: String!
    email: String!
    name: String
    salt: String!
    hashedPassword: String!
    resetToken: String
    resetTokenExpiresAt: DateTime
    UserEvent: [UserEvent]!
    FamilyMember: [FamilyMember]!
    roles: String
  }

  type Query {
    users: [User!]! @requireAuth
    user(id: String!): User @requireAuth
  }

  input CreateUserInput {
    email: String!
    name: String
    salt: String!
    hashedPassword: String!
    resetToken: String
    resetTokenExpiresAt: DateTime
    roles: String
  }

  input UpdateUserInput {
    email: String
    name: String
    salt: String
    hashedPassword: String
    resetToken: String
    resetTokenExpiresAt: DateTime
    roles: String
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: String!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: String!): User! @requireAuth
  }
`

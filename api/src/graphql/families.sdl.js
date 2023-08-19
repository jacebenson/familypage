export const schema = gql`
  type Family {
    id: String!
    name: String!
    description: String
    FamilyMember: [FamilyMember]!
  }

  type Query {
    families: [Family!]! @requireAuth
    family(id: String!): Family @requireAuth
  }

  input CreateFamilyInput {
    name: String!
    description: String
  }

  input UpdateFamilyInput {
    name: String
    description: String
  }

  type Mutation {
    createFamily(input: CreateFamilyInput!): Family! @requireAuth
    updateFamily(id: String!, input: UpdateFamilyInput!): Family! @requireAuth
    deleteFamily(id: String!): Family! @requireAuth
  }
`

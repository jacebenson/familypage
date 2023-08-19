export const schema = gql`
  type FamilyMember {
    id: String!
    familyId: String!
    userId: String!
    headOfHousehold: Boolean!
    family: Family!
    user: User!
  }

  type Query {
    familyMembers: [FamilyMember!]! @requireAuth
    familyMember(id: String!): FamilyMember @requireAuth
  }

  input CreateFamilyMemberInput {
    familyId: String!
    userId: String!
    headOfHousehold: Boolean!
  }

  input UpdateFamilyMemberInput {
    familyId: String
    userId: String
    headOfHousehold: Boolean
  }

  type Mutation {
    createFamilyMember(input: CreateFamilyMemberInput!): FamilyMember!
      @requireAuth
    updateFamilyMember(
      id: String!
      input: UpdateFamilyMemberInput!
    ): FamilyMember! @requireAuth
    deleteFamilyMember(id: String!): FamilyMember! @requireAuth
  }
`

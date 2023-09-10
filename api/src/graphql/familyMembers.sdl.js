export const schema = gql`
  type FamilyMember {
    id: String!
    familyId: String!
    userId: String!
    admin: Boolean!
    Family: Family!
    User: User!
  }

  type Query {
    familyMembers: [FamilyMember!]! @requireAuth
    familyMembersByFamily(familyId: String): [FamilyMember!]! @requireAuth
    familyMember(id: String!): FamilyMember @requireAuth
  }

  input CreateFamilyMemberInput {
    familyId: String!
    userId: String!
    admin: Boolean!
  }

  input UpdateFamilyMemberInput {
    familyId: String
    userId: String
    admin: Boolean
  }

  input CreateMemberInviteInput {
    email: String!
  }
  input CreateFamilyMemberInviteInput {
    email: String
    name: String
  }

  type Mutation {
    createMemberInvite(
      input: CreateFamilyMemberInviteInput!
    ): FamilyMember @requireAuth
    createFamilyMember(
      input: CreateFamilyMemberInput!
    ): FamilyMember! @requireAuth
    updateFamilyMember(
      id: String!
      input: UpdateFamilyMemberInput!
    ): FamilyMember! @requireAuth
    deleteFamilyMember(id: String!): FamilyMember! @requireAuth
  }
`

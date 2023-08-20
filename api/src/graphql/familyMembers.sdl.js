export const schema = gql`
  type FamilyMember {
    id: String!
    familyId: String!
    userId: String!
    admin: Boolean!
    inviteCode: String!
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
    inviteCode: String!
  }

  input UpdateFamilyMemberInput {
    familyId: String
    userId: String
    admin: Boolean
    inviteCode: String
  }

  input CreateMemberInviteInput {
    email: String!
    familyId: String!
  }

  type Mutation {
    createMemberInvite(
      input: CreateMemberInviteInput!
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

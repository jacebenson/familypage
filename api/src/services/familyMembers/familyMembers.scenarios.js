export const standard = defineScenario({
  familyMember: {
    one: {
      data: {
        inviteCode: 'String',
        Family: { create: { name: 'String' } },
        User: {
          create: {
            email: 'String8919493',
            salt: 'String',
            hashedPassword: 'String',
          },
        },
      },
    },
    two: {
      data: {
        inviteCode: 'String',
        Family: { create: { name: 'String' } },
        User: {
          create: {
            email: 'String5499943',
            salt: 'String',
            hashedPassword: 'String',
          },
        },
      },
    },
  },
})

export const standard = defineScenario({
  familyMember: {
    one: {
      data: {
        family: { create: { name: 'String' } },
        user: {
          create: {
            email: 'String3606065',
            salt: 'String',
            hashedPassword: 'String',
          },
        },
      },
    },
    two: {
      data: {
        family: { create: { name: 'String' } },
        user: {
          create: {
            email: 'String647320',
            salt: 'String',
            hashedPassword: 'String',
          },
        },
      },
    },
  },
})

export const standard = defineScenario({
  userEvent: {
    one: {
      data: {
        User: {
          create: {
            email: 'String5180520',
            salt: 'String',
            hashedPassword: 'String',
          },
        },
        Event: {
          create: {
            title: 'String',
            status: 'String',
            busyStatus: 'String',
            organizer: 'String',
            start: 'String',
            duration: 'String',
          },
        },
      },
    },
    two: {
      data: {
        User: {
          create: {
            email: 'String2088122',
            salt: 'String',
            hashedPassword: 'String',
          },
        },
        Event: {
          create: {
            title: 'String',
            status: 'String',
            busyStatus: 'String',
            organizer: 'String',
            start: 'String',
            duration: 'String',
          },
        },
      },
    },
  },
})

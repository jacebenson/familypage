export const standard = defineScenario({
  userEvent: {
    one: {
      data: {
        user: { create: { email: 'String3079309' } },
        event: {
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
        user: { create: { email: 'String9237939' } },
        event: {
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

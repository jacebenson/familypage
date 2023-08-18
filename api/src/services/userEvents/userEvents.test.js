import {
  userEvents,
  userEvent,
  createUserEvent,
  updateUserEvent,
  deleteUserEvent,
} from './userEvents'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('userEvents', () => {
  scenario('returns all userEvents', async (scenario) => {
    const result = await userEvents()

    expect(result.length).toEqual(Object.keys(scenario.userEvent).length)
  })

  scenario('returns a single userEvent', async (scenario) => {
    const result = await userEvent({ id: scenario.userEvent.one.id })

    expect(result).toEqual(scenario.userEvent.one)
  })

  scenario('creates a userEvent', async (scenario) => {
    const result = await createUserEvent({
      input: {
        userId: scenario.userEvent.two.userId,
        eventId: scenario.userEvent.two.eventId,
      },
    })

    expect(result.userId).toEqual(scenario.userEvent.two.userId)
    expect(result.eventId).toEqual(scenario.userEvent.two.eventId)
  })

  scenario('updates a userEvent', async (scenario) => {
    const original = await userEvent({
      id: scenario.userEvent.one.id,
    })
    const result = await updateUserEvent({
      id: original.id,
      input: { userId: scenario.userEvent.two.userId },
    })

    expect(result.userId).toEqual(scenario.userEvent.two.userId)
  })

  scenario('deletes a userEvent', async (scenario) => {
    const original = await deleteUserEvent({
      id: scenario.userEvent.one.id,
    })
    const result = await userEvent({ id: original.id })

    expect(result).toEqual(null)
  })
})

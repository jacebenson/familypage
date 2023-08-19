import {
  familyMembers,
  familyMember,
  createFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
} from './familyMembers'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('familyMembers', () => {
  scenario('returns all familyMembers', async (scenario) => {
    const result = await familyMembers()

    expect(result.length).toEqual(Object.keys(scenario.familyMember).length)
  })

  scenario('returns a single familyMember', async (scenario) => {
    const result = await familyMember({ id: scenario.familyMember.one.id })

    expect(result).toEqual(scenario.familyMember.one)
  })

  scenario('creates a familyMember', async (scenario) => {
    const result = await createFamilyMember({
      input: {
        familyId: scenario.familyMember.two.familyId,
        userId: scenario.familyMember.two.userId,
      },
    })

    expect(result.familyId).toEqual(scenario.familyMember.two.familyId)
    expect(result.userId).toEqual(scenario.familyMember.two.userId)
  })

  scenario('updates a familyMember', async (scenario) => {
    const original = await familyMember({
      id: scenario.familyMember.one.id,
    })
    const result = await updateFamilyMember({
      id: original.id,
      input: { familyId: scenario.familyMember.two.familyId },
    })

    expect(result.familyId).toEqual(scenario.familyMember.two.familyId)
  })

  scenario('deletes a familyMember', async (scenario) => {
    const original = await deleteFamilyMember({
      id: scenario.familyMember.one.id,
    })
    const result = await familyMember({ id: original.id })

    expect(result).toEqual(null)
  })
})

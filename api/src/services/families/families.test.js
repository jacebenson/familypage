import {
  families,
  family,
  createFamily,
  updateFamily,
  deleteFamily,
} from './families'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('families', () => {
  scenario('returns all families', async (scenario) => {
    const result = await families()

    expect(result.length).toEqual(Object.keys(scenario.family).length)
  })

  scenario('returns a single family', async (scenario) => {
    const result = await family({ id: scenario.family.one.id })

    expect(result).toEqual(scenario.family.one)
  })

  scenario('creates a family', async () => {
    const result = await createFamily({
      input: { name: 'String' },
    })

    expect(result.name).toEqual('String')
  })

  scenario('updates a family', async (scenario) => {
    const original = await family({ id: scenario.family.one.id })
    const result = await updateFamily({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a family', async (scenario) => {
    const original = await deleteFamily({
      id: scenario.family.one.id,
    })
    const result = await family({ id: original.id })

    expect(result).toEqual(null)
  })
})

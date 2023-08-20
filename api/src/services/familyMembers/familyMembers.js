import { db } from 'src/lib/db'

let randomString = (length) => {
  let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

export const familyMembersByFamily = async ({familyId}) => {
  if(!familyId) return []
  let members = await db.familyMember.findMany({
    where: { familyId },
    include: { User: true },
  })
  return members
}

export const createMemberInvite = async ({ input }) => {
  console.log({ message: 'Running createMemberInvite', input })
  let { email, familyId } = input
  console.log({
    message: 'Running createMemberInvite with email and familyId',
    input
  })
  if(!email) return null
  let user = await db.user.findUnique({
    where: { email },
  })
  if(user) {
    // create familyMember
    let familyMember = await db.familyMember.create({
      data: {
        familyId,
        userId: user.id,
        admin: false,
        inviteCode: randomString(4),
      },
    })
    return familyMember
  }
  if(!user) {
    // create user
    let user = await db.user.create({
      data: {
        email,
        name: email.split('@')[0],
        salt: randomString(4),
        hashedPassword: randomString(4),

      },
    })
    // create familyMember
    let familyMember = await db.familyMember.create({
      data: {
        familyId,
        userId: user.id,
        admin: false,
        inviteCode: randomString(4),
      },
    })
    return familyMember
  }
  return null
}

export const familyMembers = () => {
    return db.familyMember.findMany()

}

export const familyMember = ({ id }) => {
  return db.familyMember.findUnique({
    where: { id },
  })
}

export const createFamilyMember = ({ input }) => {
  return db.familyMember.create({
    data: input,
  })
}

export const updateFamilyMember = ({ id, input }) => {
  return db.familyMember.update({
    data: input,
    where: { id },
  })
}

export const deleteFamilyMember = ({ id }) => {
  return db.familyMember.delete({
    where: { id },
  })
}

export const FamilyMember = {
  Family: (_obj, { root }) => {
    return db.familyMember.findUnique({ where: { id: root?.id } }).Family()
  },
  User: (_obj, { root }) => {
    return db.familyMember.findUnique({ where: { id: root?.id } }).User()
  },
}

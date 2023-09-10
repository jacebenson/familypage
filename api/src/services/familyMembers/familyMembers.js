import { db } from 'src/lib/db'
import { createId } from '@paralleldrive/cuid2';
import CryptoJS from 'crypto-js'
let randomString = (length) => {
  let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}
let randomNumber = (() => {
  let random = CryptoJS.lib.WordArray.random(6)
  let randomString = random.toString()
  let sixDigitNumber = randomString.replace(/\D/g, '')
  if (sixDigitNumber.length < 6) {
    sixDigitNumber = sixDigitNumber.padStart(6, '0')
  }
  if (sixDigitNumber.length > 6) {
    sixDigitNumber = sixDigitNumber.slice(0, 6)
  }
  return sixDigitNumber.toString()
})()
let salt = CryptoJS.lib.WordArray.random(30).toString()
let loginToken = CryptoJS.PBKDF2(randomNumber, salt, {
  keySize: 256 / 32,
}).toString()
let loginTokenExpiresAt = new Date()
loginTokenExpiresAt.setMinutes(loginTokenExpiresAt.getMinutes() + 120)
let hashedPassword = CryptoJS.PBKDF2(randomString(10), salt, {
  keySize: 256 / 32,
}).toString()
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
  let { name, email } = input
  let isUser = await db.user.findUnique({
    where: { email },
  })
  let familyId = context.currentUser?.FamilyMember[0]?.Family?.id
  if (isUser) {
    // create familyMember
    let familyMember = await db.familyMember.create({
      data: {
        familyId,
        userId: isUser.id,
        admin: false,
      },
    })
    return familyMember
  }
  if (!isUser) {
    // create user
    // if there is no email, then generate one
    if (!email) {
      //create the user with a random email
      let cuid = createId()
      email = `${name}-${cuid}@example.com`
      let user = await db.user.create({
        data: {
          email,
          name,
          id: cuid,
          salt,
          hashedPassword,
        },
      })
      // create familyMember
      let familyMember = await db.familyMember.create({
        data: {
          admin: false,
          Family: {
            connect: {
              id: familyId,
            },
          },
          User: {
            connect: {
              id: user.id,
            },
          },
        },
      })
      return familyMember
    }
    if (email) {
      //create the user with the email
      let user = await db.user.create({
        data: {
          email,
          name,
          salt,
          hashedPassword,
          resetToken: loginToken,
          resetTokenExpiresAt: loginTokenExpiresAt,
        },
      })
      // create familyMember
      let familyMember = await db.familyMember.create({
        data: {
          familyId,
          userId: user.id,
          admin: false,
        },
      })
      return familyMember
    }
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
  // if there is only one familyMember, then don't delete it
  let familyMembers = db.familyMember.findMany()
  if(familyMembers.length == 1) return null
  // if there is only one admin, then don't delete it
  let familyMember = db.familyMember.findUnique({ where: { id } })
  if(familyMember.admin) return null

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

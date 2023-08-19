import { db } from 'src/lib/db'

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
  family: (_obj, { root }) => {
    return db.familyMember.findUnique({ where: { id: root?.id } }).family()
  },
  user: (_obj, { root }) => {
    return db.familyMember.findUnique({ where: { id: root?.id } }).user()
  },
}

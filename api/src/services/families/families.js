import { db } from 'src/lib/db'

export const families = () => {
  return db.family.findMany()
}

export const family = ({ id }) => {
  return db.family.findUnique({
    where: { id },
  })
}

export const createFamily = ({ input }) => {
  return db.family.create({
    data: input,
  })
}

export const updateFamily = ({ id, input }) => {
  return db.family.update({
    data: input,
    where: { id },
  })
}

export const deleteFamily = ({ id }) => {
  return db.family.delete({
    where: { id },
  })
}

export const Family = {
  FamilyMember: (_obj, { root }) => {
    return db.family.findUnique({ where: { id: root?.id } }).FamilyMember()
  },
}

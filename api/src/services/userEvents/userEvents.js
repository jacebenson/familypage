import { db } from 'src/lib/db'

export const userEvents = () => {
  return db.userEvent.findMany()
}

export const userEvent = ({ id }) => {
  return db.userEvent.findUnique({
    where: { id },
  })
}

export const createUserEvent = ({ input }) => {
  return db.userEvent.create({
    data: input,
  })
}

export const updateUserEvent = ({ id, input }) => {
  return db.userEvent.update({
    data: input,
    where: { id },
  })
}

export const deleteUserEvent = ({ id }) => {
  return db.userEvent.delete({
    where: { id },
  })
}

export const UserEvent = {
  user: (_obj, { root }) => {
    return db.userEvent.findUnique({ where: { id: root?.id } }).user()
  },
  event: (_obj, { root }) => {
    return db.userEvent.findUnique({ where: { id: root?.id } }).event()
  },
}

import { db } from 'src/lib/db'

export const users = () => {
  return db.user.findMany()
}

export const user = ({ id }) => {
  return db.user.findUnique({
    where: { id },
  })
}

export const createUser = async ({ input }) => {
  console.log({
    function: "createUser",
    input
  })
  let users = await db.user.findMany()
  // if there are no other users, make this user an admin
  if(users.length === 0) {
    input.roles = "admin"
  }
  console.log({
    function: "createUser",
    input,
    users
  })
  let user = db.user.create({
    data: input,
  })
  return user
}

export const updateUser = async ({ id, input }) => {
  // if there is only one user, make sure they are an admin
  let users = await db.user.findMany()
  if(users.length === 1) {
    input.roles = "admin"
  } else {
    input.roles = "user"
  }
  //if there is an admin, set the current user to a user
  let admins = await db.user.findMany({
    where: { roles: "admin" }
  })
  if(admins.length > 0) {
    input.roles = "user"
  }
  let user = db.user.update({
    data: input,
    where: { id },
  })

  return user
}

export const deleteUser = ({ id }) => {
  return db.user.delete({
    where: { id },
  })
}

export const User = {
  UserEvent: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).UserEvent()
  },
  FamilyMember: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).FamilyMember()
  },
}

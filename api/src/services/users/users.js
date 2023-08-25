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
  // if there's an admin, don't let anyone else be an admin
  // also don't let the user remove their own admin role
  let admins = await db.user.findMany({
    where: { roles: "admin" }
  })
  if(admins.length > 0 && input.roles === "admin") {
    input.roles = "user"
  }
  let thisUser = await db.user.findUnique({
    where: { id },
  })
  if(thisUser.roles === "admin" && input.roles !== "admin") {
    input.roles = "admin"
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

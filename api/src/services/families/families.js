import { db } from 'src/lib/db'


export const families = () => {
  return db.family.findMany()
}

export const family = ({ id }) => {
  return db.family.findUnique({
    where: { id },
  })
}

export const createFamily = async ({ input }) => {
  // consider the logged in person
  // if they are not in a family, then they are the admin
  let currentUser = context.currentUser
  // we can tell if they don'thave a family by their # of memberships
  let userNeedsFamily = currentUser.FamilyMember.length === 0
  if(userNeedsFamily){
    // create the family
    // then create a memberhsip
    let family = await db.family.create({
      data: input,
    })
    await db.familyMember.create({
      data: {
        familyId: family.id,
        userId: currentUser.id,
        admin: true,
      }
    })
    // create event that is the family calendar
    let today = new Date()
    let [year, month, day, hour, minute] = [today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes()]
    let start = [year, month, day, hour, minute]
    let duration = { hours: 1, minutes: 0 }
    let status = 'confirmed'
    let busyStatus = 'busy'
    let organizer = currentUser.email
    await db.event.create({

      data: {
        title: `${family.name} Joined Family Page`,
        description: `This is the family calendar for ${family.name}`,
        start: JSON.stringify(start),
        duration: JSON.stringify(duration),
        status,
        busyStatus,
        organizer,
        familyId: family.id,
      }
    })




    return family
  }
  if(!userNeedsFamily){
    return db.family.create({
      data: input,
    })
  }
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
  Event: (_obj, { root }) => {
    return db.family.findUnique({ where: { id: root?.id } }).Event()
  },
}

import { db } from 'src/lib/db'

export const eventsByFamily = async ({ familyId }) => {
  if (!familyId) return []
  let events = await db.event.findMany({
    where: { familyId },
  })
  return events
}


export const events = () => {
  return db.event.findMany()
}

export const event = ({ id }) => {
  return db.event.findUnique({
    where: { id },
  })
}

export const createEvent = async ({ input }) => {
  let event = await db.event.create({
    data: input,
  })
  // now we have the event, we need to append the description w/ the link
  // using the event.id
  console.log({event})
  let description = input.description
  let link = `https://familypage.jace.pro/edit-event/${event.id}`
  if(description) {
    description = `${description}\n\n${link}`
  }
  if(!description) {
    description = link
  }

  let updatedEvent = await db.event.update({
    where: { id: event.id },
    data: {
      description
    },
  })
  return {
    ...event,
    description
  }
}
export const createEventWithAttendees = async ({ input }) => {
  let { attendees, ...event } = input
  let newEvent = await db.event.create({
    data: event,
  })
  if (attendees) {
    let userEvents = attendees.map((userId) => {
      return {
        userId,
        eventId: newEvent.id,
      }
    })
    await db.userEvent.createMany({
      data: userEvents,
    })
  }
  return newEvent
}


export const updateEvent = ({ id, input }) => {
  return db.event.update({
    data: input,
    where: { id },
  })
}

export const deleteEvent = ({ id }) => {
  return db.event.delete({
    where: { id },
  })
}

export const Event = {
  UserEvent: (_obj, { root }) => {
    return db.event.findUnique({ where: { id: root?.id } }).UserEvent()
  },
  Family: (_obj, { root }) => {
    return db.event.findUnique({ where: { id: root?.id } }).Family()
  },
}

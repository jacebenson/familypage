export const schema = gql`
  type Event {
    id: String!
    title: String!
    description: String
    location: String
    url: String
    status: String!
    busyStatus: String!
    organizer: String!
    attendees: String
    start: String!
    duration: String!
    geo: String
    UserEvent: [UserEvent]!
    Family: Family
    familyId: String
  }

  type Query {
    events: [Event!]! @requireAuth
    eventsByFamily(familyId: String!): [Event!]! @requireAuth
    event(id: String!): Event @requireAuth
  }

  input CreateEventInput {
    title: String!
    description: String
    location: String
    url: String
    status: String!
    busyStatus: String!
    organizer: String!
    attendees: String
    start: String!
    duration: String!
    geo: String
    familyId: String
  }
  input CreateEventWithAttendeesInput {
    title: String!
    description: String
    location: String
    url: String
    status: String!
    busyStatus: String!
    organizer: String!
    attendees: [String]
    start: String!
    duration: String!
    geo: String
    familyId: String
  }


  input UpdateEventInput {
    id: String
    title: String
    description: String
    location: String
    url: String
    status: String
    busyStatus: String
    organizer: String
    attendees: String
    start: String
    duration: String
    geo: String
    familyId: String
  }

  type Mutation {
    createEvent(input: CreateEventInput!): Event! @requireAuth
    createEventWithAttendees(input: CreateEventWithAttendeesInput!): Event! @requireAuth
    updateEvent(id: String!, input: UpdateEventInput!): Event! @requireAuth
    deleteEvent(id: String!): Event! @requireAuth
  }
`

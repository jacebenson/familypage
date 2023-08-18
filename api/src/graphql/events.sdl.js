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
  }

  type Query {
    events: [Event!]! @requireAuth
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
  }

  input UpdateEventInput {
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
  }

  type Mutation {
    createEvent(input: CreateEventInput!): Event! @requireAuth
    updateEvent(id: String!, input: UpdateEventInput!): Event! @requireAuth
    deleteEvent(id: String!): Event! @requireAuth
  }
`

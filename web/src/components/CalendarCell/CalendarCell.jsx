import { useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useEffect } from 'react';
import AddEvent from '../AddEvent/AddEvent';
import { useAuth } from 'src/auth'
import { Box, Link, Text, Button, Checkbox, FormControl, Stack, Code } from '@chakra-ui/react';
import { navigate } from '@redwoodjs/router';
import { set } from '@redwoodjs/forms';
const localizer = momentLocalizer(moment)

let openModal = (event) => {
  // lets create a dialog element in the center of the screen
  let dialog = document.createElement('dialog')
  dialog.setAttribute('id', 'dialog')
  //close other dialogs
  let dialogs = document.querySelectorAll('dialog')
  dialogs.forEach((dialog) => {
    dialog.close()
  })
  dialog.setAttribute('open', true)
  dialog.style.position = 'fixed'
  dialog.style.top = '50%'
  dialog.style.left = '50%'
  dialog.style.transform = 'translate(-50%, -50%)'
  dialog.style.zIndex = 9999
  dialog.style.background = 'white'
  dialog.style.padding = '20px'
  dialog.style.borderRadius = '10px'
  dialog.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)'
  // its not centered yet, because the width is 100%
  // lets set the width to 50%
  dialog.style.width = '50%'
  dialog.innerHTML = `
    <h1>${event.title}</h1>
    <p>${event.start?.toLocaleString()}</p>
    <p>${event.end?.toLocaleString()}</p>
    <button>Close</button>
  `
  document.body.appendChild(dialog)
  dialog.querySelector('button').addEventListener('click', () => {
    dialog.close()
  }
  )
}

export const QUERY = gql`
  query FindCalendarQuery($familyId: String!) {
    dbEvents: eventsByFamily(familyId: $familyId) {
      id
      title
      description
      location
      url
      status
      busyStatus
      organizer
      attendees
      start
      duration
      geo
    }
    familyMembers: familyMembersByFamily(familyId: $familyId) {
      id
      User {
        id
        name
        email
      }
    }
  }
`

export const beforeQuery = (props) => {
  return {
    variables: { familyId: props?.familyId },
    fetchPolicy: 'no-cache',
  }
}

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ dbEvents, familyId, familyMembers }) => {
  const { currentUser } = useAuth()
  let isAdmin = currentUser?.roles?.includes('admin')
  let [events, setEvents] = useState([])
  let [newEvent, setNewEvent] = useState(null)
  let [eventMembers] = useState([currentUser.id])
  let [checkedEventMembers, setCheckedEventMembers] = useState([currentUser.id])
  useEffect(() => {

    // lets convert the calendar to a list of events
    // we may have already done this
    // so lets check if events is empty
    if (events.length == 0) {
      // we have not converted the calendar to a list of events
      let localEvents = dbEvents.map((event) => {
        let start = JSON.parse(event.start)
        let [year, month, day, hour, minute] = start
        let startObj = new Date(year, month, day, hour, minute)
        let duration = JSON.parse(event.duration)
        let endObj = new Date(startObj)
        if (duration.hours) endObj.setHours(startObj.getHours() + duration.hours)
        endObj.setMinutes(startObj.getMinutes() + duration.minutes)
        let eventObj = {
          title: event.title,
          start: startObj,
          end: endObj,
          allDay: false,
          //id: event.id
        }
        return eventObj
      })
      setEvents(localEvents)
    }
    // if newEvent is not null, then we need to add it to the list of events
    // we'll need to first ensure its not already in the list
    if (events.length > 0 && newEvent) {
      let eventExists = events.find((event) => {
        // we need to cehck title and start
        return event.title == newEvent.title && event.start == newEvent.start
      })
      if (!eventExists) {
        // we need to add the new event to the list of events
        setEvents([...events, newEvent])
      }
    }

    //setEvents(events)
    //setNewEvent(null)

  }), [events, newEvent, dbEvents]

  return <Box>
    {/** if the user is admin show this */}
    {isAdmin && (
      <details>
        <pre style={{ whiteSpace: "pre", display: "block" }}>
          {JSON.stringify(dbEvents, null, ' ')}
        </pre>
      </details>
    )}
    <AddEvent
      setNewEvent={setNewEvent}
      familyId={familyId}
      whoseAttending={checkedEventMembers}
      familyMembers={familyMembers}
    />
    {/**a nice looking minumal border checkbox section with a label of "Whose going" */}
    <Box border='1px solid lightgrey' rounded={5} mt={2} p={1}>
    <Stack spacing={5} direction='row'>
      <Text>Whose going</Text>
      {familyMembers.map((familyMember) => {
        let name = familyMember.User.name || familyMember.User.email.split('@')[0]
        // lets properly case the name
        name = name.split(' ').map((word) => {
          return word[0].toUpperCase() + word.slice(1)
        }).join(' ')

        let isChecked = checkedEventMembers.includes(familyMember.User.id)
        return (<Checkbox
          key={`check-${familyMember.id}`}
          isChecked={isChecked}
          onChange={(e) => {
            // when it's changed,
            // if it's was checked, then remove it from the list
            // if it was not checked, then add it to the list
            if (isChecked) {
              // remove it from the list
              let newCheckedEventMembers = checkedEventMembers.filter((checkedEventMember) => {
                return checkedEventMember != familyMember.User.id
              })
              setCheckedEventMembers(newCheckedEventMembers)
            }
            if (!isChecked) {
              // add it to the list
              let newCheckedEventMembers = [...checkedEventMembers, familyMember.User.id]
              setCheckedEventMembers(newCheckedEventMembers)
            }
          }}
          >
            {name}
          </Checkbox>
        )
      })}
    </Stack>
    </Box>

    <Text>Events Total: {events.length}</Text>
    <Text>Family Members Total: {familyMembers.length}</Text>
    <Text>eventMembers: {JSON.stringify(eventMembers, null, 2)}</Text>
    <Text>checkedEventMembers: {JSON.stringify(checkedEventMembers, null, 2)}</Text>
    <Box>
      {/**This will have a link to either subscribe */}
      <Button
        as={"a"}
        colorScheme='blue'
        bg={"blue.500"}
        //{`webcal://${document.location.host}/.redwood/functions/ics?familyId=${familyId}`}
        href={`webcal://${document.location.host}/.redwood/functions/ics?familyId=${familyId}`}
      >Subscribe</Button>

    </Box>
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      // make the height the highest possible - the height of the header

      style={{ height: 'calc(100vh - 250px)' }}
      onSelectEvent={(event) => {
        console.log(event)
        // lets open a modal here
        openModal(event)
      }}
    />
  </Box>
}

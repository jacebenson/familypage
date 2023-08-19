import { useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useEffect } from 'react';
import AddEvent from '../AddEvent/AddEvent';
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
    <p>${event.start.toLocaleString()}</p>
    <p>${event.end.toLocaleString()}</p>
    <button>Close</button>
  `
  document.body.appendChild(dialog)
  dialog.querySelector('button').addEventListener('click', () => {
    dialog.close()
  }
  )
}

export const QUERY = gql`
  query FindCalendarQuery {
    calendar: events {
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
  }
`

export const Loading = () => <div>Loading...</div>

/*export const Empty = () => (<>

  <AddEvent events={[]} setEvents={(data)=>{}} />

  <Calendar
          localizer={localizer}
          events={[]}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={(event) => {
            console.log(event)
            // lets open a modal here
            openModal(event)
          }}
        />
</>)
*/
export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ calendar }) => {
  let [events, setEvents] = useState([])
  useEffect(() => {
    console.log('calendar', calendar)
    // lets convert the calendar to a list of events
    calendar.forEach((event) => {
      let start = JSON.parse(event.start)
      let [year, month, day, hour, minute] = start
      let startObj = new Date(year, month, day, hour, minute)
      let duration = JSON.parse(event.duration)
      let endObj = new Date(startObj)
      if(duration.hours) endObj.setHours(startObj.getHours() + duration.hours)
      endObj.setMinutes(startObj.getMinutes() + duration.minutes)
      let eventObj = {
        title: event.title,
        start: startObj,
        end: endObj,
        allDay: false,
        //id: event.id
      }
      events.push(eventObj)
    })
  }), [events]

  return <div>
  <details>
  <pre style={{whiteSpace: "pre", display: "block"}}>
    {JSON.stringify(calendar, null, ' ')}
  </pre>
  </details>
  <AddEvent events={events} setEvents={setEvents} />
  Events Total: {events.length}
  <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={(event) => {
            console.log(event)
            // lets open a modal here
            openModal(event)
          }}
        />
  </div>
}

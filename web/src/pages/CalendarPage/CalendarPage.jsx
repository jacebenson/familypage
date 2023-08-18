import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import CalendarCell from 'src/components/CalendarCell'
/*

lets import the css


@import 'react-big-calendar/lib/sass/styles';
*/
import 'react-big-calendar/lib/css/react-big-calendar.css';
import AddEvent from 'src/components/AddEvent/AddEvent'
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
const CalendarPage = () => {
  return (
    <>
      <MetaTags title="Calendar" description="Calendar page" />

      <h1>CalendarPage</h1>
      <p>
        Find me in <code>./web/src/pages/CalendarPage/CalendarPage.jsx</code>
      </p>
      <p>
        My default route is named <code>calendar</code>, link to me with `
        <Link to={routes.calendar()}>Calendar</Link>`
      </p>


      <div>
        <AddEvent />
        {/*when i clcik on the event, goto event/3 */}
        <CalendarCell />
      </div>
    </>
  )
}

export default CalendarPage

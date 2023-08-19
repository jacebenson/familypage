import { set } from '@redwoodjs/forms'
import * as chrono from 'chrono-node'
import nlp from 'compromise'
import { useEffect, useState} from 'react'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { CREATE_EVENT_MUTATION } from 'src/components/Event/NewEvent/NewEvent'
import { titleCase } from 'src/lib/titleCase'
import { Box, Button, Flex, Input } from '@chakra-ui/react'
const AddEvent = ({events, setEvents}) => {
  // the idea here is to have a single text input
  // that parses the date/time and event name
  // and then adds it to the calendar
  // onkeyup lets parse the string and show a preview

  // todo this we'll use chrono-node to parse the string
  let [eventString, setEventString] = useState('')
  let [eventDate, setEventDate] = useState(new Date())
  let [eventDuration, setEventDuration] = useState(25*60*1000 )//25 minutes
  let [eventLocation, setEventLocation] = useState('')
  let [suggestedEventName, setSuggestedEventName] = useState('')
  let [eventICSObject, setEventICSObject] = useState({})
  useEffect(() => {
    parseEventString(eventString)
  }, [eventString])
  const setEvent = (e) => {
    setEventString(e.target.value)
  }
  const parseEventString = (eventString) => {
    console.log({
      eventString,
    })
    let chronoDateTime = chrono.parseDate(eventString)
    if(!chronoDateTime) return
    let chronoTime = chronoDateTime.toLocaleTimeString()
    let chronoDate = chronoDateTime.toLocaleDateString()
    let chronoArr = chrono.parse(eventString)
    setEventDate(chronoDateTime)
    console.log({
      chronoDateTime,
      chronoTime,
      chronoDate,
      chronoArr,
    })
    // lets remove the date and time from the string
    chronoArr.forEach((chronoObj) => {
      eventString = eventString.replace(chronoObj.text, '')
      // titlecase the event name
      eventString = titleCase(eventString)
      eventString = eventString.trim()

      // while were here; lets set the duration
      if(chronoObj.end && chronoObj.start){
        let duration = chronoObj.end.date() - chronoObj.start.date()
        console.log({
          start: chronoObj.start.date(),
          end: chronoObj.end.date(),
        })
        setEventDuration(duration)
        setEventDate(chronoObj.start.date())
        // if there is an end date, lets set it
      }
    })
    let locations = nlp(eventString)?.places()?.out('array')
    console.log({
      locations,
    })
    let lastLocation = locations[locations.length -1]
    setEventLocation(lastLocation)
    setSuggestedEventName(`${eventString}`)

    // lets create the ics object
    let setUpEventICSObject = {
      // start expects an array of [year, month, day, hour, minute]
      start: [chronoDateTime.getFullYear(), chronoDateTime.getMonth(), chronoDateTime.getDate(), chronoDateTime.getHours(), chronoDateTime.getMinutes()],
      // duration expects an object of {hours: 1, minutes: 30}
      duration: {minutes: eventDuration/1000/60},
      title: eventString,
      description: eventString,
      location: lastLocation,
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
      organizer: {name: 'Family Calendar', email: ''},
      attendees: [],
    }
    setEventICSObject(setUpEventICSObject)
    let buildCalendarEvent = ''
  }
  const [createEvent, { loading, error }] = useMutation(CREATE_EVENT_MUTATION, {
    onCompleted: (result) => {
      toast.success('Event created')
      console.log({result})
      setEventString('')
      // append the event to the events array
      let newList = JSON.stringify(events)
      newList = JSON.parse(newList)
      console.log([...newList, {...eventICSObject}])
      // lets make a new event object with
      // start
      // end
      // title
      // allDay
      // from the eventICSObject
      // .start needs to be converted to a ISOdatestring form [2023,7,17,22,0]
      // .end needs to be calculated from the duration
      // duration is { "hours", "minutes" }
      let startDate = JSON.parse(eventICSObject.start)
      startDate = new Date(startDate[0], startDate[1], startDate[2], startDate[3], startDate[4])
      let endDate = new Date(startDate)
      let duration = JSON.parse(eventICSObject.duration)
      if(duration.hours) endDate.setHours(endDate.getHours() + duration.hours)
      if(duration.minutes) endDate.setMinutes(endDate.getMinutes() + duration.minutes)
      let newEvent = {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        title: eventICSObject.title,
        allDay: false,
      }
      newList.push(newEvent)
      setEvents(newList)
      console.table(events)
      console.table(newList)
    },
  })
  const onSubmit = (data) => {
    // eek the data needs to be massaged
    // im still using sqllite so json stuff neesd to be stringified
    data.start = JSON.stringify(data.start)
    data.duration = JSON.stringify(data.duration)
    data.attendees = JSON.stringify(data.attendees)
    data.organizer = JSON.stringify(data.organizer)
    createEvent({ variables: { input: data } })
  }

  return (
    <div>
      <Flex gap={5}>
      <Input variant='outline' placeholder="Breakfast at Tiffany's Friday at 2pm"  onKeyUp={setEvent} />
      <Button colorScheme='blue'
        isDisabled={!suggestedEventName}
        onClick={() => {
          console.log({
            eventICSObject,
          })
          onSubmit(eventICSObject)
        }}
        >
          Add Event
      </Button>
      </Flex>

      <div>{suggestedEventName} {eventDate.toLocaleDateString()} {eventDate.toLocaleTimeString()}</div>
      <details>
      <summary>{suggestedEventName}</summary>
      {eventString && (
        <div>
          <p>Event String: {eventString}</p>
          <p>Start Date(iso): {eventDate.toISOString()}</p>
          <p>Start Date(local): {eventDate.toLocaleDateString() + ' ' + eventDate.toLocaleTimeString()}</p>
          <p>Duration(ms): {eventDuration}</p>
          <p>Duration(minutes): {eventDuration/1000/60}</p>
          <p>Location: {eventLocation}</p>
          <p>Suggested Event Name: {suggestedEventName}</p>
          <pre style={{textAlign: 'left'}}>{JSON.stringify(eventICSObject, null, 2)}</pre>
        </div>
      )}
      </details>
    </div>
  )
}

export default AddEvent

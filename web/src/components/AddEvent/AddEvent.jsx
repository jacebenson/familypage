import { Form, set } from '@redwoodjs/forms'
import * as chrono from 'chrono-node'
import nlp from 'compromise'
import { useEffect, useState } from 'react'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { CREATE_EVENT_MUTATION } from 'src/components/Event/NewEvent/NewEvent'
import { titleCase } from 'src/lib/titleCase'
import {
  Box,
  Button,
  Flex,
  Input,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  Select,
} from '@chakra-ui/react'
import { useAuth } from 'src/auth'

const CREATE_EVENT_WITH_ATTENDEES_MUTATION = gql`
  mutation CreateEventWithAttendeesMutation($input: CreateEventWithAttendeesInput!) {
    createEventWithAttendees(input: $input) {
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
      familyId
    }
  }
`


const AddEvent = ({ events, setEvents, setNewEvent, familyId, whoseAttending, familyMembers, emailsAttending }) => {
  const { currentUser } = useAuth()
  let isAdmin = currentUser?.roles?.includes('admin')
  // the idea here is to have a single text input
  // that parses the date/time and event name
  // and then adds it to the calendar
  // onkeyup lets parse the string and show a preview

  // todo this we'll use chrono-node to parse the string
  let [advancedEvent, setAdvancedEvent] = useState({
    title: "",
    start: "",
    end: "",
    description: "",
    location: "",
    attendees: "",
    url: "",
    familyId
  })
  let [advancedSubmit, setAdvancedSubmit] = useState(false)
  let [eventString, setEventString] = useState(null)
  let [eventDate, setEventDate] = useState(new Date())
  let [eventDuration, setEventDuration] = useState(25 * 60 * 1000)//25 minutes
  let [eventLocation, setEventLocation] = useState('')
  let [suggestedEventName, setSuggestedEventName] = useState('')
  let [eventICSObject, setEventICSObject] = useState({})
  let suggestedEventAndDate = `${suggestedEventName} ${eventDate.toLocaleDateString()} ${eventDate.toLocaleTimeString()}`
  let localAttendees = familyMembers.map((familyMember) => {
    // check whose attending
    if(whoseAttending.includes(familyMember.User.id)) {
      return {
        id: familyMember.User.id,
        name: familyMember.User.name || familyMember.User.email,
        email: familyMember.User.email,
      }
    }
  })
  console.log({localAttendees})
  const { isOpen, onOpen, onClose } = useDisclosure()
  useEffect(() => {
    if (eventString) setEventICSObject(parseEventString(eventString))
    // if advanced event has values, lets parse it
    if (advancedSubmit) setEventICSObject(parseAdvancedEvent(advancedEvent))
  }, [eventString, advancedSubmit])
  const setEvent = (e) => {
    setEventString(e.target.value)
  }
  const getDateTimeLocalFormat = (date) => {
    // lets return the current date and time
    // in the format that datetime-local expects
    let now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
  }
  const handleFormChange = (e) => {
    setAdvancedEvent({
      ...advancedEvent,
      [e.target.name]: e.target.value
    })
    let parsed = parseAdvancedEvent(advancedEvent)
    setEventICSObject(parsed)
  }
  const parseEventString = (eventString) => {
    let chronoDateTime = chrono.parseDate(eventString)
    if (!chronoDateTime) return
    let chronoArr = chrono.parse(eventString)
    setEventDate(chronoDateTime)
    // lets remove the date and time from the string
    chronoArr.forEach((chronoObj) => {
      eventString = eventString.replace(chronoObj.text, '')
      // titlecase the event name
      eventString = titleCase(eventString)
      eventString = eventString.trim()

      // while were here; lets set the duration
      if (chronoObj.end && chronoObj.start) {
        let duration = chronoObj.end.date() - chronoObj.start.date()
        setEventDuration(duration)
        setEventDate(chronoObj.start.date())
        // if there is an end date, lets set it
      }
    })
    let locations = nlp(eventString)?.places()?.out('array')
    let lastLocation = locations[locations.length - 1]
    setEventLocation(lastLocation)
    setSuggestedEventName(`${eventString}`)

    // lets create the ics object
    let setUpEventICSObject = {
      // start expects an array of [year, month, day, hour, minute]
      start: [chronoDateTime.getFullYear(), chronoDateTime.getMonth(), chronoDateTime.getDate(), chronoDateTime.getHours(), chronoDateTime.getMinutes()],
      // duration expects an object of {hours: 1, minutes: 30}
      duration: { minutes: eventDuration / 1000 / 60 },
      title: eventString,
      description: eventString,
      location: lastLocation,
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
      // organizer should follow this format
      // attendees.push(`${attendee.name} <${attendee.email}>`)
      organizer: (()=>{
        if(currentUser.name) return `${currentUser.name} <${currentUser.email}>`
        return currentUser.email
      })(),
      // lets add the attendees email addresses and names
      // how they do it on email 'name' <email>
      attendees: (()=>{
        let attendees = []
        localAttendees.forEach((attendee) => {
          if(!attendee) return
          // if name is blank, then just use the email
          attendees.push(attendee.email)
        })
        // add in emailattendees
        attendees = attendees.join(',')
        return attendees
      })(),
      familyId
    }
    console.log('setUpEventICSObject', setUpEventICSObject)
    return setUpEventICSObject
  }
  const parseAdvancedEvent = (advancedEvent) => {
    // lets check if advanced event has any values
    for (let key in advancedEvent) {
      if (advancedEvent[key]) break
      return
    }
    // at minimum we need start, title
    if (!advancedEvent.start || !advancedEvent.title) return
    // we need to parse the start date from datetime-local
    // a value is like "2023-08-26T23:52"
    let startDate = new Date(advancedEvent.start + ':00Z')
    let eventDuration = advancedEvent?.duration*60*1000 || 25 * 60 * 1000

    // we should be able to map mostly
    let setUpEventICSObject = {
      start: [startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startDate.getHours(), startDate.getMinutes()],
      duration: { minutes: eventDuration / 1000 / 60 },
      title: advancedEvent.title,
      description: advancedEvent.description,
      location: advancedEvent.location,
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
      organizer: { name: 'Family Calendar', email: '' },
      attendees: [],
      familyId
    }
    return setUpEventICSObject
  }
  const [createEvent, { loading, error }] = useMutation(CREATE_EVENT_MUTATION, {
    onCompleted: (result) => {
      toast.success('Event created')
      setEventString('')
      let startDate = JSON.parse(eventICSObject.start)
      startDate = new Date(startDate[0], startDate[1], startDate[2], startDate[3], startDate[4])
      let endDate = new Date(startDate)
      let duration = JSON.parse(eventICSObject.duration)
      if (duration?.hours) endDate.setHours(endDate.getHours() + duration.hours)
      if (duration?.minutes) endDate.setMinutes(endDate.getMinutes() + duration.minutes)
      let newEvent = {
        start: startDate,//.toISOString(),
        end: endDate,//.toISOString(),
        title: eventICSObject.title,
        allDay: false,
        id: result.createEvent.id,
      }
      setNewEvent(newEvent)
      setEvents([...events, newEvent])

    },
  })
  const onSubmit = (data) => {
    setAdvancedSubmit(false)
    // eek the data needs to be massaged
    // im still using sqllite so json stuff neesd to be stringified
    data.start = JSON.stringify(data.start)
    data.duration = JSON.stringify(data.duration)
    data.attendees = JSON.stringify(data.attendees)
    data.organizer = data.organizer
    console.log('data', data)
    createEvent({ variables: { input: data } })
  }

  return (
    <Box>
      <Flex gap={5}>
        <Input variant='outline' placeholder="Breakfast at Tiffany's Friday at 2pm" onKeyUp={setEvent} />
        <Button colorScheme='blue'
          isDisabled={!suggestedEventName}
          onClick={() => { onSubmit(eventICSObject)}}
        >
          Add Event
        </Button>
        <Button onClick={onOpen}>Open Modal</Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create Event</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box>
                <FormControl>
                  <FormLabel>Title</FormLabel>
                  <Input name='title' onChange={handleFormChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Start Date</FormLabel>
                  <Input
                    name='start'
                    placeholder="Select Date and Time"
                    size="md"
                    type="datetime-local"
                    defaultValue={getDateTimeLocalFormat(new Date())}
                    onChange={handleFormChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Duration(minutes)</FormLabel>
                  <Input name='duration' onChange={handleFormChange}
                    type='number'
                    defaultValue={25}
                    step={5}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea name='description' onChange={handleFormChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Location</FormLabel>
                  <Input name='location' onChange={handleFormChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Attendees</FormLabel>
                  <Input name='attendees' onChange={handleFormChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>URL</FormLabel>
                  <Input name='url' onChange={handleFormChange} />
                </FormControl>
              </Box>

            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={() => {
                setAdvancedSubmit(true)
                onSubmit(eventICSObject)
                setAdvancedSubmit(false)
                onClose()
              }}
              >
                Save Event
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

      </Flex>


      {!isAdmin && eventString && (
        <div>{suggestedEventAndDate}</div>
      )}
      {isAdmin && eventString && (
        <details>
          <summary>{suggestedEventAndDate}</summary>
          <div>
            <p>Whose Attending: {JSON.stringify(localAttendees)}</p>
            <p>Event String: {eventString}</p>
            <p>Start Date(iso): {eventDate.toISOString()}</p>
            <p>Start Date(local): {eventDate.toLocaleDateString() + ' ' + eventDate.toLocaleTimeString()}</p>
            <p>Duration(ms): {eventDuration}</p>
            <p>Duration(minutes): {eventDuration / 1000 / 60}</p>
            <p>Location: {eventLocation}</p>
            <p>Suggested Event Name: {suggestedEventName}</p>
            <pre style={{ textAlign: 'left' }}>{JSON.stringify(eventICSObject, null, 2)}</pre>
          </div>
        </details>
      )}
    </Box>
  )
}

export default AddEvent

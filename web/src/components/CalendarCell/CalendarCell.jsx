import { useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useEffect } from 'react';
import { datetime, RRule, RRuleSet, rrulestr } from 'rrule'
import AddEvent from '../AddEvent/AddEvent';
import { useAuth } from 'src/auth'
import {
  Box,
  Link,
  Text,
  Button,
  Checkbox,
  FormControl,
  Stack,
  Code,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
useDisclosure,
FormLabel,
Input,
Flex,
Select

} from '@chakra-ui/react';
import EditEventCell from 'src/components/EditEventCell';
const localizer = momentLocalizer(moment)


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
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { currentUser } = useAuth()
  let isAdmin = currentUser?.roles?.includes('admin')
  let [events, setEvents] = useState([])
  let [newEvent, setNewEvent] = useState(null)
  let [eventMembers] = useState([currentUser.id])
  let [repeatingSettings, setRepeating] = useState(null)
  let [checkedEventMembers, setCheckedEventMembers] = useState([currentUser.id])
  let [selectedEvent, setSelectedEvent] = useState(null)
  let [emailsAttending, setEmailsAttending] = useState(null)
  let [rrule, setRRule] = useState(null)
  if (events.length == 0) {
    // we have not converted the calendar to a list of events
    let localEvents = dbEvents.map((event) => {

      // start
      let start = JSON.parse(event.start)
      let [year, month, day, hour, minute] = start
      let startObj = new Date(year, month, day, hour, minute)

      // end
      let duration = JSON.parse(event.duration)
      let endObj = new Date(startObj)
      if (duration.hours) endObj.setHours(startObj.getHours() + duration.hours)
      endObj.setMinutes(startObj.getMinutes() + duration.minutes)

      // eventObj
      let eventObj = {
        title: event.title,
        start: startObj,
        end: endObj,
        allDay: false,
        id: event.id
      }
      return eventObj
    })

    // update the list of events
    setEvents(localEvents)
  }
  useEffect(() => {

    // if we have no events in the list of events, lets convert the events from the database to events for the calendar
   // if (events.length == 0) {
   //   // we have not converted the calendar to a list of events
   //   let localEvents = dbEvents.map((event) => {
//
   //     // start
   //     let start = JSON.parse(event.start)
   //     let [year, month, day, hour, minute] = start
   //     let startObj = new Date(year, month, day, hour, minute)
//
   //     // end
   //     let duration = JSON.parse(event.duration)
   //     let endObj = new Date(startObj)
   //     if (duration.hours) endObj.setHours(startObj.getHours() + duration.hours)
   //     endObj.setMinutes(startObj.getMinutes() + duration.minutes)
//
   //     // eventObj
   //     let eventObj = {
   //       title: event.title,
   //       start: startObj,
   //       end: endObj,
   //       allDay: false,
   //       id: event.id
   //     }
   //     return eventObj
   //   })
//
   //   // update the list of events
   //   setEvents(localEvents)
   // }
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

  }), [events, newEvent, dbEvents]



  let handleRepeatingChange = (e) => {
    // this can take an update from a number of fields;
    // we'll be putting these all in the repeatingSettings object
    let value = e.target.value
    let name = e.target.name
    let newRepeatingSettings = { ...repeatingSettings }
    newRepeatingSettings[name] = value
    setRepeating(newRepeatingSettings)

   // lets build the proper rrule string
   // example rule
   /**
    * // Create a rule:
const rule = new RRule({
  freq: RRule.WEEKLY,
  interval: 5,
  byweekday: [RRule.MO, RRule.FR],
  dtstart: datetime(2012, 2, 1, 10, 30),
  until: datetime(2012, 12, 31)
})
    */
   //then just toString it
   //TODO FIGURE THIS OUT
   let rrule = null
   let rruleObj = {}
    if(repeatingSettings?.type == 'none') {
      rrule = null
    }
    if(repeatingSettings?.type == 'every') {
      if(repeatingSettings?.freq){
        rruleObj.freq = RRule[repeatingSettings?.freq?.toUpperCase()]
      }
      rruleObj.interval = repeatingSettings?.interval ? repeatingSettings?.interval : 1
      rruleObj.dtstart = datetime(2021, 1, 1, 10, 30)
      if(repeatingSettings?.duration == 'until') {
        // datetime takes year, month, day, hour, minute
        let until = new Date(repeatingSettings?.until)
        let year = until.getFullYear()
        let month = until.getMonth()
        let day = until.getDate()
        rruleObj.until = datetime(year, month, day)
      }
      if(repeatingSettings?.duration == 'count') {
        rruleObj.count = repeatingSettings?.number
      }
      if(repeatingSettings?.duration == 'forever') {
        // do nothing
      }
      console.log({rruleObj})
      rrule = new RRule(rruleObj).toString()
    }
    setRRule(rrule)
  }
  return <Box>
    {/** if the user is admin show this */}
    <AddEvent
      setNewEvent={setNewEvent}
      familyId={familyId}
      whoseAttending={checkedEventMembers}
      emailsAttending={emailsAttending}
      familyMembers={familyMembers}
      setEvents={setEvents}
      events={events}
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
          return (
            <Checkbox
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

        <FormControl>
          <FormLabel display={'none'}>Emails</FormLabel>
          <Input placeholder="Emails comma seperated"
            onChange={(e) => {
              // lets do a little validation
              // we need to make sure the emails are valid
              // 1. split the emails by comma
              // 2. trim the emails
              // 3. make sure emails contain something@something
              let emails = e.target.value.split(',')
              let validEmails = emails.map((email) => {
                return email.trim()
              }).filter((email) => {
                return email.includes('@')
              }).filter((email) => {
                return email.includes('.')
              })

              if(validEmails.length == 0) validEmails = null

              setEmailsAttending(validEmails)
            }}

          />
        </FormControl>

      </Stack>
    </Box>
{/*<Box border='1px solid lightgrey' rounded={5} mt={2} p={1}>
    <Stack spacing={5} direction='row'>
        <Text>Repeat</Text>
        <Select name="type" onChange={handleRepeatingChange}>
          <option >None</option>
          <option value="every">Every</option>
          <option value="everyother">Every other</option>
          <option value="interval">Every (number)</option>
        </Select>
        {repeatingSettings?.type == 'interval' && (
          <Input name="interval" onChange={handleRepeatingChange} />
        )}

        <Select name="freq" onChange={handleRepeatingChange}>
          <option >None</option>
          <option value="daily">day</option>
          <option value="weekly">week</option>
          <option value="monthly">month</option>
          <option value="yearly">year</option>
        </Select>
        <Select name="duration" onChange={handleRepeatingChange}>
          <option >None</option>
          <option value="forever">Forever</option>
          <option value="until">Until</option>
          <option value="count">Number</option>
        </Select>
        {repeatingSettings?.duration == 'until' && (
          <Input name="until" type="date"
            // when picking onchange doesnt always fire
          onChange={handleRepeatingChange} />
        )}
        {repeatingSettings?.duration == 'count' && (
          <Input name="number" onChange={handleRepeatingChange} />
        )}
      </Stack>
      <Text>{rrule}</Text>
</Box>*/}
    {/*<Text>Events Total: {events.length}</Text>
    <Text>Family Members Total: {familyMembers.length}</Text>
    <Text>eventMembers: {JSON.stringify(eventMembers, null, 2)}</Text>
    <Text>checkedEventMembers: {JSON.stringify(checkedEventMembers, null, 2)}</Text>
    <Text>emailsAttending: {JSON.stringify(emailsAttending)}</Text>*/}
    <Box py={2}>
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
        setSelectedEvent(event)
        // chakra-ui modal to be opneed
        onOpen()
      }}
    />
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{selectedEvent?.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {selectedEvent?.id &&
            <EditEventCell
            id={selectedEvent?.id}
            familyMembers={familyMembers}
            setEvents={setEvents}
            events={events}
            onClose={onClose}

            />
          }

        </ModalBody>
      </ModalContent>
    </Modal>
  </Box>
}

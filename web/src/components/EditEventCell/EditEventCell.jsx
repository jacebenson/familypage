import { toast } from '@redwoodjs/web/toast'
import { useMutation } from "@redwoodjs/web"
import {
  Flex,
  FormControl,
  Badge,
  Box,
  Button,
  Code,
  FormLabel,
  HStack,
  Icon,
  Input,
  Link,
  Select,
  Spacer,
  Text,
  Textarea,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from "@chakra-ui/react"

import { MdEvent, MdLocationOn, MdAccessTime } from 'react-icons/md'
export const QUERY = gql`
  query FindEventByIdCustom($id: String!) {
    event: event(id: $id) {
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
      familyId
    }
    familyMembers: familyMembersByFamily(familyId: $id) {
      id
      User {
        name
        email
      }
    }
  }
`
const DELETE_EVENT_MUTATION = gql`
  mutation DeleteEventMutation($id: String!) {
    deleteEvent(id: $id) {
      id
    }
  }
`
const UPDATE_EVENT_MUTATION = gql`
  mutation UpdateEventMutation($id: String!, $input: UpdateEventInput!) {
    updateEvent(id: $id, input: $input) {
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
      familyId
    }
  }
`


export const beforeQuery = (props) => {
  return {
    variables: { id: props?.id },
    fetchPolicy: 'no-cache',
  }
}

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ event, familyMembers, setEvents, events, onClose, editMode, redirect}) => {
  let [debug, setDebug] = React.useState(false)
  let [formState, setFormState] = React.useState({...event})
  let [edit, setEdit] = React.useState(editMode || false)
  const { onOpen: onOpenConfirm, isOpen: isOpenConfirm, onClose: onCloseConfirm } = useDisclosure()
  let fields = [
    { name: 'title', type: 'string' },
    { name: 'description', type: 'textarea' },
    { name: 'location', type: 'string' },
    { name: 'url', type: 'string' },
    { name: 'status', type: 'select', choices: ['confirmed', 'tentative', 'cancelled'] },
    { name: 'busyStatus', type: 'select', choices: ['busy', 'free', 'busy-unavailable', 'busy-tentative'] },
    { name: 'organizer', type: 'string' },
    { name: 'attendees', type: 'string' },
    { name: 'start', type: 'datetime' },
    { name: 'duration', type: 'duration' },
    { name: 'geo', type: 'string' },
  ]
  let handleChange = (e) => {
    let name = e.target.name
    let value = e.target.value
    if(name == 'duration') {
      //duration is an object
      // but the input is a string of minutes
      // the output should be an object of { "minutes": 30 }
      let duration = { minutes: value }
      setFormState({
        ...formState,
        [name]: JSON.stringify(duration)
      })
      return
    }
    if(name == 'start') {
      // we need to retun an array of [2023,7,26,11,2]
      let date = new Date(value)
      let year = date.getFullYear()
      let month = date.getMonth()
      let day = date.getDate()
      let hours = date.getHours()
      let minutes = date.getMinutes()
      let dateTimeArray = [year, month, day, hours, minutes]
      setFormState({
        ...formState,
        [name]: JSON.stringify(dateTimeArray)
      })
      return
    }
    setFormState({
      ...formState,
      [name]: value
    })
  }
  const [deleteEvent] = useMutation(DELETE_EVENT_MUTATION, {
    onCompleted: () => {
      toast.success('Event deleted')
      navigate(routes.events())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id) => {
    var newEvents = events.filter((event) => {
      return event.id !== id
    })
    setEvents(newEvents)
    deleteEvent({ variables: { id } })
    // close the modal
    onClose()
  }

  const [updateEvent, { loading, error }] = useMutation(UPDATE_EVENT_MUTATION, {
    onCompleted: () => {
      toast.success('Event updated')
      navigate(routes.events())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
  const onSave = () => {
    // delete __typename from input
    let input = {...formState}
    let id = input.id
    console.log({ funciton: 'onSave', input, id })
    delete input.__typename
    updateEvent({ variables: { id, input } })
  }


  const formatDuration = (duration) => {

    const { hours, minutes } = JSON.parse(duration);

    if (hours === 0 || hours === undefined) {
      return `${minutes} minutes`;
    } else if (minutes === 0) {
      return `${hours} hours`;
    } else {
      return `${hours} hours ${minutes} minutes`;
    }
  };
  const formatDurationEdit = (duration) => {
    const { hours, minutes } = JSON.parse(duration);
    // convert hours to minutes
    return JSON.stringify({
      minutes: hours * 60 + minutes
    })
    let totalMinutes = hours * 60 + minutes
    return totalMinutes
  }
  const titleCase = (str) => {
    let words = str.split(' ')
    let titleCaseWords = words.map((word) => {
      return word[0].toUpperCase() + word.slice(1)
    })
    return titleCaseWords.join(' ')
  }
  const formatDateTime = (dateTime) => {
    //datetime is an string that needs parsing;
    // [2023,7,26,11,2]
    let dateTimeArray = JSON.parse(dateTime)
    let date = new Date(dateTimeArray[0], dateTimeArray[1], dateTimeArray[2], dateTimeArray[3], dateTimeArray[4])
    return date.toLocaleString()
  }
  const formatDateTimeLocal = (dateTime) => {
    //output should be like 2000-01-01T00:00:00
    console.log({ dateTime })
    let dateTimeArray = JSON.parse(dateTime)
    let date = new Date(dateTimeArray[0], dateTimeArray[1], dateTimeArray[2], dateTimeArray[3], dateTimeArray[4])
    let year = date.getFullYear()
    // all numbers should be padded to 2 digits
    let month = date.getMonth().toString().padStart(2, '0')
    let day = date.getDate().toString().padStart(2, '0')
    let hours = date.getHours().toString().padStart(2, '0')
    let minutes = date.getMinutes().toString().padStart(2, '0')
    let seconds = date.getSeconds().toString().padStart(2, '0')

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
  }
  const getUserFromEmail = (email, familyMembers) => {
    let familyMember = familyMembers.find((familyMember) => {
      return familyMember.User.email === email
    })
    if (!familyMember) return { email: email }
    return familyMember.User
  }
  const organizer = (() => {
    let organizerEmail = event.organizer
    if (event.organizer.includes('<')) {
      organizerEmail = event.organizer.split('<')[1].split('>')[0]
    }
    let familyMember = getUserFromEmail(organizerEmail, familyMembers)
    if (familyMember) {
      if (familyMember.name) familyMember.name = titleCase(familyMember.name)
      if (!familyMember.name) familyMember.name = familyMember.email
    }
    return familyMember
  })()

  const formatAttendees = (attendees, familyMembers) => {
    console.log({
      attendees,
      familyMembers
    })
    let parsedAttendees = attendees?.split(',')
    let output = []
    parsedAttendees?.forEach((attendee) => {
      let attendeeEmail = attendee
      let familyMember = getUserFromEmail(attendeeEmail, familyMembers)
      if (familyMember) {
        if (familyMember.name) familyMember.name = titleCase(familyMember.name)
        output.push(familyMember.name || familyMember.email)
      }
    })
    return output.join(', ')
  }
  return (<Box>
    <Modal isOpen={isOpenConfirm} onClose={onCloseConfirm}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Event</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to delete this event?
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onCloseConfirm}>
            Cancel
          </Button>
          <Button variant="ghost" onClick={() => {
            onDeleteClick(event.id)
            onCloseConfirm()
          }}>Delete</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>

    {!edit && <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      boxShadow="md"
    >
      <Text fontWeight="bold" fontSize="lg" mb={2}>
        {event.title}
      </Text>
      {/**Render this as unsafe html */}
      <Text
        display={event.description ? 'block' : 'none'}
        dangerouslySetInnerHTML={{ __html: event.description }}
      >
      </Text>

      <HStack mt={2} spacing={2}>
        <Icon as={MdEvent} />
        <Text>{formatDateTime(event.start)}</Text>
      </HStack>

      <HStack mt={2} spacing={2} display={event.location ? 'block' : 'none'}>
        <Icon as={MdLocationOn} />
        <Text>{event.location}</Text>
      </HStack>

      <HStack mt={2} spacing={2}>
        <Icon as={MdAccessTime} />
        <Text>Duration: {formatDuration(event.duration)}</Text>
      </HStack>

      <VStack mt={4} align="start" spacing={2}>
        <Badge colorScheme={event.status === 'cancelled' ? 'red' : 'green'}>
          {event.status}
        </Badge>
        <Badge colorScheme="gray">{event.busyStatus}</Badge>
      </VStack>

      <VStack mt={4} align="start" spacing={2} display={event.organizer ? 'block' : 'none'}>
        <Text>
          Organizer: <Link href={`mailto:${organizer.email}`}>{organizer.name}</Link>
        </Text>
        <Text>Attendees: {formatAttendees(event.attendees, familyMembers)}</Text>
      </VStack>

      <VStack mt={4} align="start" spacing={2}>
        <Link href={event.url} color="blue.500" isExternal display={event.url ? 'block' : 'none'}>
          Event Link
        </Link>
        <Link href={`https://www.google.com/maps?q=${event.geo}`} color="blue.500" isExternal display={event.geo ? 'block' : 'none'}>
          View on Map
        </Link>
      </VStack>
    </Box>}
    {edit && <Box>
      <form>
      <Code
      whiteSpace={'pre'}
      >{JSON.stringify(event, null, 2)}</Code>
        {fields.map((field) => {
          let fieldName = (() => {
            //title case the field name
            let words = field.name.split(' ')
            let titleCaseWords = words.map((word) => {
              return word[0].toUpperCase() + word.slice(1)
            })
            return titleCaseWords.join(' ')
          })()
          return (<FormControl>
            <FormLabel htmlFor={field.name}>{fieldName}</FormLabel>
            {field.type == 'select' && (
              <Select
                name={field.name}
                id={field.name}
                defaultValue={event[field.name]}>
                {field.choices.map((choice) => {
                  return <option value={choice}>{choice}</option>
                })}
                onChange={handleChange}
              </Select>
            )}
            {field.type == 'string' && (
              <Input
                type="text" name={field.name}
                id={field.name}
                defaultValue={event[field.name]}
                onChange={handleChange}
                />
            )}
            {field.type == 'duration' && (
              <>
              <Text>Duration Raw: {event[field.name]}</Text>
              <Text>Duration: {formatDuration(event[field.name])}</Text>
              <Text>Duration Edit: {formatDurationEdit(event[field.name])}</Text>
              <Input
                type="number"
                name={field.name}
                id={field.name}
                defaultValue="{formatDurationEdit(event[field.name])}"
                onChange={handleChange}
                />
              </>
            )}
            {field.type == 'datetime' && (
              <Input
                type="datetime-local"
                name={field.name}
                id={field.name}
                defaultValue={formatDateTimeLocal(event[field.name])}
                onChange={handleChange}
                />
            )}
            {field.type == 'textarea' && (
              <Textarea
                name={field.name}
                id={field.name}
                defaultValue={event[field.name]}
                rows={(()=>{
                    //get the number of lines
                    let lines = event[field.name].split('\n')
                    return lines.length
                })()}
                onChange={handleChange}
                />
            )}
          </FormControl>)
        })}
      </form>
    </Box>}
    <Flex pt={1} gap={1}>
      <Spacer />
      {!edit && <Button
        size={'sm'}
        colorScheme="yellow"
        mb="2"
        onClick={() => {
          setEdit(!edit)
        }}
      >Edit
      </Button>}
      {edit && <Button
        size={'sm'}
        colorScheme="green"
        mb="2"
        onClick={() => {
          //setEdit(!edit)
          onSave(event, event.id)
        }}
      >Save
      </Button>}
      <Button
        size={'sm'}
        colorScheme="red"
        mb="2"
        onClick={() => {
          onOpenConfirm()
          //onDeleteClick(event.id)
        }}
      >Delete</Button>
    </Flex>
  </Box>)
}

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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,

} from "@chakra-ui/react"

import { MdEvent, MdLocationOn, MdAccessTime } from 'react-icons/md'
export const QUERY = gql`
  query FindEventById($id: String!) {
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

export const Success = ({ event, familyMembers }) => {
  let [debug, setDebug] = React.useState(false)
  let [edit, setEdit] = React.useState(false)
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
    { name: 'duration', type: 'string' },
    { name: 'geo', type: 'string' },
  ]
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
  const getUserFromEmail = (email, familyMembers) => {
    let familyMember = familyMembers.find((familyMember) => {
      return familyMember.User.email === email
    })
    if (!familyMember) return { email: email}
    return familyMember.User
  }
  const organizer = (() => {
    let organizerEmail = event.organizer
    if(event.organizer.includes('<')) {
      organizerEmail = event.organizer.split('<')[1].split('>')[0]
    }
    let familyMember = getUserFromEmail(organizerEmail, familyMembers)
    if (familyMember) {
      if(familyMember.name) familyMember.name = titleCase(familyMember.name)
      if(!familyMember.name) familyMember.name = familyMember.email
    }
    return familyMember
  })()

  const formatAttendees = (attendees, familyMembers) => {
    let parsedAttendees = attendees.split(',')
    let output = []
    parsedAttendees.forEach((attendee) => {
      let attendeeEmail = attendee.split('<')[1].split('>')[0]
      let familyMember = getUserFromEmail(attendeeEmail, familyMembers)
      if (familyMember) {
        if(familyMember.name) familyMember.name = titleCase(familyMember.name)
        output.push(familyMember.name || familyMember.email)
      }
    })
    return output.join(', ')
  }
  return (<Box>
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
      <Text display={event.description ? 'block' : 'none'}>{event.description}</Text>

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
            {field.type == 'select' && <Select name={field.name} id={field.name} value={event[field.name]}>
              {field.choices.map((choice) => {
                return <option value={choice}>{choice}</option>
              })}
            </Select>}
            {field.type == 'string' && <Input type="text" name={field.name} id={field.name} value={event[field.name]} />}
            {field.type == 'datetime' && <Input type="datetime-local" name={field.name} id={field.name} value={event[field.name]} />}
            {field.type == 'textarea' && <Textarea name={field.name} id={field.name} value={event[field.name]} />}
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
          console.log("IMPLEMETN SAVE")
        }}
      >Save
      </Button>}
      <Button
        size={'sm'}
        colorScheme="red"
        mb="2"
        onClick={() => {
          setEdit(!edit)
        }}
      >Delete</Button>
    </Flex>
  </Box>)
}

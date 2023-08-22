// this component will present the user a form
// where they can enter the code to join a family
// or then can "create" a family by entering a name
// so that means... two forms
import { useAuth } from "src/auth"
import { useMutation, gql } from '@redwoodjs/web'
import NewFamily from "../Family/NewFamily/NewFamily"

'use client'

import {
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter
} from '@chakra-ui/react'

const JOIN_IMAGE = '/krzysztof-kowalik-Cc1RmGnf20E-unsplash.jpg'

const CREATE_IMAGE = '/sandy-millar-KhStXRVhfog-unsplash.jpg'

const Card = function({
  title,
  cta,
  image,
  heading,
  modalContent,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Center py={12}>
      <Box
        role={'group'}
        p={6}
        maxW={'330px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'lg'}
        pos={'relative'}
        zIndex={1}>
        <Box
          rounded={'lg'}
          mt={-12}
          pos={'relative'}
          height={'230px'}
          _after={{
            transition: 'all .3s ease',
            content: '""',
            w: 'full',
            h: 'full',
            pos: 'absolute',
            top: 5,
            left: 0,
            backgroundImage: `url(${image})`,
            filter: 'blur(15px)',
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: 'blur(20px)',
            },
          }}>
          <Image
            rounded={'lg'}
            height={230}
            width={282}
            objectFit={'cover'}
            src={image}
            alt="#"
          />
        </Box>
        <Stack pt={10} align={'center'}>
          <Stack direction={'row'} align={'center'}>
            <Button
              colorScheme="green"
              onClick={onOpen}
            >
            {cta}
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>{heading}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  {modalContent}
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={onClose}>
                    Close
                  </Button>
                  </ModalFooter>
              </ModalContent>
            </Modal>
          </Stack>
        </Stack>
      </Box>
    </Center>
  )
}

let joinForm = () => {

  const { currentUser } = useAuth()
  return (
    <>

      <Card
        cta="Get Invited"
        image={JOIN_IMAGE}
        modalContent={<Text>Tell the admin of your family to to goto their profile page
      and type in you're email address ({currentUser.email}) to get a code to join</Text>}
      />
    </>
  )
}
let createForm = () => {
  const [createFamily, { loading, error }] = useMutation(
    CREATE_FAMILY_MUTATION,
    {
      onCompleted: () => {
        toast.success('FamilyMember updated')
        navigate(routes.familyMembers())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )
  return (
    <>
      <Card
        cta="Create Family"
        image={CREATE_IMAGE}
        modalContent={<NewFamily />}
      />
    </>
  )
}
// now each form will have to be submitted;
// lets define the GQL for the join family
const JOIN_FAMILY_MUTATION = gql`
  mutation UpdateFamilyMemberMutation(
    $id: String!
    $input: UpdateFamilyMemberInput!
  ) {
    updateFamilyMember(id: $id, input: $input) {
      id
      familyId
      userId
      inviteCode
    }
  }
`
// and the create family
const CREATE_FAMILY_MUTATION = gql`
  mutation CreateFamilyMutation($input: CreateFamilyInput!) {
    createFamily(input: $input) {
      id
    }
  }
`




const SetFamily = () => {
  // now need a function to handle each mutation



  return (
  <>
    {joinForm()}
    {createForm()}
  </>
  )
}

export default SetFamily
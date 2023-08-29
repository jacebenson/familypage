import { useEffect, useState, Fragment } from 'react'

import { ExternalLinkIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'

import { useAuth } from 'src/auth'
import { navigate, routes } from '@redwoodjs/router'
import { toast, Toaster } from '@redwoodjs/web/toast'

import Form from 'src/components/Form'

const Signup = () => {
  const [submitted, setSubmitted] = useState(false)
  const { isAuthenticated, signUp } = useAuth()
  const [passwordMeetsMinLength, setPasswordMeetsMinLength] = useState(false)
  const [passwordHasUpperChars, setPasswordHasUpperChars] = useState(false)
  const [passwordHasLowerChars, setPasswordHasLowerChars] = useState(false)
  const [passwordHasNumberChars, setPasswordHasNumberChars] = useState(false)
  const [passwordHasSpecialChars, setPasswordHasSpecialChars] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.home())
    }
  }, [isAuthenticated])
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
  } = useForm()
  const onSubmit = async (data) => {
    setSubmitted(true)
    const response = await signUp({ ...data })
    if (response.error) {
      toast.error(response.error)
    } else {
      toast.success('Account Created')
      navigate(routes.calendar())
    }
  }
  let fields = [
    {
      name: 'name',
      prettyName: 'Name',
      placeholder: 'Deckard Cain',
      required: 'This is required',
    },
    {
      name: 'username',
      prettyName: 'Email',
      moreInfo: {
        title: 'How we use your email',
        body: (
          <>
            Your email serves one purpose today.
            <Text fontWeight={'bold'}>Resetting your password</Text>
            <hr />
            Someday we{"'"}ll add a way to let you subscribe to these feeds in a
            digest. We will notify you for that once, then you can opt-in.
            <hr />
            Also at anytime you can delete your email from our system and then
            we could not email you.
          </>
        ),
      },
      placeholder: 'deckard.cain@example.com',
    },

    {
      name: 'password',
      prettyName: 'Password',
      onChange: (event) => {
        setPasswordHasNumberChars(false)
        setPasswordHasLowerChars(false)
        setPasswordHasUpperChars(false)
        setPasswordMeetsMinLength(false)
        setPasswordHasSpecialChars(false)
        if (event.target.value?.length >= 8) setPasswordMeetsMinLength(true)
        if (/\d/.test(event.target.value)) setPasswordHasNumberChars(true)
        if (/[a-z]/.test(event.target.value)) setPasswordHasLowerChars(true)
        if (/[A-Z]/.test(event.target.value)) setPasswordHasUpperChars(true)
        if (
          /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(event.target.value)
        ) {
          setPasswordHasSpecialChars(true)
        }
        if (passwordHasSpecialChars === false) {
          setError('password', 'Need to be 8 characters')
        }
      },
      minLength: 8,
      moreInfo: {
        title: 'How is this secured',
        body: (
          <Text>
            This site uses{' '}
            <Link
              isExternal
              href="https://auth0.com/blog/hashing-passwords-one-way-road-to-security/"
            >
              hashing <ExternalLinkIcon mx="2px" />
            </Link>{' '}
            and{' '}
            <Link
              isExternal
              href="https://auth0.com/blog/adding-salt-to-hashing-a-better-way-to-store-passwords/"
            >
              salting <ExternalLinkIcon mx="2px" />
            </Link>
            to keep your details secure. However I personally recommend you also
            use a password manager to manage a unique password for this site.
          </Text>
        ),
      },
      required: 'This is required',
      type: 'password',
    },
  ]
  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}
      >
        {submitted === false && (
          <Fragment>
            <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
              Create an account to login
            </Heading>
            <Form
              fields={fields}
              onSubmit={onSubmit}
              handleSubmit={handleSubmit}
              register={register}
              formState={{ errors, isSubmitting }}
            >
              <Box bg="white" w="100%" color="white">
                <Flex h={'10px'}>
                  <Box
                    borderColor={'black'}
                    borderStyle={'solid'}
                    borderWidth={'1px'}
                    bg={passwordHasLowerChars ? 'green' : 'tomato'}
                    w="100%"
                  ></Box>
                  <Box
                    borderColor={'black'}
                    borderStyle={'solid'}
                    borderWidth={'1px'}
                    bg={passwordHasUpperChars ? 'green' : 'tomato'}
                    w="100%"
                  ></Box>

                  <Box
                    borderColor={'black'}
                    borderStyle={'solid'}
                    borderWidth={'1px'}
                    bg={passwordHasNumberChars ? 'green' : 'tomato'}
                    w="100%"
                  ></Box>
                  <Box
                    borderColor={'black'}
                    borderStyle={'solid'}
                    borderWidth={'1px'}
                    bg={passwordHasSpecialChars ? 'green' : 'tomato'}
                    w="100%"
                  ></Box>
                  <Box
                    borderColor={'black'}
                    borderStyle={'solid'}
                    borderWidth={'1px'}
                    bg={passwordMeetsMinLength ? 'green' : 'tomato'}
                    w="100%"
                  ></Box>
                </Flex>
                <Text color={'black'}></Text>
                <Text color={'black'}>
                  {passwordHasLowerChars ? '✅' : '❌'} Optional Lower
                  Characters
                </Text>
                <Text color={'black'}>
                  {passwordHasUpperChars ? '✅' : '❌'} Optional Upper
                  Characters
                </Text>
                <Text color={'black'}>
                  {passwordHasNumberChars ? '✅' : '❌'} Optional Number
                  Characters
                </Text>
                <Text color={'black'}>
                  {passwordHasSpecialChars ? '✅' : '❌'} Optional Special
                  Characters
                </Text>
                <Text color={'black'}>
                  {passwordMeetsMinLength ? '✅' : '❌'} Is at least eight
                  characters
                </Text>
              </Box>
              <Button
                w={'100%'}
                backgroundColor={'green'}
                rounded={'full'}
                size={'lg'}
                fontWeight={'normal'}
                px={6}
                isLoading={isSubmitting}
                disabled={!passwordMeetsMinLength}
                type="submit"
              >
                Create Your Account
              </Button>
            </Form>
          </Fragment>
        )}
        {submitted && (
          <Fragment>
            <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
              Creating your account!
            </Heading>
          </Fragment>
        )}
      </Stack>
    </Flex>
  )
}

export default Signup

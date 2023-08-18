import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import AddEvent from 'src/components/AddEvent/AddEvent'
import IcsFetch from 'src/components/IcsFetch/IcsFetch'
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Icon,
  Flex,
  useColorModeValue,
  createIcon,
  Spacer,
} from '@chakra-ui/react'
import Card from 'src/components/Card/Card'

const HomePage = () => {
  return (
    <>
      <MetaTags title="Home" description="Home page" />
      <Container maxW={'3xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}>
          <Heading
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
            lineHeight={'110%'}>
            Keep your calendar <br />
            <Text as={'span'} color={'green.400'}>
              open for your family!
            </Text>
          </Heading>
          <Text color={'gray.500'}>
            Monetize your content by charging your most loyal readers and reward them
            loyalty points. Give back to your loyal readers by granting them access to
            your pre-releases and sneak-peaks.
          </Text>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            textAlign={'center'}
            spacing={{ base: 8, md: 14 }}
            >
            <Spacer />
            <Card
              title="Self hosted calendar"
              price={"Free"}
              frequency={"forever"}
              features={[
                "Add events",
                "Share events",
                "Export events",
                "Import events",
                "Sync events",
                "Your data is yours"
              ]}
              CTALink={"https://github.com/jacebenson/familyPage"}
              CTAText={"Learn More"}
            />
            <Spacer />
            <Card
              title="Online"
              price={"4.99"}
              frequency={"month"}
              features={[
                "Add events",
                "Share events",
                "Export events",
                "Import events",
                "Sync events",
                "Access in an Instant"
              ]}
              CTALink={routes.signup()}
              CTAText={"Sign up"}
            />
            <Spacer />
          </Flex>
        </Stack>

      </Container>
      {/*Flex to allow 2 cards centered using chakra ui* */}

      <ul>
        <li>
          <p>🚧Update addEvent to create events</p>
        </li>
        <li>
          <p>✅Update calendar to show events from table</p>
        </li>
        <li>
          <p>⛔add auth</p>
        </li>
        <li>
          <p>⛔add auth user data to addevent</p>
        </li>
        <li>
          <p>⛔render ics file from function endpoint</p>
        </li>
        <li>
          <p>⛔test ics file content</p>
        </li>
        <li>
          <p>⛔update calendar to be filterable by event tags, organizer</p>
        </li>
      </ul>
      <AddEvent />
    </>
  )
}

export default HomePage


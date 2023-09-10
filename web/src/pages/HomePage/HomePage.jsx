import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
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
          py={{ base: 10, md: 20 }}>
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
            Make one calendar and share it.  Add events, share events, and sync events with your family.
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
                "Sync events",
                "You own your data"
              ]}
              CTALink={"https://github.com/jacebenson/familyPage"}
              CTAText={"Learn More"}
              CTATarget={"_blank"}
            />
            <Spacer />
            <Card
              title="Online"
              originalPrice={"0.99"}
              price={"Free"}
              priceComment={"for a limited time"}
              frequency={"month"}
              features={[
                "Add events",
                "Share events",
                "Sync events",
                "Access in an Instant"
              ]}
              CTALink={routes.signup()}
              CTAText={"Sign up"}
              CTA2Link={routes.login()}
              CTA2Text={"Log in"}
            />
            <Spacer />
          </Flex>
        </Stack>

      </Container>
    </>
  )
}

export default HomePage


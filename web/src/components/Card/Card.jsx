import {
  Box,
  Center,
  Text,
  Stack,
  List,
  ListItem,
  ListIcon,
  Button,
  useColorModeValue,
  Flex,
  Spacer,
  Icon,
} from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'

const Card = ({
  title,
  originalPrice,
  price,
  priceComment,
  frequency,
  features,
  CTAText,
  CTALink,
  CTA2Text,
  CTA2Link,
  CTA3Text,
  CTA3Link
}) => {
  if (!title) { title = 'TITLE NOT DEFINED' }
  if (!price) { price = 5.99 }
  if (!frequency) { frequency = 'month' }
  if (!features) { features = ['feature 1', 'feature 2', 'feature 3'] }
  if (!CTAText) { CTAText = 'Learn more' }
  if (!CTALink) { CTALink = 'https://ddg.gg' }
  if (!originalPrice) { originalPrice = false }
  return (
    <Center py={2}>
      <Box
        minW={'330px'}
        maxW={'330px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'md'}
        overflow={'hidden'}>
        <Stack
          textAlign={'center'}
          p={6}
          color={useColorModeValue('gray.800', 'white')}
          align={'center'}>
          <Text
            fontSize={'sm'}
            fontWeight={500}
            bg={useColorModeValue('green.50', 'green.900')}
            p={2}
            px={3}
            color={'green.500'}
            rounded={'full'}>
            {title}
          </Text>
          <Stack direction={'row'} align={'center'} justify={'center'}>
            {price && frequency && (
              <Box>
                <Box display={'flex'}>
                <Box>
                {/**strike through at a 15 degree angle */}
                <Text
                  transform={'rotate(-15deg)'}
                  textDecoration={'line-through'}
                  color={'gray.500'}
                  fontSize={'3xl'}
                  fontWeight={800}>
                  {originalPrice}
                </Text>

              </Box>
                {price !='Free' && (<Text fontSize={'3xl'}>$</Text>)}
                <Text fontSize={'6xl'} fontWeight={800}>
                  {price}
                </Text>
                </Box>
                <Text color={'gray.500'}>/{frequency}</Text>
                {priceComment && (
                  <Text color={'gray.500'} fontSize={'sm'}>{priceComment}</Text>
                )}
              </Box>
            )}

          </Stack>
        </Stack>

        <Box bg={useColorModeValue('gray.50', 'gray.900')} px={6} py={10}>
        <Box as={'ul'} textAlign={'left'}>
            {features.map((feature, index) => (
              <Box as={Flex} key={index} pl={16} mb={2}>
                <Box pr={2}>
                <Icon as={CheckIcon} color="green.400" />
                </Box>
                {feature}
              </Box>
            ))}
        </Box>

          <Button
            as={'a'}
            href={CTALink}
            mt={10}
            w={'full'}
            bg={'green.400'}
            color={'white'}
            rounded={'xl'}
            boxShadow={'0 5px 20px 0px rgb(72 187 120 / 43%)'}
            _hover={{
              bg: 'green.500',
            }}
            _focus={{
              bg: 'green.500',
            }}>
            {CTAText}
          </Button>
          {CTA2Text && (
            <Button
              as={'a'}
              href={CTA2Link}
              mt={10}
              w={'full'}
              bg={'green.400'}
              color={'white'}
              rounded={'xl'}
              boxShadow={'0 5px 20px 0px rgb(72 187 120 / 43%)'}
              _hover={{
                bg: 'green.500',
              }}
              _focus={{
                bg: 'green.500',
              }}>
              {CTA2Text}
            </Button>
          )}
          {CTA3Text && (
            <Button
              as={'a'}
              href={CTA3Link}
              mt={10}
              w={'full'}
              bg={'green.400'}
              color={'white'}
              rounded={'xl'}
              boxShadow={'0 5px 20px 0px rgb(72 187 120 / 43%)'}
              _hover={{
                bg: 'green.500',
              }}
              _focus={{
                bg: 'green.500',
              }}>
              {CTA3Text}
            </Button>
          )}
        </Box>
      </Box>
    </Center>
  )
}

export default Card

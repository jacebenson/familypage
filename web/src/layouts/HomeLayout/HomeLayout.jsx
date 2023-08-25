import {
  Box,
  Flex,
  Avatar,
  HStack,
  Image,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Link,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { useAuth } from 'src/auth'
import { navigate, routes } from '@redwoodjs/router'
const Links = [
  { name: 'Home', path: '/calendar' },
]

const NavLink = (props) => {
  const { children } = props
  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      href={props.href || '#'}>
      {children}
    </Box>
  )
}

const HomeLayout = ({ children }) => {
  const { isAuthenticated, currentUser, logOut } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const logo = '/logo-wide.png'

return (
  <>
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={'center'}>
          <Box>
            <Image src={logo} maxW={'70px'} />
          </Box>
          <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
            {Links.map((link) => (
              <NavLink key={link.name} href={link.path}>{link.name}</NavLink>
            ))}
          </HStack>
        </HStack>
        <Flex alignItems={'center'}>
          <Menu>
          {isAuthenticated && (
            <>
            <MenuButton
              as={Button}
              rounded={'full'}
              variant={'link'}
              cursor={'pointer'}
              title='Account'
              minW={0}>
              <Avatar
                name={currentUser?.name}
                size={'sm'}
                //src={
                //  'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                //}
              />
            </MenuButton>
            <MenuList>
            <MenuItem onClick={()=>{navigate(routes.myProfile())}}>Profile</MenuItem>
            <MenuItem onClick={()=>{navigate(routes.inviteToFamily())}}>Invite Others</MenuItem>
            {currentUser?.roles?.includes('admin') && (
              <>
              <MenuDivider />
              <MenuItem onClick={()=>{navigate(routes.users())}}>Users</MenuItem>
              <MenuItem onClick={()=>{navigate(routes.families())}}>Families</MenuItem>
              </>
            )}
              <MenuDivider />
              <MenuItem onClick={()=>{logOut()}}>Log out</MenuItem>
            </MenuList>
            </>
          )}
          {!isAuthenticated && (
            <MenuButton
              as={Link}
              rounded={'full'}
              variant={'link'}
              cursor={'pointer'}
              minW={0}
              href={routes.login()}
              >
              Login
            </MenuButton>
          )}

          </Menu>
        </Flex>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} spacing={4}>
            {Links.map((link) => (
              <>
              <pre>
              {JSON.stringify(link, null, 2)}
              </pre>
              {/*<NavLink key={link.name}>{link.name}</NavLink>*/}
              </>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>

    <Box p={4}>{children}</Box>
  </>)
}

export default HomeLayout

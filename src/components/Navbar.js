import React from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  useDisclosure,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import usePiPlatform from '../hooks/usePiPlatform';

const NavLink = ({ children, to }) => (
  <Link
    as={RouterLink}
    to={to}
    px={2}
    py={1}
    rounded="md"
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
  >
    {children}
  </Link>
);

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { user } = usePiPlatform();

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH="60px"
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle="solid"
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align="center"
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant="ghost"
            aria-label="Toggle Navigation"
          />
        </Flex>

        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            as={RouterLink}
            to="/"
            textAlign={{ base: 'center', md: 'left' }}
            fontFamily="heading"
            color={useColorModeValue('gray.800', 'white')}
            fontWeight="bold"
          >
            PailotPH
          </Text>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <Stack direction="row" spacing={4}>
              {user ? (
                <>
                  <NavLink to="/driver/deliveries">Deliveries</NavLink>
                  <NavLink to="/driver/earnings">Earnings</NavLink>
                  <NavLink to="/book-delivery">Book Delivery</NavLink>
                  <NavLink to="/my-deliveries">My Deliveries</NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/about">About</NavLink>
                  <NavLink to="/features">Features</NavLink>
                  <NavLink to="/contact">Contact</NavLink>
                </>
              )}
            </Stack>
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify="flex-end"
          direction="row"
          spacing={6}
        >
          {user ? (
            <Menu>
              <MenuButton
                as={Button}
                rounded="full"
                variant="link"
                cursor="pointer"
                minW={0}
              >
                <Avatar
                  size="sm"
                  name={user.username}
                  src={user.avatar}
                />
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/driver/profile">
                  Profile
                </MenuItem>
                <MenuItem as={RouterLink} to="/driver/earnings">
                  Earnings
                </MenuItem>
                <MenuItem as={RouterLink} to="/settings">
                  Settings
                </MenuItem>
                <MenuItem onClick={() => {/* Handle logout */}}>
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <>
              <Button
                as={RouterLink}
                to="/login"
                fontSize="sm"
                fontWeight={400}
                variant="link"
              >
                Sign In
              </Button>
              <Button
                as={RouterLink}
                to="/register"
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize="sm"
                fontWeight={600}
                colorScheme="brand"
              >
                Sign Up
              </Button>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};

export default Navbar;

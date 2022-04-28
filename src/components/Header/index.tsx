import { Flex, Icon, IconButton, Tooltip, useBreakpointValue, useToast } from '@chakra-ui/react'
import { RiLogoutBoxRLine, RiMenuLine } from 'react-icons/ri';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useSidebarDrawer } from '../../contexts/SidebarDrawerContext';

import { Logo } from './Logo';
import { NotificationsNav } from './NotificationsNav';
import { Profile } from './Profile'
import { SearchBox } from './SearchBox';
import { getAuthCookie } from '../../utils/auth-cookies';
import { api } from '../../services/api';
import { useState } from 'react';

export function Header() {

  const router = useRouter();
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const fetcher = (url) => fetch(url).then((r) => r.json());

  const { data: user, mutate: mutateUser } = useSWR('/api/user', fetcher);


  const { onOpen } = useSidebarDrawer()

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  })

  function handleLogout() {

    try {
      setIsLoading(true)
      api.post(`/logout`).then(()=>router.push('/'))

    } catch (error) {
      toast({
        title: `Erro no logout`,
        status: "error",
        position:"top-right",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Flex
      as="header"
      w="100%"
      maxWidth={1480}
      h="20"
      mx="auto"
      mt="4"
      px="6"
      align="center"
    >
      { !isWideVersion && (
        <IconButton
          aria-label="Open navigation"
          icon={<Icon as={RiMenuLine} />}
          fontSize="24"
          variant="unstyled"
          onClick={onOpen}
          mr="2"
        >

        </IconButton>
      ) }

      <Logo />

      { isWideVersion && <SearchBox /> }
    
      <Flex align="center" ml="auto">
        <NotificationsNav />
        <Profile showProfileData={isWideVersion} user={user} />
        <Tooltip hasArrow label='Sair' placement='top'>
          <IconButton
            bg= 'gray.900'
            color= 'gray.50'
            onClick={() =>handleLogout()}
            aria-label='delete'
            size='md'
            isLoading={isLoading}
            fontSize="md"
            ml='2'
            icon={<RiLogoutBoxRLine />}
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
}


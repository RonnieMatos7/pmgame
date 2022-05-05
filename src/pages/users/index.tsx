import NextLink from "next/link";
import { Box, Button, Checkbox, Flex, Heading, HStack, Icon, IconButton, Link, Spinner, Table, Tbody, Td, Text, Th, Thead, Tooltip, Tr, useBreakpointValue, useToast } from "@chakra-ui/react";
import { RiAddLine, RiPencilFill, RiDeleteBin2Fill } from "react-icons/ri";
import { format } from "date-fns";
import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import { getUsers, useUsers } from "../../services/hooks/useUsers";
import { useState } from "react";
import { queryClient } from "../../services/queryClient";
import { api } from "../../services/api";
import { GetServerSideProps } from "next";
import { graphQLClient } from '../../utils/graphql-client';
import useSWR from 'swr';
import { gql } from 'graphql-request';

import { getAuthCookie } from '../../utils/auth-cookies';
import { focusManager, useQuery } from "react-query";
import players from "../api/players";

interface User {
  _id: string
  name: string
  email: string
  role: string
  department: string
}

interface UserProps {
  data: {
    allUsers: {
      data: User[]
    }
  }
}


export default function UserList({ token }) {
  const toast = useToast()
  
  const { data, isLoading, error} = useQuery('players', async () => {
    const response = await api.get('/user/getAllUsers')
    
    const players = response.data?.map(player => {
      return {
        id: player['ref']['@ref'].id,
        name: player.data.name,
        department: player.data.department,
        role: player.data.role,
        email: player.data.email,
        score: player.data.score,
        created_at: player.data.created_at,//format(player.data.created_at, 'dd/MM/yyyy'),
        image_url: player.data.image_url,
      };
    })
    return players.sort((a,b) => (a.name > b.name) ? 1 : -1);
  })

  
  
  if(error) {
    return <div>Error...</div>
  }

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  })
/* 
  async function handlePrefetchUser(userId: string) {
    await queryClient.prefetchQuery(['user', userId], async () => {
      const response = await api.get(`users/${userId}`)

      return response.data;
    }, {
      staleTime: 1000 * 60 * 10, // 10 minutes
    })
  } */

  function handleDeleteUser(user_id:string) {

    try {
      api.delete(`/user/delete/${user_id}`).then(
        () => {
          focusManager.setFocused(true)
          toast({
            title: "Usuário excluído com sucesso",
            status: "success",
            position:"top-right",
            duration: 3000,
            isClosable: true,
          })
        }
      )


    } catch (error) {
      toast({
        title: `Erro na exclusão do usuário`,
        status: "error",
        position:"top-right",
        duration: 3000,
        isClosable: true,
      })
    }



  }

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Usuários
              
              {/* { !data && <Spinner size="sm" color="gray.500" ml="4" /> } */}
            </Heading>

            <NextLink href="/users/create" passHref>
              <Button
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="pink"
                leftIcon={<Icon as={RiAddLine} fontSize="20" />}
              >
                Criar novo
              </Button>
            </NextLink>
          </Flex>

          <Table colorScheme="whiteAlpha">
                <Thead>
                  <Tr>
                    <Th px={["4", "4", "6"]} color="gray.300" width="8">
                      <Checkbox colorScheme="pink" />
                    </Th>
                    <Th>Usuário</Th>
                    { isWideVersion && <Th>Departamento</Th> }
                    { isWideVersion && <Th>Perfil</Th> }
                    { isWideVersion && <Th>Data de cadastro</Th> }
                    <Th>Ação</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data?.map(user => {
                    return (
                      <Tr key={user.id}>
                        <Td px={["4", "4", "6"]}>
                          <Checkbox colorScheme="pink" />
                        </Td>
                        <Td>
                          <Box>
                            <Link color="purple.400">
                              <Text fontWeight="bold">{user.name}</Text>
                            </Link>
                            <Text fontSize="sm" color="gray.300">{user.email}</Text>
                          </Box>
                        </Td>
                        { isWideVersion && <Td>{user?.department}</Td> }
                        { isWideVersion && <Td>{user?.role}</Td> }
                        { isWideVersion && <Td>{user?.created_at}</Td> }
                        <Td>
                          <HStack>
                            <Tooltip hasArrow label='Editar Usuário' placement='top'>
                              <NextLink href={`/users/update/${user.id}`} passHref>
                                <IconButton
                                  colorScheme='teal'
                                  aria-label='edit'
                                  size='sm'
                                  fontSize="lg"
                                  ml='2'
                                  icon={<RiPencilFill />}
                                />
                              </NextLink>
                            </Tooltip>
                            <Tooltip hasArrow label='Deletar Usuário' placement='top'>
                              <IconButton
                                colorScheme='pink'
                                onClick={() =>handleDeleteUser(user.id)}
                                aria-label='delete'
                                size='sm'
                                fontSize="lg"
                                ml='2'
                                icon={<RiDeleteBin2Fill />}
                              />
                            </Tooltip>
                          </HStack>
                        </Td>

                      </Tr>
                    )
                  })}
                </Tbody>
              </Table>


        </Box>
      </Flex>
    </Box>
  );
}

export async function getServerSideProps({res, req, params}) {
  const token = getAuthCookie(req);
  if(!token){
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();
  }
  return { props: { token: token || null } };
}

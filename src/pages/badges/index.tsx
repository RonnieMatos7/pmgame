import NextLink from "next/link";
import { Avatar, Box, Button, Checkbox, Flex, Heading, HStack, Icon, IconButton, Link, Spinner, Table, Tbody, Td, Text, Th, Thead, Tooltip, Tr, useBreakpointValue, useToast } from "@chakra-ui/react";
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
import { useQuery, RefetchOptions, focusManager } from "react-query";
import players from "../api/players";
import { Badge } from "../../components/Badge";

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
  
  const { data, isLoading, error} = useQuery('badge', async () => {
    const response = await api.get('/badges/getAll')
    
    const badges = response.data?.map(badge => {
      return {
        id: badge['ref']['@ref'].id,
        title: badge.data.title,
        score: badge.data.score,
        description: badge.data.description,
        stars: badge.data.stars,
        created_at: badge.data.created_at,
      };
    })
    return badges.sort((a,b) => (a.title > b.title) ? 1 : -1);
  },
)

  
  
  if(error) {
    return <div>Error...</div>
  }

/*   const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  }) */



  function handleDeleteBadge(badge_id:string) {

    try {
      api.delete(`/badges/delete/${badge_id}`).then(
        () => {
          focusManager.setFocused(true)
          toast({
            title: "Conquista excluída com sucesso",
            status: "success",
            position:"top-right",
            duration: 3000,
            isClosable: true,
          })
        }
      )


    } catch (error) {
      toast({
        title: `Erro na exclusão da conquista`,
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
              Conquistas
              
              {/* { !data && <Spinner size="sm" color="gray.500" ml="4" /> } */}
            </Heading>

            <NextLink href="/badges/create" passHref>
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
                    <Th>Imagem</Th>
                    <Th>Nome</Th>
                    <Th>Pontuação</Th>
                    <Th>Criado em</Th>
                    <Th>Ação</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data?.map(badge => {
                    return (
                      <Tr key={badge.id}>
                        <Td px={["4", "4", "6"]}>
                          <Checkbox colorScheme="pink" />
                        </Td>
                        <Td>
                          <Avatar name={badge?.title} src={`/badges/${badge?.title}.png`}/>
                        </Td>
                        <Td>{badge?.title}</Td>
                        <Td>{badge?.score}</Td>
                        <Td>{badge?.created_at}</Td>
                        <Td>
                          <HStack>
                            <Tooltip hasArrow label='Editar Usuário' placement='top'>
                              <NextLink href={`/badges/update/${badge.id}`} passHref>
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
                                  onClick={() =>handleDeleteBadge(badge.id)}
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

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




export default function TaskList({ token }) {
  const toast = useToast()
  
  const { data, isLoading, error} = useQuery('tasks', async () => {
    const response = await api.get('/tasks/getAll')
    
    const tasks = response.data?.map(task => {
      return {
        id: task['ref']['@ref'].id,
        title: task.data.title,
        score: task.data.score,
        description: task.data.description,
        frequency: task.data.frequency,
        created_at: task.data.created_at,
      };
    })
    return tasks.sort((a,b) => (a.title > b.title) ? 1 : -1);
  })

  
  
  if(error) {
    return <div>Error...</div>
  }

/*   const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  }) */

  /* async function handlePrefetchReward(rewardId: string) {
    await queryClient.prefetchQuery(['reward', rewardId], async () => {
      const response = await api.get(`rewards/${rewardId}`)

      return response.data;
    }, {
      staleTime: 1000 * 60 * 10, // 10 minutes
    })
  } */

  function handleDeleteTask(task_id:string) {

    try {
      api.delete(`/task/delete/${task_id}`).then(
        () => {
          focusManager.setFocused(true)
          toast({
            title: "Entrega excluída com sucesso",
            status: "success",
            position:"top-right",
            duration: 3000,
            isClosable: true,
          })
        }
      )

      
    } catch (error) {
      toast({
        title: `Erro na exclusão da entrega`,
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
              Entregas
              
              {/* { !data && <Spinner size="sm" color="gray.500" ml="4" /> } */}
            </Heading>

            <NextLink href="/tasks/create" passHref>
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
                    <Th>Título</Th>
                    <Th>Periodicidade</Th>
                    <Th>Pontuação</Th>
                    <Th>Criado em</Th>
                    <Th>Ação</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data?.map(task => {
                    return (
                      <Tr key={task.id}>
                        <Td px={["4", "4", "6"]}>
                          <Checkbox colorScheme="pink" />
                        </Td>
                        <Td>
                          <Box>
                            <Link color="purple.400">
                              <Text fontWeight="bold">{task?.title}</Text>
                            </Link>
                            <Text fontSize="sm" color="gray.300">{task?.description}</Text>
                          </Box>
                        </Td>
                        <Td>{task?.frequency}</Td>
                        <Td>{task?.score}</Td>
                        <Td>{task?.created_at}</Td>
                        <Td>
                          <HStack>
                            <Tooltip hasArrow label='Editar Usuário' placement='top'>
                              <NextLink href={`/tasks/update/${task.id}`} passHref>
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
                                  onClick={() =>handleDeleteTask(task.id)}
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

import { Box, Text, Button, Divider, Flex, Heading, HStack, Select, SimpleGrid, VStack, Icon, Table, Thead, Th, Tbody, Td, Tr, Avatar, Tooltip, TabPanel, Tab, TabList, TabPanels, Tabs } from "@chakra-ui/react";
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation, useQuery } from 'react-query'
import NextLink from "next/link";

import { Input } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/api";
import { queryClient } from "../../services/queryClient";
import useSWR from "swr";
import { getAuthCookie } from "../../utils/auth-cookies";
import { RiLock2Line } from "react-icons/ri";

type CreateUserFormData = {
  name: string;
  email: string;
  id: string;
  role:string;
  department:string;
  image_url:string;
  password: string;
  password_confirmation: string;
};



export default function Guide() {
  const router = useRouter()

  const fetcher = (url: any) => fetch(url).then((r) => r.json());
  const { data: rewards, mutate: mutateReward } = useSWR('/api/reward/getAll', fetcher);
  
  const { data:tasks, isLoading:isLoadingTasks, error:errorTasks} = useQuery('tasks', async () => {
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
  const { data:badges, isLoading:isLoadingBadges, error:errorBadges} = useQuery('badges', async () => {
    const response = await api.get('/badges/getAll')
    
    const badges = response.data?.map(badge => {
      return {
        id: badge['ref']['@ref'].id,
        title: badge.data.title,
        score: badge.data.score,
        description: badge.data.description,
        icon: badge.data.icon,
        created_at: badge.data.created_at,
      };
    })
    return badges.sort((a,b) => (a.title > b.title) ? 1 : -1);
  })
  

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <Box
          as="form"
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={["6", "8"]}
        >
          <Flex mb="8" justify="space-between" align="left">
            <VStack>
              <Heading mb={"4"} size="lg" fontWeight="normal" alignContent={"flex-start"}>
              Guia da Gamificação
              </Heading>
              <section>
                <Heading mb={"4"} size="md" fontWeight="normal" alignContent={"left"} textAlign={"left"} alignSelf={'left'}>
                O que é gamificação ?
                </Heading>
                <Text mb={"8"}>
                  Consiste em usar técnicas, estratégias e o design de games em outros contextos que não sejam necessariamente associadas aos jogos em si.  É trazer o jogo para a realidade e com isso impactar pontos como engajamento, produtividade, foco, determinação e outros, tornando mais simples atingir metas e objetivos em qualquer contexto.
                </Text>
                <Heading mb={"4"} size="md" fontWeight="normal" alignContent={"left"} textAlign={"left"} alignSelf={'left'}>
                  O que é o PM ESE Game ?
                </Heading>
                <Text mb={"8"}>
                  Trata-se de um game para incentivar e reconhecer a alta performance dos gerentes de projetos.
                </Text>
                <Heading mb={"4"} size="md" fontWeight="normal" alignContent={"left"} textAlign={"left"} alignSelf={'left'}>
                  Qual é o ciclo do game ?
                </Heading>
                <Text mb={"8"}>
                  O ciclo 2022 da gamificação inicará em 01/05/2022 e finalizará em 31/11/2022.
                </Text>
                <Heading mb={"4"} size="md" fontWeight="normal" alignContent={"left"} textAlign={"left"} alignSelf={'left'}>
                  Quais são os elementos do game ?
                </Heading>
                <Text mb={"6"}>
                  Para o ciclo utilizaremos os elementos: Jogadores, Conquistas, Entregas e Recompensas.;
                </Text>
                <Tabs>
                  <TabList>
                    <Tab>Jogadores</Tab>
                    <Tab>Entregas</Tab>
                    <Tab>Conquistas</Tab>
                    <Tab>Recompensas</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <Text mb={"6"}>
                        Os jogadores serão os gerentes de projetos do ano.
                      </Text>
                    </TabPanel>
                    <TabPanel>
                      <Table>
                        <Thead>
                          <Tr >
                            <Th justifyContent={"center"}>Entrega</Th>
                            <Th justifyContent={"center"}>Período</Th>
                            <Th justifyContent={"center"}>Pontuação</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {tasks?.map(task=>(
                            <Tr key={task?.title}>
                              <Td>{task?.title}</Td>
                              <Td>{task?.frequency}</Td>
                              <Td>{task?.score}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TabPanel>
                    <TabPanel>
                      <Table>
                        <Thead>
                          <Tr >
                            <Th justifyContent={"center"}>Conquista</Th>
                            <Th justifyContent={"center"}>Descrição</Th>
                            <Th justifyContent={"center"}>Pontuação</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {badges?.map((badge, index)=>(
                            <Tr key={badge?.title}>
                              <Td><Tooltip key={index} hasArrow label={`${badge?.title}`} placement='top'><Avatar key={badge?.title} name={badge?.title} src={`/badges/${badge?.title}.png`} /></Tooltip></Td>
                              <Td>{badge?.description}</Td>
                              <Td>{badge?.score}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TabPanel>
                    <TabPanel>
                      <Table>
                        <Thead>
                          <Tr >
                            <Th justifyContent={"center"}>Recompensa</Th>
                            <Th justifyContent={"center"}>Pontuação</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {rewards?.map(reward=>(
                            <Tr key={reward?.data?.title}>
                              <Td>{reward?.data?.title}</Td>
                              <Td>{reward?.data?.score}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </section>



            </VStack>

            
          </Flex>

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

import { Box, Text, Button, Divider, Flex, Heading, HStack, Select, SimpleGrid, VStack, Avatar, Checkbox, Icon, Table, Tbody, Td, Th, Thead, Tooltip, Tr, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation, useQuery } from 'react-query'

import { Input } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/api";
import { queryClient } from "../../services/queryClient";
import { format } from "date-fns";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { RiAddLine, RiCheckFill, RiCloseFill, RiDeleteBin2Line, RiFileAddLine, RiFileList3Line, RiMedalLine } from "react-icons/ri";


type CreateSolicitationFormData = {
  title: string,
  player: {
    id: string,
    name: string,
    email: string,
    image_url: string
  },
  score: number,
  month: string,
  description: string;
  status: string
};

type PlayerProps ={
  id: string,
  name: string,
  email: string,
  image_url: string
}

type ShopCartTaskProps = {
  id: string,
  player: {
    id: string,
    name: string,
    email: string,
    image_url: string
  },
  task_id: string,
  title: string,
  score: number,
  month: string,
  created_at: string
}
type ShopCartBadgeProps = {
  id: string,
  player: {
    id: string,
    name: string,
    email: string,
    image_url: string
  },
  badge_id: string,
  title: string,
  score: number,
  month: string,
  created_at: string
}

type TaskProps = {
  id: string,
  title: string,
  score: number,
  created_at?: string
}

const createUserFormSchema = yup.object().shape({
  title: yup.string().required('Escolha uma entrega'),
  month: yup.string().required('Selecione o mês de referência'),
})

/* function guidGenerator() {
  var S4 = function() {
     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
} */



export default function CreateSolicitation() {
  
  
  
  const router = useRouter()

  const [total, setTotal] = useState<number>(0)
  const [shopCartTask, setShopCartTask] = useState<ShopCartTaskProps[]>([])
  const [shopCartBadge, setShopCartBadge] = useState<ShopCartBadgeProps[]>([])
  const [taskSelected, setTaskSelected] = useState('')
  const [badgeSelected, setBadgeSelected] = useState('')
  const [selectedPlayer, setSelectedPlayer] = useState('')
  const [monthSelected, setMonthSelected] = useState('')



  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data: user, mutate: mutateUser } = useSWR('/api/user', fetcher);
  
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


  const createSolicitation = useMutation(async (solicitation: CreateSolicitationFormData) => {
    const response = await api.post('solicitations/createSolicitation', {
      solicitation: {
        ...solicitation,
        selectedPlayer, 
        created_at: format(new Date(), 'dd/MM/yyyy'),
      }
    })

    return response.data.badge;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('solicitation')
    }
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(createUserFormSchema)
  })

  function handleDeleteShopCartTaskItem(id:string, score:number){
    
    console.log({
      id,
      score
    })
    const dados = shopCartTask
    const subtotal = total - score
    setTotal(subtotal)
    var filteredData = dados.filter(e => e.id !== id)
    setShopCartTask(filteredData)
  } 
  function handleDeleteShopCartBadgeItem(id:string, score:number){
    
    console.log({
      id,
      score
    })
    const dados = shopCartBadge
    const subtotal = total - score
    setTotal(subtotal)
    var filteredData = dados.filter(e => e.id !== id)
    setShopCartBadge(filteredData)
  } 
  

  async function handleAddTaskitem(id:any){
    let task = await tasks.filter(x => x.id === taskSelected)
    let subtotal = 0
    if(task[0]){
          subtotal = total + task[0].score
          setTotal(subtotal)
          const newItem = {
            player:user,
            type: 'task',
            title: task[0].title,
            score: task[0].score,
            month: monthSelected,
            task_id:task[0]?.id,
            id,
            created_at: format(new Date(), 'dd/MM/yyyy')
          }
          setShopCartTask((t) => [...t, newItem]);
        }
      
  }
  async function handleAddBadgeitem(id:any){
    let badge = await badges.filter(x => x.id === badgeSelected)
    let subtotal = 0
    if(badge[0]){
          subtotal = total + badge[0].score
          setTotal(subtotal)
          const newItem = {
            player: user,
            type: 'badge',
            icon: badge[0].icon,
            title: badge[0].title,
            score: badge[0].score,
            month: monthSelected,
            badge_id:badge[0]?.id,
            id,
            created_at: format(new Date(), 'dd/MM/yyyy')
          }
          setShopCartBadge((t) => [...t, newItem]);
        }
      
  }

  const handleCreateSolicitation: SubmitHandler<CreateSolicitationFormData> = async (values) => {
    await createSolicitation.mutateAsync(values);

    router.push(`\solicitations`)
  }

  
  const handleAddSolicitationTaskItem = async () => {
    try {
      shopCartTask.map(async item=>{
        console.log(item)
        const response = await api.post('solicitations/createSolicitation', {
          solicitation: {
            item, 
            created_at: format(new Date(), 'dd/MM/yyyy')
          }
        })})
        router.push('/my-solicitations')
    } catch (error) {
      console.log(error)
    }
  }

  const handleAddSolicitationBadgeItem = async () => {
    try {
      shopCartBadge.map(async item=>{
        console.log(item)
        const response = await api.post('solicitations/createSolicitation', {
          solicitation: {
            item, 
            created_at: format(new Date(), 'dd/MM/yyyy')
          }
        })})
        router.push('/my-solicitations')
    } catch (error) {
      console.log(error)
    }
  }


  

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
          <Tabs size='md' variant='enclosed'>
            <TabList>
              <Tab><Icon as={RiFileList3Line}/>&nbsp;Entrega</Tab>
              <Tab><Icon as={RiMedalLine}/>&nbsp;Conquista</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Flex mb="8" justify="space-between" align="center">
                  <Heading size="lg" fontWeight="normal">
                    Criar Solicitação de Entrega
                    
                    {/* { !data && <Spinner size="sm" color="gray.500" ml="4" /> } */}
                  </Heading>
                  <Heading size="md" fontWeight="normal">
                    Total: {total}
                  </Heading>

                </Flex>

                <Divider my="6" borderColor="gray.700" />

                <VStack spacing="8" onSubmit={()=>handleAddSolicitationTaskItem()}>
                  <SimpleGrid minChildWidth="240px" flex={'1'} spacing={["4", "6"]} w="100%"
                  
                  >
                    <Box>
                      <Text fontWeight='medium'>Mês de Referência</Text>
                      <Select
                      mt='3'
                        name="month"
                        onChange={e=> setMonthSelected(e.target.value)}
                        label="Mês de Referência"
                        error={errors.month}
                      >
                        <option key={'Selecione'} value={0}>Selecione o mês</option> 
                        
                        <option key={'Janeiro'} value={'Janeiro'}>Janeiro</option>
                        <option key={'Fevereiro'} value={'Fevereiro'}>Fevereiro</option>
                        <option key={'Março'} value={'Março'}>Março</option>
                        <option key={'Abril'} value={'Abril'}>Abril</option>
                        <option key={'Maio'} value={'Maio'}>Maio</option>  
                        <option key={'Junho'} value={'Junho'}>Junho</option>  
                        <option key={'Julho'} value={'Julho'}>Julho</option>  
                        <option key={'Agosto'} value={'Agosto'}>Agosto</option>  
                        <option key={'Setembro'} value={'Setembro'}>Setembro</option>  
                        <option key={'Outubro'} value={'Outubro'}>Outubro</option>  
                        <option key={'Novembro'} value={'Novembro'}>Novembro</option> 
                        <option key={'Dezembro'} value={'Dezembro'}>Dezembro</option>
                      
                      </Select>
                    </Box>
                    
                    <Box>
                      <Text fontWeight='medium'>Entrega</Text>
                        <Select
                          mt='3'
                          name="task"
                          onChange={(e => setTaskSelected(e.target.value))}
                          label="Entrega"
                          error={errors.task}
                        >
                          <option key={'SelecioneTask'} value={0}>Selecione a Entrega</option> 
                          {tasks?.map(item => (
                              <option key={item?.title} value={item?.id}>{item?.title}</option> 
                            ))}

                        </Select>
                    </Box>
                    
                    <Box mx='0' my={"auto"} pt={10} justifyContent='flex-end'>
                      <Tooltip hasArrow label='Adicionar item' placement='top'>
                        <Button
                          type="submit"
                          as="a"
                          size="sm"
                          fontSize="sm"
                          colorScheme="teal"
                          shadow="md"
                          onClick={async ()=>await handleAddTaskitem(new Date().getMilliseconds())}
                          >
                          <Icon as={RiAddLine} fontSize="16"/>
                        </Button>
                      </Tooltip>
                    </Box>
                  </SimpleGrid>

                <Divider my="6" borderColor="gray.700" />
                <Table colorScheme="whiteAlpha">
                      <Thead>
                        <Tr>
                          <Th px={["4", "4", "6"]} color="gray.300" width="8">
                            <Checkbox colorScheme="pink" />
                          </Th>
                          <Th>Jogador</Th>
                          <Th>Titulo</Th>
                          <Th>Pontuação</Th>
                          <Th>Mês</Th>
                          <Th>Ação</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {shopCartTask?.map(solicitation => {
                          return (
                            <Tr key={solicitation?.id}>
                              <Td px={["4", "4", "6"]}>
                                <Checkbox colorScheme="pink" />
                              </Td>
                              <Td>{solicitation?.player.name}</Td>
                              <Td>{solicitation?.title}</Td>
                              <Td>{solicitation?.score}</Td>
                              <Td>{solicitation?.month}</Td>
                              <Td>
                                <HStack>
                                    <Tooltip hasArrow label='Excluir Entrega' placement='top'>
                                      <Button
                                        as="a"
                                        size="sm"
                                        fontSize="sm"
                                        colorScheme="red"
                                        shadow="md"
                                        onClick={()=>handleDeleteShopCartTaskItem(solicitation.id, solicitation.score)}
                                      >
                                        <Icon as={RiDeleteBin2Line} fontSize="16"/>
                                      </Button>
                                    </Tooltip>
                                </HStack>
                              </Td>

                            </Tr>
                          )
                        })}
                      </Tbody>
                    </Table>
                  
                </VStack>
                <Divider my="6" borderColor="gray.700" />
                <Flex mt="8" justify="flex-end">
                  <HStack spacing="4">
                    <Link href="/users" passHref>
                      <Button as="a" colorScheme="whiteAlpha">Cancelar</Button>
                    </Link>
                    <Button
                      onClick={()=>handleAddSolicitationTaskItem()}
                      colorScheme="pink"
                      isLoading={isSubmitting}
                    >
                      Salvar
                    </Button>
                  </HStack>
                </Flex>
              </TabPanel>
              <TabPanel>
              <Flex mb="8" justify="space-between" align="center">
                  <Heading size="lg" fontWeight="normal">
                    Criar Solicitação de Conquista
                    
                    {/* { !data && <Spinner size="sm" color="gray.500" ml="4" /> } */}
                  </Heading>
                  <Heading size="md" fontWeight="normal">
                    Total: {total}
                  </Heading>

                </Flex>

                <Divider my="6" borderColor="gray.700" />

                <VStack spacing="8" onSubmit={()=>handleAddSolicitationBadgeItem()}>
                  <SimpleGrid minChildWidth="240px" flex={'1'} spacing={["4", "6"]} w="100%"
                  
                  >
                    <Box>
                      <Text fontWeight='medium'>Mês de Referência</Text>
                      <Select
                      mt='3'
                        name="month"
                        onChange={e=> setMonthSelected(e.target.value)}
                        label="Mês de Referência"
                        error={errors.month}
                      >
                        <option key={'Selecione'} value={0}>Selecione o mês</option> 
                        <option key={'Maio'} value={'Maio'}>Maio</option>  
                        <option key={'Junho'} value={'Junho'}>Junho</option>  
                        <option key={'Julho'} value={'Julho'}>Julho</option>  
                        <option key={'Agosto'} value={'Agosto'}>Agosto</option>  
                        <option key={'Setembro'} value={'Setembro'}>Setembro</option>  
                        <option key={'Outubro'} value={'Outubro'}>Outubro</option>  
                        <option key={'Novembro'} value={'Novembro'}>Novembro</option>  
                      </Select>
                    </Box>
                    
                  
                    <Box>
                      <Text fontWeight='medium'>Conquista</Text>
                        <Select
                          mt='3'
                          name="task"
                          onChange={(e => setBadgeSelected(e.target.value))}
                          label="Entrega"
                          error={errors.task}
                        >
                          <option key={'SelecioneBadge'} value={0}>Selecione a Conquista</option> 
                          {badges?.map((item, index) => (
                              <option key={index} value={item?.id}>{item?.title}</option> 
                            ))}

                        </Select>
                    </Box>
                    
                    <Box mx='0' my={"auto"} pt={10} justifyContent='flex-end'>
                      <Tooltip hasArrow label='Adicionar item' placement='top'>
                        <Button
                          type="submit"
                          as="a"
                          size="sm"
                          fontSize="sm"
                          colorScheme="teal"
                          shadow="md"
                          onClick={async ()=>await handleAddBadgeitem(new Date().getMilliseconds())}
                          >
                          <Icon as={RiAddLine} fontSize="16"/>
                        </Button>
                      </Tooltip>
                    </Box>
                  </SimpleGrid>

                <Divider my="6" borderColor="gray.700" />
                <Table colorScheme="whiteAlpha">
                      <Thead>
                        <Tr>
                          <Th px={["4", "4", "6"]} color="gray.300" width="8">
                            <Checkbox colorScheme="pink" />
                          </Th>
                          <Th>Jogador</Th>
                          <Th>Conquista</Th>
                          <Th>Pontuação</Th>
                          <Th>Mês</Th>
                          <Th>Ação</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {shopCartBadge?.map(solicitation => {
                          return (
                            <Tr key={solicitation?.id}>
                              <Td px={["4", "4", "6"]}>
                                <Checkbox colorScheme="pink" />
                              </Td>
                              <Td>{solicitation?.player.name}</Td>
                              <Td>
                                <Avatar name={solicitation?.title} src={`/badges/${solicitation?.title}.png`}/>
                              </Td>
                              <Td>{solicitation?.score}</Td>
                              <Td>{solicitation?.month}</Td>
                              <Td>
                                <HStack>
                                    <Tooltip hasArrow label='Excluir Entrega' placement='top'>
                                      <Button
                                        as="a"
                                        size="sm"
                                        fontSize="sm"
                                        colorScheme="red"
                                        shadow="md"
                                        onClick={()=>handleDeleteShopCartBadgeItem(solicitation.id, solicitation.score)}
                                      >
                                        <Icon as={RiDeleteBin2Line} fontSize="16"/>
                                      </Button>
                                    </Tooltip>
                                </HStack>
                              </Td>

                            </Tr>
                          )
                        })}
                      </Tbody>
                    </Table>
                  
                </VStack>
                <Divider my="6" borderColor="gray.700" />
                <Flex mt="8" justify="flex-end">
                  <HStack spacing="4">
                    <Link href="/users" passHref>
                      <Button as="a" colorScheme="whiteAlpha">Cancelar</Button>
                    </Link>
                    <Button
                      onClick={()=>handleAddSolicitationBadgeItem()}
                      colorScheme="pink"
                      isLoading={isSubmitting}
                    >
                      Salvar
                    </Button>
                  </HStack>
                </Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>
          
        </Box>
      </Flex>
    </Box>
  );
}

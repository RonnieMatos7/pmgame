import { Avatar, AvatarGroup, Badge, Box, Center, Checkbox, Divider, Flex, HStack, Icon, IconButton, Link, SimpleGrid, Table, Tbody, Td, Text, Th, Thead, theme, Tooltip, Tr, VStack } from "@chakra-ui/react";
import dynamic from 'next/dynamic';
import { RiPencilFill, RiDeleteBin2Fill, RiArrowLeftSFill, RiArrowRightSFill, RiArrowDownSFill, RiArrowUpSFill, RiSubtractFill } from "react-icons/ri";
import { FaCrown } from "react-icons/fa";
import { useQuery } from "react-query";
import { DepartmentAvatar } from "../components/DepartmentAvatar";
import { Header } from "../components/Header";
import { PlayerAvatar } from "../components/PlayerAvatar";
import { Sidebar } from "../components/Sidebar";
import { api } from "../services/api";
import { getAuthCookie } from "../utils/auth-cookies";

/* const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

const options = {
  chart: {
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    foreColor: theme.colors.gray[500],
  },
  grid: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    enabled: false,
  },
  xaxis: {
    type: 'datetime',
    axisBorder: {
      color: theme.colors.gray[600]
    },
    axisTicks: {
      color: theme.colors.gray[600]
    },
    categories: [
      '2021-03-18T00:00:00.000Z',
      '2021-03-19T00:00:00.000Z',
      '2021-03-20T00:00:00.000Z',
      '2021-03-21T00:00:00.000Z',
      '2021-03-22T00:00:00.000Z',
      '2021-03-23T00:00:00.000Z',
      '2021-03-24T00:00:00.000Z',
    ],
  },
  fill: {
    opacity: 0.3,
    type: 'gradient',
    gradient: {
      shade: 'dark',
      opacityFrom: 0.7,
      opacityTo: 0.3,
    },
  },
};

const series = [
  { name: 'series1', data: [31, 120, 10, 28, 61, 18, 109] }
] */

export default function Dashboard() {

  const { data, isLoading, error} = useQuery('players', async () => {
    const response = await api.get('/players')
    
    const players = response.data?.map(player => {
      return {
        id: player['ref']['@ref'].id,
        name: player.data.name,
        department: player.data.department,
        role: player.data.role,
        position: player.data.position,
        old_position: player.data.old_position,
        badges: player.data.badges,
        email: player.data.email,
        score: player.data.score,
        created_at: player.data.created_at,//format(player.data.created_at, 'dd/MM/yyyy'),
        image_url: player.data.image_url,
      };
    })
    return players.sort((a,b) => (a.position > b.position) ? 1 : -1);
  })
  
  return (
    <Flex direction="column" h="100vh">
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <SimpleGrid flex="1" gap="4" columns={1} align="flex-start">
          <Box
            p={["6", "8"]}
            bg="gray.800"
            borderRadius={8}
            pb="4"
          >
            <Text fontSize="lg" mb="4">Top Departamentos (Em breve)</Text>
            
            {/* <Chart options={options} series={series} type="area" height={160} /> */}
            
            {/* <HStack>
              <DepartmentAvatar
                name="DCMD"
                department="DTEC"
                score={1000}
                position={1}
                color="yellow"
                avatar= {false}
              />
              <Center height='20'>
                <Divider orientation='vertical' />
              </Center>
              <DepartmentAvatar
                name="DECP"
                department="DTEC"
                score={1000}
                position={2}
                color="gray"
                avatar= {false}
              />
              <Center height='20'>
                <Divider orientation='vertical' />
              </Center>
              <DepartmentAvatar
                name="Facilities"
                department="DCSE"
                score={1000}
                position={3}
                color="orange"
                avatar= {false}
              />
            </HStack> */}
            
          </Box>
          <Box
            p={["6", "8"]}
            bg="gray.800"
            borderRadius={8}
            pb="4"
          >
            <Text fontSize="lg" mb="4">Top Gerentes de Projetos</Text>
            {/* <Chart options={options} series={series} type="area" height={160} /> */}
            <Table colorScheme="whiteAlpha">
                <Thead>
                  <Tr >
                    <Th justifyContent={"center"}>Posição</Th>
                    <Th justifyContent={"flex-start"}>Avatar</Th>
                    <Th justifyContent={"flex-start"}>Jogador</Th>
                    <Th justifyContent={"fcenter"}>Conquistas</Th>
                    <Th justifyContent={"flex-end"}>Pontuação</Th>
                  </Tr>
                </Thead>
                <Tbody>
                {data?.map(player => {
                    return (
                      <Tr key={player.id}>
                        <Td justifyContent={"center"}>
                          <HStack>
                          { player?.position=== 1 ?
                              (
                                <Icon as={FaCrown} w={8} h={8} mr={2} color='yellow.400' />
                                )
                                : player?.position=== 2 ?
                                (
                                  <Icon as={FaCrown} w={8} h={8} mr={2} color='gray.400' />
                                  )
                                  : player?.position=== 3 ?
                                  (
                                    <Icon as={FaCrown} w={8} h={8} mr={2} color='orange.400' />
                                    )
                                    :
                                    (
                                      <Badge bg={'gray.400'} textColor='white' mr={2}  h='full' py='0.5' px='4' w='auto'>
                                  {player?.position}
                                </Badge>           
                              )
                            }
                                        { player?.position - player?.old_position === 0 ?
                                          (
                                            <Text fontSize={"small"}>
                                              <Icon as={RiSubtractFill} w={6} h={6} color='gray.400' />
                                            </Text>
                                          )
                                          : player?.position - player?.old_position < 0 ?
                                          (
                                            <Text fontSize={"small"}>
                                              -{player?.position - player?.old_position}
                                              <Icon as={RiArrowDownSFill} w={6} h={6} color='red.400' />
                                            </Text>
                                            )
                                            : 
                                            (
                                              <Text fontSize={"small"}>
                                              +{player?.position - player?.old_position}
                                              <Icon as={RiArrowUpSFill} w={6} h={6} color='green.400' />
                                            </Text>
                                            )
                                          }
                            </HStack>
                        </Td>
                        <Td justifyContent={"flex-start"}>
                          <Avatar name={player?.name} src={player?.image_url}/>
                        </Td>
                        <Td justifyContent={"flex-start"}>
                          <Box>
                            <Text fontWeight='bold'>
                              {player?.name}
                            </Text>
                            <Text fontSize='sm'>{player?.department}</Text>
                          </Box>  
                        </Td>
                        <Td justifyContent={"center"}>
                          <AvatarGroup size='md' max={3}>
                          {player?.badges?.map((badge,index) =>{
                              <Avatar key={index} name={badge?.title} src={`/badges/${badge?.title}.png`} />
                            })}
                          </AvatarGroup>
                        </Td>
                        <Td justifyContent={"flex-end"}>
                        <Badge colorScheme='gray'  h='full' py='0.5' px='4' w='auto' variant='solid'>
                          <Text fontWeight='bold' fontSize='sm'>
                            {player?.score}
                          </Text>
                        </Badge>
                        </Td>
                      </Tr>
                    )
                  })}
                </Tbody>
              </Table>
            
          </Box>
        </SimpleGrid>
      </Flex>
    </Flex>
  )
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
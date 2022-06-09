import { Avatar, AvatarGroup, Badge, Box, Center, Checkbox, Divider, Flex, HStack, Icon, IconButton, Link, SimpleGrid, Table, Tbody, Td, Text, Th, Thead, theme, Tooltip, Tr, VStack } from "@chakra-ui/react";
import dynamic from 'next/dynamic';
import { RiPencilFill, RiDeleteBin2Fill, RiArrowLeftSFill, RiArrowRightSFill, RiArrowDownSFill, RiArrowUpSFill, RiSubtractFill, RiSearchLine, RiBarChart2Fill } from "react-icons/ri";
import { FaCrown } from "react-icons/fa";
import { useQuery } from "react-query";
import { DepartmentAvatar } from "../components/DepartmentAvatar";
import { Header } from "../components/Header";
import { PlayerAvatar } from "../components/PlayerAvatar";
import { Sidebar } from "../components/Sidebar";
import { api } from "../services/api";
import { getAuthCookie } from "../utils/auth-cookies";
import useSWR from "swr";
import router from "next/router";



export default function Dashboard() {

  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data: topDepartment, mutate: mutateUser } = useSWR('/api/topDepartment', fetcher);

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

        <SimpleGrid flex="1" gap="4" columns={1} alignContent="flex-start">
          <Box
            p={["6", "8"]}
            bg="gray.800"
            borderRadius={8}
            pb="4"
          >
            <Text fontSize="lg" mb="4">Top Departamentos</Text>
            
            {/* <Chart options={options} series={series} type="area" height={160} /> */}


            
            <HStack>

            {topDepartment ? (
              <>
              <Flex key={topDepartment[0]?.department} flex='1' justifyContent={"space-between"} align='center' py='3' px='5' >
                  { topDepartment[0]?.position=== 1 ?
                    (
                      <Icon as={FaCrown} w={8} h={8} mr={2} color='yellow.400' />
                      )
                      : topDepartment[0]?.position=== 2 ?
                      (
                        <Icon as={FaCrown} w={8} h={8} mr={2} color='gray.400' />
                        )
                        : 
                        (
                          <Icon as={FaCrown} w={8} h={8} mr={2} color='orange.400' />
                          )
                  }
                  <Flex flex='1' justifyContent={"center"} align='center'>
                    
                    <Box>
                      <Text fontWeight='bold'>
                      {topDepartment[0]?.department}
                      </Text>
                    </Box>  
                  </Flex>
                  <Badge colorScheme='gray'  h='full' py='0.5' px='4' w='auto' variant='solid'>
                    <Text fontWeight='bold' fontSize='sm'>
                      {topDepartment[0]?.average}
                    </Text>
                  </Badge>
                </Flex>
                <Center height='20'>
                  <Divider orientation='vertical' />
                </Center>
              <Flex key={topDepartment[1]?.department} flex='1' justifyContent={"space-between"} align='center' py='3' px='5' >
                  { topDepartment[1]?.position=== 1 ?
                    (
                      <Icon as={FaCrown} w={8} h={8} mr={2} color='yellow.400' />
                      )
                      : topDepartment[1]?.position=== 2 ?
                      (
                        <Icon as={FaCrown} w={8} h={8} mr={2} color='gray.400' />
                        )
                        : 
                        (
                          <Icon as={FaCrown} w={8} h={8} mr={2} color='orange.400' />
                          )
                  }
                  <Flex flex='1' justifyContent={"center"} align='center'>
                    
                    <Box>
                      <Text fontWeight='bold'>
                      {topDepartment[1]?.department}
                      </Text>
                    </Box>  
                  </Flex>
                  <Badge colorScheme='gray'  h='full' py='0.5' px='4' w='auto' variant='solid'>
                    <Text fontWeight='bold' fontSize='sm'>
                      {topDepartment[1]?.average}
                    </Text>
                  </Badge>
                </Flex>
                <Center height='20'>
                  <Divider orientation='vertical' />
                </Center>
              <Flex key={topDepartment[2]?.department} flex='1' justifyContent={"space-between"} align='center' py='3' px='5' >
                  { topDepartment[2]?.position=== 1 ?
                    (
                      <Icon as={FaCrown} w={8} h={8} mr={2} color='yellow.400' />
                      )
                      : topDepartment[2]?.position=== 2 ?
                      (
                        <Icon as={FaCrown} w={8} h={8} mr={2} color='gray.400' />
                        )
                        : 
                        (
                          <Icon as={FaCrown} w={8} h={8} mr={2} color='orange.400' />
                          )
                  }
                  <Flex flex='1' justifyContent={"center"} align='center'>
                    
                    <Box>
                      <Text fontWeight='bold'>
                      {topDepartment[2]?.department}
                      </Text>
                    </Box>  
                  </Flex>
                  <Badge colorScheme='gray'  h='full' py='0.5' px='4' w='auto' variant='solid'>
                    <Text fontWeight='bold' fontSize='sm'>
                      {topDepartment[2]?.average}
                    </Text>
                  </Badge>
                </Flex>
              </>
            ) : null}

            </HStack>
            
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
                    <Th justifyContent={"center"}>Conquistas</Th>
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
                        <Td >
                          <AvatarGroup spacing={"-0.75rem"} size='md' max={3}>
                            { player.badges[0] &&<Tooltip hasArrow label={`${player.badges[0].title}`} placement='top'><Avatar key={player.badges[0].title} name={player.badges[0]?.title} src={`/badges/${player.badges[0]?.title}.png`} /></Tooltip>}
                            { player.badges[1] &&<Tooltip hasArrow label={`${player.badges[1].title}`} placement='top'><Avatar ml={"-3"} key={player.badges[1].title} name={player.badges[1]?.title} src={`/badges/${player.badges[1]?.title}.png`} /></Tooltip>}
                            { player.badges[2] &&<Tooltip hasArrow label={`${player.badges[2].title}`} placement='top'><Avatar ml={"-3"} key={player.badges[2].title} name={player.badges[2]?.title} src={`/badges/${player.badges[2]?.title}.png`} /></Tooltip>}
                            { player.badges[3] &&<Tooltip hasArrow label={`${player.badges[3].title}`} placement='top'><Avatar key={player.badges[3].title} name={player.badges[3]?.title} src={`/badges/${player.badges[3]?.title}.png`} /></Tooltip>}
                            { player.badges[4] &&<Tooltip hasArrow label={`${player.badges[4].title}`} placement='top'><Avatar key={player.badges[4].title} name={player.badges[4]?.title} src={`/badges/${player.badges[4]?.title}.png`} /></Tooltip>}
                            { player.badges[5] &&<Tooltip hasArrow label={`${player.badges[5].title}`} placement='top'><Avatar key={player.badges[5].title} name={player.badges[5]?.title} src={`/badges/${player.badges[5]?.title}.png`} /></Tooltip>}
                            { player.badges[6] &&<Tooltip hasArrow label={`${player.badges[6].title}`} placement='top'><Avatar key={player.badges[6].title} name={player.badges[6]?.title} src={`/badges/${player.badges[6]?.title}.png`} /></Tooltip>}
                            { player.badges[7] &&<Tooltip hasArrow label={`${player.badges[7].title}`} placement='top'><Avatar key={player.badges[7].title} name={player.badges[7]?.title} src={`/badges/${player.badges[7]?.title}.png`} /></Tooltip>}
                            { player.badges[8] &&<Tooltip hasArrow label={`${player.badges[8].title}`} placement='top'><Avatar key={player.badges[8].title} name={player.badges[8]?.title} src={`/badges/${player.badges[8]?.title}.png`} /></Tooltip>}
                            { player.badges[9] &&<Tooltip hasArrow label={`${player.badges[9].title}`} placement='top'><Avatar key={player.badges[9].title} name={player.badges[9]?.title} src={`/badges/${player.badges[9]?.title}.png`} /></Tooltip>}
                            { player.badges[10] &&<Tooltip hasArrow label={`${player.badges[10].title}`} placement='top'><Avatar key={player.badges[10].title} name={player.badges[10]?.title} src={`/badges/${player.badges[10]?.title}.png`} /></Tooltip>}
                            { player.badges[11] &&<Tooltip hasArrow label={`${player.badges[11].title}`} placement='top'><Avatar key={player.badges[11].title} name={player.badges[11]?.title} src={`/badges/${player.badges[11]?.title}.png`} /></Tooltip>}
                            { player.badges[12] &&<Tooltip hasArrow label={`${player.badges[12].title}`} placement='top'><Avatar key={player.badges[12].title} name={player.badges[12]?.title} src={`/badges/${player.badges[12]?.title}.png`} /></Tooltip>}
                            { player.badges[13] &&<Tooltip hasArrow label={`${player.badges[13].title}`} placement='top'><Avatar key={player.badges[13].title} name={player.badges[13]?.title} src={`/badges/${player.badges[13]?.title}.png`} /></Tooltip>}
                            { player.badges[14] &&<Tooltip hasArrow label={`${player.badges[14].title}`} placement='top'><Avatar key={player.badges[14].title} name={player.badges[14]?.title} src={`/badges/${player.badges[14]?.title}.png`} /></Tooltip>}
                            { player.badges[15] &&<Tooltip hasArrow label={`${player.badges[15].title}`} placement='top'><Avatar key={player.badges[15].title} name={player.badges[15]?.title} src={`/badges/${player.badges[15]?.title}.png`} /></Tooltip>}
                            { player.badges[16] &&<Tooltip hasArrow label={`${player.badges[16].title}`} placement='top'><Avatar key={player.badges[16].title} name={player.badges[16]?.title} src={`/badges/${player.badges[16]?.title}.png`} /></Tooltip>}
                            { player.badges[17] &&<Tooltip hasArrow label={`${player.badges[17].title}`} placement='top'><Avatar key={player.badges[17].title} name={player.badges[17]?.title} src={`/badges/${player.badges[17]?.title}.png`} /></Tooltip>}
                          </AvatarGroup>
                        </Td>
                        <Td justifyContent={"flex-end"}>
                        <Badge colorScheme='gray'  h='full' py='0.5' px='4' w='auto' variant='solid'>
                          <Text fontWeight='bold' fontSize='sm'>
                            {player?.score}
                          </Text>
                        </Badge>
                        <Tooltip hasArrow label='Analytics' placement='top'>
                            <IconButton
                              bg= 'gray.900'
                              color= 'gray.50'
                              onClick={() =>router.push(`/performance/${player.id}`)}
                              aria-label='delete'
                              size='sm'
                              isLoading={isLoading}
                              fontSize="sm"
                              ml='2'
                              icon={<RiBarChart2Fill />}
                            />
                          </Tooltip>
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
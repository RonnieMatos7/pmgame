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
import useSWR from "swr";

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

        <SimpleGrid flex="1" gap="4" columns={1} align="flex-start">
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
              { data?.map(player =>{
                <>
                <PlayerAvatar
                  name={player.name}
                  department={player.department}
                  score={player.score}
                  position={player.position}
                  color={player.color}
                  avatar />
                  <Divider orientation='horizontal' />
                </>
              })}
              
            {/* <Chart options={options} series={series} type="area" height={160} /> */}
            
            
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
import { Box, Text, theme, Button, Divider, Flex, Heading, HStack, Select, SimpleGrid, VStack, Icon, Avatar, AvatarBadge, Stat, StatArrow, StatGroup, StatHelpText, StatLabel, StatNumber, Progress, Center, Tooltip } from "@chakra-ui/react";
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
import { ReactChild, ReactFragment, ReactPortal } from "react";
import dynamic from "next/dynamic";



 const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})



export default function Performance() {

  const router = useRouter()
  const { id } = router.query;
  
  
  const fetcher = (url: any) => fetch(url).then((r) => r.json());

  const { data: userData, mutate: mutateUser } = useSWR(`/api/user/get/${id}`, fetcher);
  const { data: user } = useSWR('/api/user', fetcher);
  const { data: rewards, mutate: mutateReward } = useSWR('/api/reward/getAll', fetcher);
  const { data: badges, mutate: mutateBadge} = useSWR('/api/badges/getAll', fetcher);
  const { data: performancePlayer} = useSWR(`/api/performance/${id}`, fetcher);
  const { data: performance} = useSWR(`/api/performance/${user?.id}`, fetcher);

  const options = {
    chart: {
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: true,
      },
      foreColor: theme.colors.gray[500],
    },
    grid: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
      showForSingleSeries: true,
      position: 'top',
      horizontalAlign: 'left'
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
    { name: userData?.name, data: performancePlayer },
    { name: user?.name, data: performance  },
    
  ] 
  

  


  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />
        <VStack>
        <Flex w='100%'>
          <Box
            borderRadius={8}
            bg="gray.800"
            p={["6", "8"]}
            mr={3}
            >
            <Text>Perfil</Text>
            <HStack mt={2}>
              <Box>
                <HStack>
                  <Avatar size='lg' mr={3}  key={userData?.name} name={userData?.name} src={userData?.image_url} />
                  <Box>
                    <Text fontWeight="bold">{userData?.name}</Text>
                    <Text >{userData?.role} - {userData?.department}</Text>
                    <Text fontSize="sm" color="gray.300">{userData?.email}</Text>
                  </Box>
                </HStack>
              </Box>
            </HStack>
          </Box>
          <Box
            borderRadius={8}
            bg="gray.800"
            p={["6", "8"]}
            mr={3}
          >
            <Text>Pontuação</Text>
            <StatGroup>
              <Stat>
                <StatNumber fontSize={"4xl"}>{userData?.score}</StatNumber>
              </Stat>
            </StatGroup>
          </Box>
          <Box
            borderRadius={8}
            bg="gray.800"
            p={["6", "8"]}
            mr={3}
          >
            <Text>Posição</Text>
            <StatGroup>
              <Stat>
                <StatNumber fontSize={"4xl"}>{userData?.position ? userData?.position : 'N/A'}º</StatNumber>
                <StatHelpText>
                  {userData?.position > userData?.old_position ? <StatArrow type='decrease' /> : userData?.position < userData?.old_position ? <StatArrow type='increase' /> : null}
                  {userData?.position && userData?.position - userData?.old_position === 0 ? null : null }
                </StatHelpText>
              </Stat>
            </StatGroup>
          </Box>
          <Box
            borderRadius={8}
            bg="gray.800"
            p={["6", "8"]}
            w={'100%'}
            >
            <Text>Recompensas</Text>
            <SimpleGrid columns={2} gap={"2"} mt={2}>
              {rewards?.map((reward: { data: { title: string; score: number; }; }) => (            
                <Box key={reward?.data?.title} flex={1} w={'100%'}>
                  <Text fontSize="sm" color="gray.300" align={"left"}>{reward?.data?.title} {/* - {reward?.data?.score}pts */}</Text>
                  <Progress colorScheme={(userData?.score/reward?.data?.score)*100 >= 100 ? 'green' : 'yellow' } size={"sm"} value={(userData?.score/reward?.data?.score)*100} />               
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        </Flex>
        <Flex w='100%'>
          <Box
            borderRadius={8}
            bg="gray.800"
            p={["6", "8"]}
            mr={3}
            w='100%'
            >
            <Text>Conquistas</Text>
            <SimpleGrid gap={2} columns={9} mt={2}>
              {badges?.map(item=>(
                <Box bg="gray.900" key={item?.data?.title} borderRadius={8} p={1} >
                  <Center>
                   { console.log(userData?.badges)}
                    {
                      userData?.badges?.find((a) => a.title === item?.data?.title)
                      ? <Tooltip hasArrow label={`${item?.data?.title} - ${item?.data?.score} pts`} placement='top'><Avatar size='md' color='gray.500' key={item?.data?.title} name={item?.data?.name} src={`/badges/${item?.data?.title}.png`} /></Tooltip>
                      : <Tooltip hasArrow label={`${item?.data?.title} - ${item?.data?.score} pts`} placement='top'><Avatar size='md' color='gray.500' opacity={'50%'} filter='grayscale(100%)'  key={item?.data?.title} name={item?.data?.name} src={`/badges/${item?.data?.title}.png`} /></Tooltip>
                    }
                  </Center>
                </Box>
              ))}
              
            </SimpleGrid>
          </Box>
        </Flex>
        <Flex w='100%'>
          <Box
            borderRadius={8}
            bg="gray.800"
            p={["6", "8"]}
            mr={3}
            w='100%'
            >
            <Text>Performance</Text>
            <Chart options={options} series={series}type="area" height={160}/>
          </Box>
        </Flex>
        </VStack>
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
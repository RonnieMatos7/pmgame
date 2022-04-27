import { Avatar, Badge, Box, Center, Divider, Flex, HStack, SimpleGrid, Text, theme, VStack } from "@chakra-ui/react";
import dynamic from 'next/dynamic';
import { DepartmentAvatar } from "../components/DepartmentAvatar";
import { Header } from "../components/Header";
import { PlayerAvatar } from "../components/PlayerAvatar";
import { Sidebar } from "../components/Sidebar";
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
            <PlayerAvatar
              name="João Abobrinha"
              department="DCMD"
              score={1000}
              position={1}
              color="yellow"
              avatar
            />
            <Divider orientation='horizontal' />
            <PlayerAvatar
              name="João Abobrinha"
              department="DCMD"
              score={1000}
              position={2}
              color="gray"
              avatar
            />
                        <Divider orientation='horizontal' />
            <PlayerAvatar
              name="João Abobrinha"
              department="DCMD"
              score={1000}
              position={3}
              color="orange"
              avatar
            />
                        <Divider orientation='horizontal' />
            <PlayerAvatar
              name="João Abobrinha"
              department="DCMD"
              score={1000}
              position={4}
              color="white"
              avatar
            />
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
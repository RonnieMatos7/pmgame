import NextLink from "next/link";
import { Avatar, Box, Button, Checkbox, Flex, Heading, HStack, Icon, IconButton, Table, Tbody, Td, Th, Thead, Tooltip, Tr, useToast } from "@chakra-ui/react";
import { RiAddLine, RiPencilFill, RiDeleteBin2Fill, RiCheckFill, RiCloseFill } from "react-icons/ri";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/api";

import { getAuthCookie } from '../../utils/auth-cookies';
import { useQuery, focusManager } from "react-query";

type Solicitation = {
  id: string,
  title: string,
  score: number,
  month: string,
  status: string,
  description: string,
  player: {
    id: string
    name: string
    image_url: string
    score: number
  },
}


export default function UserList({ token }) {
  const toast = useToast()
  
  const { data, isLoading, error} = useQuery('solicitation', async () => {
    const response = await api.get('/solicitations/getAll')
    
    const solicitations = response.data?.map(solicitation => {
      return {
        id: solicitation['ref']['@ref'].id,
        player: solicitation.data.player,
        title: solicitation.data.title,
        score: solicitation.data.score,
        description: solicitation.data.description,
        created_at: solicitation.data.created_at,
      };
    })
    return solicitations.sort((a,b) => (a.title > b.title) ? 1 : -1);
  },
)

  
  
  if(error) {
    return <div>Error...</div>
  }

/*   const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  }) */

  


  function handleSolicitationApproval(solicitation:Solicitation, status:String) {

    try {
      api.put(`/solicitations/approval/${solicitation.id}`,
      {
        status: "status"
      }
      ).then(
        () => {
          focusManager.setFocused(true)
          toast({
            title: `Solicitação ${status} com sucesso`,
            status: "success",
            position:"top-right",
            duration: 3000,
            isClosable: true,
          })
          if(status === "Aprovada"){
            api.put(`/user/update-score/${solicitation.player.id}`, {
              score: solicitation.score,
              month: solicitation.month
            })
          }
        }
      )


    } catch (error) {
      toast({
        title: `Erro na aprovação da solicitação`,
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
              Solicitações
              
              {/* { !data && <Spinner size="sm" color="gray.500" ml="4" /> } */}
            </Heading>

            <NextLink href="/solicitations/create" passHref>
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
                  {data?.map(solicitation => {
                    return (
                      <Tr key={solicitation.id}>
                        <Td px={["4", "4", "6"]}>
                          <Checkbox colorScheme="pink" />
                        </Td>
                        <Td>
                          <Avatar name={solicitation?.player?.name} src={`/solicitations/${solicitation?.title}.png`}/>
                        </Td>
                        <Td>{solicitation?.title}</Td>
                        <Td>{solicitation?.score}</Td>
                        <Td>{solicitation?.created_at}</Td>
                        <Td>
                          <HStack>
                            <Tooltip hasArrow label='Aprovar Solicitação' placement='top'>
                              <Button
                              as="a"
                              size="sm"
                              fontSize="sm"
                              color="white"
                              colorScheme="green"
                              shadow="md"
                              onClick={()=>handleSolicitationApproval(solicitation, 'Aprovada')}
                            >
                              <Icon as={RiCheckFill} fontSize="16"/>
                            </Button>
                            </Tooltip>
                              <Tooltip hasArrow label='Reprovar Solicitação' placement='top'>
                                <Button
                                  as="a"
                                  size="sm"
                                  fontSize="sm"
                                  color="white"
                                  colorScheme="red"
                                  shadow="md"
                                  onClick={()=>handleSolicitationApproval(solicitation, 'Reprovada')}
                                >
                                  <Icon as={RiCloseFill} fontSize="16"/>
                                </Button>
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

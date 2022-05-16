import { Box, Text, Button, Divider, Flex, Heading, HStack, Select, SimpleGrid, VStack } from "@chakra-ui/react";
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation, useQuery } from 'react-query'

import { Input } from "../../../components/Form/Input";
import { Header } from "../../../components/Header";
import { Sidebar } from "../../../components/Sidebar";
import { api } from "../../../services/api";
import { queryClient } from "../../../services/queryClient";
import { format } from "date-fns";

type CreateBadgeFormData = {
  title: string;
  score: number;
  description: string;
  icon: string;
};

const createUserFormSchema = yup.object().shape({
  title: yup.string().required('Nome obrigatório'),
  description: yup.string().required('Descrição obrigatória'),
  icon: yup.string().required('Icone obrigatório'),
})

export default function UpdateUser() {
  const router = useRouter()
  const {id} = router.query
  

  const { data, isLoading, error} = useQuery('badge', async () => {
    const response = await api.get(`/badge/get/${id}`)
    const badge = response.data
    return badge;
  })
  
  

  const updateBadge = useMutation(async (badge: CreateBadgeFormData) => {
    const response = await api.put(`badge/update/${id}`, {
      badge: {
        ...badge,
        updated_at: format(new Date(), 'dd/MM/yyyy'),
      }
    })

    return response.data.badge;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('badges')
    }
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(createUserFormSchema)
  })

  const handleUpdateBadge: SubmitHandler<CreateBadgeFormData> = async (values) => {
    await updateBadge.mutateAsync(values);

    router.push('/badges')
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
          onSubmit={handleSubmit(handleUpdateBadge)}
        >
          <Heading size="lg" fontWeight="normal">Atualizar Conquista</Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                name="title"
                label="Nome"
                defaultValue={data?.title}
                error={errors.title}
                {...register('title')}
              />
              <Input
                name="score"
                label="Pontuação"
                defaultValue={data?.score}
                error={errors.score}
                {...register('score')}
              />
               <Input
                name="description"
                label="Descrição"
                defaultValue={data?.description}
                error={errors.description}
                {...register('description')}
              />
            </SimpleGrid>

            
          </VStack>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/badges" passHref>
                <Button as="a" colorScheme="whiteAlpha">Cancelar</Button>
              </Link>
              <Button
                type="submit"
                colorScheme="pink"
                isLoading={isSubmitting}
              >
                Salvar
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
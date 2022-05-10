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

type CreateRewardFormData = {
  title: string;
  score: number;
};

const createUserFormSchema = yup.object().shape({
  title: yup.string().required('Nome obrigatório'),
  score: yup.number().required('Pontuação obrigatória'),
})

export default function UpdateUser() {
  const router = useRouter()
  const {id} = router.query
  

  const { data, isLoading, error} = useQuery('reward', async () => {
    const response = await api.get(`/reward/get/${id}`)
    const reward = response.data
    return reward;
  })
  
  

  const updateReward = useMutation(async (reward: CreateRewardFormData) => {
    const response = await api.put(`reward/update/${id}`, {
      reward: {
        ...reward,
        updated_at: format(new Date(), 'dd/MM/yyyy'),
      }
    })

    return response.data.reward;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('rewards')
    }
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(createUserFormSchema)
  })

  const handleUpdateReward: SubmitHandler<CreateRewardFormData> = async (values) => {
    await updateReward.mutateAsync(values);

    router.push('/rewards')
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
          onSubmit={handleSubmit(handleUpdateReward)}
        >
          <Heading size="lg" fontWeight="normal">Atualizar Recompensa</Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                name="title"
                label="Nome completo"
                defaultValue={data?.title}
                error={errors.title}
                {...register('title')}
              />
              <Input
                name="score"
                label="E-mail"
                defaultValue={data?.score}
                error={errors.score}
                {...register('score')}
              />
               
            </SimpleGrid>

            
          </VStack>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/rewards" passHref>
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
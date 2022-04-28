import { Box, Text, Button, Divider, Flex, Heading, HStack, Select, SimpleGrid, VStack } from "@chakra-ui/react";
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from 'react-query'

import { Input } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/api";
import { queryClient } from "../../services/queryClient";
import { format } from "date-fns";

type CreateRewardFormData = {
  title: string;
  score: string;
};

const createUserFormSchema = yup.object().shape({
  title: yup.string().required('Nome obrigatório'),
  score: yup.number().required('Pontuação obrigatória'),
})

export default function CreateReward() {
  const router = useRouter()

  const createReward = useMutation(async (reward: CreateRewardFormData) => {
    const response = await api.post('reward/createReward', {
      reward: {
        ...reward,
        created_at: format(new Date(), 'dd/MM/yyyy'),
      }
    })

    return response.data.user;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('rewards')
    }
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(createUserFormSchema)
  })

  const handleCreateReward: SubmitHandler<CreateRewardFormData> = async (values) => {
    await createReward.mutateAsync(values);

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
          onSubmit={handleSubmit(handleCreateReward)}
        >
          <Heading size="lg" fontWeight="normal">Criar Recompensa</Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                name="title"
                label="Nome da Recompensa"
                error={errors.title}
                {...register('title')}
              />
              <Input
                name="score"
                label="Pontuação"
                error={errors.score}
                {...register('score')}
              />
               
            </SimpleGrid>

            
          </VStack>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/users" passHref>
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
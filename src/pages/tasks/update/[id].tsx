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

type CreateTaskFormData = {
  title: string;
  score: number;
  description: number;
  frequency: number;
};

const createUserFormSchema = yup.object().shape({
  title: yup.string().required('Nome obrigatório'),
  score: yup.number().required('Pontuação obrigatória'),
  description: yup.string().required('Descriçao obrigatória'),
  frequency: yup.string().required('Periodicidade obrigatória'),
})

export default function UpdateUser() {
  const router = useRouter()
  const {id} = router.query
  

  const { data, isLoading, error} = useQuery('task', async () => {
    const response = await api.get(`/tasks/get/${id}`)
    const task = response.data
    return task;
  })
  
  

  const updateTask = useMutation(async (task: CreateTaskFormData) => {
    const response = await api.put(`tasks/update/${id}`, {
      task: {
        ...task,
        updated_at: format(new Date(), 'dd/MM/yyyy'),
      }
    })

    return response.data.reward;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('tasks')
    }
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(createUserFormSchema)
  })

  const handleUpdateReward: SubmitHandler<CreateTaskFormData> = async (values) => {
    await updateTask.mutateAsync(values);

    router.push('/tasks')
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
          <Heading size="lg" fontWeight="normal">Atualizar Entrega</Heading>

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
              <Input
                name="frequency"
                label="Periodicidade"
                defaultValue={data?.frequency}
                error={errors.frequency}
                {...register('frequency')}
              />
               
            </SimpleGrid>

            
          </VStack>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/tasks" passHref>
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
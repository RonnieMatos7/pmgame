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

type CreateUserFormData = {
  name: string;
  email: string;
  role:string;
  department:string;
  image_url:string;
  password: string;
  password_confirmation: string;
};

const createUserFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  role: yup.string().required('Perfil obrigatório'),
  department: yup.string().required('Departamento obrigatório'),
  password: yup.string().required('Senha obrigatória').min(6, 'No mínimo 6 caracteres'),
  password_confirmation: yup.string().oneOf([
    null, yup.ref('password')
  ], 'As senhas precisam ser iguais')
})

export default function UpdateUser() {
  const router = useRouter()
  const {id} = router.query
  

  const { data, isLoading, error} = useQuery('user', async () => {
    const response = await api.get(`/user/get/${id}`)
    const user = response.data
    return user;
  })
  
  

  const updateUser = useMutation(async (user: CreateUserFormData) => {
    const response = await api.post(`user/update/${id}`, {
      user: {
        ...user,
        updated_at: new Date(),
      }
    })

    return response.data.user;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('users')
    }
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(createUserFormSchema)
  })

  const handleUpdateUser: SubmitHandler<CreateUserFormData> = async (values) => {
    await updateUser.mutateAsync(values);

    router.push('/users')
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
          onSubmit={handleSubmit(handleUpdateUser)}
        >
          <Heading size="lg" fontWeight="normal">Criar usuário</Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                name="name"
                label="Nome completo"
                defaultValue={data?.name}
                error={errors.name}
                {...register('name')}
              />
              <Input
                name="email"
                type="email"
                label="E-mail"
                defaultValue={data?.email}
                error={errors.email}
                {...register('email')}
              />
               <Input
                name="department"
                label="Departamento"
                defaultValue={data?.department}
                error={errors.name}
                {...register('department')}
              />
              <Box>
                <Text fontWeight='medium'>Perfil do Usuário</Text>
                <Select
                 mt='3'
                 value={data?.role}
                  name="role"
                  label="Perfil do Usuário"
                  error={errors.name}
                  {...register('role')}
                >
                  <option key={'Jogador'} value={'Jogador'}>Jogador</option>  
                  <option key={'PMO'} value={'PMO'}>PMO</option>
                </Select>
              </Box>
              <Input
                name="image_url"
                label="Link Imagem de Perfil"
                defaultValue={data?.image_url}
                error={errors.name}
                {...register('image_url')}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                name="password"
                type="password"
                label="Senha"
                error={errors.password}
                {...register('password')}
              />
              <Input
                name="password_confirmation"
                type="password"
                label="Confirmação da senha"
                error={errors.password_confirmation}
                {...register('password_confirmation')}
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
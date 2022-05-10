import { Box, Text, Button, Divider, Flex, Heading, HStack, Select, SimpleGrid, VStack } from "@chakra-ui/react";
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation, useQuery } from 'react-query'

import { Input } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/api";
import { queryClient } from "../../services/queryClient";
import useSWR from "swr";
import { getAuthCookie } from "../../utils/auth-cookies";

type CreateUserFormData = {
  name: string;
  email: string;
  id: string;
  role:string;
  department:string;
  image_url:string;
  password: string;
  password_confirmation: string;
};

const createUserFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  /* role: yup.string().required('Perfil obrigatório').oneOf(['Jogador', 'PMO']), */
  department: yup.string().required('Departamento obrigatório')
})

export default function UpdateUser() {
  const router = useRouter()
  
  

  const fetcher = (url) => fetch(url).then((r) => r.json());

  const { data: userData, mutate: mutateUser } = useSWR('/api/user', fetcher);
  

  const updateUser = useMutation(async (user: CreateUserFormData) => {
    const response = await api.put(`user/reset-password/${userData.id}`, {
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
          <Heading size="lg" fontWeight="normal">Alterar Senha</Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                name="password"
                type="password"
                label="Senha"
                defaultValue={userData?.password}
                error={errors.password}
                {...register('password')}
              />
              <Input
                name="password_confirmation"
                type="password"
                label="Confirmação da senha"
                defaultValue={userData?.password}
                error={errors.password_confirmation}
                {...register('password_confirmation')}
              />
            </SimpleGrid>
            
          </VStack>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/profile" passHref>
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

export async function getServerSideProps({res, req, params}) {
  const token = getAuthCookie(req);
  if(!token){
    res.setHeader("location", "/");
    res.statusCode = 302;
    res.end();
  }
  
  return { props: { token: token || null } };
}
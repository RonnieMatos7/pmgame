import { Box, Text, Button, Divider, Flex, Heading, HStack, Select, SimpleGrid, VStack, Tooltip, IconButton, InputGroup, InputRightElement, InputLeftElement, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Icon, Image, Badge } from "@chakra-ui/react";
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
import { RiStarFill, RiStarLine } from "react-icons/ri";
import { useEffect, useState } from "react";


type CreateBadgeFormData = {
  title: string;
  score: string;
  description: string;
  stars: number;
};

const createUserFormSchema = yup.object().shape({
  title: yup.string().required('Nome obrigatório'),
  score: yup.number().required('Pontuação obrigatória'),
  description: yup.string().required('Descrição obrigatória'),
  icon: yup.number().required('Icone obrigatório'),
})

export default function CreateBadge() {
  const router = useRouter()
  const [selectedIcon, setSelectedIcon] = useState<any>()
  const [badgeName, setBadgeName] = useState<any>('')
  const [badgeNamePreview, setBadgeNamePreview] = useState<any>('')
  const [badgeStars, setBadgeStars] = useState<any>(0)

  const { isOpen, onOpen, onClose } = useDisclosure()

 



  const createBadge = useMutation(async (badge: CreateBadgeFormData) => {
    const response = await api.post('badges/createBadge', {
      badge: {
        ...badge,
        created_at: format(new Date(), 'dd/MM/yyyy'),
      }
    })

    return response.data.user;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('badges')
    }
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(createUserFormSchema)
  })

  const handleCreateBadge: SubmitHandler<CreateBadgeFormData> = async (values) => {
    await createBadge.mutateAsync(values);

    router.push('/badges')
  }

  return (
    <Box>
      <Header />
      {/* <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg= 'gray.900'color= 'gray.50'>
          <ModalHeader>Selecione o icone</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <SimpleGrid>
              <Image onClick={() => handleSelectIcon()} src='/icons/abacus.svg' />
            </SimpleGrid>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <Box
          as="form"
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={["6", "8"]}
          onSubmit={handleSubmit(handleCreateBadge)}
        >
          <Heading size="lg" fontWeight="normal">Criar Conquista</Heading>

          <Divider my="6" borderColor="gray.700" />
          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                name="title"
                key={"title"}
                label="Nome da Conquista"
                error={errors.title}
                {...register('title')}
              />
              <Input
                name="description"
                key={"description"}
                label="Descrição"
                error={errors.description}
                {...register('description')}
              />
              <Input
                name="score"
                key={"score"}
                label="Pontuação"
                error={errors.score}
                {...register('score')}
              />
              <Input
                name="stars"
                label="Estrelas"
                error={errors.stars}
                {...register('stars')}
              />
              {/* <Box>
                <Text fontWeight='medium' mb='3'>Icone</Text>
                <InputGroup>
                <InputLeftElement size='md'>
                  <Tooltip hasArrow label='Selecionar Icone' placement='top'>
                    <IconButton
                      bg= 'gray.900'
                      color= 'gray.50'
                      onClick={onOpen}
                      aria-label='delete'
                      size='sm'
                      fontSize="sm"
                      icon={<RiFolderOpenLine />}
                    />
                  </Tooltip>
                </InputLeftElement>
                  
                <Input
                  name="icon"
                  error={errors.icon}
                  {...register('icon')}
                />
              </InputGroup>
              </Box> */}

               
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
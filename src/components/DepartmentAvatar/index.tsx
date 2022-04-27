import { Avatar, Box, Flex, Text, Badge } from "@chakra-ui/react";

interface AvatarProps {
  email?: string;
  name: string;
  department: string;
  score: number;
  position: number;
  avatar_url?: string;
  color?: string;
  avatar?: boolean

}

export function DepartmentAvatar({ avatar, color,avatar_url, position, name, department, score }: AvatarProps) {
  return (
    <Flex flex='1' justifyContent={"space-between"} alignItems='center' py='3' px='5' >
      <Badge bg={color+'.400'} textColor='white'  h='full' py='0.5' px='4' w='auto'>
        {position}
      </Badge>
      <Flex flex='1' justifyContent={"center"} alignItems='center'>
        
        <Box>
          <Text fontWeight='bold'>
            {name}
          </Text>
        </Box>  
      </Flex>
      <Badge colorScheme='gray'  h='full' py='0.5' px='4' w='auto' variant='solid'>
        <Text fontWeight='bold' fontSize='sm'>
          {score}
        </Text>
      </Badge>
    </Flex>
  );
}
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

export function PlayerAvatar({ avatar, color,avatar_url, position, name, department, score }: AvatarProps) {
  return (
    <Flex flex='1' justifyContent={"space-evenly"} alignItems='center' py='3' >
      <Badge bg={color+'.400'} textColor='white'  h='full' py='0.5' px='4' w='auto'>
        {position}
      </Badge>
      <Flex flex='1' justifyContent={"start"} alignItems='center'>
        {avatar ? <Avatar name={name} src={avatar_url} ml='6' mr='3' /> : null}
        <Box>
          <Text fontWeight='bold'>
            {name}
          </Text>
          <Text fontSize='sm'>{department}</Text>
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
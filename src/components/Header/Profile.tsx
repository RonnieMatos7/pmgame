import { Avatar, Box, Flex, Text } from "@chakra-ui/react";

interface ProfileProps {
  showProfileData?: boolean;
  user:{
    email: string;
    image_url:string;
    name: string;
    department: string;
    role: string;
  }
}

export function Profile({ showProfileData = true, user }: ProfileProps) {
  return (
    <Flex align="center">
      { showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>{user?.name}</Text>
          <Text color="gray.300" fontSize="small">
            {user?.email}
          </Text>
        </Box>
      )}

      <Avatar size="md" name={user?.name} src={user?.image_url} />
    </Flex>
  );
}
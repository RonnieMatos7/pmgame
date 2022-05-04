import { Avatar, Box, Flex, Text, Badge as ChackraBadge, HStack } from "@chakra-ui/react";
import { RiStarFill, RiStarLine } from "react-icons/ri";

interface BadgeProps {
  title: string;
  score?: string;
  description?: string;
  stars: number;
}

const color = ['orange.400', 'gray.400', 'yellow.400']

export function Badge({ title, stars }: BadgeProps) {
  const starsFilled = Number(stars)
  const starsLine = 3 - Number(stars)

  return (
    <Box>
      <ChackraBadge bg={color[Number(stars)-1]} rounded="lg" p='2' flexDir={"row"} textColor='white'>
        <HStack>
          <Text>{title}</Text>
          <HStack spacing={"1"}>
            {[...Array(starsFilled)].map((x, i) =>
              <RiStarFill key={x} />
            )}
            {[...Array(starsLine)].map((x, i) =>
              <RiStarLine key={x} />
            )}
          </HStack>
        </HStack>
      </ChackraBadge>
    </Box>
    
    
    
   
  );
}
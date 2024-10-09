import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import spinachFarm from "./../assets/bgss.jpg"

const GlassCard = ({ children }) => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgImage={`url(${spinachFarm})`}
      bgSize="cover"
      bgPosition="center"
    >
     <Box
        p={8}
        width={{ base: '90%', sm: '80%', md: '30%' }}
        bg="rgba(255, 255, 255, 0.1)"
        blur="0.3"
        boxShadow="xl"
        borderRadius="xl"
        textShadow="2px 2px 4px rgba(0, 0, 0, 0.025)"
        backdropFilter="blur(50px)"
      >
        {children}
      </Box>
    </Flex>
  );
};

export default GlassCard;

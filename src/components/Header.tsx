import { Box, Center, Heading, useColorModeValue } from "@chakra-ui/react";

export const Header = () => {
  return (
    <Center p={"6"} boxShadow={"lg"}>
      <Heading
        textAlign={"center"}
        width={"100%"}
        margin={"10px 0 20px"}
        lineHeight="0.1em"
        borderBottom={`1px solid`}
        paddingTop={"3"}
      >
        <Box as="span" background={"chakra-body-bg"} padding={"0 10px"}>
          Rental Manager
        </Box>
      </Heading>
    </Center>
  );
};

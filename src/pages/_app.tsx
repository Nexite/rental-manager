import {
  Box,
  Center,
  ChakraProvider,
  extendTheme,
  Heading,
} from "@chakra-ui/react";
import type { AppProps } from "next/app";

const theme = extendTheme({
  config: { initialColorMode: "light", useSystemColorMode: false },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Center p={"10"} bg="gray.500">
        <Heading>Rental Manager</Heading>
      </Center>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

import "@fontsource/raleway/400.css";
import "@fontsource/open-sans/700.css";
import { ChakraProvider, Container, extendTheme } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { Header } from "@/components/Header";
import { NextSeo } from "next-seo";
import RentalProvider from "@/components/RentalProvider";

const theme = extendTheme({
  fonts: {
    heading: `'Open Sans', sans-serif`,
    body: `'Raleway', sans-serif`,
  },
  config: { initialColorMode: "system", useSystemColorMode: true },
});

export default function App({ Component, pageProps: { title, ...pageProps } }: AppProps) {
  return (
    <>
      <NextSeo title={title ? `Rental Manager ~ ${title}` : "Rental Manager"} />
      <ChakraProvider theme={theme}>
        <RentalProvider>
          <Header />
          <Container maxWidth={"container.xl"}>
            <Component {...pageProps} />
          </Container>
        </RentalProvider>
      </ChakraProvider>
    </>
  );
}

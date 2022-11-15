import {Box, Flex, Stack, Spacer, Text, VStack} from "@chakra-ui/react";
import Head from "next/head";
import Header from "./Header";

type LayoutProps = {
  children: JSX.Element;
  main?: boolean;
  style?: object;
};

let secondBGColor = "#9D0039";
export const mainStyles = {
  mainItemColor: "#FF9A02",
  mainBGColor: "#141923",
  sidebarBTNS: "",
  sidebarBTNSHover: "#224957",
  sidebarBTNSBBorder: secondBGColor,
  getMessages: "#224957",
  sendMessages: "#C1402F",
  cardBorder: "#224957",
  headerBG: "#232833",
};

<link
  href="https://fonts.googleapis.com/css?family=Roboto:100,100italic,300,300italic,regular,italic,500,500italic,700,700italic,900,900italic"
  rel="stylesheet"
/>;

export default function LayoutCard({
  children,
  main = true,
  style,
}: LayoutProps) {
  return (
    <>
      {/* <Navbar /> */}
      <Head>
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:100,100italic,300,300italic,regular,italic,500,500italic,700,700italic,900,900italic"
          rel="stylesheet"
        />
      </Head>

      <Flex
        bg={mainStyles.mainBGColor}
        direction="column"
        height="100vh"
        {...style}
        // С хуя ли не работает? Я бы на его месте тоже не работал...
      >
        <VStack overflowY="hidden" height="100vh" w="100%">
          <Header />
          <Flex
            direction="column"
            bg={mainStyles.mainBGColor}
            w="100%"
            h="100%"
            maxW="1076px"
            overflowY="hidden"
            mx="60px"
            height="100%"
            flex={1}
          >
            {/* {main && <Header />} */}
            {children}
          </Flex>
          {/* <Footer /> */}
        </VStack>
      </Flex>
    </>
  );
}

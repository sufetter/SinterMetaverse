import type {NextPage} from "next";
import Head from "next/head";
import Login from "./login";
import {ChakraProvider} from "@chakra-ui/react";
import Chats from "./Chats";
import Layout from "../components/Layout";
import Register from "./register";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ChakraProvider>
        <Register />
      </ChakraProvider>
    </div>
  );
};

export default Home;

import {Avatar, Box, ChakraProvider, Flex} from "@chakra-ui/react";
import React from "react";
import LayoutCard from "../../components/LayoutCard";
import {MainChat} from "../../components/MainChat";
import {SidebarMain} from "../../components/SidebarMain";
import Sidebar from "../../components/Sidebar";
import {ChatSettings} from "../../components/ChatSettings";
import ChatList from "../../components/ChatList";
import {mainStyles} from "../../components/LayoutCard";
import ChatHeader from "../../components/ChatHeader";

const id: React.FC = () => {
  return (
    <LayoutCard style={{height: "100vh", overflow: "hidden"}} main>
      <ChakraProvider>
        <Flex bg={mainStyles.mainBGColor} overflowY="hidden" my={3}>
          <Sidebar />
          <Flex
            bg={mainStyles.chatCardBG}
            w="100%"
            borderRadius="10px"
            direction="column"
          >
            <Flex>
              <ChatHeader />
            </Flex>
            <Flex>
              <ChatList />
              <MainChat />
            </Flex>
          </Flex>

          {/* <ChatSettings /> */}
        </Flex>
      </ChakraProvider>
    </LayoutCard>
  );
};

export default id;

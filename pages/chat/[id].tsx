import {Avatar, Box, ChakraProvider, Flex, Icon, Text} from "@chakra-ui/react";
import React, {useState, useRef} from "react";
import LayoutCard from "../../components/LayoutCard";
import {MainChat} from "../../components/MainChat";
import {SidebarMain} from "../../components/SidebarMain";
import Sidebar from "../../components/Sidebar";
import {ChatSettings} from "../../components/ChatSettings";
import ChatList from "../../components/ChatList";
import {mainStyles} from "../../components/LayoutCard";
import {HiOutlineChatAlt2} from "react-icons/hi";

const id: React.FC = () => {
  const searchInput = useRef<any>(null);
  const ChatCardDefault = () => {
    const focusSearchInput = () => {
      searchInput.current?.focus();
    };
    return (
      <Flex
        flex={1}
        h="100%"
        align="center"
        justify="center"
        w="100%"
        direction="column"
        onClick={() => {
          console.log(chatCard);
        }}
      >
        <Icon as={HiOutlineChatAlt2} color="white" boxSize="70px" />
        <Text color="white" as="span">
          Select any chat
        </Text>
        <Text>
          <Text color="white" as="span">
            or{" "}
          </Text>
          <Text
            color={mainStyles.mainItemColor}
            as="span"
            _hover={{textDecoration: "underline", cursor: "pointer"}}
            onClick={focusSearchInput}
          >
            create new one
          </Text>
        </Text>
      </Flex>
    );
  };
  const [chatCard, setChatCard] = useState(ChatCardDefault);
  return (
    <LayoutCard style={{height: "100vh", overflow: "hidden"}}>
      <ChakraProvider>
        <Flex bg={mainStyles.mainBGColor} overflowY="hidden" my={3} h="100%">
          <Sidebar />
          <Flex
            bg={mainStyles.chatCardBG}
            w="100%"
            borderRadius="10px"
            border="1px solid"
            borderColor={mainStyles.chatListBorderColor}
          >
            <ChatList searchInput={searchInput} setChatCard={setChatCard} />
            {chatCard}
            {/* {chatCard} */}
            {/* <MainChat /> */}
          </Flex>
        </Flex>
      </ChakraProvider>
    </LayoutCard>
  );
};

export default id;

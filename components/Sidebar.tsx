import {
  Flex,
  Icon,
  Text,
  Box,
  Tooltip,
  ChakraProvider,
  Spacer,
} from "@chakra-ui/react";
import React from "react";
import {CgProfile} from "react-icons/cg";
import {FiMessageSquare, FiSettings} from "react-icons/fi";
import {BsNewspaper} from "react-icons/bs";
import {FaUserFriends} from "react-icons/fa";
import {GoFileMedia} from "react-icons/go";
import {MdOutlineLogout} from "react-icons/md";
import {mainStyles} from "./LayoutCard";

type SideBarItemProps = {
  icon?: JSX.Element | any;
  desc?: string;
};

export const SidebarItem = ({icon, desc}: SideBarItemProps) => {
  return (
    <Flex
      w="140px"
      mb={2}
      mr={2}
      p={1.5}
      bg={mainStyles.sidebarBTNS}
      align="center"
      borderRadius="5px"
      transition="background-color 100ms linear"
      _hover={{
        cursor: "pointer",
        bg: mainStyles.sidebarBTNSHover,
      }}
    >
      <Icon boxSize={"20px"} color={mainStyles.mainItemColor} as={icon} />
      <Text color={mainStyles.mainTextColor} pl={3} fontSize="14px">
        {desc}
      </Text>
    </Flex>
  );
};

const Sidebar = () => {
  return (
    <Flex direction="column">
      <SidebarItem icon={CgProfile} desc="My Profile" />
      <SidebarItem icon={BsNewspaper} desc="News" />
      <SidebarItem icon={FiMessageSquare} desc="Messages" />
      <SidebarItem icon={FaUserFriends} desc="Friends" />
      <SidebarItem icon={GoFileMedia} desc="Media Files" />
      <Spacer />
      <SidebarItem icon={FiSettings} desc="Settings" />
      <SidebarItem icon={MdOutlineLogout} desc="Logout" />
    </Flex>
  );
};

export default Sidebar;

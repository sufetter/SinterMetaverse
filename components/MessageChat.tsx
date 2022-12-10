import {Avatar, Box, Flex, Text} from "@chakra-ui/react";
import React, {memo, useState} from "react";
import {mainStyles} from "./LayoutCard";
import {db} from "../firebaseconfig";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";

export interface StandardProps {
  type?: string;
  children?: React.ReactNode;
  message: string;
  time: any;

  user: any;
}
const MessageChat = ({children, type, message, time, user}: StandardProps) => {
  const [src, setSRC] = useState(
    "https://firebasestorage.googleapis.com/v0/b/sinter-metaverse.appspot.com/o/user.png?alt=media&token=516be896-9714-4101-ab89-f2002fe7b099"
  );
  if (src != user.photoURL && user.photoURL != "" && user.photoURL != null)
    setSRC(user.photoURL);

  var dateFormat = new Date(time.seconds * 1000);

  let localTime =
    dateFormat.getDate() +
    "." +
    (dateFormat.getMonth() + 1) +
    "." +
    dateFormat.getFullYear() +
    " " +
    dateFormat.getHours() +
    ":" +
    dateFormat.getMinutes().toLocaleString();

  return (
    <Flex direction="row" my={1.5}>
      <Box mr="10px" boxSize="45px">
        <img src={src} style={{borderRadius: "20px"}} />
      </Box>

      <Flex direction="column">
        <Flex direction="column">
          <Flex align="center">
            <Text
              color={mainStyles.messageTextColor}
              mr="10px"
              fontWeight={500}
              fontSize="14px"
            >
              {user?.displayName}
            </Text>
            <Text
              color={mainStyles.secondTextColor}
              fontWeight={400}
              fontSize="14px"
            >
              {localTime}
            </Text>
          </Flex>

          <Text
            color="white"
            w="fit-content"
            py={0.5}
            borderRadius="5px"
            textAlign="justify"
            fontSize="14px"
          >
            {message}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default memo(MessageChat);

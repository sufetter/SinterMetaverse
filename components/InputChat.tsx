import {
  Button,
  Flex,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
  Icon,
  Box,
  Image,
  FormLabel,
  Text,
} from "@chakra-ui/react";
import {
  arrayUnion,
  doc,
  Timestamp,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import React, {useState, useEffect, useContext} from "react";
import {AuthContext} from "../context/AuthContext";
import {
  HiOutlineEmojiHappy,
  HiOutlineMicrophone,
  HiOutlinePaperClip,
} from "react-icons/hi";
import {mainStyles} from "./LayoutCard";
import {db} from "./../firebaseconfig";
import {v4 as uuid} from "uuid";
import {RiSpace} from "react-icons/ri";

interface MainInput {
  changeSmileOpen: () => void;
  setMessage: (value: string) => void;
  message: string;
  user: any;
  setMainComponent?: any;
}
export const InputChat: React.FC<MainInput> = ({
  changeSmileOpen,
  setMessage,
  message,
  user,
}) => {
  const currentUser: any = useContext(AuthContext);

  const handleMessageChange = (e: any) => setMessage(e.target.value);
  const combinedUid: any =
    currentUser?.uid?.slice(0, 5) + "" + user?.uid!.slice(0, 5);
  const combinedUidReverse =
    user?.uid!.slice(0, 5) + currentUser?.uid?.slice(0, 5) + "";

  const handleSend = async () => {
    if (message == "") return;
    else if (message == " ") message = "just a space...";
    await updateDoc(doc(db, "chats", combinedUid), {
      messages: arrayUnion({
        id: uuid(),
        message,
        senderId: currentUser.uid,
        date: Timestamp.now(),
      }),
    });
    await updateDoc(doc(db, "chats", combinedUidReverse), {
      messages: arrayUnion({
        id: uuid(),
        message,
        senderId: currentUser.uid,
        date: Timestamp.now(),
      }),
    });
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [combinedUid + ".lastMessage"]: {
        message,
        sender: currentUser.displayName,
        date: serverTimestamp(),
      },
    });
    await updateDoc(doc(db, "userChats", user.uid), {
      [combinedUidReverse + ".lastMessage"]: {
        message,
        sender: currentUser.displayName,
        date: serverTimestamp(),
      },
    });
    setMessage("");
  };

  const handleKey = async (e: any) => {
    e.code === "Enter" && handleSend();
  };

  const handleFileComponent = () => {
    setMainComponent(!mainComponent);
  };

  const handleFile = (e: any) => {
    if (e.target.files[0]?.type == undefined) return;
    let file = e.target.files![0];
    console.log(file);
    if (file?.type.includes("image") && Math.round(file.size / 1000) < 5000) {
      setFileChecked(true);
      setFileName("Your File is: " + file.name);
      let avatarPath = URL.createObjectURL(file);
      setImagePreview(avatarPath);
    } else {
      setFileName("Not valid file, please, upload Image (up to 5mb)");
    }
  };

  const [mainComponent, setMainComponent] = useState<any>(true);
  const [fileName, setFileName] = useState("Choose any file");
  const [fileChecked, setFileChecked] = useState(false);
  const [imagePreview, setImagePreview] = useState(
    "https://firebasestorage.googleapis.com/v0/b/sinter-metaverse.appspot.com/o/user.png?alt=media&token=516be896-9714-4101-ab89-f2002fe7b099"
  );

  return (
    <Flex justify="space-between" w="100%" align="center">
      <Flex align="center">
        <Icon
          as={HiOutlinePaperClip}
          color={mainStyles.mainIconColor}
          boxSize="23px"
          _hover={{cursor: "pointer"}}
          onClick={handleFileComponent}
        />
      </Flex>
      <label
        htmlFor="Avatar"
        style={{display: mainComponent ? "none" : "block", width: "30%"}}
      >
        <Flex align="center" justify="space-between">
          <Input
            type="file"
            color="white"
            border="white"
            cursor="pointer"
            onChange={handleFile}
            display="none"
            id="Avatar"
            // ref={inputFile}
          ></Input>
          <Text
            align="center"
            color="white"
            _hover={{
              textDecoration: "underline",
              cursor: "pointer",
            }}
            flexWrap="wrap"
          >
            {fileName}
          </Text>
          <Image src={imagePreview} boxSize="60px" />
        </Flex>
      </label>
      <InputGroup px={2} display={mainComponent ? "flex" : "none"}>
        <Input
          placeholder="Type a message....."
          border="1px solid"
          borderColor={mainStyles.chatInputBorderColor}
          _focus={{borderWidth: "1px"}}
          focusBorderColor={mainStyles.chatInputBorderColor}
          autoComplete="off"
          color="white"
          onChange={handleMessageChange}
          _hover={{borderColor: mainStyles.chatInputBorderColor}}
          value={message}
          onKeyDown={handleKey}
        ></Input>
        <InputRightElement
          pr={3}
          children={
            <Icon
              as={HiOutlineEmojiHappy}
              color={mainStyles.mainIconColor}
              boxSize="25px"
              onClick={changeSmileOpen}
              _hover={{cursor: "pointer"}}
            />
          }
        />
      </InputGroup>
      <Flex align="center">
        <Icon
          as={HiOutlineMicrophone}
          color={mainStyles.mainIconColor}
          boxSize="23px"
          _hover={{cursor: "pointer"}}
        />
      </Flex>
    </Flex>
  );
};

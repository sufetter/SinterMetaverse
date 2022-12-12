import {
  Flex,
  Text,
  Avatar,
  InputGroup,
  InputLeftElement,
  Input,
  Icon,
  Stack,
  Tooltip,
  Box,
} from "@chakra-ui/react";
import React, {useState, useContext, useEffect, memo, useMemo} from "react";
import {BiSearchAlt2} from "react-icons/bi";
import {CiSettings} from "react-icons/ci";
import {MdAdd} from "react-icons/md";
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
  orderBy,
} from "firebase/firestore";
import {AuthContext} from "../context/AuthContext";
import {MainChat} from "./MainChat";
import {mainSlice} from "../src/reducers/MainSlice";
import {useAppDispatch, useAppSelector} from "../src/hooks/redux";
import {SearchItem} from "./SearchItem";

type ChatItemProps = {
  searchedAvatar?: string;
  searchedName?: string;
  user?: any;
  options?: boolean;
  setChatCard?: any;
};

export const ChatItem = memo(
  ({searchedUser, options, setChatCard}: ChatItemProps) => {
    const currentUser: any = useContext(AuthContext);
    let searchedAvatar: string =
      "https://firebasestorage.googleapis.com/v0/b/sinter-metaverse.appspot.com/o/user.png?alt=media&token=516be896-9714-4101-ab89-f2002fe7b099";
    if (searchedUser?.photoURL != undefined && searchedUser?.photoURL != "") {
      searchedAvatar = searchedUser.photoURL;
    }
    const {changeMainOpen} = mainSlice.actions; //Ууууу Reduux
    const dispatch = useAppDispatch();
    return (
      <Flex
        align="center"
        justify="space-between"
        p="2"
        _hover={{bg: mainStyles.chatListItemHover, cursor: "pointer"}}
        w="100%"
        px={4}
        py={2}
      >
        <Flex
          align="center"
          w="100%"
          onClick={() => {
            setChatCard(<MainChat user={user} />);
          }}
        >
          <Box boxSize="45px">
            <img src={searchedAvatar} style={{borderRadius: "100px"}} />
          </Box>
          <Text ms={3} color="white">
            {user?.displayName}
          </Text>
        </Flex>
        <Flex align="center"></Flex>
      </Flex>
    );
  }
);

export const ChatSearch = ({
  handleSearchedUsers,
  username,
  setUsername,
  searchInput,
}: any) => {
  const [error, setError] = useState<boolean>(false);
  const currentUser: any = useContext(AuthContext);

  useEffect(() => {
    if (username !== undefined && currentUser.uid !== undefined) handleSearch();
  }, [username]);

  const handleInput = (e: any) => {
    setUsername(e.target.value!);
  };
  const handleSearch = async () => {
    const queryDB = query(
      collection(db, "users"),
      where("displayNameLC", "==", username.toLocaleLowerCase())
      // where("userID", "!=", currentUser.uid)
      // where("displayNameLC", ">=", username.toLocaleLowerCase())
      // where("displayNameLC", "<=", username.toLocaleLowerCase() + "~")
    );
    try {
      let results: Array<Object> = [];
      const querySnapshot: any = await getDocs(queryDB);
      await querySnapshot.forEach((doc: any) => {
        const result = doc.data();
        if (result.userID != currentUser.uid) results.push(result);
      });

      handleSearchedUsers(results);
    } catch (err: any) {
      setError(true);
      console.log(err);
      console.log(err.message);
    }
  };

  return (
    <Flex
      px={1}
      minH="50px"
      align="center"
      borderBottom="2px solid"
      borderColor={mainStyles.chatInputBorderColor}
      bg={mainStyles.chatCardSecondBGColor}
      borderRadius={{base: 0, sm: "9px 0 0 0"}}
    >
      <InputGroup size="md">
        <Input
          borderColor={mainStyles.chatCardSecondBGColor}
          focusBorderColor={mainStyles.chatCardSecondBGColor}
          _hover={{borderColor: mainStyles.chatCardSecondBGColor}}
          placeholder="Search"
          color="white"
          onChange={handleInput}
          ref={searchInput}
        />
        <InputLeftElement
          pointerEvents="none"
          children={<BiSearchAlt2 color="white" size="18px" />}
        />
      </InputGroup>
      <Flex pr={1.5}>
        <Icon
          as={CiSettings}
          color="white"
          boxSize={6}
          _hover={{cursor: "pointer"}}
        />
      </Flex>
    </Flex>
  );
};

const Render = ({searchedUsers, username}: any) => {
  let borderWidth = 0;
  let supMessage = "No user found";
  let type = 2;
  let display = "block";

  let result = searchedUsers?.map((user: any) => {
    return (
      <SearchItem
        searchedAvatar={user.photoURL}
        searchedName={user.displayName}
        searchedUser={user}
        options
        key={Math.random()}
      />
    );
  });
  if (result?.length > 0) {
    borderWidth = 1;
    supMessage = "Users found:";
    type = 0;
  }
  if (supMessage != "") {
    borderWidth = 1;
  }
  if (username == "") {
    supMessage = "";
    borderWidth = 0;
    display = "none";
  }

  return (
    <Flex
      direction="column"
      borderBottom={`${borderWidth}px solid`}
      borderColor={mainStyles.chatListBorderColor}
      display={display}
      sx={{scrollbarWidth: "none"}}
      css={{
        "&::-webkit-scrollbar": {
          display: "none",
          width: "30px",
        },
      }}
    >
      <Flex>
        <Text color="white" px={2} pt={2} pb={type}>
          {supMessage}
        </Text>
      </Flex>
      <Flex direction="column">{result}</Flex>
    </Flex>
  );
};

const ChatItemsList = memo(({setChatCard}: any) => {
  const currentUser: any = useContext(AuthContext);
  const [chats, setChats] = useState<any>([]);
  let chatsLength = 0;
  useEffect(() => {
    const getChats = () => {
      const newChat = onSnapshot(
        doc(db, "userChats", currentUser.uid),
        (doc) => {
          let resChats: any = doc.data();

          let chatsArr = Object.entries(resChats).sort();

          if (chatsLength != chatsArr.length) {
            let res = chatsArr.map((chat: any) => {
              return (
                <ChatItem
                  key={Math.random()}
                  user={chat[1].userInfo}
                  setChatCard={setChatCard}
                />
              );
            });
            setChats(res);
            chatsLength = chatsArr.length;
          }
        }
      );

      return () => {
        newChat();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  return <Flex direction="column">{chats}</Flex>;
});

type ChatListProps = {
  searchInput: any;
  setChatCard: any;
};

const ChatList = ({searchInput, setChatCard}: ChatListProps) => {
  const [searchedUsers, setSearchedUsers] = useState<any>();
  const [username, setUsername] = useState("");

  const {isOpen} = useAppSelector((state) => state.mainSlice);
  return (
    <Flex
      display={{base: isOpen === "none" ? "flex" : "none", sm: "flex"}}
      flex={1}
      direction="column"
      borderEnd="1px solid"
      borderColor={mainStyles.chatListBorderColor}
    >
      <ChatSearch
        handleSearchedUsers={(users: any) => setSearchedUsers(users)}
        username={username}
        setUsername={setUsername}
        searchInput={searchInput}
      />
      <Render searchedUsers={searchedUsers} username={username} />
      <Flex
        pt={0}
        overflowY="scroll"
        direction="column"
        sx={{scrollbarWidth: "none"}}
        css={{
          "&::-webkit-scrollbar": {
            display: "none",
            width: "30px",
          },
        }}
      >
        <ChatItemsList setChatCard={setChatCard} />
      </Flex>
    </Flex>
  );
};
export default ChatList;

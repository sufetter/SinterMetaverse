import {Flex} from "@chakra-ui/react";

import React, {useEffect, useState} from "react";
import {db} from "./../../firebaseconfig";
import {useAppDispatch, useAppSelector} from "../../src/hooks/redux";
import {ModalBlockCard} from "../ModalBlock";
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
  deleteDoc,
  deleteField,
} from "firebase/firestore";
import {ChatItem} from "../ChatList";

export const FriendsCard = () => {
  const {currentUser} = useAppSelector((state) => state.userAuthSlice);
  const [friends, setFriends] = useState<any>();

  useEffect(() => {
    if (currentUser != String) {
      const getFriends = async () => {
        const newFriend = onSnapshot(
          doc(db, "userFriends", currentUser.uid),
          (docs) => {
            let resFriends: any = docs.data();
            if (resFriends) {
              let friendsArr = Object.entries(resFriends);
              const res = friendsArr.map((friend) => {
                let data: any;
                async function Get() {
                  const user: any = await getDoc(doc(db, "users", friend[0]));
                  data = user.data();
                  return data;
                }
                const r = Get();
                console.log(r);
                return <ChatItem user={Get} key={Math.random()} />;
              });

              setFriends(res);
            } else {
              setFriends(<></>);
            }
          }
        );

        return () => {
          newFriend();
        };
      };

      currentUser.uid && getFriends();
    }
  }, [currentUser]);

  return (
    <Flex h="100%" w="100%" flex={1}>
      {friends}
    </Flex>
  );
};

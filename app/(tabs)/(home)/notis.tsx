import { useUser } from "@clerk/clerk-expo";
import React, { useCallback } from "react";
import { View, Text, YStack, Button } from "tamagui";
import { getNotis } from "@/services/apiCalls";
import * as Types from "@/types";
import UserScrollView from "@/components/userScrollView";
import { useFocusEffect } from "expo-router";

// const fakeNotis: Types.Noti[] = [
//   {
//     user: {
//       id: "id",
//       name: "Jeff Hardy",
//       pfp: "https://ui-avatars.com/api/?name=b&background=00cccc&color=fff",
//     },
//     sessionID: "sessionID",
//     date: "2024-07-25T23:49:09.646Z",
//     body: "body",
//   },
// ];

enum ScreenType {
  FOLLOWING,
  FOLLOWERS,
  NOTIS,
}
const NotiScreen = () => {
  const { user } = useUser();
  const [notisUsers, setNotisUsers] = React.useState<Types.User[]>([]);
  const [notisContent, setNotisContent] = React.useState<Types.NotiContent[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchNotis();
    }, [notisUsers.length])
  );

  const fetchNotis = async () => {
    try {
      const notisData = await getNotis(user?.id as string);
      const notisUsersData: Types.User[] = notisData.map((noti) => noti.user);
      const notisContent: Types.NotiContent[] = notisData.map((noti) => ({
        sessionID: noti.sessionID,
        date: noti.date,
        body: noti.body,
        type: noti.type,
      }));
      setNotisUsers(notisUsersData);
      setNotisContent(notisContent);
      console.log(notisContent)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <YStack
      flex={1}
      alignItems="center"
      backgroundColor={"$background"}
    >
      <UserScrollView
        followers={notisUsers}
        following={[]}
        notisContent={notisContent}
        loading={false}
      />
    </YStack>
  );
};

export default NotiScreen;

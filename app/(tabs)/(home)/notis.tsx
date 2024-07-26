import UserScrollView from "@/components/userScrollView";
import { getNotis } from "@/services/apiCalls";
import * as Types from "@/types";
import { useUser } from "@clerk/clerk-expo";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback } from "react";
import { YStack } from "tamagui";

const NotiScreen = () => {
  const { user } = useUser();
  const [notisUsers, setNotisUsers] = React.useState<Types.User[]>([]);
  const [notisContent, setNotisContent] = React.useState<Types.NotiContent[]>([]);
  const params = useLocalSearchParams();
  const { followingListParam }  = params;
  const followingList = JSON.parse(followingListParam as string) as string[];
  const [loading, setLoading] = React.useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchNotis();
    }, [notisUsers.length])
  );

  const fetchNotis = async () => {
    setLoading(true);
    try {
      const notisData = await getNotis(user?.id as string);
      const notisUsersData: Types.User[] = notisData.map((noti) => noti.user);
      const notisContent: Types.NotiContent[] = notisData.map((noti) => ({
        sessionID: noti.sessionID,
        date: noti.date,
        type: noti.type,
      }));
      setNotisUsers(notisUsersData);
      setNotisContent(notisContent);
    } catch (error) {
      console.log(error);
    } finally{
      setLoading(false);
    }
  };

  return (
    <YStack
      flex={1}
      alignItems="center"
      backgroundColor={"$background"}
    >
      <UserScrollView
        userList={notisUsers}
        followingList={followingList}
        notisContent={notisContent}
        loading={loading}
      />
    </YStack>
  );
};

export default NotiScreen;


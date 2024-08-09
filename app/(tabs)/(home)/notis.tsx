import UserScrollView from "@/components/userScrollView";
import { getNotis } from "@/services/apiCalls";
import * as Types from "@/types";
import { useUser } from "@clerk/clerk-expo";
import React, { useEffect, useRef } from "react";
import { YStack } from "tamagui";

const emptyUser: Types.User = {
  id: "",
  name: "",
  pfp: " ",
};
const skeletonUsers = Array.from(
  { length: 5 },
  (_, i) => emptyUser
);

const NotiScreen = () => {
  const { user } = useUser();
  const [notisUsers, setNotisUsers] = React.useState<Types.User[]>([]);
  const [notisContent, setNotisContent] = React.useState<Types.NotiContent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const isInitialLoad = useRef(true);
 
  const fetchNotis = async () => {
    setLoading(true);
    try {
      const notisData = (await getNotis(user?.id as string)).reverse();
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
      isInitialLoad.current = false;
    }
  };

  useEffect(() => {
    fetchNotis();
  }, []);

  const showSkeleton = loading && isInitialLoad.current;
  return (
    <YStack
      flex={1}
      alignItems="center"
      backgroundColor={"$background"}
    >{
      showSkeleton && <UserScrollView
        userList={skeletonUsers}
        loading={true}
      />
    }
     {!showSkeleton && <UserScrollView
        userList={notisUsers}
        notisContent={notisContent}
        loading={false}
      />}
    </YStack>
  );
};

export default NotiScreen;

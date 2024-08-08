import UserScrollView from "@/components/home/userScrollView";
import { getUserFollowers } from "@/services/apiCalls";
import * as Types from "@/types";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { YStack } from "tamagui";

const emptyUser: Types.User = {
  id: "",
  name: "",
  pfp: " ",
};

const UserFollowers = ({followerCount, userID} : {followerCount: number, userID : string}) => {
  const [followers, setFollowers] = React.useState<Types.User[]>([]);
  const [loading, setLoading] = React.useState(false);

  const skeletonUsers = Array.from({ length: Math.min(followerCount, 10) }, (_, i) => emptyUser);

  useEffect(() => {
    fetchFollowers();
  }, []);

  const fetchFollowers = async () => {
    setLoading(true);
    try {
      console.log(userID);
      const data = await getUserFollowers(userID as string);
      setFollowers(data);
    } catch (error) {}
    setLoading(false);
  };

  return (
    <YStack
      flex={1}
      alignItems="center"
      backgroundColor={"$background"}
    >
      {loading && (
        <UserScrollView
          userList={skeletonUsers}
          loading={true}
        />
      )}
      {!loading && (
        <UserScrollView
          userList={followers}
          loading={false}
        />
      )}
    </YStack>
  );
};

export default UserFollowers;

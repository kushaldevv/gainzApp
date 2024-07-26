import UserScrollView from "@/components/userScrollView";
import * as Types from "@/types";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { YStack } from "tamagui";

const emptyUser: Types.User = {
  id: "",
  name: "",
  pfp: " ",
};

const UserFollowers = () => {
  const params = useLocalSearchParams();
  const { followingListParam, followersParam } = params;
  const followers = JSON.parse(followersParam as string) as Types.User[];
  const followingList = JSON.parse(followingListParam as string) as string[];

  return (
    <YStack
      flex={1}
      alignItems="center"
      backgroundColor={"$background"}
    >
      {
        <UserScrollView
          userList={followers}
          followingList={followingList}
          loading={false}
        />
      }
    </YStack>
  );
};

export default UserFollowers;

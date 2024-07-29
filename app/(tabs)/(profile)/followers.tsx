import UserScrollView from "@/components/userScrollView";
import * as Types from "@/types";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { YStack } from "tamagui";

const UserFollowers = () => {
  const params = useLocalSearchParams();
  const { followersParam } = params;
  const followers = JSON.parse(followersParam as string) as Types.User[];

  return (
    <YStack
      flex={1}
      alignItems="center"
      backgroundColor={"$background"}
    >
      {
        <UserScrollView
          userList={followers}
          loading={false}
        />
      }
    </YStack>
  );
};

export default UserFollowers;

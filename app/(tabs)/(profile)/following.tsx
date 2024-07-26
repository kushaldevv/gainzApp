import UserScrollView from "@/components/userScrollView";
import * as Types from "@/types";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  YStack
} from "tamagui";

const emptyUser: Types.User = {
  id: "",
  name: "",
  pfp: " ",
};

const UserFollowing = () => {
  const params = useLocalSearchParams();
  const { followingParam } = params;
  const following = JSON.parse(followingParam as string) as Types.User[];

  return (
    <YStack flex={1} alignItems="center" backgroundColor={"$background"}>
        <UserScrollView
          userList={following}
          loading={false}
        />
    </YStack>
  );
};

export default UserFollowing;

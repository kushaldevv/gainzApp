import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import { Avatar, Button, ScrollView, SizableText, XStack, YStack } from "tamagui";
import * as Types from "@/types";
import UserScrollView from "@/components/userScrollView";
import { getUserFollowers } from "@/services/apiCalls";

const emptyUser: Types.User = {
  id: "",
  name: "",
  pfp: " ",
};

const UserFollowers = () => {
  const params = useLocalSearchParams();
  const { followingParam, followersParam } = params;
  const followers = JSON.parse(followersParam as string) as Types.User[];
  const following = JSON.parse(followingParam as string) as Types.User[];
  // const [followers, setFollowers] = useState<Types.User[]>([])
  const [loading, setLoading] = useState(true);

  const skeletonUsers = Array.from({ length: Math.min(followers.length, 10) }, (_, i) => emptyUser);

  // useFocusEffect(
  //   useCallback(() => {
  //     console.log(following);
  //   }, [])
  // );

  // const fetchFollowers = async () => {
  //   try {
  //     setLoading(true);
  //     if (userID) {
  //       const data = await getUserFollowers(userID as string);
  //       setFollowers(data);
  //     }
  //   } catch (error) {
  //     console.log("Error: ", error);
  //   }  finally {
  //     setLoading(false);
  //   }
  // }

  return (
    <YStack
      flex={1}
      alignItems="center"
      backgroundColor={"$background"}
    >
      {
        <UserScrollView
          followers={followers}
          following={following}
          loading={false}
        />
      }
    </YStack>
  );
};

export default UserFollowers;

import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Avatar,
  Button,
  ScrollView,
  SizableText,
  XStack,
  YStack,
} from "tamagui";
import * as Types from "@/types";
import UserScrollView from "@/components/userScrollView";
import { getUserFollowing } from "@/services/apiCalls";

const emptyUser: Types.User = {
  id: "",
  name: "",
  pfp: " ",
};

const UserFollowing = () => {
  const params = useLocalSearchParams();
  const {userID, numFollowing} = params;
  const [following, setFollowing] = useState<Types.User[]>([])
  const [loading, setLoading] = useState(true);

  const skeletonUsers = Array.from(
    { length: Math.min(parseInt(numFollowing as string), 10) },
    (_, i) => emptyUser
  );

  useFocusEffect(
    useCallback(() => {
        fetchFollowing();
    }, [])
  );
  
  const fetchFollowing = async () => {
    try {
      setLoading(true);
      if (userID) {
        const data = await getUserFollowing(userID as string);
        setFollowing(data);
      }
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <YStack flex={1} alignItems="center" backgroundColor={"$background"}>
           {loading && (
        <UserScrollView
          userList={skeletonUsers}
          loading={true}
        />
      )}
      {!loading && (
        <UserScrollView
          userList={following}
          loading={false}
        />
      )}
    </YStack>
  );
};

export default UserFollowing;

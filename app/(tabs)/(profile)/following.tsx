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

const UserFollowing = () => {
  const params = useLocalSearchParams();
  const {userID} = params;
  const [following, setFollowing] = useState<Types.User[]>([])

  useFocusEffect(
    useCallback(() => {
        fetchFollowing();
    }, [])
  );
  
  const fetchFollowing = async () => {
    try {
      if (userID) {
        const data = await getUserFollowing(userID as string);
        setFollowing(data);
      }
    } catch (error) {
      console.log("Error: ", error);
    } 
  }

  return (
    <YStack flex={1} alignItems="center" backgroundColor={"$background"}>
      <UserScrollView userList={following}/>
    </YStack>
  );
};

export default UserFollowing;

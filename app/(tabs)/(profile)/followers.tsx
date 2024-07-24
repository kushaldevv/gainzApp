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
import { getUserFollowers } from "@/services/apiCalls";

const UserFollowers = () => {
  const params = useLocalSearchParams();
  const {userID} = params;
  const [followers, setFollowers] = useState<Types.User[]>([])

  useFocusEffect(
    useCallback(() => {
        fetchFollowers();
    }, [])
  );
  
  const fetchFollowers = async () => {
    try {
      if (userID) {
        const data = await getUserFollowers(userID as string);
        setFollowers(data);
      }
    } catch (error) {
      console.log("Error: ", error);
    } 
  }

  return (
    <YStack flex={1} alignItems="center" backgroundColor={"$background"}>
      <UserScrollView userList={followers}/>
    </YStack>
  );
};

export default UserFollowers;

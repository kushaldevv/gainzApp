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

const emptyUser: Types.User = {
  id: "",
  name: "",
  pfp: " ",
};

const UserFollowers = () => {
  const params = useLocalSearchParams();
  const {userID, numFollowers} = params;
  const [followers, setFollowers] = useState<Types.User[]>([])
  const [loading, setLoading] = useState(true);

  const skeletonUsers = Array.from(
    { length: Math.min(parseInt(numFollowers as string), 10) },
    (_, i) => emptyUser
  );

  useFocusEffect(
    useCallback(() => {
        fetchFollowers();
    }, [])
  );
  
  const fetchFollowers = async () => {
    try {
      setLoading(true);
      if (userID) {
        const data = await getUserFollowers(userID as string);
        setFollowers(data);
      }
    } catch (error) {
      console.log("Error: ", error);
    }  finally {
      setLoading(false);
    }
  }

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

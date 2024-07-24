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
import { getSessionLikes } from "@/services/apiCalls";


const Likes = () => {
  const params = useLocalSearchParams();
  const {sessionID} = params;
  const [likes, setLikes] = useState<Types.User[]>([])

  useFocusEffect(
    useCallback(() => {
      fetchLikes();
    }, [])
  );
  
  const fetchLikes = async () => {
    try {
      if (sessionID){
        const data = await getSessionLikes(sessionID as string);
        setLikes(data);
      }
    } catch (error) {
      
    } 
  }

  return (
    <YStack flex={1} alignItems="center" backgroundColor={"$background"}>
      <UserScrollView userList={likes}/>
    </YStack>
  );
};

export default Likes;

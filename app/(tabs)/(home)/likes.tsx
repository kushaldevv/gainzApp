import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import { YStack } from "tamagui";
import * as Types from "@/types";
import UserScrollView from "@/components/userScrollView";
import { getSessionLikes } from "@/services/apiCalls";

const emptyUser: Types.User = {
  id: "",
  name: "",
  pfp: " ",
};

const Likes = () => {
  const params = useLocalSearchParams();
  const { sessionID, numLikes } = params;
  const [likes, setLikes] = useState<Types.User[]>([]);
  const [loading, setLoading] = useState(true);

  const skeletonUsers = Array.from(
    { length: Math.min(parseInt(numLikes as string), 10) },
    (_, i) => emptyUser
  );

  useFocusEffect(
    useCallback(() => {
      fetchLikes();
    }, [])
  );

  const fetchLikes = async () => {
    try {
      setLoading(true);
      if (sessionID) {
        const data = await getSessionLikes(sessionID as string);
        setLikes(data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
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
          userList={likes}
          loading={false}
        />
      )}
    </YStack>
  );
};

export default Likes;

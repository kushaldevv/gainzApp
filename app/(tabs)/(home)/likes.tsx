import UserScrollView from "@/components/home/userScrollView";
import { getSessionLikes } from "@/services/apiCalls";
import * as Types from "@/types";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { YStack } from "tamagui";

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

  useEffect(() => {
    fetchLikes();
  }, []);

  const fetchLikes = async () => {
    try {
      setLoading(true);
      if (sessionID) {
        const likesData = await getSessionLikes(sessionID as string);
        setLikes(likesData);
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

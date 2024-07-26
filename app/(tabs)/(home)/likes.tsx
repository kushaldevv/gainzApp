import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import { YStack } from "tamagui";
import * as Types from "@/types";
import UserScrollView from "@/components/userScrollView";
import { getSessionLikes, getUserFollowing, getUserFollowingList } from "@/services/apiCalls";
import { useUser } from "@clerk/clerk-expo";

const emptyUser: Types.User = {
  id: "",
  name: "",
  pfp: " ",
};

const Likes = () => {
  const params = useLocalSearchParams();
  const { sessionID, numLikes } = params;
  const [likes, setLikes] = useState<Types.User[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const {user} = useUser();

  const skeletonUsers = Array.from(
    { length: Math.min(parseInt(numLikes as string), 10) },
    (_, i) => emptyUser
  );

  useFocusEffect(
    useCallback(() => {
      fetchLikesAndFollowing();
    }, [])
  );

  const fetchLikesAndFollowing = async () => {
    try {
      setLoading(true);
      if (sessionID) {
        const likesData = await getSessionLikes(sessionID as string);
        setLikes(likesData);
        const followingData = await getUserFollowingList(user?.id as string);
        setFollowing(followingData);
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
          followingList={[]}
          loading={true}
        />
      )}
      {!loading && (
        <UserScrollView
         userList={likes}
         followingList={following}
         loading={false}
        />
      )}
    </YStack>
  );
};

export default Likes;

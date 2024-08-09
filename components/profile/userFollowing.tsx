import UserScrollView from "@/components/home/userScrollView";
import { getUserFollowing } from "@/services/apiCalls";
import * as Types from "@/types";
import React, { useEffect } from "react";
import { YStack } from "tamagui";

const emptyUser: Types.User = {
  id: "",
  name: "",
  pfp: " ",
};

const UserFollowing = ({followingCount, userID} : {followingCount: number, userID : string}) => {
  const [following, setFollowing] = React.useState<Types.User[]>([]);
  const [loading, setLoading] = React.useState(false);

  const skeletonUsers = Array.from({ length: Math.min(followingCount, 10) }, (_, i) => emptyUser);

  useEffect(() => {
    fetchFollowing();
  }, []);

  const fetchFollowing = async () => {
    setLoading(true);
    try {
      console.log(userID);
      const data = await getUserFollowing(userID as string);
      setFollowing(data);
    } catch (error) {}
    setLoading(false);
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
          followingScreen={true}
          loading={true}
        />
      )}
      {!loading && (
        <UserScrollView
          userList={following}
          followingScreen={true}
          loading={false}
        />
      )}
    </YStack>
  );
};

export default UserFollowing;

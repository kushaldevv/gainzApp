import * as Types from "@/types";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import UserFollowing from "@/components/profile/userFollowing";

const Following = () => {
  const params = useLocalSearchParams();
  const { userID, followingParam } = params;
  const followingCount = parseInt(followingParam as string);
  
  return <UserFollowing followingCount={followingCount} userID={userID as string} />
};

export default Following;

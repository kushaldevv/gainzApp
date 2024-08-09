import * as Types from "@/types";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import UserFollowers from "@/components/profile/userFollowers";

const Followers = () => {
  const params = useLocalSearchParams();
  const { userID, followersParam } = params;
  const followersCount = parseInt(followersParam as string);
  
  return <UserFollowers followerCount={followersCount} userID={userID as string} />
};

export default Followers;

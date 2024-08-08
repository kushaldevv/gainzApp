import { View, Text } from "react-native";
import React, { useContext, useEffect } from "react";
import UserProfile from "@/components/profile/userProfile";
import { useUser } from "@clerk/clerk-expo";
import { router, useLocalSearchParams } from "expo-router";
import { ProfileContext } from "./_layout";

const Profile = () => {
  const { user } = useUser();
  const params = useLocalSearchParams();
  const { userIdParam, userFollowingParam } = params;
  const { userId, setUserId } = useContext(ProfileContext);

  useEffect(() => {
    setUserId((userIdParam as string) || user?.id!);
  }, []);

  return (
    <UserProfile
      userID={(userIdParam as string) || user?.id!}
      isPublicProfile={false}
      following={(userFollowingParam as string) === "true"}
    />
  );
};

export default Profile;

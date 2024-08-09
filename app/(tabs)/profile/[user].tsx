import UserProfile from "@/components/profile/userProfile";
import { useUser } from "@clerk/clerk-expo";
import { useLocalSearchParams, usePathname } from "expo-router";
import React from "react";

const Profile = () => {
  const { user } = useUser();
  const params = useLocalSearchParams();
  const { userIdParam } = params;

  const userID = (userIdParam as string) || user?.id!
  return (
    <UserProfile
      userID={userID}
      isPublicProfile={false}
    />
  );
};

export default Profile;

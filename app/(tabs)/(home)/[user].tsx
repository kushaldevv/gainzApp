import UserProfile from "@/components/profile/userProfile";
import { useLocalSearchParams } from "expo-router";
import React from "react";

const Profile = () => {
  const params = useLocalSearchParams();
  const { userIdParam } = params;
  const userID = (userIdParam as string)

  return (
    <UserProfile
      userID={userID}
      isPublicProfile={true}
    />
  );
};

export default Profile;

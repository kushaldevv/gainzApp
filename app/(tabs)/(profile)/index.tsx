import { useClerk, useUser } from "@clerk/clerk-expo";
import React, { useCallback, useState } from "react";
import { Avatar, Button, Text, View, XStack, YStack } from "tamagui";
import { getUserPfp, getUserProfile } from "@/services/apiCalls";
import { router, useFocusEffect } from "expo-router";
import axios from "axios";
import { TouchableOpacity } from "react-native";

const Profile = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [pfp, setPfp] = useState(" ");

  const [workouts, setWorkouts] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  useFocusEffect(
    useCallback(() => {
      fetchPFP();
      fetchUserProfile();
    }, [])
  );

  const fetchPFP = async () => {
    if (user) {
      setPfp(await getUserPfp(user.id));
    }
  };

  const fetchUserProfile = async () => {
    if (user) {
      try {
        const userProfile = await getUserProfile(user.id);
        setWorkouts(userProfile.sessions.length);
        setFollowers(userProfile.followers.length);
        setFollowing(userProfile.following.length);
      } catch (error) {
        console.error("Error fetching user profile: ", error);
      }
    }
  };

  const handleFollowingPress = () => {
    if (following > 0) {
      router.push({
        pathname: "/following",
        params: { userID: user?.id, numFollowing: following },
      });
    }
  };

  const handleFollowersPress = () => {
    if (following > 0) {
      router.push({
        pathname: "/followers",
        params: { userID: user?.id, numFollowers: followers },
      });
    }
  };

  return (
    <YStack
      flex={1}
      alignItems="center"
      backgroundColor="$background"
    >
      <XStack
        gap="$6"
        justifyContent="center"
      >
        <Avatar
          circular
          size="$7"
        >
          <Avatar.Image src={pfp} />
          <Avatar.Fallback backgroundColor="$blue10" />
        </Avatar>
        <YStack justifyContent="center">
          <TouchableOpacity style={{ alignItems: "center" }}>
            <Text
              fontWeight="bold"
              fontSize="$5"
            >
              {workouts}
            </Text>
            <Text fontSize="$4">workouts</Text>
          </TouchableOpacity>
        </YStack>
        <YStack justifyContent="center">
          <TouchableOpacity
            onPress={()=> (followers > 0 && handleFollowersPress())}
            style={{ alignItems: "center" }}
          >
            <Text
              fontWeight="bold"
              fontSize="$5"
            >
              {followers}
            </Text>
            <Text fontSize="$4">followers</Text>
          </TouchableOpacity>
        </YStack>
        <YStack justifyContent="center">
          <TouchableOpacity
            onPress={()=> (following > 0 && handleFollowingPress())}
            style={{ alignItems: "center" }}
          >
            <Text
              fontWeight="bold"
              fontSize="$5"
            >
              {following}
            </Text>
            <Text fontSize="$4">following</Text>
          </TouchableOpacity>
        </YStack>
      </XStack>

      <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
      <Text>Hello {user?.id}</Text>
      <Button onPress={() => signOut()}>Log out</Button>
    </YStack>
  );
};

export default Profile;

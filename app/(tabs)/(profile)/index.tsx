import { useClerk, useUser } from "@clerk/clerk-expo";
import React, { useCallback, useState } from "react";
import { Avatar, Button, Text, View, XStack, YStack } from "tamagui";
import { getUserPfp, getUserProfile } from "@/services/apiCalls";
import { router, useFocusEffect } from "expo-router";
import * as Types from "@/types";
import { TouchableOpacity } from "react-native";

const Profile = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [pfp, setPfp] = useState(" ");

  const [workouts, setWorkouts] = useState(0);
  const [followers, setFollowers] = useState<Types.User[]>([]);
  const [following, setFollowing] = useState<Types.User[]>([]);

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
        setFollowers(userProfile.followers);
        setFollowing(userProfile.following);
        router.setParams({ followers: JSON.stringify(userProfile.followers) });
        router.setParams({ following: JSON.stringify(userProfile.following) });
      } catch (error) {
        console.error("Error fetching user profile: ", error);
      }
    }
  };

  const handleFollowingPress = () => {
    if (following.length > 0) {
      router.push({
        pathname: "/following",
        params: {followingParam: JSON.stringify(following)},
      });
    }
  };

  const handleFollowersPress = () => {
    if (followers.length > 0) {
      router.push({
        pathname: "/followers",
        params: { followingParam: JSON.stringify(following), followersParam: JSON.stringify(followers)},
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
            onPress={()=> (followers.length > 0 && handleFollowersPress())}
            style={{ alignItems: "center" }}
          >
            <Text
              fontWeight="bold"
              fontSize="$5"
            >
              {followers.length}
            </Text>
            <Text fontSize="$4">followers</Text>
          </TouchableOpacity>
        </YStack>
        <YStack justifyContent="center">
          <TouchableOpacity
            onPress={()=> (following.length > 0 && handleFollowingPress())}
            style={{ alignItems: "center" }}
          >
            <Text
              fontWeight="bold"
              fontSize="$5"
            >
              {following.length}
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

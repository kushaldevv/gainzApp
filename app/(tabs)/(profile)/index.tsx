import { getUserProfile } from "@/services/apiCalls";
import * as Types from "@/types";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Avatar, Button, Text, XStack, YStack } from "tamagui";

const Profile = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [pfp, setPfp] = useState(" ");

  const [workouts, setWorkouts] = useState(0);
  const [followers, setFollowers] = useState<Types.User[]>([]);
  const [following, setFollowing] = useState<Types.User[]>([]);
  const [followingList, setFollowingList] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [])
  );

  const fetchUserProfile = async () => {
    if (user) {
      try {
        const userProfile = await getUserProfile(user.id);
        setWorkouts(userProfile.sessions.length);
        setFollowers(userProfile.followers);
        setFollowing(userProfile.following);
        setPfp(userProfile.pfp);
        const newFollowingList = userProfile.following.map((user) => user.id);
        setFollowingList(newFollowingList);
        router.setParams({
          followersParam: JSON.stringify(userProfile.followers),
          followingParam: JSON.stringify(userProfile.following),
          followingListParam: JSON.stringify(newFollowingList),
        });
      } catch (error) {
        console.error("Error fetching user profile: ", error);
      }
    }
  };

  const handleFollowingPress = () => {
    if (following.length > 0) {
      router.push({
        pathname: "/following",
        params: {
          followingParam: JSON.stringify(following),
          followingListParam: JSON.stringify(followingList),
        },
      });
    }
  };

  const handleFollowersPress = () => {
    if (followers.length > 0) {
      router.push({
        pathname: "/followers",
        params: {
          followingListParam: JSON.stringify(followingList),
          followersParam: JSON.stringify(followers),
        },
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
        mt="$3"
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
            onPress={() => followers.length > 0 && handleFollowersPress()}
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
            onPress={() => following.length > 0 && handleFollowingPress()}
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

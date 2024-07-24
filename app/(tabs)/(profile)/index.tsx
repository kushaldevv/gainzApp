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

  const updateClerkPfp = async (): Promise<void> => {
    // if (user) {
    //   try {
    //     const imageUrl =
    //       "https://ui-avatars.com/api/?name=Roti&background=00cccc&color=fff";
    //     const response = await axios.get(imageUrl, {
    //       responseType: "arraybuffer",
    //       headers: {
    //         Accept: "image/png",
    //       },
    //     });
    //     const imageBlob = new Blob([response.data], { type: "image/png" });
    //     const file = new File([imageBlob], "pfp.png", { type: "image/png" });
    //     await user
    //       .setProfileImage({ file: file })
    //       .then((res) => console.log(res))
    //       .catch((error) => console.log("An error occurred:", error.errors));
    //     // await user.reload();
    //   } catch (error) {
    //     console.error("Error updating profile picture:", error);
    //   }
    // }
  };

  // const handleFollowingPress = () => {
  //   router.push('/following');
  // }

  const handleFollowingPress = () => {
    if (following > 0) {
      router.push({
        pathname: "/following",
        params: {userID: user?.id},
      });
    }
  };

  const handleFollowersPress = () => {
    if (following > 0) {
      router.push({
        pathname: "/followers",
        params: {userID: user?.id},
      });
    }
  };

  return (
    // <YStack flex={1} alignItems="center" backgroundColor={"$background"}>
    //   <Button onPress={() => updateClerkPfp()}>Change Image</Button>
    //   <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
    //   <Text>Hello {user?.id}</Text>
    //   <Button onPress={() => signOut()}>Log out</Button>
    //   <Avatar circular size="$4">
    //     <Avatar.Image src={pfp} />
    //     <Avatar.Fallback backgroundColor="$blue10" />
    //   </Avatar>
    // </YStack>
    <View style={{ flex: 1 }}>
      <XStack
        justifyContent="space-between"
        alignItems="center"
        padding="$4"
        backgroundColor="$background"
      >
        <Avatar circular size="$7">
          <Avatar.Image src={pfp} />
          <Avatar.Fallback backgroundColor="$blue10" />
        </Avatar>

        <XStack alignItems="center" paddingHorizontal="$4">
          <YStack alignItems="center" paddingHorizontal="$4">
            <Text fontWeight="bold" fontSize="$5">
              {workouts}
            </Text>
            <Text fontSize="$4">workouts</Text>
          </YStack>
          <YStack alignItems="center" paddingHorizontal="$4">
            <Text fontWeight="bold" fontSize="$5">{followers}</Text>
            <Text fontSize="$4" onPress={handleFollowersPress}>followers</Text>
          </YStack>
          <YStack alignItems="center" paddingHorizontal="$4">
            <Text fontWeight="bold" fontSize="$5">{following}</Text>
            <TouchableOpacity>
              <Text fontSize="$4" onPress={handleFollowingPress}>following</Text>
            </TouchableOpacity>
          </YStack>
        </XStack>
      </XStack>

      <YStack
        flex={1}
        alignItems="center"
        backgroundColor="$background"
        padding="$4"
      >
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <Text>Hello {user?.id}</Text>
        <Button onPress={() => updateClerkPfp()}>Change Image</Button>
        <Button onPress={() => signOut()}>Log out</Button>
      </YStack>
    </View>
  );
};

export default Profile;

import { useClerk, useUser } from "@clerk/clerk-expo";
import React, { useCallback, useState } from "react";
import { Avatar, Button, Text, YStack } from "tamagui";
import { getUserPfp } from "@/services/apiCalls";
import { useFocusEffect } from "expo-router";

const Profile = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [pfp, setPfp] = useState(" ");


  useFocusEffect(
    useCallback(() => {
      fetchPFP();
    }, [])
  );

  const fetchPFP = async () => {
    if (user) {
      setPfp(await getUserPfp(user.id));
    }
  };

  return (
    <YStack flex={1} alignItems="center" backgroundColor={"$background"}>
      <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
      <Text>Hello {user?.id}</Text>
      <Button onPress={() => signOut()}>Log out</Button>
      <Avatar circular size="$4">
        <Avatar.Image src={pfp} />
        <Avatar.Fallback backgroundColor="$blue10" />
      </Avatar>
    </YStack>
  );
};

export default Profile;

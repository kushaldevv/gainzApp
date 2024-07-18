import { useClerk, useUser } from "@clerk/clerk-expo";
import React from "react";
import { Button, Text, YStack } from "tamagui";

const Profile = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  return (
    <YStack flex={1} alignItems="center" backgroundColor={"$background"}>
      <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
      <Button onPress={() => signOut()}>Log out</Button>
    </YStack>
  );
};

export default Profile;

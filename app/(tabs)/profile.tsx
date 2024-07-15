import React from "react";
import { YStack, Text, Button } from "tamagui";
import { useClerk, useUser } from "@clerk/clerk-expo";

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

import { useClerk, useUser } from "@clerk/clerk-expo";
import React from "react";
import { Avatar, Button, Text, YStack } from "tamagui";

const Profile = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  return (
    <YStack flex={1} alignItems="center" backgroundColor={"$background"}>
      <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
      <Button onPress={() => signOut()}>Log out</Button>
      <Avatar circular size="$4">
        <Avatar.Image src={user?.imageUrl} />
        <Avatar.Fallback backgroundColor="$blue10" />
      </Avatar>
    </YStack>
  );
};

export default Profile;

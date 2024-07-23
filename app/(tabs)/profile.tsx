import { useClerk, useUser } from "@clerk/clerk-expo";
import React, { useCallback, useState } from "react";
import { Avatar, Button, Text, YStack } from "tamagui";
import { getUserPfp } from "@/services/apiCalls";
import { useFocusEffect } from "expo-router";
import axios from "axios";

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

  return (
    <YStack flex={1} alignItems="center" backgroundColor={"$background"}>
      <Button onPress={() => updateClerkPfp()}>Change Image</Button>
      <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
      <Text>Hello {user?.id}</Text>
      <Button onPress={() => signOut()}>Log out</Button>
      <Avatar circular size="$4">
        <Avatar.Image src={user?.imageUrl} />
        <Avatar.Fallback backgroundColor="$blue10" />
      </Avatar>
    </YStack>
  );
};

export default Profile;

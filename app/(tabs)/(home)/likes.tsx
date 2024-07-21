import { getSessionLikes } from "@/services/apiCalls";
import * as Types from "@/types";

import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  ScrollView,
  XStack,
  YStack,
  Text,
  SizableText,
} from "tamagui";
import { useLocalSearchParams } from "expo-router";

type Like = {
  id: string;
  name: string;
  pfp: string;
};

// Mock data for likes (replace this with actual data from your API or props)
const mockLikes: Like[] = [
  { id: "1", name: "John Doe", pfp: "https://example.com/john.jpg" },
  { id: "2", name: "Jane Smith", pfp: "https://example.com/jane.jpg" },
  { id: "3", name: "Bob Johnson", pfp: "https://example.com/bob.jpg" },
  // Add more mock data as needed
];

const Likes = () => {
  // const [likes, setLikes] = useState<Types.User[]>([]);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchLikes = async () => {
  //     try {
  //       const likedUsers = await getSessionLikes(userID, sessionID);
  //       setLikes(likedUsers);
  //       setIsLoading(false);
  //     } catch (err) {
  //       console.error("Error fetching likes:", err);
  //       setError("Failed to fetch likes. Please try again later.");
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchLikes();
  // }, [userID, sessionID]);

  const { likes } = useLocalSearchParams();
  const likesData = JSON.parse(likes as string);

  // Use likesData in your component
  // ...
  console.log("Hello this is: ");
  console.log(likesData);

  const handleFollow = (userId: string) => {
    // Implement follow functionality here
    console.log(`Following user with ID: ${userId}`);
  };

  return (
    <YStack flex={1} alignItems="center" backgroundColor={"$background"}>
      <ScrollView width={"100%"}>
        {likesData.map((like: Like) => (
          <XStack key={like.id} padding="$3" alignItems="center" justifyContent='space-between'>
            <XStack flex={1} alignItems="center" mr="$3">
              <Avatar circular size="$5">
                <Avatar.Image src={like.pfp} />
                <Avatar.Fallback backgroundColor="$blue10" />
              </Avatar>
              <SizableText
                size={"$4"}
                fontFamily={"$mono"}
                fontWeight={700}
                ml="$3"
              >
                {like.name}
              </SizableText>
            </XStack>
            <Button themeInverse onPress={() => handleFollow(like.id)} height={'$3'} width={'$10'}>
              Follow
            </Button>
          </XStack>
        ))}
      </ScrollView>
    </YStack>
  );
};

export default Likes;
function setError(arg0: string) {
  throw new Error("Function not implemented.");
}

import { getSessionLikes } from "@/services/apiCalls";
import * as Types from "@/types";

import React, { useEffect, useState } from "react";
import { Avatar, Button, ScrollView, XStack, YStack, Text } from "tamagui";
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

  return (
    // <View style={{ flex: 1 }}>
    //   <XStack justifyContent="space-between" alignItems="center" padding="$4">
    //     <Button onPress={() => router.back()}>Back</Button>
    //     <Text>Likes</Text>
    //   </XStack>

    //   {/* Rest of your Likes screen content */}
    //   <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    //     <Text>This is the Likes Screen</Text>
    //     {/* You can add your likes content here */}
    //   </View>
    // </View>
    <YStack flex={1} alignItems="center" backgroundColor={"$background"}>
      <ScrollView width={"100%"}>
        {likesData.map((like: Like) => (
          <XStack key={like.id} padding="$3" alignItems="center">
            <Avatar circular size="$4">
              <Avatar.Image src={like.pfp} />
              <Avatar.Fallback backgroundColor="$blue10" />
            </Avatar>
    
            <Text fontSize={"$6"} paddingLeft={"$4"}>{like.name}</Text>
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

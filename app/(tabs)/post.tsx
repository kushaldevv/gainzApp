import React from "react";
import { Text, YStack } from "tamagui";

const Post = () => {
  return (
    <YStack flex={1} alignItems="center" backgroundColor={"$background"}>
      <Text>Hello, World!</Text>
    </YStack>
  );
};

export default Post;

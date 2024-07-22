import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Avatar,
  Button,
  ScrollView,
  SizableText,
  XStack,
  YStack,
} from "tamagui";
import * as Types from "@/types";

const Likes = () => {
  const { likes } = useLocalSearchParams();
  const likesData = JSON.parse(likes as string);

  return (
    <YStack flex={1} alignItems="center" backgroundColor={"$background"}>
      <ScrollView width={"100%"}>
        {likesData.map((like: Types.User) => (
          <XStack
            key={like.id}
            padding="$3"
            alignItems="center"
            justifyContent="space-between"
          >
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
            <Button
              themeInverse
              height={"$3"}
              width={"$10"}
              pressStyle={{
                backgroundColor: "$gray7",
                borderColor: "$borderColorFocus",
              }}
            >
              Follow
            </Button>
          </XStack>
        ))}
      </ScrollView>
    </YStack>
  );
};

export default Likes;

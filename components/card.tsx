import {
  Dumbbell,
  MessageCircleMore,
  MoreHorizontal,
  Send,
  ThumbsUp,
  X,
} from "@tamagui/lucide-icons";
import React, { useState } from "react";
import {
  Avatar,
  Circle,
  Input,
  Paragraph,
  ScrollView,
  Sheet,
  SizableText,
  View,
  XStack,
  YStack,
} from "tamagui";

import { useHeaderHeight } from "@react-navigation/elements";
import { Dimensions } from "react-native";
import * as Types from "../types";
import { Comment } from "./comment";

export const Card = ({ session }: Types.CardProps) => {
  const [like, setLike] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <YStack backgroundColor={"$gray1"} p="$3" gap="$2">
      <XStack gap="$3" width="100%">
        <Avatar circular size="$4">
          <Avatar.Image src={session.user.pfp} />
          <Avatar.Fallback backgroundColor="$blue10" />
        </Avatar>
        <YStack>
          <SizableText size={"$2"} fontFamily={"$mono"} fontWeight={800}>
            {session.user.name}
          </SizableText>
          <XStack gap="$2" alignItems="center">
            <Dumbbell size="$1" />
            <YStack>
              <Paragraph lineHeight={"$1"} fontSize={"$1"}>
                {formatSessionDate(session.date)}
                {"\n"}
                {session.location}
              </Paragraph>
            </YStack>
          </XStack>
        </YStack>
        <MoreHorizontal pos="absolute" right="$0" />
      </XStack>
      <SizableText size={"$6"} fontFamily={"$mono"} fontWeight={700}>
        Evening Workout
      </SizableText>
      <XStack gap="$5">
        <YStack>
          <Paragraph lineHeight={"$1"} fontSize={"$1"}>
            Exercises
          </Paragraph>
          <SizableText size={"$5"} fontFamily={"$mono"} fontWeight={700}>
            {session.exercises.length}
          </SizableText>
        </YStack>
        <YStack>
          <Paragraph lineHeight={"$1"} fontSize={"$1"}>
            Time
          </Paragraph>
          <SizableText size={"$4"} fontFamily={"$mono"} fontWeight={700}>
            {formatSessionTime(session.sessionTime)}
          </SizableText>
        </YStack>
      </XStack>
      <View
        height={"$15"}
        alignItems="center"
        justifyContent="center"
        backgroundColor={"#00cccc"}
        borderRadius={"$5"}
      >
        <SizableText>Card Action</SizableText>
      </View>
      <XStack
        justifyContent="space-between"
        paddingHorizontal="$10"
        paddingTop="$2"
      >
        <YStack alignItems="center" gap="$2" width={"$10"}>
          <XStack>
            {session.likes.slice(0, 3).map((item, index) => (
              <Avatar
                key={index}
                circular
                size="$1.5"
                ml={index != 0 ? "$-2" : "$0"}
                borderWidth="$0.25"
                borderColor={"$color"}
              >
                <Avatar.Image src={item.pfp} />
                <Avatar.Fallback backgroundColor="$blue10" />
              </Avatar>
            ))}
            {session.likes.length > 3 && (
              <Circle
                size="$1.5"
                backgroundColor="$gray7"
                ml="$-2"
                borderWidth="$0.25"
                borderColor={"$color"}
              >
                <SizableText size={"$1"}>
                  {session.likes.length - 3}+
                </SizableText>
              </Circle>
            )}
            {session.likes.length == 0 && (
              <View height={"$1.5"} justifyContent="center">
                <SizableText size={"$1"}>Be the first to like!</SizableText>
              </View>
            )}
          </XStack>
          <View onPress={() => setLike(!like)}>
            <ThumbsUp size={"$2"} fill={like ? "#00cccc" : "none"} />
          </View>
        </YStack>
        <YStack alignItems="center" gap="$2" width={"$10"}>
          <View height={"$1.5"} justifyContent="center">
            <SizableText size={"$1"}>
              {session.comments.length} Comments
            </SizableText>
          </View>
          <View onPress={() => setOpen(!open)}>
            <MessageCircleMore size={"$2"} />
          </View>
        </YStack>
      </XStack>
      <Sheet
        forceRemoveScrollEnabled={open}
        modal={true}
        open={open}
        onOpenChange={setOpen}
        dismissOnSnapToBottom
        snapPoints={[
          Math.floor(
            ((Dimensions.get("window").height - useHeaderHeight()) /
              Dimensions.get("window").height) *
              100
          ),
        ]}
        snapPointsMode="percent"
        zIndex={100_000}
        animation="medium"
      >
        <Sheet.Overlay
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Frame alignItems="center" gap="$5">
          <YStack width={"100%"} gap="$2">
            <View p="$4" pb="$2">
              <XStack justifyContent="center">
                <SizableText size={"$6"} fontFamily={"$mono"} fontWeight={700}>
                  Comments
                </SizableText>
                <View pos="absolute" right="$0" onPress={() => setOpen(false)}>
                  <X size="$2" />
                </View>
              </XStack>
            </View>
            <ScrollView width={"100%"} height={"80%"}>
              <View gap="$5" mt="$3" p="$4" pt="$2">
                {session.comments.map((comment, index) => (
                  <Comment key={index} comment={comment} />
                ))}
              </View>
            </ScrollView>
            <View p="$4" pt="$2">
              <XStack gap="$2">
                <Avatar circular size="$4">
                  <Avatar.Image />
                  <Avatar.Fallback backgroundColor="$blue10" />
                </Avatar>
                <Input
                  flex={1}
                  placeholder="Add a comment..."
                  borderColor="$borderColor"
                  borderRadius="$12"
                  pr="$7"
                />
                <Send
                  size={"$1"}
                  alignSelf="center"
                  right="$0"
                  pos={"absolute"}
                  mr="$3"
                />
              </XStack>
            </View>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  );
};

function formatSessionDate(isoString: string) {
  const sessionDate = new Date(isoString);
  const now = new Date();
  const isToday = now.toDateString() === sessionDate.toDateString();
  const isYesterday =
    new Date(now.setDate(now.getDate() - 1)).toDateString() ===
    sessionDate.toDateString();

  const timeString = sessionDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) {
    return `Today at ${timeString}`;
  } else if (isYesterday) {
    return `Yesterday at ${timeString}`;
  } else {
    return sessionDate.toLocaleDateString([], {
      year: "numeric",
      month: "long",
      day: "numeric",
    }) + ` at ${timeString}`;
  }
}

function formatSessionTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  let result = "";
  if (hours > 0) result += `${hours}hr `;
  if (minutes > 0) result += `${minutes}m `;
  result += `${remainingSeconds}s`;

  return result.trim();
}

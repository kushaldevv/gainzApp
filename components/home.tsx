import React from "react";
import {
  ScrollView,
  Avatar,
  SizableText,
  YStack,
  XStack,
  Paragraph,
  View,
  Circle,
  ZStack,
} from "tamagui";
import {
  Dumbbell,
  MoreHorizontal,
  ThumbsUp,
  MessageCircleMore,
} from "@tamagui/lucide-icons";

const Card = () => {
  const name = "Leul Mesfin";
  const pfp =
    "https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80";
  const location = "Golds Gym - Frederick, MD";
  const date = new Date();
  const numExercises = 6;
  const sessionTime = 6022;
  const numCommnets = 3;
  const likes = [pfp, pfp, pfp, pfp];
  return (
    <YStack backgroundColor={"$gray1"} p="$3" gap="$2">
      <XStack gap="$3" width="100%">
        <Avatar circular size="$4">
          <Avatar.Image src={pfp} />
          <Avatar.Fallback backgroundColor="$blue10" />
        </Avatar>
        <YStack>
          <SizableText size={"$2"} fontFamily={"$mono"} fontWeight={800}>
            {name}
          </SizableText>
          <XStack gap="$2" alignItems="center">
            <Dumbbell size="$1" />
            <YStack>
              <Paragraph lineHeight={"$1"} fontSize={"$1"}>
                {formatSessionDate(date)}
                {"\n"}
                {location}
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
            {numExercises}
          </SizableText>
        </YStack>
        <YStack>
          <Paragraph lineHeight={"$1"} fontSize={"$1"}>
            Time
          </Paragraph>
          <SizableText size={"$4"} fontFamily={"$mono"} fontWeight={700}>
            {formatSessionTime(sessionTime)}
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
        paddingHorizontal="$11"
        paddingTop="$2"
      >
        <YStack alignItems="center" gap="$2">
          <XStack>
            {likes.slice(0, 3).map((item, index) => (
              <Avatar key={index} circular size="$1.5" ml={index != 0 ? "$-2" : "$0"}>
                <Avatar.Image src={item} />
                <Avatar.Fallback backgroundColor="$blue10" />
              </Avatar>
            ))}
            {likes.length > 3 && (
              <Circle size="$1.5" backgroundColor="$gray7" ml="$-2">
                <SizableText size={"$1"}>{likes.length - 3}+</SizableText>
              </Circle>
            )}
          </XStack>
          <ThumbsUp size={"$1.5"} />
        </YStack>
        <YStack alignItems="center" gap="$2">
          <View height={'$1.5'} justifyContent="center">
            <SizableText size={"$1"}>{numCommnets} Comments</SizableText>
          </View>
          <MessageCircleMore size={"$1.5"} />
        </YStack>
      </XStack>
    </YStack>
  );
};

export const Home = () => {
  return (
    <ScrollView width={"100%"}>
      <View gap="$2">
        <Card />
        <Card />
        <Card />
      </View>
    </ScrollView>
  );
};

export default Home;

function formatSessionDate(sessionDate: Date) {
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
    });
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

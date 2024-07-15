import React, { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import {
  ScrollView,
  Avatar,
  SizableText,
  YStack,
  XStack,
  Paragraph,
  View,
  Circle,
  Sheet,
  Input,
} from "tamagui";
import {
  Dumbbell,
  MoreHorizontal,
  ThumbsUp,
  MessageCircleMore,
  X,
  Heart,
  Send,
} from "@tamagui/lucide-icons";
import { userAPI } from "../services/db";

const spModes = ["percent", "constant", "fit", "mixed"] as const;

type CardProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Card = ({ open, setOpen }: CardProps) => {
  const name = "Leul Mesfin";
  const pfp =
    "https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80";
  const location = "Golds Gym - Frederick, MD";
  const date = new Date();
  const numExercises = 6;
  const sessionTime = 6022;
  const comments = ["Great job!", "Keep it up!", "You got this!"];
  const likes = [pfp, pfp, pfp, pfp];
  const [like, setLike] = useState(false);

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
        paddingHorizontal="$10"
        paddingTop="$2"
      >
        <YStack alignItems="center" gap="$2" width={"$10"}>
          <XStack>
            {likes.slice(0, 3).map((item, index) => (
              <Avatar
                key={index}
                circular
                size="$1.5"
                ml={index != 0 ? "$-2" : "$0"}
                borderWidth="$0.25"
                borderColor={"$color"}
              >
                <Avatar.Image src={item} />
                <Avatar.Fallback backgroundColor="$blue10" />
              </Avatar>
            ))}
            {likes.length > 3 && (
              <Circle
                size="$1.5"
                backgroundColor="$gray7"
                ml="$-2"
                borderWidth="$0.25"
                borderColor={"$color"}
              >
                <SizableText size={"$1"}>{likes.length - 3}+</SizableText>
              </Circle>
            )}
            {likes.length == 0 && (
              <View height={"$1.5"} justifyContent="center">
                <SizableText size={"$1"}>Be the first to like!</SizableText>
              </View>
            )}
          </XStack>
          <ThumbsUp
            size={"$1.5"}
            fill={like ? "#00cccc" : "none"}
            scale={like ? 1.25 : 1}
            onPress={() => setLike(!like)}
          />
        </YStack>
        <YStack alignItems="center" gap="$2" width={"$10"}>
          <View height={"$1.5"} justifyContent="center">
            <SizableText size={"$1"}>{comments.length} Comments</SizableText>
          </View>
          <MessageCircleMore size={"$1.5"} onPress={() => setOpen(!open)} />
        </YStack>
      </XStack>
    </YStack>
  );
};

const Comment = () => {
  const name = "Leul Mesfin";
  const date = new Date("2023-07-10T12:00:00");
  const pfp =
    "https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80";
  const body =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";
  const likes = 12;
  const [like, setLike] = useState(false);
  return (
    <XStack gap="$2">
      <Avatar circular size="$3">
        <Avatar.Image src={pfp} />
        <Avatar.Fallback backgroundColor="$blue10" />
      </Avatar>
      <YStack width={"$20"}>
        <XStack gap="$1">
          <SizableText size={"$1"} fontFamily={"$mono"} fontWeight={800}>
            {name}
          </SizableText>
          <SizableText
            size={'$1'}
            color={"$gray11"}
            fontFamily={"$mono"}
            fontWeight={400}
          >
            {formatSimpleDate(date)}
          </SizableText>
        </XStack>
        <Paragraph lineHeight={"$1"} fontSize={'$2'} textAlign="left">
          {body}
        </Paragraph>
      </YStack>
      <YStack position="absolute" right="$1" alignItems="center">
        <Heart
          size={"$1"}
          fill={like ? "red" : "none"}
          onPress={() => setLike(!like)}
        />
        <SizableText size={"$1"} color={"$gray11"}>
          {likes}
        </SizableText>
      </YStack>
    </XStack>
  );
};

export const Home = () => {
  // const [users, setUsers] = useState([]);

  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  // const fetchUsers = async () => {
  //   try {
  //     const data = await userAPI.getUsers();
  //     setUsers(data.Items || []);
  //   } catch (error) {
  //     console.error("Error fetching users:", error);
  //   }
  // };
  const [open, setOpen] = useState(false);
  return (
    <>
      <ScrollView width={"100%"}>
        <View gap="$2">
          <Card open={open} setOpen={setOpen} />
          <Card open={open} setOpen={setOpen} />
          <Card open={open} setOpen={setOpen} />
        </View>
      </ScrollView>
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
              100,
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
                <X
                  size="$2"
                  pos="absolute"
                  right="$0"
                  onPress={() => setOpen(false)}
                />
              </XStack>
            </View>
            <ScrollView width={"100%"} height={"80%"}>
              <View gap="$5" mt="$3" p="$4" pt="$2">
                <Comment />
                <Comment />
                <Comment />
                <Comment />
                <Comment />
              </View>
            </ScrollView>
            <View p="$4" pt="$2">
              <XStack gap='$2'>
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
    </>
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
function formatSimpleDate(likeDate: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - likeDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d`;
  }
  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks}w`;
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
